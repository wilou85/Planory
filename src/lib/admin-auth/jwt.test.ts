import { describe, expect, it } from "vitest";
import { assertInvariant } from "@/lib/test/invariants";
import { signAdminToken, verifyAdminToken } from "@/lib/admin-auth/jwt";

const SECRET = "test-admin-jwt-secret-at-least-32-chars";

describe("admin JWT invariants", () => {
  it("round-trips sub, email and admin role with the correct secret", async () => {
    const token = await signAdminToken(
      { sub: "uid-1", email: "a@planory.net", role: "admin" },
      { secret: SECRET },
    );
    const payload = await verifyAdminToken(token, { secret: SECRET });
    expect(payload).toEqual({ sub: "uid-1", email: "a@planory.net", role: "admin" });
  });

  it("rejects wrong secret, truncated token and incomplete payloads", async () => {
    const token = await signAdminToken(
      { sub: "uid-1", email: "a@planory.net", role: "admin" },
      { secret: SECRET },
    );
    assertInvariant(
      (await verifyAdminToken(token, { secret: "other-secret-at-least-32-characters!!" })) === null,
      "wrong secret must fail",
    );
    assertInvariant(
      (await verifyAdminToken(token.slice(0, 20), { secret: SECRET })) === null,
      "truncated token must fail",
    );
    assertInvariant(
      (await verifyAdminToken("", { secret: SECRET })) === null,
      "empty token must fail",
    );
  });

  it("rejects a missing secret at sign and verify time", async () => {
    await expect(
      signAdminToken({ sub: "u", email: "a@b.c", role: "admin" }, { secret: "" }),
    ).rejects.toThrow();
    assertInvariant(
      (await verifyAdminToken("anything", { secret: "" })) === null,
      "empty secret must not verify",
    );
  });
});
