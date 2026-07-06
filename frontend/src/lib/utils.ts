import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for merging Tailwind CSS class names.
 * Combines `clsx` (conditional classes) with `tailwind-merge`
 * (deduplication of conflicting utilities).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
