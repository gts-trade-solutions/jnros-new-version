"use client";

import { MQ } from "@/lib/motion";
import { useMediaQuery } from "./useMediaQuery";

/** True when the user asked the OS for reduced motion. False on the server. */
export function useReducedMotion() {
  return useMediaQuery(MQ.reduce);
}
