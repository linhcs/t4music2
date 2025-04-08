import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractParamFromUrl(url: string, after: string): string | null {
  const path = new URL(url).pathname.split("/");
  const index = path.indexOf(after);
  return index !== -1 && index + 1 < path.length ? path[index + 1] : null;
}
