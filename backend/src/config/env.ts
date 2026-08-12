import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load .env file from backend root directory
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const envSchema = z.object({
  PORT: z.string().transform(Number).default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),

  // Fixed WhatsApp Destination Number (predefined recipient for all enquiries)
  WHATSAPP_DESTINATION_NUMBER: z.string().optional().default(''),
  MANAGER_WHATSAPP_NUMBER: z.string().optional().default(''), // Fallback alias

  // WhatsApp Cloud API Configuration
  WHATSAPP_ACCESS_TOKEN: z.string().optional().default(''),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional().default(''),
  WHATSAPP_BUSINESS_ACCOUNT_ID: z.string().optional().default(''),
  WHATSAPP_API_VERSION: z.string().default('v18.0'),
  WHATSAPP_TEMPLATE_NAME: z.string().optional().default(''),
  WHATSAPP_DELIVERY_CONFIG: z.string().optional().default(''),
  // CallMeBot Integration
  CALLMEBOT_API_KEY: z.string().optional().default(''),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Environment configuration error:', result.error.format());
    throw new Error('Invalid environment variables');
  }
  return result.data;
};

export const env = parseEnv();

/**
 * Returns the effective target WhatsApp number for enquiry delivery.
 */
export const getWhatsAppDestinationNumber = (): string => {
  const destination = env.WHATSAPP_DESTINATION_NUMBER || env.MANAGER_WHATSAPP_NUMBER || '';
  return destination.trim();
};

export const isWhatsAppConfigured = (): boolean => {
  const destNumber = getWhatsAppDestinationNumber();
  return Boolean(destNumber !== '');
};

