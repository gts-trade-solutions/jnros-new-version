import { Counter } from "@/components/ui/Counter";
import { stats } from "@/lib/data";
import { cn } from "@/lib/utils";

/** Border layout for a 2×2 grid on mobile and a single row on desktop, with thin dividers between. */
const cellBorders = ["", "border-l", "border-t lg:border-t-0 lg:border-l", "border-l border-t lg:border-t-0"];

/** Four headline numbers that count up when scrolled into view (see <Counter>). */
export function Stats() {
  return (
    <section id="stats" aria-label="Jnros by the numbers" className="relative border-b border-border bg-surface">
      <div className="container-x">
        <dl className="-mx-5 grid grid-cols-2 sm:-mx-8 lg:grid-cols-4">
          {stats.map((s, i) => {
            const safety = i === stats.length - 1;
            return (
              <div key={s.label} className={cn("flex flex-col border-border px-5 py-10 sm:px-8 sm:py-14 lg:py-16", cellBorders[i])}>
                <dt className="order-2 mt-4 font-display text-xl font-bold uppercase tracking-[0.04em] sm:text-2xl">{s.label}</dt>
                <dd className={cn("order-1 font-display text-stat font-extrabold", safety && "text-accent")}>
                  <Counter to={s.value} from={"from" in s ? s.from : 0} suffix={"suffix" in s ? s.suffix : ""} />
                </dd>
                <dd className="order-3 mt-2 flex items-center gap-2 font-mono text-label uppercase text-muted">
                  {safety && <span aria-hidden="true" className="hazard inline-block h-2 w-3 rounded-[1px]" />}
                  {s.detail}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
