import type { SVGProps } from "react";

/**
 * Hand-built pixel-grid icon set (no stock art) — each icon is a fixed set
 * of squares on a 16x16 (or 12x12/24x24) grid, rendered crisp/unsmoothed so
 * it matches the game's pixel-art visual language. Every icon takes the
 * standard SVG props so size/className/etc. can be set at the call site;
 * fill defaults to currentColor so icons inherit surrounding text color.
 *
 * "Warm Pixel" shading (chosen 2026-09-24 from 3 reviewed directions): every
 * icon's main silhouette gets a lighter highlight strip along its top/light
 * edge (`.icon-hi`) and a darker shadow strip along its bottom/dark edge
 * (`.icon-lo`) — the same warm-gold highlight/shadow language the isometric
 * house illustrations already use (see game.css). `.icon-accent`/
 * `.icon-cutout` (pre-existing) are still used for small detail marks.
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
      <rect x="1" y="4" width="14" height="2" className="icon-hi" />
      <rect x="1" y="12" width="14" height="2" className="icon-lo" />
      <rect x="10" y="9" width="3" height="2" className="icon-accent" />
    </Grid>
  );
}

export function CartIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="1" y="2" width="2" height="2" />
      <rect x="3" y="2" width="11" height="2" className="icon-hi" />
      <rect x="3" y="4" width="10" height="6" />
      <rect x="2" y="10" width="11" height="2" className="icon-lo" />
      <rect x="4" y="13" width="2" height="2" />
      <rect x="10" y="13" width="2" height="2" />
    </Grid>
  );
}

export function ChatIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="1" y="2" width="14" height="9" />
      <rect x="1" y="2" width="14" height="2" className="icon-hi" />
      <rect x="1" y="9" width="14" height="2" className="icon-lo" />
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
      <rect x="7" y="1" width="2" height="2" className="icon-hi" />
      <rect x="5" y="3" width="2" height="2" className="icon-hi" />
      <rect x="9" y="3" width="2" height="2" className="icon-hi" />
      <rect x="3" y="5" width="2" height="2" />
      <rect x="11" y="5" width="2" height="2" />
      <rect x="2" y="7" width="12" height="4" />
      <rect x="2" y="11" width="12" height="3" className="icon-lo" />
      <rect x="7" y="9" width="2" height="5" fill="#0000003d" />
    </Grid>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="7" y="1" width="2" height="4" className="icon-hi" />
      <rect x="7" y="11" width="2" height="4" className="icon-lo" />
      <rect x="1" y="7" width="4" height="2" />
      <rect x="11" y="7" width="4" height="2" />
      <rect x="3" y="3" width="2" height="2" className="icon-hi" />
      <rect x="11" y="3" width="2" height="2" className="icon-hi" />
      <rect x="3" y="11" width="2" height="2" className="icon-lo" />
      <rect x="11" y="11" width="2" height="2" className="icon-lo" />
      <rect x="6" y="6" width="4" height="4" />
    </Grid>
  );
}

export function MedalIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="5" y="1" width="2" height="4" className="icon-hi" />
      <rect x="9" y="1" width="2" height="4" className="icon-hi" />
      <rect x="4" y="7" width="8" height="4" />
      <rect x="4" y="11" width="8" height="4" className="icon-lo" />
      <rect x="6" y="9" width="4" height="4" className="icon-accent" />
    </Grid>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="2" y="3" width="5" height="5" className="icon-hi" />
      <rect x="9" y="3" width="5" height="5" className="icon-hi" />
      <rect x="4" y="8" width="8" height="3" />
      <rect x="6" y="11" width="4" height="2" className="icon-accent" />
    </Grid>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="1" y="2" width="14" height="12" />
      <rect x="1" y="2" width="14" height="3" className="icon-hi" />
      <rect x="1" y="11" width="14" height="3" className="icon-lo" />
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
      <rect x="13" y="1" width="2" height="13" className="icon-hi" />
    </Grid>
  );
}

export function BatteryIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="1" y="4" width="12" height="8" />
      <rect x="1" y="4" width="12" height="2" className="icon-hi" />
      <rect x="13" y="6" width="2" height="4" />
      <rect x="3" y="6" width="4" height="4" className="icon-accent" />
    </Grid>
  );
}

export function VideoCamIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="1" y="5" width="8" height="7" />
      <rect x="1" y="5" width="8" height="2" className="icon-hi" />
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
      <rect x="10" y="1" width="4" height="4" className="icon-hi" />
    </Grid>
  );
}

/** App logo: a house silhouette with a keyhole door — real-estate + "key handover" in one mark. */
export function LogoIcon(props: IconProps) {
  return (
    <Grid {...props} viewBox="0 0 24 24">
      <rect x="10" y="2" width="4" height="2" className="icon-hi" />
      <rect x="7" y="4" width="10" height="2" className="icon-hi" />
      <rect x="4" y="6" width="16" height="2" />
      <rect x="5" y="8" width="14" height="6" />
      <rect x="5" y="14" width="14" height="4" className="icon-lo" />
      <rect x="7" y="10" width="3" height="3" className="icon-cutout" />
      <rect x="14" y="10" width="3" height="3" className="icon-cutout" />
      <rect x="10" y="12" width="4" height="6" className="icon-cutout" />
      <rect x="11" y="13" width="2" height="2" className="icon-accent" />
      <rect x="11" y="15" width="2" height="2" className="icon-accent" />
    </Grid>
  );
}

export function GearIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="7" y="0" width="2" height="3" className="icon-hi" />
      <rect x="7" y="13" width="2" height="3" className="icon-lo" />
      <rect x="0" y="7" width="3" height="2" />
      <rect x="13" y="7" width="3" height="2" />
      <rect x="2" y="2" width="2" height="2" className="icon-hi" />
      <rect x="12" y="2" width="2" height="2" className="icon-hi" />
      <rect x="2" y="12" width="2" height="2" className="icon-lo" />
      <rect x="12" y="12" width="2" height="2" className="icon-lo" />
      <rect x="3" y="3" width="10" height="10" />
      <rect x="6" y="6" width="4" height="4" className="icon-cutout" />
    </Grid>
  );
}

/** A held smartphone silhouette — used for the Messages entry point, distinct from the small ChatIcon speech-bubble. */
export function PhoneDeviceIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="4" y="0" width="8" height="16" />
      <rect x="4" y="0" width="8" height="2" className="icon-hi" />
      <rect x="4" y="14" width="8" height="2" className="icon-lo" />
      <rect x="5" y="2" width="6" height="10" fill="#0000003d" />
      <rect x="7" y="13" width="2" height="2" className="icon-accent" />
    </Grid>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="7" y="1" width="2" height="2" className="icon-hi" />
      <rect x="5" y="3" width="6" height="2" className="icon-hi" />
      <rect x="4" y="5" width="8" height="3" />
      <rect x="4" y="8" width="8" height="3" className="icon-lo" />
      <rect x="3" y="11" width="10" height="2" />
      <rect x="6" y="13" width="4" height="2" />
    </Grid>
  );
}

/** "Emlah'ın Geçmişi" origin badges — one per backstory, shown at rank-ups. See data/origin.ts. */
export function ChalkboardIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="1" y="2" width="14" height="9" />
      <rect x="1" y="2" width="14" height="2" className="icon-hi" />
      <rect x="2" y="3" width="12" height="7" fill="#0000003d" />
      <rect x="4" y="5" width="6" height="1" className="icon-accent" />
      <rect x="4" y="7" width="4" height="1" className="icon-accent" />
      <rect x="7" y="12" width="2" height="3" />
      <rect x="5" y="15" width="6" height="1" />
    </Grid>
  );
}

export function KeyRingIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="1" y="4" width="6" height="2" className="icon-hi" />
      <rect x="1" y="4" width="2" height="6" />
      <rect x="1" y="8" width="6" height="2" className="icon-lo" />
      <rect x="5" y="4" width="2" height="6" />
      <rect x="3" y="6" width="2" height="2" className="icon-accent" />
      <rect x="7" y="6" width="8" height="2" />
      <rect x="11" y="8" width="2" height="3" />
      <rect x="13" y="8" width="2" height="2" />
    </Grid>
  );
}

export function BriefcaseIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="6" y="1" width="4" height="2" />
      <rect x="1" y="4" width="14" height="10" />
      <rect x="1" y="4" width="14" height="2" className="icon-hi" />
      <rect x="1" y="12" width="14" height="2" className="icon-lo" />
      <rect x="6" y="7" width="4" height="3" className="icon-accent" />
    </Grid>
  );
}

/** Store: Jetton package — octagonal coin medallion, distinct from MedalIcon's ribboned medal. */
export function CoinIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="5" y="2" width="6" height="2" className="icon-hi" />
      <rect x="3" y="4" width="10" height="8" />
      <rect x="3" y="4" width="10" height="2" className="icon-hi" />
      <rect x="3" y="10" width="10" height="2" className="icon-lo" />
      <rect x="5" y="12" width="6" height="2" className="icon-lo" />
      <rect x="6" y="6" width="4" height="4" className="icon-accent" />
    </Grid>
  );
}

/** Store: Full Version — an open padlock (shackle swung clear), body + keyhole below. */
export function UnlockIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="4" y="2" width="2" height="4" className="icon-hi" />
      <rect x="4" y="1" width="5" height="2" className="icon-hi" />
      <rect x="9" y="0" width="2" height="3" className="icon-hi" />
      <rect x="2" y="6" width="12" height="8" />
      <rect x="2" y="6" width="12" height="2" className="icon-hi" />
      <rect x="2" y="12" width="12" height="2" className="icon-lo" />
      <rect x="7" y="9" width="2" height="2" className="icon-accent" />
      <rect x="7" y="11" width="2" height="1" className="icon-accent" />
    </Grid>
  );
}

/** Store: Remove Ads — a megaphone with a diagonal "no" slash. */
export function NoAdsIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="1" y="6" width="4" height="4" />
      <rect x="5" y="4" width="4" height="8" className="icon-hi" />
      <rect x="9" y="2" width="4" height="12" />
      <rect x="9" y="2" width="4" height="2" className="icon-hi" />
      <rect x="9" y="12" width="4" height="2" className="icon-lo" />
      <rect x="1" y="12" width="2" height="2" fill="#e2574c" />
      <rect x="4" y="10" width="2" height="2" fill="#e2574c" />
      <rect x="7" y="8" width="2" height="2" fill="#e2574c" />
      <rect x="10" y="6" width="2" height="2" fill="#e2574c" />
      <rect x="13" y="4" width="2" height="2" fill="#e2574c" />
    </Grid>
  );
}

/** Store: Starter Bundles — a wrapped gift box with a crossed ribbon and bow. */
export function GiftBundleIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="4" y="2" width="3" height="3" className="icon-hi" />
      <rect x="9" y="2" width="3" height="3" className="icon-hi" />
      <rect x="1" y="5" width="14" height="2" className="icon-hi" />
      <rect x="2" y="7" width="12" height="7" />
      <rect x="2" y="12" width="12" height="2" className="icon-lo" />
      <rect x="7" y="5" width="2" height="9" className="icon-accent" />
    </Grid>
  );
}

export function CompassIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="5" y="1" width="6" height="2" className="icon-hi" />
      <rect x="5" y="13" width="6" height="2" className="icon-lo" />
      <rect x="1" y="5" width="2" height="6" />
      <rect x="13" y="5" width="2" height="6" />
      <rect x="3" y="3" width="10" height="10" fill="#0000003d" />
      <rect x="7" y="6" width="2" height="2" className="icon-accent" />
      <rect x="6" y="9" width="4" height="1" className="icon-accent" />
    </Grid>
  );
}

/* ---------- 2026-10-06: gezinme / üst bar / ofis ikonları (emoji yerine) ---------- */

/** Ofis — masa + monitör: alt çubuktaki "Ofis" sekmesi. */
export function OfficeIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="4" y="1" width="8" height="6" />
      <rect x="4" y="1" width="8" height="2" className="icon-hi" />
      <rect x="5" y="3" width="6" height="3" fill="#0000003d" />
      <rect x="7" y="7" width="2" height="2" />
      <rect x="1" y="9" width="14" height="2" className="icon-hi" />
      <rect x="2" y="11" width="2" height="4" className="icon-lo" />
      <rect x="12" y="11" width="2" height="4" className="icon-lo" />
    </Grid>
  );
}

/** Mağaza — kulplu alışveriş çantası (gerçek para mağazası; oyun içi Çarşı CartIcon kullanır). */
export function ShopBagIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="5" y="1" width="6" height="2" />
      <rect x="5" y="1" width="2" height="4" />
      <rect x="9" y="1" width="2" height="4" />
      <rect x="2" y="5" width="12" height="10" />
      <rect x="2" y="5" width="12" height="2" className="icon-hi" />
      <rect x="2" y="13" width="12" height="2" className="icon-lo" />
      <rect x="7" y="8" width="2" height="3" className="icon-accent" />
    </Grid>
  );
}

/** Kayıt göstergesi — disket. */
export function DiskIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="1" y="1" width="13" height="14" />
      <rect x="14" y="3" width="1" height="12" />
      <rect x="4" y="1" width="7" height="5" fill="#0000003d" />
      <rect x="8" y="2" width="2" height="3" className="icon-hi" />
      <rect x="3" y="9" width="10" height="5" className="icon-hi" />
    </Grid>
  );
}

/** Enerji — şimşek. */
export function BoltIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="8" y="0" width="4" height="2" className="icon-hi" />
      <rect x="6" y="2" width="4" height="2" className="icon-hi" />
      <rect x="4" y="4" width="4" height="3" />
      <rect x="4" y="7" width="9" height="2" />
      <rect x="8" y="9" width="4" height="2" />
      <rect x="7" y="11" width="3" height="2" className="icon-lo" />
      <rect x="6" y="13" width="2" height="3" className="icon-lo" />
    </Grid>
  );
}

/** Patron memnuniyeti — kravat. */
export function TieIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="5" y="1" width="6" height="3" className="icon-hi" />
      <rect x="6" y="4" width="4" height="2" />
      <rect x="5" y="6" width="6" height="5" />
      <rect x="6" y="11" width="4" height="2" className="icon-lo" />
      <rect x="7" y="13" width="2" height="2" className="icon-lo" />
      <rect x="7" y="7" width="2" height="2" className="icon-accent" />
    </Grid>
  );
}

/** Emlah — yakaya takılan emlakçı kimlik kartı (alt çubuktaki "Emlah" menüsü). */
export function IdCardIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="6" y="0" width="4" height="3" />
      <rect x="1" y="3" width="14" height="12" />
      <rect x="1" y="3" width="14" height="2" className="icon-hi" />
      <rect x="1" y="13" width="14" height="2" className="icon-lo" />
      <rect x="3" y="6" width="4" height="5" fill="#0000003d" />
      <rect x="9" y="7" width="4" height="1" className="icon-accent" />
      <rect x="9" y="9" width="3" height="1" className="icon-accent" />
    </Grid>
  );
}

/** Saat — takvim yaprağındaki saat ve geri sayımlar. */
export function ClockIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="5" y="1" width="6" height="2" className="icon-hi" />
      <rect x="3" y="3" width="10" height="10" />
      <rect x="1" y="5" width="2" height="6" />
      <rect x="13" y="5" width="2" height="6" />
      <rect x="5" y="13" width="6" height="2" className="icon-lo" />
      <rect x="4" y="4" width="8" height="8" fill="#0000003d" />
      <rect x="7" y="5" width="2" height="4" className="icon-accent" />
      <rect x="9" y="8" width="2" height="1" className="icon-accent" />
    </Grid>
  );
}

/** Müşteri Araştırması — büyüteç. */
export function MagnifierIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="3" y="1" width="6" height="2" className="icon-hi" />
      <rect x="1" y="3" width="2" height="6" />
      <rect x="9" y="3" width="2" height="6" />
      <rect x="3" y="9" width="6" height="2" className="icon-lo" />
      <rect x="3" y="3" width="6" height="6" fill="#ffffff2e" />
      <rect x="10" y="10" width="2" height="2" />
      <rect x="12" y="12" width="3" height="3" className="icon-lo" />
    </Grid>
  );
}

/** Pazarlama — megafon. */
export function MegaphoneIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="1" y="6" width="3" height="5" />
      <rect x="4" y="5" width="3" height="7" />
      <rect x="7" y="3" width="3" height="11" />
      <rect x="10" y="1" width="3" height="15" />
      <rect x="10" y="1" width="3" height="2" className="icon-hi" />
      <rect x="10" y="14" width="3" height="2" className="icon-lo" />
      <rect x="4" y="12" width="2" height="3" className="icon-lo" />
      <rect x="14" y="6" width="2" height="5" className="icon-accent" />
    </Grid>
  );
}

/** Ofis İşleri — dosya klasörü. */
export function FolderIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="1" y="2" width="6" height="2" className="icon-hi" />
      <rect x="1" y="4" width="14" height="10" />
      <rect x="1" y="4" width="14" height="2" className="icon-hi" />
      <rect x="1" y="12" width="14" height="2" className="icon-lo" />
      <rect x="4" y="7" width="8" height="1" fill="#0000003d" />
      <rect x="4" y="9" width="6" height="1" fill="#0000003d" />
    </Grid>
  );
}

/** Prestij / ödül — küçük kupa. */
export function TrophyIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="3" y="1" width="10" height="2" className="icon-hi" />
      <rect x="1" y="3" width="2" height="4" />
      <rect x="13" y="3" width="2" height="4" />
      <rect x="4" y="3" width="8" height="5" />
      <rect x="5" y="8" width="6" height="2" className="icon-lo" />
      <rect x="7" y="10" width="2" height="3" />
      <rect x="4" y="13" width="8" height="2" className="icon-lo" />
    </Grid>
  );
}

/** Mini oyun / reklam izleme — film klaketi. */
export function ClapperIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="1" y="2" width="14" height="3" className="icon-hi" />
      <rect x="3" y="2" width="2" height="3" fill="#0000003d" />
      <rect x="7" y="2" width="2" height="3" fill="#0000003d" />
      <rect x="11" y="2" width="2" height="3" fill="#0000003d" />
      <rect x="1" y="6" width="14" height="8" />
      <rect x="1" y="12" width="14" height="2" className="icon-lo" />
    </Grid>
  );
}

/** Yatırım Evleri — yükselen çubuk grafik. */
export function ChartUpIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="1" y="14" width="14" height="1" className="icon-lo" />
      <rect x="2" y="10" width="3" height="4" />
      <rect x="6" y="7" width="3" height="7" />
      <rect x="10" y="3" width="3" height="11" />
      <rect x="10" y="3" width="3" height="2" className="icon-hi" />
      <rect x="6" y="7" width="3" height="2" className="icon-hi" />
      <rect x="2" y="10" width="3" height="2" className="icon-hi" />
    </Grid>
  );
}

/** İnsanlar / Arkadaşlarım — iki kişi silüeti. */
export function PeopleIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="3" y="2" width="4" height="4" className="icon-hi" />
      <rect x="1" y="7" width="8" height="7" />
      <rect x="1" y="12" width="8" height="2" className="icon-lo" />
      <rect x="10" y="4" width="3" height="3" className="icon-hi" />
      <rect x="9" y="8" width="6" height="6" fill="currentColor" opacity="0.7" />
    </Grid>
  );
}

/** Rehber — telefon defteri (sırtlı kitap). */
export function ContactBookIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="3" y="1" width="11" height="14" />
      <rect x="3" y="1" width="11" height="2" className="icon-hi" />
      <rect x="3" y="13" width="11" height="2" className="icon-lo" />
      <rect x="1" y="4" width="3" height="2" className="icon-accent" />
      <rect x="1" y="10" width="3" height="2" className="icon-accent" />
      <rect x="7" y="5" width="4" height="3" fill="#0000003d" />
      <rect x="6" y="9" width="6" height="2" fill="#0000003d" />
    </Grid>
  );
}

/** Özel Davetler — zarf. */
export function EnvelopeIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="1" y="3" width="14" height="10" />
      <rect x="1" y="3" width="14" height="2" className="icon-hi" />
      <rect x="1" y="11" width="14" height="2" className="icon-lo" />
      <rect x="3" y="5" width="2" height="2" fill="#0000003d" />
      <rect x="5" y="7" width="2" height="2" fill="#0000003d" />
      <rect x="7" y="8" width="2" height="2" fill="#0000003d" />
      <rect x="9" y="7" width="2" height="2" fill="#0000003d" />
      <rect x="11" y="5" width="2" height="2" fill="#0000003d" />
    </Grid>
  );
}

/** Kilit (kapalı asma kilit) — kilitli içerik kartları. */
export function LockIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="5" y="1" width="6" height="2" className="icon-hi" />
      <rect x="4" y="3" width="2" height="4" />
      <rect x="10" y="3" width="2" height="4" />
      <rect x="2" y="7" width="12" height="8" />
      <rect x="2" y="7" width="12" height="2" className="icon-hi" />
      <rect x="2" y="13" width="12" height="2" className="icon-lo" />
      <rect x="7" y="10" width="2" height="3" fill="#0000003d" />
    </Grid>
  );
}

/** Şüphe — kısık bakan göz. */
export function EyeIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="4" y="4" width="8" height="2" className="icon-hi" />
      <rect x="2" y="6" width="12" height="4" />
      <rect x="4" y="10" width="8" height="2" className="icon-lo" />
      <rect x="0" y="7" width="2" height="2" />
      <rect x="14" y="7" width="2" height="2" />
      <rect x="6" y="6" width="4" height="4" fill="#0000005c" />
      <rect x="7" y="7" width="1" height="1" fill="#ffffff" />
    </Grid>
  );
}

/** İlgi — dört köşeli kıvılcım. */
export function SparkIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="7" y="0" width="2" height="5" className="icon-hi" />
      <rect x="7" y="11" width="2" height="5" className="icon-lo" />
      <rect x="0" y="7" width="5" height="2" />
      <rect x="11" y="7" width="5" height="2" />
      <rect x="5" y="5" width="6" height="6" />
      <rect x="6" y="6" width="2" height="2" className="icon-accent" />
    </Grid>
  );
}

/** Eğlence — gülen yüz. */
export function SmileIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="4" y="1" width="8" height="2" className="icon-hi" />
      <rect x="2" y="3" width="12" height="10" />
      <rect x="4" y="13" width="8" height="2" className="icon-lo" />
      <rect x="5" y="5" width="2" height="2" fill="#0000005c" />
      <rect x="9" y="5" width="2" height="2" fill="#0000005c" />
      <rect x="4" y="9" width="2" height="1" fill="#0000005c" />
      <rect x="5" y="10" width="6" height="1" fill="#0000005c" />
      <rect x="10" y="9" width="2" height="1" fill="#0000005c" />
    </Grid>
  );
}

/** Seri bonusu — alev. */
export function FlameIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="7" y="1" width="2" height="3" className="icon-hi" />
      <rect x="5" y="4" width="5" height="3" />
      <rect x="4" y="7" width="8" height="5" />
      <rect x="10" y="5" width="2" height="2" className="icon-hi" />
      <rect x="5" y="12" width="6" height="2" className="icon-lo" />
      <rect x="7" y="9" width="2" height="3" className="icon-accent" />
    </Grid>
  );
}

/** Onay — tik. */
export function CheckIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="12" y="3" width="3" height="3" className="icon-hi" />
      <rect x="10" y="5" width="3" height="3" />
      <rect x="8" y="7" width="3" height="3" />
      <rect x="6" y="9" width="3" height="3" className="icon-lo" />
      <rect x="4" y="7" width="3" height="3" />
      <rect x="2" y="5" width="3" height="3" className="icon-hi" />
    </Grid>
  );
}

/** Uyarı — ünlemli üçgen. */
export function WarnIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="7" y="1" width="2" height="2" className="icon-hi" />
      <rect x="6" y="3" width="4" height="3" />
      <rect x="4" y="6" width="8" height="4" />
      <rect x="2" y="10" width="12" height="4" className="icon-lo" />
      <rect x="7" y="5" width="2" height="5" fill="#0000005c" />
      <rect x="7" y="11" width="2" height="2" fill="#0000005c" />
    </Grid>
  );
}

/** Ret / kayıp — çarpı. */
export function CrossIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="2" y="2" width="3" height="3" className="icon-hi" />
      <rect x="11" y="2" width="3" height="3" className="icon-hi" />
      <rect x="4" y="4" width="3" height="3" />
      <rect x="9" y="4" width="3" height="3" />
      <rect x="6" y="6" width="4" height="4" />
      <rect x="4" y="9" width="3" height="3" />
      <rect x="9" y="9" width="3" height="3" />
      <rect x="2" y="11" width="3" height="3" className="icon-lo" />
      <rect x="11" y="11" width="3" height="3" className="icon-lo" />
    </Grid>
  );
}

/* ---------- 2026-10-06: emoji temizliği — envanter / mini oyun / panel ikonları ---------- */

export function ShieldIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="2" y="1" width="12" height="2" className="icon-hi" />
      <rect x="2" y="3" width="12" height="6" />
      <rect x="3" y="9" width="10" height="2" />
      <rect x="5" y="11" width="6" height="2" className="icon-lo" />
      <rect x="7" y="13" width="2" height="2" className="icon-lo" />
      <rect x="7" y="3" width="2" height="8" className="icon-accent" />
    </Grid>
  );
}

export function CloverIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="5" y="1" width="6" height="5" className="icon-hi" />
      <rect x="1" y="5" width="5" height="6" />
      <rect x="10" y="5" width="5" height="6" />
      <rect x="5" y="9" width="6" height="4" className="icon-lo" />
      <rect x="7" y="12" width="2" height="4" />
    </Grid>
  );
}

export function LampIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="5" y="1" width="6" height="2" className="icon-hi" />
      <rect x="3" y="3" width="10" height="4" />
      <rect x="7" y="7" width="2" height="6" className="icon-lo" />
      <rect x="4" y="13" width="8" height="2" className="icon-lo" />
      <rect x="6" y="7" width="4" height="1" className="icon-accent" />
    </Grid>
  );
}

export function FrameIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="1" y="2" width="14" height="12" />
      <rect x="1" y="2" width="14" height="2" className="icon-hi" />
      <rect x="1" y="12" width="14" height="2" className="icon-lo" />
      <rect x="3" y="4" width="10" height="8" fill="#0000005c" />
      <rect x="4" y="9" width="4" height="2" className="icon-accent" />
      <rect x="7" y="7" width="5" height="4" className="icon-hi" />
    </Grid>
  );
}

export function PlantIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="7" y="1" width="2" height="7" className="icon-hi" />
      <rect x="3" y="3" width="4" height="3" />
      <rect x="9" y="4" width="4" height="3" />
      <rect x="4" y="9" width="8" height="2" className="icon-accent" />
      <rect x="5" y="11" width="6" height="4" className="icon-lo" />
    </Grid>
  );
}

export function CupIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="5" y="1" width="1" height="3" className="icon-hi" />
      <rect x="8" y="1" width="1" height="3" className="icon-hi" />
      <rect x="2" y="5" width="10" height="2" className="icon-hi" />
      <rect x="2" y="7" width="10" height="5" />
      <rect x="12" y="7" width="3" height="4" />
      <rect x="3" y="12" width="8" height="2" className="icon-lo" />
    </Grid>
  );
}

export function ChairIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="4" y="1" width="8" height="7" />
      <rect x="4" y="1" width="8" height="2" className="icon-hi" />
      <rect x="3" y="8" width="10" height="2" className="icon-hi" />
      <rect x="4" y="10" width="2" height="5" className="icon-lo" />
      <rect x="10" y="10" width="2" height="5" className="icon-lo" />
    </Grid>
  );
}

export function SignIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="1" y="2" width="14" height="8" />
      <rect x="1" y="2" width="14" height="2" className="icon-hi" />
      <rect x="3" y="5" width="8" height="1" fill="#0000005c" />
      <rect x="3" y="7" width="5" height="1" fill="#0000005c" />
      <rect x="7" y="10" width="2" height="5" className="icon-lo" />
    </Grid>
  );
}

export function RefreshIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="4" y="1" width="8" height="2" className="icon-hi" />
      <rect x="2" y="3" width="2" height="4" />
      <rect x="12" y="3" width="2" height="2" />
      <rect x="11" y="1" width="2" height="5" className="icon-accent" />
      <rect x="12" y="9" width="2" height="4" />
      <rect x="2" y="11" width="2" height="2" />
      <rect x="3" y="10" width="2" height="5" className="icon-accent" />
      <rect x="4" y="13" width="8" height="2" className="icon-lo" />
    </Grid>
  );
}

export function ClipboardIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="5" y="0" width="6" height="3" className="icon-accent" />
      <rect x="2" y="2" width="12" height="13" />
      <rect x="2" y="2" width="12" height="2" className="icon-hi" />
      <rect x="4" y="6" width="8" height="1" fill="#0000005c" />
      <rect x="4" y="9" width="8" height="1" fill="#0000005c" />
      <rect x="4" y="12" width="5" height="1" fill="#0000005c" />
    </Grid>
  );
}

export function TargetIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="4" y="1" width="8" height="2" className="icon-hi" />
      <rect x="2" y="3" width="12" height="10" />
      <rect x="4" y="13" width="8" height="2" className="icon-lo" />
      <rect x="4" y="5" width="8" height="6" fill="#0000005c" />
      <rect x="6" y="6" width="4" height="4" />
      <rect x="7" y="7" width="2" height="2" className="icon-accent" />
    </Grid>
  );
}

export function KeyIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="1" y="5" width="6" height="2" className="icon-hi" />
      <rect x="1" y="5" width="2" height="6" />
      <rect x="1" y="9" width="6" height="2" className="icon-lo" />
      <rect x="5" y="5" width="2" height="6" />
      <rect x="7" y="7" width="8" height="2" />
      <rect x="11" y="9" width="2" height="3" />
      <rect x="14" y="9" width="1" height="2" />
    </Grid>
  );
}

export function BoxIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="1" y="4" width="14" height="11" fill="#b9874a" />
      <rect x="1" y="4" width="14" height="3" fill="#d9a865" />
      <rect x="0" y="3" width="16" height="2" fill="#e6bd80" />
      <rect x="1" y="13" width="14" height="2" fill="#8a6234" />
      <rect x="7" y="3" width="2" height="12" fill="#f1e2c2" />
      <rect x="3" y="9" width="3" height="2" fill="#8a6234" />
    </Grid>
  );
}

export function WalkIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="7" y="0" width="3" height="3" className="icon-hi" />
      <rect x="6" y="4" width="4" height="5" />
      <rect x="4" y="5" width="2" height="3" />
      <rect x="10" y="6" width="2" height="2" />
      <rect x="5" y="9" width="2" height="4" className="icon-lo" />
      <rect x="9" y="9" width="2" height="3" className="icon-lo" />
      <rect x="10" y="12" width="2" height="3" />
      <rect x="4" y="13" width="2" height="2" />
    </Grid>
  );
}

export function CameraIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="5" y="2" width="5" height="2" className="icon-hi" />
      <rect x="1" y="4" width="14" height="10" />
      <rect x="1" y="4" width="14" height="2" className="icon-hi" />
      <rect x="1" y="12" width="14" height="2" className="icon-lo" />
      <rect x="5" y="6" width="6" height="6" fill="#0000005c" />
      <rect x="7" y="8" width="2" height="2" className="icon-accent" />
    </Grid>
  );
}

export function RadioIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="10" y="1" width="1" height="4" className="icon-hi" />
      <rect x="1" y="5" width="14" height="9" />
      <rect x="1" y="5" width="14" height="2" className="icon-hi" />
      <rect x="1" y="12" width="14" height="2" className="icon-lo" />
      <rect x="3" y="8" width="5" height="4" fill="#0000005c" />
      <rect x="10" y="8" width="3" height="1" className="icon-accent" />
      <rect x="10" y="10" width="3" height="1" className="icon-accent" />
    </Grid>
  );
}

export function CrownIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="1" y="3" width="2" height="2" className="icon-hi" />
      <rect x="7" y="2" width="2" height="2" className="icon-hi" />
      <rect x="13" y="3" width="2" height="2" className="icon-hi" />
      <rect x="2" y="5" width="12" height="6" />
      <rect x="2" y="11" width="12" height="3" className="icon-lo" />
      <rect x="7" y="7" width="2" height="2" className="icon-accent" />
    </Grid>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="5" y="1" width="6" height="2" className="icon-hi" />
      <rect x="4" y="3" width="8" height="5" />
      <rect x="3" y="8" width="10" height="2" className="icon-lo" />
      <rect x="7" y="10" width="2" height="5" />
    </Grid>
  );
}

export function ChartDownIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="1" y="14" width="14" height="1" className="icon-lo" />
      <rect x="2" y="3" width="3" height="11" />
      <rect x="6" y="7" width="3" height="7" />
      <rect x="10" y="10" width="3" height="4" />
      <rect x="2" y="3" width="3" height="2" className="icon-hi" />
    </Grid>
  );
}

export function HandshakeIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="0" y="5" width="3" height="6" className="icon-lo" />
      <rect x="13" y="5" width="3" height="6" className="icon-lo" />
      <rect x="3" y="6" width="5" height="4" />
      <rect x="8" y="5" width="5" height="5" className="icon-hi" />
      <rect x="5" y="10" width="6" height="2" />
      <rect x="7" y="7" width="2" height="2" className="icon-accent" />
    </Grid>
  );
}

export function ShadesIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="0" y="5" width="16" height="2" className="icon-hi" />
      <rect x="1" y="7" width="6" height="4" />
      <rect x="9" y="7" width="6" height="4" />
      <rect x="2" y="8" width="2" height="1" className="icon-accent" />
      <rect x="10" y="8" width="2" height="1" className="icon-accent" />
    </Grid>
  );
}

export function BrokenHeartIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="2" y="3" width="5" height="5" className="icon-hi" />
      <rect x="9" y="3" width="5" height="5" className="icon-hi" />
      <rect x="4" y="8" width="8" height="3" />
      <rect x="6" y="11" width="4" height="2" />
      <rect x="7" y="3" width="1" height="3" fill="#0000008a" />
      <rect x="8" y="6" width="1" height="3" fill="#0000008a" />
      <rect x="7" y="9" width="1" height="3" fill="#0000008a" />
    </Grid>
  );
}

export function DoorIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="3" y="1" width="10" height="14" />
      <rect x="3" y="1" width="10" height="2" className="icon-hi" />
      <rect x="3" y="13" width="10" height="2" className="icon-lo" />
      <rect x="5" y="4" width="6" height="4" fill="#0000003d" />
      <rect x="10" y="9" width="2" height="2" className="icon-accent" />
    </Grid>
  );
}

export function WrenchIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="10" y="1" width="2" height="2" className="icon-hi" />
      <rect x="13" y="3" width="2" height="2" className="icon-hi" />
      <rect x="9" y="3" width="5" height="4" />
      <rect x="7" y="6" width="3" height="3" />
      <rect x="5" y="8" width="3" height="3" />
      <rect x="2" y="10" width="4" height="4" className="icon-lo" />
    </Grid>
  );
}

/** Dil seçimi — Türk bayrağı (vektör; ay-yıldız piksel ızgarada okunmuyordu). */
export function FlagTrIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg width={size} height={(size * 2) / 3} viewBox="0 0 30 20" aria-hidden="true" {...rest}>
      <rect width="30" height="20" fill="#e30a17" />
      <circle cx="11.25" cy="10" r="5" fill="#ffffff" />
      <circle cx="12.5" cy="10" r="4" fill="#e30a17" />
      <polygon
        fill="#ffffff"
        points="17.00,10.00 18.75,9.38 18.80,7.53 19.92,9.00 21.70,8.47 20.65,10.00 21.70,11.53 19.92,11.00 18.80,12.47 18.75,10.62"
      />
    </svg>
  );
}

/** Dil seçimi — Birleşik Krallık bayrağı (vektör, sadeleştirilmiş). */
export function FlagGbIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg width={size} height={size / 2} viewBox="0 0 60 30" aria-hidden="true" {...rest}>
      <clipPath id="gb-clip">
        <rect width="60" height="30" />
      </clipPath>
      <g clipPath="url(#gb-clip)">
        <rect width="60" height="30" fill="#012169" />
        <path d="M0,0 60,30 M60,0 0,30" stroke="#ffffff" strokeWidth="6" />
        <path d="M0,0 60,30 M60,0 0,30" stroke="#c8102e" strokeWidth="2.5" />
        <path d="M30,0 v30 M0,15 h60" stroke="#ffffff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#c8102e" strokeWidth="6" />
      </g>
    </svg>
  );
}

/** Hayalet Ev Soruşturması — çarşaflı küçük hayalet. */
export function GhostIcon(props: IconProps) {
  return (
    <Grid {...props}>
      <rect x="5" y="1" width="6" height="2" className="icon-hi" />
      <rect x="3" y="3" width="10" height="10" />
      <rect x="3" y="13" width="2" height="2" />
      <rect x="7" y="13" width="2" height="2" />
      <rect x="11" y="13" width="2" height="2" />
      <rect x="5" y="6" width="2" height="2" fill="#0000005c" />
      <rect x="9" y="6" width="2" height="2" fill="#0000005c" />
      <rect x="7" y="9" width="2" height="2" fill="#0000005c" />
    </Grid>
  );
}
