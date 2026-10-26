"use client";

import { CircleAlert, FileImage, FileSpreadsheet, FileText, Upload, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { ACCEPT, checkFile, type IndustryQuoteInput, MAX_FILE_MB, MAX_FILES } from "@/lib/industry-quote";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

const formatSize = (bytes: number) => (bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

function fileIcon(name: string) {
  if (/\.(jpe?g|png|gif)$/i.test(name)) return FileImage;
  if (/\.xlsx?$/i.test(name)) return FileSpreadsheet;
  return FileText;
}

/**
 * Attachments. Drag files onto the zone (its border pulses lime while dragging) or click to
 * browse. Files are checked as they're added (type, 10 MB each, 5 max); accepted ones appear as
 * chips that animate in and can be removed. Files live in the form state as File objects.
 */
export function Attachments() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<IndustryQuoteInput>();
  const files = (watch("files") ?? []) as File[];
  const [dragging, setDragging] = useState(false);
  const [rejected, setRejected] = useState<string[]>([]);

  const add = (incoming: FileList | File[]) => {
    const next = [...files];
    const problems: string[] = [];
    for (const file of Array.from(incoming)) {
      const problem = checkFile(file);
      if (problem) problems.push(problem);
      else if (next.some((f) => f.name === file.name && f.size === file.size)) continue;
      else if (next.length >= MAX_FILES) problems.push(`${file.name}: the limit is ${MAX_FILES} files`);
      else next.push(file);
    }
    setRejected(problems);
    setValue("files", next, { shouldValidate: true, shouldDirty: true });
  };

  const remove = (index: number) => {
    setValue(
      "files",
      files.filter((_, i) => i !== index),
      { shouldValidate: true, shouldDirty: true },
    );
  };

  const schemaError = errors.files?.message as string | undefined;

  return (
    <div className="space-y-6">
      <label
        htmlFor="iq-files"
        onDragEnter={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          add(e.dataTransfer.files);
        }}
        className="relative grid cursor-pointer place-items-center gap-4 rounded-sm border border-dashed border-line bg-forest-950/50 px-6 py-14 text-center transition-colors hover:border-lime/50 has-[:focus-visible]:border-lime"
      >
        {/* Pulsing lime border while a file is dragged over (opacity animation). */}
        <span aria-hidden="true" className={cn("pointer-events-none absolute -inset-px rounded-sm border-2 border-lime opacity-0", dragging && "animate-drop-pulse")} />
        <span className={cn("grid size-14 place-items-center rounded-full border border-line text-lime transition-transform duration-500 ease-brand", dragging && "scale-110")}>
          <Upload aria-hidden="true" className="size-6" />
        </span>
        <span className="font-display text-xl font-bold uppercase tracking-[0.04em] text-cream">
          Drag files here or <span className="text-lime underline decoration-1 underline-offset-4">browse</span>
        </span>
        <span className="font-mono text-label uppercase text-sage">
          JPG, PNG, GIF, PDF or XLS · up to {MAX_FILES} files, {MAX_FILE_MB} MB each
        </span>
        <input
          id="iq-files"
          type="file"
          multiple
          accept={ACCEPT}
          className="sr-only"
          onChange={(e) => {
            if (e.target.files) add(e.target.files);
            e.target.value = "";
          }}
        />
      </label>

      {(rejected.length > 0 || schemaError) && (
        <ul role="alert" className="space-y-1">
          {[...rejected, ...(schemaError ? [schemaError] : [])].map((message) => (
            <li key={message} className="flex items-center gap-1.5 text-sm text-lime-bright">
              <CircleAlert aria-hidden="true" className="size-3.5 shrink-0" />
              {message}
            </li>
          ))}
        </ul>
      )}

      <ul aria-label="Attached files" className="flex flex-wrap gap-2">
        <AnimatePresence initial={false}>
          {files.map((file, i) => {
            const Icon = fileIcon(file.name);
            return (
              <motion.li
                key={`${file.name}-${file.size}`}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="flex max-w-full items-center gap-3 rounded-sm border border-line bg-forest-800 py-2 pl-3 pr-2"
              >
                <Icon aria-hidden="true" className="size-4 shrink-0 text-lime" />
                <span className="min-w-0 truncate text-sm text-cream">{file.name}</span>
                <span className="shrink-0 font-mono text-label text-sage">{formatSize(file.size)}</span>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  aria-label={`Remove ${file.name}`}
                  className="grid size-7 shrink-0 place-items-center rounded-xs text-sage transition-colors hover:bg-forest-700 hover:text-lime"
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
