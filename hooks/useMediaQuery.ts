"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Live media-query match. Renders `serverFallback` on the server and during hydration, then the
 * real value, so markup never mismatches.
 */
export function useMediaQuery(query: string, serverFallback = false) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverFallback,
  );
}
