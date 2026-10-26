import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/*
 * GSAP is registered once, client side. Every animated component imports gsap from here so the
 * plugins and defaults are guaranteed to be in place.
 *
 * "brand" is the site-wide easing: cubic-bezier(0.22, 1, 0.36, 1), the same curve Motion and CSS use.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, CustomEase);
  CustomEase.create("brand", "0.22, 1, 0.36, 1");
  gsap.defaults({ ease: "brand", duration: 1 });
  gsap.config({ nullTargetWarn: false });
  // Mobile URL bars resize the viewport on scroll; don't re-measure every trigger for that.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { MQ } from "@/lib/motion";
export { gsap, ScrollTrigger, useGSAP };
