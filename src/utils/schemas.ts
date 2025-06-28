import z from 'zod';

export const signUpSchema = z.object({
  email: z
    .string()
    .email()
    .min(1)
    .max(255)
    .transform((email) => email.toLowerCase()),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/^(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .regex(/^(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .regex(/^(?=.*\d)/, 'Password must contain at least one number')
    .regex(/^(?=.*[@$!%*?&])/, 'Password must contain at least one special character'),
  name: z.string().min(1).max(100).optional(),
  deviceInfo: z.string().optional(),
});

export const signInSchema = z.object({
  email: z
    .string()
    .email()
    .transform((email) => email.toLowerCase()),
  password: z.string().min(1),
  deviceInfo: z.string().optional(),
});

export const oauthSchema = z.object({
  provider: z.enum(['google', 'facebook', 'github', 'microsoft']),
  code: z.string().min(1),
  state: z.string().optional(),
  deviceInfo: z.string().optional(),
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .email()
    .transform((email) => email.toLowerCase()),
});

export const confirmResetSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/^(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .regex(/^(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .regex(/^(?=.*\d)/, 'Password must contain at least one number')
    .regex(/^(?=.*[@$!%*?&])/, 'Password must contain at least one special character'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
export type SignInSchema = z.infer<typeof signInSchema>;
export type OAuthSchema = z.infer<typeof oauthSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type ConfirmResetPasswordSchema = z.infer<typeof confirmResetSchema>;
export type RefreshTokenSchema = z.infer<typeof refreshTokenSchema>;
