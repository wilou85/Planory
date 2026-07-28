import { NextRequest } from "next/server";
import {
  getRedirectUrl,
  getRewrittenUrl,
  isRewrite,
  unstable_doesMiddlewareMatch,
} from "next/experimental/testing/server";
import { describe, expect, it } from "vitest";
import { config, proxy } from "@/proxy";

const BASE = "https://www.planory.net";

function req(pathname: string) {
  return new NextRequest(new URL(pathname, BASE));
}

describe("proxy matcher", () => {
  it("matches marketing pages", () => {
    expect(
      unstable_doesMiddlewareMatch({
        config,
        url: `${BASE}/produit`,
        nextConfig: {},
      }),
    ).toBe(true);
  });

  it("skips static assets via matcher exclusion", () => {
    expect(
      unstable_doesMiddlewareMatch({
        config,
        url: `${BASE}/_next/static/chunks/main.js`,
        nextConfig: {},
      }),
    ).toBe(false);
  });
});

describe("proxy locale routing", () => {
  it("rewrites FR public paths to /fr/*", async () => {
    const response = await proxy(req("/produit"));
    expect(isRewrite(response)).toBe(true);
    expect(getRewrittenUrl(response)).toBe(`${BASE}/fr/produit`);
    expect(response.headers.get("x-locale")).toBe("fr");
  });

  it("rewrites home to /fr", async () => {
    const response = await proxy(req("/"));
    expect(isRewrite(response)).toBe(true);
    expect(getRewrittenUrl(response)).toBe(`${BASE}/fr`);
  });

  it("passes /en through with en locale header", async () => {
    const response = await proxy(req("/en/produit"));
    expect(isRewrite(response)).toBe(false);
    expect(getRedirectUrl(response)).toBeNull();
    expect(response.headers.get("x-locale")).toBe("en");
  });

  it("redirects public /fr/* to unprefixed FR URLs", async () => {
    const response = await proxy(req("/fr/produit"));
    expect(getRedirectUrl(response)).toBe(`${BASE}/produit`);
  });

  it("redirects /fr home to /", async () => {
    const response = await proxy(req("/fr"));
    expect(getRedirectUrl(response)).toBe(`${BASE}/`);
  });

  it("bypasses API routes", async () => {
    const response = await proxy(req("/api/lead-magnet"));
    expect(isRewrite(response)).toBe(false);
    expect(getRedirectUrl(response)).toBeNull();
    expect(response.headers.get("x-locale")).toBeNull();
  });
});
