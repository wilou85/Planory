import { describe, expect, it } from "vitest";
import { assertInvariant, assertInvariantForEach } from "@/lib/test/invariants";
import { SESSION_IDLE_TIMEOUT_MS, resolveSession } from "@/lib/analytics/session";

const T0 = Date.UTC(2026, 9, 20, 10, 0, 0);
let counter = 0;
const createId = () => `sess_${++counter}`;

describe("resolveSession", () => {
  describe("invariants", () => {
    it("keeps the same session while the visitor stays active", () => {
      const first = resolveSession(null, T0, createId);
      const next = resolveSession(first.stored, T0 + SESSION_IDLE_TIMEOUT_MS - 1, createId);
      assertInvariant(first.isNew && !next.isNew, "only the first hit opens a session");
      expect(next.id).toBe(first.id);
    });

    it("opens a new session after the idle timeout", () => {
      const first = resolveSession(null, T0, createId);
      const later = resolveSession(first.stored, T0 + SESSION_IDLE_TIMEOUT_MS + 1, createId);
      assertInvariant(later.isNew && later.id !== first.id, "idle visitor must get a new session");
    });

    it("never resumes an unreadable or legacy stored session", () => {
      assertInvariantForEach(
        [null, "", "sess_legacy_plain_id", "{not json", '{"id":5}', '{"id":"s","lastSeen":"x"}'],
        (raw) => resolveSession(raw, T0, createId).isNew,
        (raw) => `stored value ${String(raw)} must start a new session`,
      );
    });

    it("stores the activity time so the session idles from the last hit, not the first", () => {
      let state = resolveSession(null, T0, createId);
      const id = state.id;
      for (let i = 1; i <= 5; i++) {
        state = resolveSession(state.stored, T0 + i * (SESSION_IDLE_TIMEOUT_MS - 1000), createId);
      }
      expect(state.id).toBe(id);
    });
  });
});
