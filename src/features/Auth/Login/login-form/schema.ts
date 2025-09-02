import { z } from 'zod';

export const getLoginSchema = (/**TODO: implementar i18n */) =>
  z.object({
    email: z
      .string()
      .email({
        message: 'Invalid email',
      })
      .min(1, 'Required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  });

export type LoginSchemaType = z.infer<ReturnType<typeof getLoginSchema>>;
