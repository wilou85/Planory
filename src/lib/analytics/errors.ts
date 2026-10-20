import { scrubErrorMessage } from "@/lib/analytics/validate";

export const MAX_ERRORS_PER_PAGE = 5;

type ClientError = { message?: string; filename?: string; lineno?: number };

export type ErrorPayload = { message: string; source?: string; line?: number };

const IGNORED_FILES = /^(chrome|moz|safari(-web)?)-extension:\/\//;
const IGNORED_MESSAGES = /^(ResizeObserver loop|Script error\.?$)/;

function fileName(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const name = url.split(/[?#]/)[0].split("/").pop();
  return name || undefined;
}

/** One reporter per page load: dedupes messages and caps the volume sent. */
export function createErrorReporter() {
  const seen = new Set<string>();

  return (error: ClientError): ErrorPayload | null => {
    const message = scrubErrorMessage(error.message?.trim() ?? "");
    if (!message || IGNORED_MESSAGES.test(message)) return null;
    if (error.filename && IGNORED_FILES.test(error.filename)) return null;
    if (seen.has(message) || seen.size >= MAX_ERRORS_PER_PAGE) return null;
    seen.add(message);

    const source = fileName(error.filename);
    return {
      message,
      ...(source ? { source } : {}),
      ...(typeof error.lineno === "number" && error.lineno > 0 ? { line: error.lineno } : {}),
    };
  };
}
