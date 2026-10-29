/*
 * Encodes a background clip for <LoopVideo> (components/ui/LoopVideo.tsx):
 *   public/videos/<name>-1080.mp4    1920×1080 H.264, for tablets and desktops
 *   public/videos/<name>-720.mp4     1280×720 H.264, for phones
 *   public/images/<name>-poster.jpg  the first frame: shown at once, and wherever video doesn't play
 *
 *   node scripts/encode-video.mjs <source> <name> [--start s] [--end s] [--fade s]
 *
 * --start/--end trim the source. --fade dissolves the last seconds back into the first, so a single
 * continuous shot loops without a jump; leave it out when the loop point is already a cut.
 *
 * H.264 because every phone and browser decodes it in hardware: playback stays smooth and light on
 * battery. No audio track. "faststart" moves the index to the front of the file, so playback starts
 * from the first bytes instead of after the whole download. Frame rates above 30 are halved (a
 * background loop doesn't need 60fps, and it halves the file), and other aspect ratios are cropped
 * to 16:9 from the centre, so every clip and poster has the same size. Needs ffmpeg on the PATH; the
 * outputs are committed, so building the site doesn't.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: { start: { type: "string", default: "0" }, end: { type: "string" }, fade: { type: "string", default: "0" } },
});
const [source, name] = positionals;
if (!source || !name) {
  console.error("Usage: node scripts/encode-video.mjs <source> <name> [--start s] [--end s] [--fade s]");
  process.exit(1);
}

const probe = (entries) => execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", entries, "-of", "csv=p=0", source], { encoding: "utf8" }).trim();
const [num, den] = probe("stream=r_frame_rate").split("/").map(Number);
const sourceFps = num / (den || 1);
const fps = sourceFps > 31 ? `${num}/${(den || 1) * 2}` : `${num}/${den || 1}`;

const start = Number(values.start);
const end = values.end ? Number(values.end) : Number(probe("format=duration"));
const fade = Number(values.fade);

// A fade loop starts `fade` seconds in, and its last `fade` seconds dissolve into the source's
// first `fade` seconds: the final frame matches the first, so the loop is seamless.
const trim = (from, to) => `trim=start=${from}:end=${to},setpts=PTS-STARTPTS`;
// Scale to cover w×h, then crop the overflow from the centre.
const fit = (w, h) => `scale=${w}:${h}:force_original_aspect_ratio=increase:flags=lanczos,crop=${w}:${h}`;
const body = fade
  ? `[0:v]${trim(start + fade, end)}[a];[0:v]${trim(start, start + fade)}[b];[a][b]xfade=transition=fade:duration=${fade}:offset=${end - start - 2 * fade}[clip]`
  : `[0:v]${trim(start, end)}[clip]`;
const graph = `${body};[clip]fps=${fps},hqdn3d=1.5:1.5:6:6,format=yuv420p,split=2[x][y];[x]${fit(1920, 1080)}[hd];[y]${fit(1280, 720)}[sd]`;

const root = fileURLToPath(new URL("..", import.meta.url));
const videos = join(root, "public/videos");
mkdirSync(videos, { recursive: true });
const hd = join(videos, `${name}-1080.mp4`);
const sd = join(videos, `${name}-720.mp4`);
const poster = join(root, "public/images", `${name}-poster.jpg`);

const gop = String(Math.round(2 * (sourceFps > 31 ? sourceFps / 2 : sourceFps)));
const h264 = (crf, maxrate) => ["-c:v", "libx264", "-preset", "slower", "-profile:v", "high", "-crf", crf, "-maxrate", maxrate, "-bufsize", `${parseFloat(maxrate) * 2}M`, "-g", gop, "-movflags", "+faststart", "-an"];

execFileSync("ffmpeg", ["-v", "error", "-y", "-i", source, "-filter_complex", graph, "-map", "[hd]", ...h264("23", "4M"), hd, "-map", "[sd]", ...h264("24", "1.8M"), sd], { stdio: "inherit" });
execFileSync("ffmpeg", ["-v", "error", "-y", "-i", hd, "-frames:v", "1", "-q:v", "3", poster], { stdio: "inherit" });

const mb = (file) => `${(statSync(file).size / 1e6).toFixed(1)} MB`;
console.log(`${name}: ${(end - start - fade).toFixed(1)}s loop · 1080p ${mb(hd)} · 720p ${mb(sd)} · poster ${mb(poster)}`);
