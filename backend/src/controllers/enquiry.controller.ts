import { Request, Response, NextFunction } from 'express';
import { EnquiryService } from '../services/enquiry.service.js';
import { CreateEnquiryDTO } from '../validators/enquiry.validator.js';

export class EnquiryController {
  /**
   * Handles POST /api/enquiry & POST /api/v1/enquiries
   */
  public static async create(
    req: Request<unknown, unknown, CreateEnquiryDTO>,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const result = await EnquiryService.processEnquiry(req.body);

      if (!result.success) {
        res.status(400).json({
          success: false,
          message: result.message || 'Unable to submit enquiry. Please try again.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: result.message || 'Enquiry submitted successfully.',
      });

    } catch {
      // Never expose internal errors, credentials, or stack traces
      res.status(500).json({
        success: false,
        message: 'Unable to submit enquiry. Please try again.',
      });
    }
  }
}


