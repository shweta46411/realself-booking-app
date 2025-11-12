import { z } from 'zod';

export const bookingSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(
      /^[a-zA-Z\s]+$/,
      'Name can only contain letters and spaces'
    )
    .refine((val) => val.trim().length >= 2, {
      message: 'Name must contain at least 2 characters',
    }),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  timeslot: z.string().min(1, 'Please select a timeslot'),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

