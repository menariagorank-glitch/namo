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

  public static initialize() {
    logger.info('⏳ Initializing WhatsApp Web Client... (Note: First run may take 5+ minutes to download Chromium in the background)');

    this.client = new Client({
      authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }),
      puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
        headless: true, // Make sure it runs headlessly
      },
      webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
      }
    });

    this.client.on('qr', (qr) => {
      logger.info('======================================================');
      logger.info('📲 WhatsApp Authentication Required! Scan this QR code:');
      logger.info('======================================================');
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      this.isReady = true;
      logger.info('✅ WhatsApp Client is READY and connected!');
    });

    this.client.on('authenticated', () => {
      logger.info('✅ WhatsApp Client authenticated successfully.');
    });

    this.client.on('auth_failure', (msg) => {
      logger.error('❌ WhatsApp Authentication failure:', msg);
    });

    this.client.on('disconnected', (reason) => {
      this.isReady = false;
      logger.warn('⚠️ WhatsApp Client disconnected:', reason);
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
      return { status: 'failed', errorDetails: 'WhatsApp client is not ready. Need authentication or connection.' };
    }

    const recipientPhone = destinationNumber.replace(/\D/g, '');

    try {
      logger.info(`Sending curated WhatsApp enquiry to ${recipientPhone} via whatsapp-web.js...`);

      let targetId = `${recipientPhone}@c.us`;
      try {
        const numberDetails = await this.client.getNumberId(recipientPhone);
        if (numberDetails) {
          targetId = numberDetails._serialized;
        } else {
          logger.warn(`⚠️ Number ${recipientPhone} was not recognized by getNumberId. Trying fallback format: ${targetId}`);
        }
      } catch (err) {
        logger.warn(`Could not lookup number ID, proceeding with fallback ${targetId}`);
      }

      const response = await this.client.sendMessage(targetId, messageText);
      const messageId = (response && response.id && response.id.id) ? response.id.id : `msg_${Date.now()}`;

      logger.info(`🟢 WhatsApp message sent successfully. Message ID: ${messageId}`);

      return {
        status: 'sent',
        messageId,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown WhatsApp API error';
      logger.error('❌ Exception thrown while contacting WhatsApp:', error);

      return {
        status: 'failed',
        errorDetails: errorMessage,
      };
    }
  }
}

