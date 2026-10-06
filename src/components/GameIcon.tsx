import type { ComponentType, SVGProps } from "react";
import * as I from "./icons";

type IconComp = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

/**
 * Veri dosyalarındaki `icon` alanları artık emoji değil, buradaki anahtarlar
 * (kullanıcı kuralı: oyunda hiç emoji yok, tüm görseller bize ait).
 */
const registry: Record<string, IconComp> = {
  shield: I.ShieldIcon,
  clover: I.CloverIcon,
  bolt: I.BoltIcon,
  tie: I.TieIcon,
  lamp: I.LampIcon,
  frame: I.FrameIcon,
  plant: I.PlantIcon,
  cup: I.CupIcon,
  chair: I.ChairIcon,
  trophy: I.TrophyIcon,
  sign: I.SignIcon,
  refresh: I.RefreshIcon,
  spark: I.SparkIcon,
  envelope: I.EnvelopeIcon,
  clipboard: I.ClipboardIcon,
  battery: I.BatteryIcon,
  target: I.TargetIcon,
  key: I.KeyIcon,
  walk: I.WalkIcon,
  house: I.HouseIcon,
  noads: I.NoAdsIcon,
  clapper: I.ClapperIcon,
  chart: I.ChartUpIcon,
  check: I.CheckIcon,
  coin: I.CoinIcon,
  unlock: I.UnlockIcon,
  gift: I.GiftBundleIcon,
  chat: I.ChatIcon,
  medal: I.MedalIcon,
  smile: I.SmileIcon,
  star: I.StarIcon,
  ghost: I.GhostIcon,
};

export default function GameIcon({ name, size = 16, className }: { name: string; size?: number; className?: string }) {
  const Comp = registry[name] ?? I.StarIcon;
  return <Comp size={size} className={className} />;
}
