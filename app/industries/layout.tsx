import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#04100A",
  colorScheme: "dark",
};

/**
 * Industries section wrapper. data-theme="forest" switches the site tokens to the green palette
 * (see globals.css), which also re-colours the shared header, footer, cursor and page transition
 * while one of these pages is on screen.
 */
export default function IndustriesLayout({ children }: { children: React.ReactNode }) {
  return <div data-theme="forest">{children}</div>;
}
