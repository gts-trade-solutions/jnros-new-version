import type { PartnerLogo as PartnerLogoName } from "@/lib/data";

/**
 * Placeholder marks for the group companies, drawn on a 40×40 grid.
 * Rendered twice by the Partners section (a grey copy and a brand-colour copy) so the hover can
 * crossfade between them with opacity alone.
 */
const marks: Record<PartnerLogoName, React.ReactNode> = {
  irongate: <path d="M5 7h30v5H5zM7.5 14.5h5V34h-5zM17.5 14.5h5V34h-5zM27.5 14.5h5V34h-5z" />,
  kestrel: (
    <>
      <path d="M20 3.5a16.5 16.5 0 1 0 0 33 16.5 16.5 0 0 0 0-33Zm0 5a11.5 11.5 0 1 1 0 23 11.5 11.5 0 0 1 0-23Z" />
      <path d="M17.75 0h4.5v13h-4.5zM17.75 27h4.5v13h-4.5zM0 17.75h13v4.5H0zM27 17.75h13v4.5H27z" />
      <circle cx="20" cy="20" r="2.75" />
    </>
  ),
  bedrock: <path d="M4 26h32v9H4zM9 15.5h22v8.5H9zM14 5h12v8.5H14z" />,
  northline: <path d="m3 25 8.5-8.5L20 25l8.5-8.5L37 25v7l-8.5-8.5L20 32l-8.5-8.5L3 32zM3 12.5 11.5 4 20 12.5 28.5 4 37 12.5v5L28.5 9 20 17.5 11.5 9 3 17.5z" />,
};

export function PartnerMark({ logo, color, className }: { logo: PartnerLogoName; color: string; className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={className} fill={color} fillRule="evenodd">
      {marks[logo]}
    </svg>
  );
}
