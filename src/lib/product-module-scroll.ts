/** Stable anchor for the product module article (survives module remounts). */
export const PRODUCT_MODULE_PANEL_ID = "product-module-panel";

type Scrollable = { scrollIntoView: (options?: ScrollIntoViewOptions) => void };
type DocLike = { getElementById: (id: string) => Scrollable | null };

/**
 * After a MODULES sidebar / chip click, bring the article into view so the
 * reader does not have to scroll back up manually.
 */
export function scrollProductModuleIntoView(
  moduleId: string,
  doc: DocLike | null = typeof document !== "undefined" ? document : null,
): void {
  if (!doc) return;
  const el =
    doc.getElementById(PRODUCT_MODULE_PANEL_ID) ?? doc.getElementById(moduleId);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}
