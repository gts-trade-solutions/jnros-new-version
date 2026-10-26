"use client";

import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLenis } from "@/components/layout/SmoothScroll";
import { Reveal } from "@/components/ui/Reveal";
import type { Img } from "@/lib/data";
import { EASE } from "@/lib/motion";
import { pad2 } from "@/lib/utils";

/**
 * Masonry gallery (CSS columns, so images keep their natural ratios) that opens a lightbox.
 * Items rise in row by row as they scroll into view.
 */
export function Gallery({ images }: { images: Img[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <Reveal as="ul" batch className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4 [&>li]:break-inside-avoid">
        {images.map((img, i) => (
          <li key={img.src}>
            <button
              type="button"
              data-cursor="view"
              onClick={(e) => {
                opener.current = e.currentTarget;
                setIndex(i);
              }}
              aria-label={`View larger: ${img.alt}`}
              className="group relative block w-full overflow-hidden rounded-xs bg-surface-2"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="h-auto w-full transition-transform duration-[1.2s] ease-brand motion-safe:group-hover:scale-105"
              />
              <span aria-hidden="true" className="absolute inset-0 bg-bg/0 transition-colors duration-500 group-hover:bg-bg/30" />
              <span
                aria-hidden="true"
                className="absolute right-4 top-4 grid size-10 place-items-center rounded-xs bg-accent text-bg opacity-0 transition duration-500 ease-brand group-hover:opacity-100 group-focus-visible:opacity-100 can-hover:translate-y-2 can-hover:group-hover:translate-y-0"
              >
                <Expand className="size-4" />
              </span>
            </button>
          </li>
        ))}
      </Reveal>
      <Lightbox
        images={images}
        index={index}
        onIndex={setIndex}
        onClose={() => {
          setIndex(null);
          opener.current?.focus();
        }}
      />
    </>
  );
}

/**
 * Fullscreen viewer: arrow keys / buttons to page, Escape to close, swipe (drag) on touch and
 * mouse. Slides travel in the direction of navigation.
 */
function Lightbox({ images, index, onIndex, onClose }: { images: Img[]; index: number | null; onIndex: (i: number) => void; onClose: () => void }) {
  const lenis = useLenis();
  const [direction, setDirection] = useState(1);
  const closeButton = useRef<HTMLButtonElement>(null);
  const open = index !== null;

  const go = useCallback(
    (step: number) => {
      if (index === null) return;
      setDirection(step);
      onIndex((index + step + images.length) % images.length);
    },
    [index, images.length, onIndex],
  );

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    closeButton.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, [open, go, onClose, lenis]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -80 || info.velocity.x < -500) go(1);
    else if (info.offset.x > 80 || info.velocity.x > 500) go(-1);
  };

  const img = index === null ? null : images[index];

  return (
    <AnimatePresence>
      {img && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          className="fixed inset-0 z-[160] flex flex-col bg-bg/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <div className="container-x flex h-20 shrink-0 items-center justify-between">
            <p className="font-mono text-label tabular-nums text-muted">
              <span className="text-text">{pad2((index ?? 0) + 1)}</span> / {pad2(images.length)}
            </p>
            <button ref={closeButton} type="button" onClick={onClose} aria-label="Close image viewer" className="grid size-12 place-items-center rounded-xs border border-border hover:border-accent hover:text-accent">
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>

          <div className="relative min-h-0 flex-1 overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={img.src}
                custom={direction}
                className="absolute inset-0 px-4 sm:px-20"
                data-cursor="drag"
                variants={{
                  enter: (d: number) => ({ x: `${d * 30}%`, opacity: 0 }),
                  center: { x: "0%", opacity: 1 },
                  exit: (d: number) => ({ x: `${d * -30}%`, opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: EASE }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={onDragEnd}
              >
                <Image src={img.src} alt={img.alt} fill sizes="100vw" className="pointer-events-none select-none object-contain" draggable={false} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="container-x flex h-24 shrink-0 items-center justify-between gap-6">
            <p className="line-clamp-2 max-w-xl text-sm text-muted">{img.alt}</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => go(-1)} aria-label="Previous image" className="grid size-12 place-items-center rounded-xs border border-border hover:border-accent hover:text-accent">
                <ChevronLeft aria-hidden="true" className="size-5" />
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next image" className="grid size-12 place-items-center rounded-xs border border-border hover:border-accent hover:text-accent">
                <ChevronRight aria-hidden="true" className="size-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
