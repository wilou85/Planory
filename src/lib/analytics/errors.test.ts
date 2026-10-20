import { describe, expect, it } from "vitest";
import { assertInvariant, assertInvariantForEach } from "@/lib/test/invariants";
import { MAX_ERRORS_PER_PAGE, createErrorReporter } from "@/lib/analytics/errors";

describe("createErrorReporter", () => {
  it("reports a first-party error with its file name and line, without the query string", () => {
    const report = createErrorReporter();
    expect(
      report({
        message: "TypeError: a is undefined",
        filename: "https://www.planory.net/_next/static/chunks/app.js?v=123",
        lineno: 42,
      }),
    ).toEqual({ message: "TypeError: a is undefined", source: "app.js", line: 42 });
  });

  describe("invariants", () => {
    it("ignores noise that is not a bug of the site", () => {
      assertInvariantForEach(
        [
          { message: "boom", filename: "chrome-extension://abc/content.js" },
          { message: "boom", filename: "moz-extension://abc/content.js" },
          { message: "ResizeObserver loop completed with undelivered notifications." },
          { message: "Script error." },
          { message: "" },
        ],
        (error) => createErrorReporter()(error) === null,
        (error) => `${JSON.stringify(error)} must be ignored`,
      );
    });

    it("reports each distinct message once and caps the volume per page", () => {
      const report = createErrorReporter();
      assertInvariant(report({ message: "same" }) !== null, "first occurrence is reported");
      assertInvariant(report({ message: "same" }) === null, "duplicates are dropped");
      const reported = Array.from({ length: 20 }, (_, i) => report({ message: `e${i}` })).filter(
        Boolean,
      );
      assertInvariant(
        reported.length === MAX_ERRORS_PER_PAGE - 1,
        `at most ${MAX_ERRORS_PER_PAGE} errors per page`,
      );
    });
  });
});
