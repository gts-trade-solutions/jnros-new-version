/*
 * Pre-builds every image size next/image can ask for, as static WebP files:
 *   public/images/<name>.<ext>  →  public/img/images/<name>-<width>.webp
 *   public/brand/<name>.png     →  public/img/brand/<name>-<width>.webp
 * for each width in lib/image-widths.json (next.config.ts images.deviceSizes + imageSizes).
 *
 * lib/image-loader.ts points <Image> at these files, so photos are plain static files on the CDN:
 * no on-demand resizing, and no slow first request for a size nobody has asked for yet.
 *
 * Runs before `next dev` and `next build` (package.json). Incremental: a file is only encoded
 * when it is missing or older than its source. The output is generated, not committed.
 */
import { readFileSync } from "node:fs";
import { mkdir, readdir, stat } from "node:fs/promises";
import { availableParallelism } from "node:os";
import { join, parse } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));
const { deviceSizes, imageSizes } = JSON.parse(readFileSync(join(root, "lib/image-widths.json"), "utf8"));
const WIDTHS = [...imageSizes, ...deviceSizes];
const SOURCE_DIRS = ["images", "brand"];
const INPUT = /\.(jpe?g|png|webp|avif)$/i;

const jobs = [];
for (const dir of SOURCE_DIRS) {
  const outDir = join(root, "public/img", dir);
  await mkdir(outDir, { recursive: true });
  for (const file of await readdir(join(root, "public", dir))) {
    if (!INPUT.test(file)) continue;
    const src = join(root, "public", dir, file);
    const srcTime = (await stat(src)).mtimeMs;
    for (const width of WIDTHS) {
      const out = join(outDir, `${parse(file).name}-${width}.webp`);
      const outTime = await stat(out).then((s) => s.mtimeMs, () => 0);
      if (outTime < srcTime) jobs.push({ src, out, width });
    }
  }
}

const started = Date.now();
let next = 0;
async function worker() {
  while (next < jobs.length) {
    const { src, out, width } = jobs[next++];
    // Never upscales: a width above the source's own is written at the source size.
    await sharp(src).resize({ width, withoutEnlargement: true }).webp({ quality: 75, effort: 5 }).toFile(out);
  }
}
await Promise.all(Array.from({ length: Math.min(availableParallelism(), 8) }, worker));
console.log(`optimize-images: ${jobs.length} file(s) encoded in ${((Date.now() - started) / 1000).toFixed(1)}s`);
