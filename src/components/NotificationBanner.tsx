import { useEffect } from "react";
import { t } from "../data/language";
import appIcon from "../assets/branding/oddestate-logo.png";

export interface BannerData {
  key: string;
  threadId: string;
  name: string;
  text: string;
  avatarSrc?: string;
}

interface NotificationBannerProps {
  banner: BannerData;
  /** Ofisteyken dokununca o sohbet açılır; değilse yalnızca kapanır. */
  onTap: () => void;
  onDone: () => void;
}

const VISIBLE_MS = 3600;

/**
 * S5 — gerçek bir mesaj gelince iOS bildirimi gibi üstten kayan kart.
 * Yalnızca gerçek (okunmamış, kozmetik olmayan) mesajlar için gösterilir.
 */
export default function NotificationBanner({ banner, onTap, onDone }: NotificationBannerProps) {
  useEffect(() => {
    const timer = setTimeout(onDone, VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [banner.key, onDone]);

  return (
    <button className="ios-banner" key={banner.key} onClick={onTap} aria-live="polite">
      <span className="ios-banner-head">
        <img className="ios-banner-app" src={appIcon} alt="" />
        <span className="ios-banner-appname">{t({ tr: "MESAJLAR", en: "MESSAGES" })}</span>
        <span className="ios-banner-time">{t({ tr: "şimdi", en: "now" })}</span>
      </span>
      <span className="ios-banner-body">
        {banner.avatarSrc ? (
          <img className="ios-banner-avatar" src={banner.avatarSrc} alt="" />
        ) : (
          <span className="ios-banner-avatar ios-banner-initial">{banner.name.charAt(0).toLocaleUpperCase("tr-TR")}</span>
        )}
        <span className="ios-banner-text">
          <strong>{banner.name}</strong>
          <span>{banner.text}</span>
        </span>
      </span>
    </button>
  );
}
