/**
 * Idle work queue. Scroll-driven GSAP setups (pins, scrubs, parallax) are not needed on the first
 * frame, and creating a ScrollTrigger measures layout. Running them all during hydration produced
 * one long main-thread task on phones; instead each setup runs in its own idle callback, highest
 * priority first (pinned sections first, since they add height that later triggers measure).
 *
 * When the queue empties, drain listeners fire (SmoothScroll uses this to re-measure once).
 */

type Job = { run: () => void; priority: number };

let queue: Job[] = [];
let scheduled = false;
const drainListeners = new Set<() => void>();

function request(callback: () => void) {
  if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(callback, { timeout: 700 });
  else window.setTimeout(callback, 16);
}

function schedule() {
  if (scheduled) return;
  scheduled = true;
  request(pump);
}

function pump() {
  scheduled = false;
  queue.sort((a, b) => b.priority - a.priority);
  const job = queue.shift();
  job?.run();
  if (queue.length) schedule();
  else if (job) drainListeners.forEach((listener) => listener());
}

/** Runs `run` in its own idle task. Returns a function that cancels it if it hasn't run yet. */
export function whenIdle(run: () => void, priority = 0) {
  const job: Job = { run, priority };
  queue.push(job);
  schedule();
  return () => {
    queue = queue.filter((j) => j !== job);
  };
}

export function onIdleDrain(listener: () => void) {
  drainListeners.add(listener);
  return () => {
    drainListeners.delete(listener);
  };
}
