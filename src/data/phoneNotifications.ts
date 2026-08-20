import { pickWhatsAppNotification } from "./whatsappNotifications";
import { pickAppNotification } from "./appNotifications";

/**
 * The single entry point PhoneScreen.tsx uses for its top iOS-style banner.
 * Mostly WhatsApp-style contact/group messages, occasionally a notification
 * from one of the parody apps instead — purely cosmetic, no gameplay effect.
 */
const APP_NOTIFICATION_CHANCE = 0.35;

export function pickPhoneNotificationText(): string {
  const { icon, name, text } =
    Math.random() < APP_NOTIFICATION_CHANCE ? pickAppNotification() : pickWhatsAppNotification();
  return `${icon} ${name}: ${text}`;
}
