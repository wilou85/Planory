import { describe, expect, it } from "vitest";
import { assertInvariant } from "@/lib/test/invariants";
import { hashPassword, verifyPassword } from "@/lib/admin-auth/password";

describe("admin password invariants", () => {
  it("accepts the original password and rejects every other candidate", async () => {
    const hash = await hashPassword("Correct-Horse-Battery-1");
    assertInvariant(await verifyPassword("Correct-Horse-Battery-1", hash), "original must verify");
    for (const wrong of ["", "Correct-Horse-Battery-2", hash, "correct-horse-battery-1"]) {
      assertInvariant(!(await verifyPassword(wrong, hash)), `must reject ${JSON.stringify(wrong)}`);
    }
  });

  it("never produces an empty or plaintext hash", async () => {
    const password = "PlanoryAdmin!2026";
    const hash = await hashPassword(password);
    assertInvariant(hash.length > 20, "hash must be non-trivial");
    assertInvariant(hash !== password, "hash must not equal plaintext");
    expect(hash.startsWith("$2")).toBe(true);
  });
});
