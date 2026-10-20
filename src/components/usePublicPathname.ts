"use client";

import { usePathname } from "next/navigation";
import { toPublicPathname } from "@/lib/public-path";

/**
 * usePathname() returns the internal `/fr/...` path on prerendered French pages;
 * links and active states must use the public URL instead.
 */
export function usePublicPathname(): string {
  return toPublicPathname(usePathname() || "/");
}
