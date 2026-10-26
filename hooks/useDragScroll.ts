"use client";

import { type RefObject, useEffect } from "react";

/**
 * Click-and-drag horizontal scrolling for mouse users on an overflow-x container (touch already
 * swipes natively). Scroll-snap is suspended while dragging so the content follows the pointer,
 * and a click that ends a drag is swallowed so it doesn't open a card.
 */
export function useDragScroll(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let startX = 0;
    let startScroll = 0;
    let dragging = false;
    let moved = false;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0 || el.scrollWidth <= el.clientWidth) return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startScroll = el.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 5) {
        moved = true;
        el.style.scrollSnapType = "none";
        el.setPointerCapture(e.pointerId);
      }
      if (moved) el.scrollLeft = startScroll - dx;
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      el.style.scrollSnapType = "";
    };
    // Window capture runs before any document-level click handling (including page transitions).
    const onClick = (e: MouseEvent) => {
      if (moved && el.contains(e.target as Node)) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    const onDragStart = (e: DragEvent) => e.preventDefault();

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    window.addEventListener("click", onClick, true);
    el.addEventListener("dragstart", onDragStart);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      window.removeEventListener("click", onClick, true);
      el.removeEventListener("dragstart", onDragStart);
    };
  }, [ref]);
}
