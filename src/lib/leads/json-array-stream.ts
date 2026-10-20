export type JsonArrayItemSplitter = {
  push(chunk: string): unknown[];
  end(): void;
};

const QUOTE = 34;
const BACKSLASH = 92;
const OPEN_BRACE = 123;
const CLOSE_BRACE = 125;
const OPEN_BRACKET = 91;
const CLOSE_BRACKET = 93;
const COLON = 58;
const COMMA = 44;

/**
 * Streams the object items of one top-level array (`{ "<key>": [ {...}, ... ] }`)
 * without materialising the whole document, which may exceed V8's max string length.
 */
export function createJsonArrayItemSplitter(key: string): JsonArrayItemSplitter {
  let depth = 0;
  let inString = false;
  let escaped = false;
  let rootString = "";
  let collectingRootString = false;
  let keyCandidate: string | null = null;
  let currentKey: string | null = null;
  let inTargetArray = false;
  let itemParts: string[] | null = null;

  return {
    push(chunk) {
      const items: unknown[] = [];
      let itemStart = itemParts ? 0 : -1;

      for (let i = 0; i < chunk.length; i += 1) {
        const code = chunk.charCodeAt(i);

        if (inString) {
          if (escaped) escaped = false;
          else if (code === BACKSLASH) escaped = true;
          else if (code === QUOTE) {
            inString = false;
            if (collectingRootString) {
              collectingRootString = false;
              if (currentKey === null) keyCandidate = rootString;
            }
            continue;
          }
          if (collectingRootString) rootString += chunk[i];
          continue;
        }

        if (code === QUOTE) {
          inString = true;
          if (depth === 1) {
            collectingRootString = true;
            rootString = "";
          }
        } else if (code === OPEN_BRACE || code === OPEN_BRACKET) {
          if (depth === 1 && code === OPEN_BRACKET && currentKey === key) {
            inTargetArray = true;
          } else if (inTargetArray && depth === 2 && code === OPEN_BRACE) {
            itemParts = [];
            itemStart = i;
          }
          depth += 1;
        } else if (code === CLOSE_BRACE || code === CLOSE_BRACKET) {
          depth -= 1;
          if (inTargetArray && depth === 2 && code === CLOSE_BRACE && itemParts) {
            itemParts.push(chunk.slice(itemStart, i + 1));
            items.push(JSON.parse(itemParts.join("")));
            itemParts = null;
            itemStart = -1;
          } else if (inTargetArray && depth === 1) {
            inTargetArray = false;
          }
        } else if (depth === 1 && code === COLON) {
          currentKey = keyCandidate;
        } else if (depth === 1 && code === COMMA) {
          currentKey = null;
          keyCandidate = null;
        }
      }

      if (itemParts && itemStart >= 0) itemParts.push(chunk.slice(itemStart));
      return items;
    },
    end() {
      if (itemParts || inString || depth !== 0) {
        throw new Error(`Truncated JSON document while streaming "${key}" items`);
      }
    },
  };
}
