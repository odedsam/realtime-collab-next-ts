import { z } from 'zod';

const envSchema = z.object({
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  EMAIL_USER: z.string().email('EMAIL_USER must be a valid email'),
  EMAIL_PASSWORD: z.string().min(1, 'EMAIL_PASSWORD is required'),
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),
  GOOGLE_REDIRECT_URI: z.string().url('GOOGLE_REDIRECT_URI must be a valid URL'),
  FACEBOOK_CLIENT_ID: z.string().min(1, 'FACEBOOK_CLIENT_ID is required'),
  FACEBOOK_CLIENT_SECRET: z.string().min(1, 'FACEBOOK_CLIENT_SECRET is required'),
  FACEBOOK_REDIRECT_URI: z.string().url('FACEBOOK_REDIRECT_URI must be a valid URL'),
  BCRYPT_ROUNDS: z
    .string()
    .regex(/^\d+$/, 'BCRYPT_ROUNDS must be a number')
    .transform((val) => parseInt(val, 10))
    .optional()
    .default('12'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:');
  console.error(_env.error.format());
  throw new Error('Invalid environment variables');
}

export type Env = z.infer<typeof envSchema>;
export const ENV = _env.data;
export const BCRYPT_ROUNDS = ENV.BCRYPT_ROUNDS;
