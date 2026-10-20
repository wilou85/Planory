import { describe, expect, it } from "vitest";
import { assertInvariant, assertInvariantForEach } from "@/lib/test/invariants";

describe("assertInvariant", () => {
  it("passes when the condition holds", () => {
    expect(() => assertInvariant(true, "should hold")).not.toThrow();
  });

  it("throws a named violation when the condition fails", () => {
    expect(() => assertInvariant(false, "canonical must be https")).toThrow(
      /Invariant violated: canonical must be https/,
    );
  });
});

describe("assertInvariantForEach", () => {
  it("checks every case", () => {
    expect(() =>
      assertInvariantForEach(
        [2, 4, 6],
        (n) => n % 2 === 0,
        (n) => `${n} must be even`,
      ),
    ).not.toThrow();
  });

  it("reports the first failing case", () => {
    expect(() =>
      assertInvariantForEach(
        [2, 3, 4],
        (n) => n % 2 === 0,
        (n) => `${n} must be even`,
      ),
    ).toThrow(/Invariant violated: 3 must be even/);
  });
});
