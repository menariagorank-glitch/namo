import { Router, Request, Response } from 'express';
import enquiryRoutes from './enquiry.routes.js';
import { isWhatsAppConfigured } from '../config/env.js';

const router = Router();

// Health Check Endpoint
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'NAMO Hotel API is running',
    data: {
      service: 'namo-hotel-backend',
      status: 'ok',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      integrations: {
        whatsappConfigured: isWhatsAppConfigured(),
      },
    },
  });
});

// Enquiry Endpoints
router.use('/enquiry', enquiryRoutes);
router.use('/enquiries', enquiryRoutes);

export default router;

