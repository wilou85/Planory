export const SESSION_IDLE_TIMEOUT_MS = 30 * 60 * 1000;

type StoredSession = { id: string; lastSeen: number };

export type ResolvedSession = {
  id: string;
  isNew: boolean;
  /** Value to write back to storage. */
  stored: string;
};

function parseStored(raw: string | null): StoredSession | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "object" || value === null) return null;
    const { id, lastSeen } = value as Record<string, unknown>;
    if (typeof id !== "string" || !id || typeof lastSeen !== "number") return null;
    return { id, lastSeen };
  } catch {
    return null;
  }
}

export function resolveSession(
  raw: string | null,
  now: number,
  createId: () => string,
): ResolvedSession {
  const previous = parseStored(raw);
  const active =
    previous !== null &&
    now >= previous.lastSeen &&
    now - previous.lastSeen <= SESSION_IDLE_TIMEOUT_MS;
  const id = active ? previous.id : createId();
  return { id, isNew: !active, stored: JSON.stringify({ id, lastSeen: now }) };
}
