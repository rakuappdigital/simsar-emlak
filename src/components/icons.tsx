import type { SVGProps } from "react";

/**
 * Hand-built pixel-grid icon set (no stock art) — each icon is a fixed set
 * of squares on a 16x16 (or 12x12) grid, rendered crisp/unsmoothed so it
 * matches the game's pixel-art visual language. Every icon takes the
 * standard SVG props so size/className/etc. can be set at the call site;
 * fill defaults to currentColor so icons inherit surrounding text color.
 */

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

function Grid({ size = 16, viewBox = "0 0 16 16", children, ...rest }: IconProps & { viewBox?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="currentColor"
      shapeRendering="crispEdges"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function WalletIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="1" y="4" width="14" height="10" />
      <rect x="1" y="4" width="14" height="2" fill="#0000003d" />
      <rect x="9" y="8" width="5" height="4" fill="#00000000" stroke="none" />
      <rect x="10" y="9" width="3" height="2" className="icon-accent" />
    </Grid>
  );
}

export function CartIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="1" y="2" width="2" height="2" />
      <rect x="3" y="2" width="11" height="2" />
      <rect x="3" y="4" width="10" height="6" />
      <rect x="2" y="10" width="11" height="2" />
      <rect x="4" y="13" width="2" height="2" />
      <rect x="10" y="13" width="2" height="2" />
    </Grid>
  );
}

export function ChatIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="1" y="2" width="14" height="9" />
      <rect x="3" y="11" width="2" height="3" />
      <rect x="4" y="5" width="2" height="2" fill="#0000003d" />
      <rect x="7" y="5" width="2" height="2" fill="#0000003d" />
      <rect x="10" y="5" width="2" height="2" fill="#0000003d" />
    </Grid>
  );
}

export function HouseIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="7" y="1" width="2" height="2" />
      <rect x="5" y="3" width="2" height="2" />
      <rect x="9" y="3" width="2" height="2" />
      <rect x="3" y="5" width="2" height="2" />
      <rect x="11" y="5" width="2" height="2" />
      <rect x="2" y="7" width="12" height="7" />
      <rect x="7" y="9" width="2" height="5" fill="#0000003d" />
    </Grid>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="7" y="1" width="2" height="4" />
      <rect x="7" y="11" width="2" height="4" />
      <rect x="1" y="7" width="4" height="2" />
      <rect x="11" y="7" width="4" height="2" />
      <rect x="3" y="3" width="2" height="2" />
      <rect x="11" y="3" width="2" height="2" />
      <rect x="3" y="11" width="2" height="2" />
      <rect x="11" y="11" width="2" height="2" />
      <rect x="6" y="6" width="4" height="4" />
    </Grid>
  );
}

export function MedalIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="5" y="1" width="2" height="4" />
      <rect x="9" y="1" width="2" height="4" />
      <rect x="4" y="7" width="8" height="8" />
      <rect x="6" y="9" width="4" height="4" className="icon-accent" />
    </Grid>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="2" y="3" width="5" height="5" />
      <rect x="9" y="3" width="5" height="5" />
      <rect x="4" y="8" width="8" height="3" />
      <rect x="6" y="11" width="4" height="2" className="icon-accent" />
    </Grid>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="1" y="2" width="14" height="12" />
      <rect x="1" y="2" width="14" height="3" fill="#0000003d" />
      <rect x="3" y="0" width="2" height="3" />
      <rect x="11" y="0" width="2" height="3" />
      <rect x="4" y="8" width="2" height="2" className="icon-accent" />
      <rect x="7" y="8" width="2" height="2" className="icon-accent" />
      <rect x="10" y="8" width="2" height="2" className="icon-accent" />
      <rect x="4" y="11" width="2" height="2" className="icon-accent" />
    </Grid>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="1" y="1" width="2" height="2" />
      <rect x="3" y="3" width="2" height="2" />
      <rect x="5" y="5" width="2" height="2" />
      <rect x="7" y="7" width="2" height="2" />
      <rect x="9" y="5" width="2" height="2" />
      <rect x="11" y="3" width="2" height="2" />
      <rect x="13" y="1" width="2" height="2" />
      <rect x="1" y="13" width="2" height="2" />
      <rect x="3" y="11" width="2" height="2" />
      <rect x="5" y="9" width="2" height="2" />
      <rect x="9" y="9" width="2" height="2" />
      <rect x="11" y="11" width="2" height="2" />
      <rect x="13" y="13" width="2" height="2" />
    </Grid>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="9" y="1" width="2" height="2" />
      <rect x="7" y="3" width="2" height="2" />
      <rect x="5" y="5" width="2" height="2" />
      <rect x="3" y="7" width="2" height="2" />
      <rect x="5" y="9" width="2" height="2" />
      <rect x="7" y="11" width="2" height="2" />
      <rect x="9" y="13" width="2" height="2" />
    </Grid>
  );
}

export function SignalIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="1" y="10" width="2" height="4" />
      <rect x="5" y="7" width="2" height="7" />
      <rect x="9" y="4" width="2" height="10" />
      <rect x="13" y="1" width="2" height="13" />
    </Grid>
  );
}

export function BatteryIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="1" y="4" width="12" height="8" />
      <rect x="13" y="6" width="2" height="4" />
      <rect x="3" y="6" width="4" height="4" className="icon-accent" />
    </Grid>
  );
}

export function VideoCamIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="1" y="5" width="8" height="7" />
      <rect x="9" y="7" width="1" height="3" />
      <rect x="10" y="7" width="2" height="3" />
      <rect x="12" y="6" width="2" height="5" />
      <rect x="14" y="5" width="1" height="7" />
    </Grid>
  );
}

export function PhoneCallIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="2" y="10" width="4" height="4" />
      <rect x="5" y="7" width="3" height="3" />
      <rect x="8" y="4" width="3" height="3" />
      <rect x="10" y="1" width="4" height="4" />
    </Grid>
  );
}

/** App logo: a house silhouette with a keyhole door — real-estate + "key handover" in one mark. */
export function LogoIcon(props: IconProps) {
  return (
    <Grid {...props} viewBox="0 0 24 24">
      <rect x="10" y="2" width="4" height="2" />
      <rect x="7" y="4" width="10" height="2" />
      <rect x="4" y="6" width="16" height="2" />
      <rect x="5" y="8" width="14" height="10" />
      <rect x="7" y="10" width="3" height="3" className="icon-cutout" />
      <rect x="14" y="10" width="3" height="3" className="icon-cutout" />
      <rect x="10" y="12" width="4" height="6" className="icon-cutout" />
      <rect x="11" y="13" width="2" height="2" className="icon-accent" />
      <rect x="11" y="15" width="2" height="2" className="icon-accent" />
    </Grid>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="7" y="1" width="2" height="2" />
      <rect x="5" y="3" width="6" height="2" />
      <rect x="4" y="5" width="8" height="6" />
      <rect x="3" y="11" width="10" height="2" />
      <rect x="6" y="13" width="4" height="2" />
    </Grid>
  );
}
