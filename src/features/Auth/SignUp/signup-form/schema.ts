import { z } from 'zod';

export const getSignUpSchema = (/**TODO: implementar i18n */) =>
  z
    .object({
      name: z.string(),
      email: z
        .string()
        .email({
          message: 'Invalid email',
        })
        .min(1, 'Required'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      confirmPassword: z
        .string()
        .min(8, 'Password must be at least 8 characters'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    });

export type SignUpSchemaType = z.infer<ReturnType<typeof getSignUpSchema>>;
