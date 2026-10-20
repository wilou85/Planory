import { describe, it } from "vitest";
import { assertInvariant } from "@/lib/test/invariants";
import {
  ADMIN_SESSION_COOKIE,
  clearAdminSessionCookieOptions,
  createAdminSessionCookieOptions,
} from "@/lib/admin-auth/session";

describe("admin session cookie invariants", () => {
  it("always issues an httpOnly Lax cookie on / with a stable name", () => {
    const options = createAdminSessionCookieOptions({ secure: true });
    assertInvariant(ADMIN_SESSION_COOKIE === "planory_admin_session", "stable cookie name");
    assertInvariant(options.httpOnly === true, "httpOnly required");
    assertInvariant(options.sameSite === "lax", "SameSite=Lax required");
    assertInvariant(options.path === "/", "path=/ required");
    assertInvariant(options.secure === true, "secure when requested");
    assertInvariant(typeof options.maxAge === "number" && options.maxAge > 0, "positive maxAge");
  });

  it("clears the cookie with matching path and a non-positive maxAge", () => {
    const cleared = clearAdminSessionCookieOptions({ secure: false });
    assertInvariant(cleared.httpOnly === true, "clear must stay httpOnly");
    assertInvariant(cleared.path === "/", "clear path must match");
    assertInvariant(cleared.maxAge === 0, "maxAge 0 clears the cookie");
    assertInvariant(cleared.secure === false, "secure follows env");
  });
});
