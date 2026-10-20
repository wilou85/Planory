import { describe, expect, it } from "vitest";
import { assertInvariantForEach } from "@/lib/test/invariants";
import { TRAFFIC_MEDIUMS, classifyTrafficSource } from "@/lib/analytics/traffic-source";

const classify = (referrer: string, search = "") => classifyTrafficSource({ referrer, search });

describe("classifyTrafficSource", () => {
  it("recognises search engines, social networks and AI assistants by host", () => {
    expect(classify("https://www.google.fr/")).toMatchObject({ source: "google", medium: "organic" });
    expect(classify("https://www.bing.com/search?q=planning")).toMatchObject({ source: "bing", medium: "organic" });
    expect(classify("https://duckduckgo.com/")).toMatchObject({ source: "duckduckgo", medium: "organic" });
    expect(classify("https://www.linkedin.com/feed/")).toMatchObject({ source: "linkedin", medium: "social" });
    expect(classify("https://lnkd.in/abc")).toMatchObject({ source: "linkedin", medium: "social" });
    expect(classify("https://chatgpt.com/")).toMatchObject({ source: "chatgpt", medium: "ai" });
    expect(classify("https://www.perplexity.ai/search")).toMatchObject({ source: "perplexity", medium: "ai" });
    expect(classify("https://gemini.google.com/app")).toMatchObject({ source: "gemini", medium: "ai" });
    expect(classify("https://blog.example.org/post")).toMatchObject({ source: "blog.example.org", medium: "referral" });
  });

  it("lets explicit UTM tags win over the referrer", () => {
    expect(
      classify("https://www.google.com/", "?utm_source=Newsletter&utm_medium=email&utm_campaign=oct-2026"),
    ).toEqual({ source: "newsletter", medium: "email", campaign: "oct-2026", referrerHost: "www.google.com" });
  });

  describe("invariants", () => {
    it("treats missing, invalid or internal referrers as direct traffic", () => {
      assertInvariantForEach(
        ["", "not a url", "https://www.planory.net/faq", "https://planory.net/", "http://localhost:3000/"],
        (referrer) => {
          const result = classify(referrer);
          return result.source === "direct" && result.medium === "direct";
        },
        (referrer) => `${referrer || "(empty)"} must be classified as direct`,
      );
    });

    it("never keeps the referrer path or query, and always yields bounded labels", () => {
      const samples = [
        classify("https://www.google.fr/search?q=jean.dupont@example.com"),
        classify("https://blog.example.org/private/path?token=secret"),
        classify("", `?utm_source=${"x".repeat(500)}&utm_campaign=${"y".repeat(500)}`),
        classify("https://t.co/xyz", "?utm_medium=PAID%20Social"),
      ];
      assertInvariantForEach(
        samples,
        (result) => {
          const json = JSON.stringify(result);
          return (
            !json.includes("secret") &&
            !json.includes("@") &&
            !json.includes("/private") &&
            result.source.length > 0 &&
            result.source.length <= 60 &&
            (result.campaign ?? "").length <= 80 &&
            result.source === result.source.toLowerCase() &&
            (TRAFFIC_MEDIUMS as readonly string[]).includes(result.medium)
          );
        },
        (result) => `unsafe or unbounded source: ${JSON.stringify(result)}`,
      );
    });
  });
});
