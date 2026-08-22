import { pickWhatsAppNotification } from "./whatsappNotifications";

/**
 * The single entry point PhoneScreen.tsx uses for its top WhatsApp-style
 * notification banner. Always a WhatsApp contact/group message — showing
 * an unrelated app's notification while already sitting inside WhatsApp
 * read as visually meaningless, so the banner is WhatsApp-only content,
 * styled to match (see .wa-notification in game.css).
 */
export function pickPhoneNotificationText(): { icon: string; name: string; text: string } {
  return pickWhatsAppNotification();
}
