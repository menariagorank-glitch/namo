import { z } from 'zod';

const isValidDateString = (val?: string): boolean => {
  if (!val || val.trim() === '') return true;
  const timestamp = Date.parse(val);
  return !isNaN(timestamp);
};

export const createEnquirySchema = z
  .object({
    name: z
      .string({ required_error: 'Full name is required' })
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must not exceed 100 characters'),

    phone: z
      .string({ required_error: 'Phone / WhatsApp number is required' })
      .trim()
      .min(8, 'Phone number must be at least 8 digits')
      .max(20, 'Phone number must not exceed 20 characters')
      .regex(/^[\d\s+\-()]+$/, 'Phone number contains invalid characters'),

    email: z
      .string({ required_error: 'Email address is required' })
      .trim()
      .toLowerCase()
      .email('Please enter a valid email address')
      .max(255, 'Email must not exceed 255 characters'),

    destination: z.string().trim().max(100).optional(),

    hotel: z.string().trim().max(100).optional(),

    checkIn: z
      .string()
      .trim()
      .max(50)
      .refine(isValidDateString, { message: 'Invalid check-in date format' })
      .optional(),

    checkOut: z
      .string()
      .trim()
      .max(50)
      .refine(isValidDateString, { message: 'Invalid check-out date format' })
      .optional(),

    guests: z
      .union([
        z.number().int().min(1, 'Guests must be at least 1').max(100, 'Guests cannot exceed 100'),
        z
          .string()
          .regex(/^[1-9]\d*$/, 'Guests must be a positive integer')
          .transform(Number)
          .refine((val) => val >= 1 && val <= 100, {
            message: 'Guests must be between 1 and 100',
          }),
      ])
      .optional()
      .default(1),

    interests: z.array(z.string().trim().max(50)).optional(),

    message: z
      .string({ required_error: 'Message is required' })
      .trim()
      .min(2, 'Message must be at least 2 characters')
      .max(2000, 'Message cannot exceed 2000 characters'),

    source: z.string().trim().max(100).optional().default('website'),

    page: z.string().trim().max(200).optional(),
  })
  .refine(
    (data) => {
      if (data.checkIn && data.checkOut && data.checkIn.trim() !== '' && data.checkOut.trim() !== '') {
        const inTime = Date.parse(data.checkIn);
        const outTime = Date.parse(data.checkOut);
        if (!isNaN(inTime) && !isNaN(outTime)) {
          return outTime >= inTime;
        }
      }
      return true;
    },
    {
      message: 'Check-out date must be on or after check-in date',
      path: ['checkOut'],
    }
  );

export type CreateEnquiryDTO = z.infer<typeof createEnquirySchema>;


