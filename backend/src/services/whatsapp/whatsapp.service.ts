import makeWASocket, { useMultiFileAuthState, DisconnectReason, Browsers, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';
import { getWhatsAppDestinationNumber } from '../../config/env.js';
import { logger } from '../../utils/logger.js';
import { WhatsAppStatus } from '../../types/enquiry.types.js';
import pino from 'pino';

export interface WhatsAppSendResult {
  status: WhatsAppStatus;
  messageId?: string;
  errorDetails?: string;
}

export class WhatsAppService {
  private static client: any;
  private static isReady: boolean = false;
  private static latestQrCode: string | null = null;

  public static getLatestQrCode(): string | null {
    return this.latestQrCode;
  }

  public static getIsReady(): boolean {
    return this.isReady;
  }

  public static async initialize() {
    logger.info('⏳ Initializing WhatsApp Web Client (Baileys native protocol)...');
    
    // Store auth in /app/.baileys_auth_v2
    const { state, saveCreds } = await useMultiFileAuthState('/app/.baileys_auth_v2');
    
    // Fetch latest WA Web version to avoid "Couldn't link device" errors
    const { version, isLatest } = await fetchLatestBaileysVersion();
    logger.info(`WA version: ${version.join('.')}, isLatest: ${isLatest}`);

    const connectToWhatsApp = async () => {
      // makeWASocket does not have a default export in some bundlers, handle both cases safely
      const makeSocket = (makeWASocket as any).default || makeWASocket;
      
      this.client = makeSocket({
        version,
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'info' }) as any, // Turn on info logs to see where it gets stuck
        browser: Browsers.ubuntu('Desktop'),
        markOnlineOnConnect: false,
        syncFullHistory: false
      });

      if (process.env.WHATSAPP_SENDER_NUMBER && !this.client.authState.creds.me) {
        setTimeout(async () => {
          try {
            const code = await this.client.requestPairingCode(process.env.WHATSAPP_SENDER_NUMBER.replace(/\D/g, ''));
            logger.info('======================================================');
            logger.info(`📲 WHATSAPP PAIRING CODE: ${code}`);
            logger.info('⚠️ Tap "Link with phone number instead" on your phone and enter this code!');
            logger.info('======================================================');
          } catch (err) {
            logger.error('❌ Failed to request pairing code:', err);
          }
        }, 3000);
      }

      this.client.ev.on('connection.update', (update: any) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr && !process.env.WHATSAPP_SENDER_NUMBER) {
          this.latestQrCode = qr;
          logger.info('======================================================');
          logger.info('📲 NEW WhatsApp QR Code Generated! (NATIVE CONNECTION)');
          logger.info('⚠️ SCAN THIS QR CODE IN YOUR WHATSAPP APP');
          logger.info('======================================================');
          qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
          const shouldReconnect = (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut;
          logger.error('❌ WhatsApp Connection closed due to:', lastDisconnect?.error);
          this.isReady = false;
          
          if (shouldReconnect) {
            logger.info('⏳ Reconnecting to WhatsApp...');
            connectToWhatsApp();
          } else {
            logger.error('❌ WhatsApp Logged out. You must manually clear the /app/.baileys_auth folder to generate a new QR code.');
          }
        } else if (connection === 'open') {
          this.isReady = true;
          this.latestQrCode = null;
          logger.info('✅ WhatsApp Client is READY and connected!');
        }
      });

      this.client.ev.on('creds.update', saveCreds);
    };

    connectToWhatsApp();
  }

  public static async sendNotification(messageText: string): Promise<WhatsAppSendResult> {
    const destinationNumber = getWhatsAppDestinationNumber();

    if (!destinationNumber) {
      logger.warn('⚠️ WhatsApp destination number is not configured.');
      return { status: 'not_configured', errorDetails: 'WhatsApp destination number missing' };
    }

    if (!this.isReady || !this.client) {
      logger.error('❌ WhatsApp Client is not ready. Have you scanned the QR code?');
      return { status: 'failed', errorDetails: 'WhatsApp client is not ready.' };
    }

    const recipientPhone = destinationNumber.replace(/\D/g, '');

    try {
      logger.info(`Sending WhatsApp enquiry to ${recipientPhone}...`);

      const targetId = `${recipientPhone}@s.whatsapp.net`;
      
      // Check if number exists on WA
      const [result] = await this.client.onWhatsApp(targetId);
      if (!result?.exists) {
         logger.warn(`⚠️ Number ${recipientPhone} is not registered on WhatsApp.`);
         return { status: 'failed', errorDetails: 'Number not on WhatsApp' };
      }

      const response = await this.client.sendMessage(result.jid, { text: messageText });
      const messageId = response?.key?.id || `msg_${Date.now()}`;

      logger.info(`🟢 WhatsApp message sent. ID: ${messageId}`);
      return { status: 'sent', messageId };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown WhatsApp error';
      logger.error('❌ Failed to send WhatsApp message:', error);
      return { status: 'failed', errorDetails: errorMessage };
    }
  }
}
