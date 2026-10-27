import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { GridLines } from "@/components/ui/GridLines";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { pageImages } from "@/lib/data";

export default function NotFound() {
  return (
    <section data-hero="" data-tone="dark" className="relative isolate flex min-h-svh items-end overflow-hidden bg-bg">
      <Image src={pageImages.notFound.src} alt="" fill sizes="100vw" className="-z-20 object-cover opacity-40" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-bg via-bg/70 to-bg/40" />
      <GridLines className="-z-10" />
      <div className="container-x pb-24 pt-44">
        <SectionLabel>Error 404</SectionLabel>
        <p aria-hidden="true" className="mt-6 font-display text-[clamp(8rem,28vw,24rem)] font-extrabold leading-[0.8] text-outline">
          404
        </p>
        <h1 className="mt-6 text-h2">Page not found.</h1>
        <p className="mt-6 max-w-xl text-lead text-muted">The page you were looking for has moved or does not exist.</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="/" size="lg">
            Back to home
          </Button>
          <Button href="/contact" variant="outline" size="lg" arrow={false}>
            Contact us
          </Button>
        </div>
      </div>
    </section>
  );
}
