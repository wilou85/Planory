/**
 * Fail fast with a named business/domain invariant.
 * Use in Vitest after the invariant has been stated in the test title.
 */
export function assertInvariant(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) {
    throw new Error(`Invariant violated: ${message}`);
  }
}

/** Run the same invariant predicate across a table of cases. */
export function assertInvariantForEach<T>(
  cases: readonly T[],
  predicate: (value: T) => boolean,
  message: (value: T) => string,
): void {
  for (const value of cases) {
    assertInvariant(predicate(value), message(value));
  }
}
