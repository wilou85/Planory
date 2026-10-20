import { describe, expect, it } from "vitest";
import { assertInvariant } from "@/lib/test/invariants";
import { createJsonArrayItemSplitter } from "@/lib/leads/json-array-stream";

const document = {
  schemaVersion: "v1.0.0",
  label: "pmej",
  gco: [{ pmSmsseId: "403", pmej: [{ nested: true }] }],
  pmej: [
    { id: "1", name: "Résidence « Les Tilleuls » {aile [B]}", tags: ["a", "b"] },
    { id: "2", quote: 'il a dit \"bonjour\" \\ puis }]', nested: { pmej: [{ x: 1 }] } },
    { id: "3", emoji: "maison 🏠 de retraite", empty: {} },
  ],
  trailer: [{ id: "ignored" }],
};

const text = JSON.stringify(document, null, 2);
const expected = document.pmej;

function splitAt(source: string, cuts: number[]): string[] {
  const sorted = [...new Set(cuts)].filter((c) => c > 0 && c < source.length).sort((a, b) => a - b);
  const chunks: string[] = [];
  let start = 0;
  for (const cut of sorted) {
    chunks.push(source.slice(start, cut));
    start = cut;
  }
  chunks.push(source.slice(start));
  return chunks;
}

function collect(chunks: string[], key = "pmej"): unknown[] {
  const splitter = createJsonArrayItemSplitter(key);
  const items: unknown[] = [];
  for (const chunk of chunks) items.push(...splitter.push(chunk));
  splitter.end();
  return items;
}

function seededCuts(seed: number, count: number, max: number): number[] {
  let state = seed;
  const cuts: number[] = [];
  for (let i = 0; i < count; i += 1) {
    state = (state * 1103515245 + 12345) % 2147483648;
    cuts.push(state % max);
  }
  return cuts;
}

describe("createJsonArrayItemSplitter", () => {
  describe("invariants", () => {
    it("yields exactly the items of the requested top-level array", () => {
      expect(collect([text])).toEqual(expected);
    });

    it("is independent of how the text is chunked", () => {
      expect(collect(text.split(""))).toEqual(expected);
      for (let seed = 1; seed <= 50; seed += 1) {
        const chunks = splitAt(text, seededCuts(seed, 1 + (seed % 12), text.length));
        const items = collect(chunks);
        assertInvariant(
          JSON.stringify(items) === JSON.stringify(expected),
          `chunking with seed ${seed} must not change the items`,
        );
      }
    });

    it("ignores same-named arrays that are nested or appear as string values", () => {
      const items = collect([text]) as Array<{ id: string }>;
      assertInvariant(
        items.every((item) => ["1", "2", "3"].includes(item.id)),
        "only top-level pmej items may be emitted",
      );
    });

    it("emits nothing when the key is absent", () => {
      expect(collect([text], "ege")).toEqual([]);
    });

    it("rejects a document that ends in the middle of an item", () => {
      const splitter = createJsonArrayItemSplitter("pmej");
      splitter.push(text.slice(0, text.indexOf('"2"')));
      expect(() => splitter.end()).toThrow();
    });
  });
});
