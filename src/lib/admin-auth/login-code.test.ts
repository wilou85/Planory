import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { assertInvariant, assertInvariantForEach } from "@/lib/test/invariants";
import {
  LOGIN_CODE_MAX_ATTEMPTS,
  LOGIN_CODE_RESEND_COOLDOWN_MS,
  LOGIN_CODE_TTL_MS,
  buildLoginCodeEmail,
  createLoginCodeStore,
  generateLoginCode,
  hashLoginCode,
  sendAdminEmail,
} from "@/lib/admin-auth/login-code";

const NOW = new Date("2026-10-20T12:00:00.000Z");
const at = (ms: number) => new Date(NOW.getTime() + ms);
const SECRET = "test-secret-at-least-32-characters-long";

describe("generateLoginCode", () => {
  describe("invariants", () => {
    it("always yields exactly 6 digits, zero-padded", () => {
      assertInvariantForEach(
        [0, 7, 42, 999_999, ...Array.from({ length: 50 }, () => -1)],
        (n) => /^\d{6}$/.test(n < 0 ? generateLoginCode() : generateLoginCode(() => n)),
        (n) => `code for ${n} must be 6 digits`,
      );
      expect(generateLoginCode(() => 42)).toBe("000042");
    });
  });
});

describe("hashLoginCode", () => {
  describe("invariants", () => {
    it("never stores the code itself and binds it to the user and the server secret", () => {
      const hash = hashLoginCode("u1", "123456", SECRET);
      assertInvariant(!hash.includes("123456"), "hash must not contain the code");
      assertInvariant(hash !== hashLoginCode("u2", "123456", SECRET), "same code, other user");
      assertInvariant(hash !== hashLoginCode("u1", "123456", `${SECRET}x`), "same code, other secret");
      assertInvariant(hash === hashLoginCode("u1", " 123 456 ", SECRET), "spaces typed by the user are ignored");
    });
  });
});

describe("login code e-mail", () => {
  const message = buildLoginCodeEmail({
    email: "william.tran@planory.net",
    code: "042137",
    ip: "203.0.113.7",
    userAgent: "Mozilla/5.0 (Windows NT 10.0)",
    at: NOW,
  });

  it("gives the code, its lifetime and the context of the attempt (Paris time)", () => {
    expect(message.to).toBe("william.tran@planory.net");
    expect(message.subject).toContain("042137");
    expect(message.text).toContain("042137");
    expect(message.text).toContain(`${LOGIN_CODE_TTL_MS / 60_000} minutes`);
    expect(message.text).toContain("20/10/2026 14:00");
    expect(message.text).toContain("203.0.113.7");
    expect(message.text).toContain("Mozilla/5.0 (Windows NT 10.0)");
  });

  it("sends through Resend only when an API key is configured", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    expect(await sendAdminEmail(message, { apiKey: undefined, from: "x", fetchImpl })).toBe(false);
    expect(fetchImpl).not.toHaveBeenCalled();

    expect(await sendAdminEmail(message, { apiKey: "re_123", from: "Planory <a@b>", fetchImpl })).toBe(true);
    const [url, init] = fetchImpl.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    expect(new Headers(init.headers).get("authorization")).toBe("Bearer re_123");
    expect(JSON.parse(String(init.body))).toMatchObject({ to: [message.to], subject: message.subject });
  });

  it("reports a provider failure instead of throwing", async () => {
    const failing = vi.fn().mockRejectedValue(new Error("network down"));
    expect(await sendAdminEmail(message, { apiKey: "re_123", from: "x", fetchImpl: failing })).toBe(false);
    const refused = vi.fn().mockResolvedValue(new Response(null, { status: 422 }));
    expect(await sendAdminEmail(message, { apiKey: "re_123", from: "x", fetchImpl: refused })).toBe(false);
  });
});

describe("login code store (PostgreSQL)", () => {
  let pg: PGlite;
  let u1: string;
  let u2: string;
  const store = createLoginCodeStore((text, params) => pg.query(text, params), () => SECRET);

  beforeAll(async () => {
    pg = new PGlite();
    for (const file of ["analytics_events.sql", "admin_users.sql"]) {
      await pg.exec(readFileSync(join(process.cwd(), "sql", file), "utf8"));
    }
    const users = await pg.query<{ id: string }>(
      `INSERT INTO public.admin_users (email, password_hash)
       VALUES ('a@planory.net', 'x'), ('b@planory.net', 'x') RETURNING id`,
    );
    [u1, u2] = users.rows.map((row) => row.id);
  });

  afterAll(async () => {
    await pg.close();
  });

  beforeEach(async () => {
    await pg.query("DELETE FROM public.admin_login_codes");
  });

  const issue = async (userId: string, when = NOW) => {
    const code = await store.issue(userId, when);
    if (!code) throw new Error("expected a code");
    return code;
  };
  const otherCode = (code: string) => String((Number(code) + 1) % 1_000_000).padStart(6, "0");

  describe("invariants", () => {
    it("keeps only a hash in the database", async () => {
      const code = await issue(u1);
      const { rows } = await pg.query<Record<string, unknown>>("SELECT * FROM public.admin_login_codes");
      assertInvariant(!JSON.stringify(rows).includes(code), "the clear code must never be stored");
    });

    it("accepts the right code exactly once", async () => {
      const code = await issue(u1);
      expect(await store.verify(u1, code, at(1_000))).toBe(true);
      assertInvariant(!(await store.verify(u1, code, at(2_000))), "a used code must be refused");
    });

    it("never accepts a code for another user", async () => {
      const code = await issue(u1);
      assertInvariant(!(await store.verify(u2, code, at(1_000))), "code of u1 must not log u2 in");
    });

    it("refuses the code once expired", async () => {
      const code = await issue(u1);
      assertInvariant(!(await store.verify(u1, code, at(LOGIN_CODE_TTL_MS))), "expired code refused");
    });

    it(`locks the code after ${LOGIN_CODE_MAX_ATTEMPTS} wrong attempts, even if the next guess is right`, async () => {
      const code = await issue(u1);
      for (let i = 0; i < LOGIN_CODE_MAX_ATTEMPTS; i += 1) {
        assertInvariant(!(await store.verify(u1, otherCode(code), at(1_000))), "wrong code refused");
      }
      assertInvariant(!(await store.verify(u1, code, at(2_000))), "locked code must stay refused");
    });

    it("does not send a new code before the cooldown, and a new code replaces the old one", async () => {
      const first = await issue(u1);
      expect(await store.issue(u1, at(LOGIN_CODE_RESEND_COOLDOWN_MS - 1))).toBeNull();
      expect(await store.verify(u1, first, at(LOGIN_CODE_RESEND_COOLDOWN_MS - 1))).toBe(true);

      const second = await issue(u1, at(2 * LOGIN_CODE_RESEND_COOLDOWN_MS));
      const third = await issue(u1, at(4 * LOGIN_CODE_RESEND_COOLDOWN_MS));
      if (third !== second) {
        assertInvariant(
          !(await store.verify(u1, second, at(4 * LOGIN_CODE_RESEND_COOLDOWN_MS + 1))),
          "a replaced code must be refused",
        );
      }
      expect(await store.verify(u1, third, at(4 * LOGIN_CODE_RESEND_COOLDOWN_MS + 2))).toBe(true);
    });

    it("a fresh code resets the attempt counter", async () => {
      const locked = await issue(u1);
      for (let i = 0; i < LOGIN_CODE_MAX_ATTEMPTS; i += 1) await store.verify(u1, otherCode(locked), at(1_000));
      const fresh = await issue(u1, at(LOGIN_CODE_RESEND_COOLDOWN_MS));
      expect(await store.verify(u1, fresh, at(LOGIN_CODE_RESEND_COOLDOWN_MS + 1))).toBe(true);
    });
  });
});
