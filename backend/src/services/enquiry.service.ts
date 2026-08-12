import { IEnquiryInput, IEnquiryResult } from '../types/enquiry.types.js';
import { WhatsAppMessageFormatter } from './notifications/providers/whatsapp/whatsapp-message.formatter.js';
import { WhatsAppService } from './whatsapp/whatsapp.service.js';
import { logger } from '../utils/logger.js';

// In-memory sliding window to prevent rapid duplicate submissions (cleared automatically after 60s)
const recentSubmissions = new Map<string, number>();

const CLEANUP_INTERVAL_MS = 60000;
const DUP_WINDOW_MS = 30000;

setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of recentSubmissions.entries()) {
    if (now - timestamp > DUP_WINDOW_MS) {
      recentSubmissions.delete(key);
    }
  }
}, CLEANUP_INTERVAL_MS).unref?.();

/**
 * Strips HTML tags and trims whitespace to sanitize user text inputs.
 */
const sanitizeText = (val?: string): string => {
  if (!val) return '';
  return val.replace(/<[^>]*>?/gm, '').trim();
};

export class EnquiryService {
  /**
   * Processes an incoming enquiry in a completely stateless manner:
   * 1. Sanitizes user text fields.
   * 2. Checks in-memory rapid duplicate submission window.
   * 3. Generates curated WhatsApp message payload.
   * 4. Sends message to the fixed WhatsApp destination.
   * 5. Returns success/failure result directly.
   */
  public static async processEnquiry(rawInput: IEnquiryInput): Promise<IEnquiryResult> {
    // 1. Sanitize user inputs
    const sanitizedInput: IEnquiryInput = {
      name: sanitizeText(rawInput.name),
      phone: sanitizeText(rawInput.phone),
      email: sanitizeText(rawInput.email).toLowerCase(),
      destination: sanitizeText(rawInput.destination),
      hotel: sanitizeText(rawInput.hotel),
      checkIn: sanitizeText(rawInput.checkIn),
      checkOut: sanitizeText(rawInput.checkOut),
      guests: rawInput.guests || 1,
      interests: (rawInput.interests || []).map((item) => sanitizeText(item)),
      message: sanitizeText(rawInput.message),
      source: sanitizeText(rawInput.source) || 'Hotel Website',
      page: sanitizeText(rawInput.page),
    };

    // 2. In-memory rapid duplicate submission protection
    const submissionKey = `${sanitizedInput.phone}:${sanitizedInput.email}`;
    const now = Date.now();
    const lastSeen = recentSubmissions.get(submissionKey);

    if (lastSeen && now - lastSeen < DUP_WINDOW_MS) {
      logger.info('⚠️ Duplicate rapid enquiry submission blocked by in-memory rate limiter.');
      return {
        success: true,
        message: 'Your enquiry has already been received. Our team will contact you shortly.',
      };
    }

    recentSubmissions.set(submissionKey, now);

    // 3. Construct curated WhatsApp message
    const formattedMessage = WhatsAppMessageFormatter.format(sanitizedInput);
    const destinationNumber = (process.env.WHATSAPP_DESTINATION_NUMBER || '917852846216').replace(/\D/g, '');

    // 4. Deliver message to fixed configured WhatsApp destination
    const deliveryResult = await WhatsAppService.sendNotification(formattedMessage);

    if (deliveryResult.status !== 'sent') {
      logger.error(`❌ Enquiry delivery failed for recipient: ${deliveryResult.errorDetails}`);
      return {
        success: false,
        message: "We couldn't send your enquiry right now. Please try again.",
      };
    }

    logger.info(`✅ Enquiry processed successfully. Target destination: ${destinationNumber}`);

    return {
      success: true,
      message: 'Your enquiry has been sent successfully. Our team will contact you shortly.',
      whatsappStatus: deliveryResult.status,
      messageId: deliveryResult.messageId,
    };
  }
}



