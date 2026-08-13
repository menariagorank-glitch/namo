import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { getWhatsAppDestinationNumber } from '../../config/env.js';
import { logger } from '../../utils/logger.js';
import { WhatsAppStatus } from '../../types/enquiry.types.js';

export interface WhatsAppSendResult {
  status: WhatsAppStatus;
  messageId?: string;
  errorDetails?: string;
}

export class WhatsAppService {
  private static client: Client;
  private static isReady: boolean = false;
  private static latestQrCode: string | null = null;

  public static getLatestQrCode(): string | null {
    return this.latestQrCode;
  }

  public static getIsReady(): boolean {
    return this.isReady;
  }

  public static initialize() {
    logger.info('⏳ Initializing WhatsApp Web Client...');

    this.client = new Client({
      authStrategy: new LocalAuth({ dataPath: '/app/.wwebjs_auth' }),
      puppeteer: {
        // Do NOT override executablePath — let puppeteer find its bundled Chrome automatically
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ],
        headless: true,
      }
    });

    this.client.on('qr', (qr) => {
      this.latestQrCode = qr;
      logger.info('======================================================');
      logger.info('📲 WhatsApp Authentication Required! Scan this QR code:');
      logger.info('======================================================');
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      this.isReady = true;
      this.latestQrCode = null;
      logger.info('✅ WhatsApp Client is READY and connected!');
    });

    this.client.on('authenticated', () => {
      this.latestQrCode = null;
      logger.info('✅ WhatsApp Client authenticated successfully.');
    });

    this.client.on('auth_failure', (msg) => {
      logger.error(`❌ WhatsApp Authentication Failed: ${msg}`);
    });

    this.client.on('disconnected', (reason) => {
      this.isReady = false;
      logger.error(`❌ WhatsApp Client disconnected. Reason: ${reason}`);
    });

    this.client.initialize().catch((err) => {
      logger.error('❌ Failed to initialize WhatsApp Client:', err);
    });
  }

  public static async sendNotification(messageText: string): Promise<WhatsAppSendResult> {
    const destinationNumber = getWhatsAppDestinationNumber();

    if (!destinationNumber) {
      logger.warn('⚠️ WhatsApp destination number is not configured.');
      return { status: 'not_configured', errorDetails: 'WhatsApp destination number missing' };
    }

    if (!this.isReady) {
      logger.error('❌ WhatsApp Client is not ready. Have you scanned the QR code?');
      return { status: 'failed', errorDetails: 'WhatsApp client is not ready.' };
    }

    const recipientPhone = destinationNumber.replace(/\D/g, '');

    try {
      logger.info(`Sending WhatsApp enquiry to ${recipientPhone}...`);

      let targetId = `${recipientPhone}@c.us`;
      try {
        const numberDetails = await this.client.getNumberId(recipientPhone);
        if (numberDetails) {
          targetId = numberDetails._serialized;
        }
      } catch {
        logger.warn(`Could not lookup number ID, using fallback: ${targetId}`);
      }

      const response = await this.client.sendMessage(targetId, messageText);
      const messageId = (response && response.id && response.id.id) ? response.id.id : `msg_${Date.now()}`;

      logger.info(`🟢 WhatsApp message sent. ID: ${messageId}`);
      return { status: 'sent', messageId };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown WhatsApp error';
      logger.error('❌ Failed to send WhatsApp message:', error);
      return { status: 'failed', errorDetails: errorMessage };
    }
  }
}
