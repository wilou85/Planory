import { describe, expect, it, vi } from "vitest";
import { assertInvariant } from "@/lib/test/invariants";
import { authenticateAdmin, loginThrottleKeys } from "@/lib/admin-auth/login";
import type { AdminUser } from "@/lib/admin-auth/users";

const user: AdminUser = {
  id: "u1",
  email: "william.tran@planory.net",
  passwordHash: "hash:good",
  role: "admin",
};

function setup(options: { user?: AdminUser | null; issued?: string | null; valid?: string; sent?: boolean } = {}) {
  const deps = {
    findUser: vi.fn(async () => (options.user === undefined ? user : options.user)),
    verifyPassword: vi.fn(async (pw: string, hash: string) => hash === `hash:${pw}`),
    issueCode: vi.fn(async () => (options.issued === undefined ? "123456" : options.issued)),
    verifyCode: vi.fn(async (_userId: string, code: string) => code === (options.valid ?? "123456")),
    sendCode: vi.fn(async () => options.sent ?? true),
  };
  const login = (password: string, code?: string) =>
    authenticateAdmin({ email: user.email, password, code }, deps);
  return { deps, login };
}

describe("authenticateAdmin", () => {
  describe("invariants", () => {
    it("without the right password: refused, and no code is issued, sent or checked", async () => {
      for (const found of [null, user]) {
        for (const code of [undefined, "123456", "000000"]) {
          const { deps, login } = setup({ user: found });
          const outcome = await login("bad", code);
          assertInvariant(outcome.status === "invalid", `wrong password must be "invalid" (code=${code})`);
          assertInvariant(
            deps.issueCode.mock.calls.length + deps.sendCode.mock.calls.length + deps.verifyCode.mock.calls.length === 0,
            "no e-mail may be triggered without the password",
          );
        }
      }
    });

    it("never grants access without a verified e-mail code", async () => {
      for (const code of [undefined, "", "000000", "12345", "1234567"]) {
        const outcome = await setup().login("good", code);
        assertInvariant(outcome.status !== "ok", `access granted with code=${code}`);
      }
      const { deps, login } = setup();
      const outcome = await login("good", " 123 456 ");
      assertInvariant(outcome.status === "ok" && outcome.user.id === "u1", "valid code grants access");
      expect(deps.verifyCode).toHaveBeenCalledWith("u1", "123456");
    });
  });

  it("with the password only: issues and e-mails a code to the account", async () => {
    const { deps, login } = setup();
    expect(await login("good")).toEqual({ status: "code_sent", email: user.email });
    expect(deps.sendCode).toHaveBeenCalledWith(user, "123456");
  });

  it("does not resend while the previous code is still within its cooldown", async () => {
    const { deps, login } = setup({ issued: null });
    expect(await login("good")).toEqual({ status: "code_pending", email: user.email });
    expect(deps.sendCode).not.toHaveBeenCalled();
  });

  it("reports a failed delivery", async () => {
    expect((await setup({ sent: false }).login("good")).status).toBe("code_send_failed");
  });

  it("refuses a wrong code without issuing a new one", async () => {
    const { deps, login } = setup();
    expect((await login("good", "654321")).status).toBe("code_invalid");
    expect(deps.issueCode).not.toHaveBeenCalled();
  });
});

describe("loginThrottleKeys", () => {
  describe("invariants", () => {
    it("throttles each account independently of the (spoofable) client IP", () => {
      const ips = ["203.0.113.7", "198.51.100.1", "unknown", "::1"];
      const accountKeys = new Set(
        ips.map((ip) => loginThrottleKeys({ ip, email: " William.Tran@Planory.net " }).account),
      );
      assertInvariant(accountKeys.size === 1, "changing IP must not reset the account counter");
      assertInvariant(
        loginThrottleKeys({ ip: "a", email: "x@y.z" }).ip !== loginThrottleKeys({ ip: "b", email: "x@y.z" }).ip,
        "the per-IP counter still separates clients",
      );
    });
  });
});
