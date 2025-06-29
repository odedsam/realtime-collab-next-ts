import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  DATABASE_URL: z.string().url('DATABASE_URL must be a valid PostgreSQL connection string'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),

  EMAIL_USER: z.string().min(1, 'EMAIL_USER must be a valid email'),
  EMAIL_PASSWORD: z.string().min(1, 'EMAIL_PASSWORD is required'),

  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),
  FACEBOOK_CLIENT_SECRET: z.string().min(1, 'FACEBOOK_CLIENT_SECRET is required'),

  FACEBOOK_REDIRECT_URI: z.string().url('FACEBOOK_REDIRECT_URI must be a valid URL'),
  GOOGLE_REDIRECT_URI: z.string().url('GOOGLE_REDIRECT_URI must be a valid URL'),

  BCRYPT_ROUNDS: z
    .string()
    .regex(/^\d+$/, 'BCRYPT_ROUNDS must be a number')
    .transform((val) => parseInt(val, 10))
    .optional()
    .default('12'),

  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
  NEXT_PUBLIC_FACEBOOK_CLIENT_ID: z.string().min(1, 'FACEBOOK_CLIENT_ID is required'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:');
  console.error(_env.error.format());
  throw new Error('Invalid environment variables');
}

export const env = _env.data;
export type Env = z.infer<typeof envSchema>;
export const isDev = env.NODE_ENV === 'development';
export const isProd = env.NODE_ENV === 'production';

export const clientEnv = Object.fromEntries(Object.entries(env).filter(([key]) => key.startsWith('NEXT_PUBLIC_'))) as Pick<
  Env,
  keyof Env & `NEXT_PUBLIC_${string}`
>;
