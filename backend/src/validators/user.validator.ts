import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters long').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().trim().email('Invalid email address format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(100, 'Password cannot exceed 100 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  role: z.enum(['ADMIN', 'MANAGER', 'STAFF'], {
    errorMap: () => ({ message: 'Invalid role. Must be ADMIN, MANAGER, or STAFF' }),
  }),
});

export const updateUserSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters long').max(100, 'Name cannot exceed 100 characters').optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'STAFF'], {
    errorMap: () => ({ message: 'Invalid role. Must be ADMIN, MANAGER, or STAFF' }),
  }).optional(),
}).strict({ message: 'Unrecognized fields in update request' });

export const updateUserStatusSchema = z.object({
  isActive: z.boolean({ required_error: 'isActive boolean field is required' }),
}).strict({ message: 'Unrecognized fields in status update request' });

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
