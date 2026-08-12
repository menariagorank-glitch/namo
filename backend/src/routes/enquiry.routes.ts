import { Router } from 'express';
import { EnquiryController } from '../controllers/enquiry.controller.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { createEnquirySchema } from '../validators/enquiry.validator.js';
import { enquiryRateLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

router.post(
  '/',
  enquiryRateLimiter,
  validateRequest(createEnquirySchema),
  EnquiryController.create
);

export default router;

