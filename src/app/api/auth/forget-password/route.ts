import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export async function POST(req: Request): Promise<Response> {
  const { email }: { email: string } = await req.json();

  if (!email) {
    return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiration = Date.now() + 3600000;

  /*  storing the reset token and expiration in the database */
  await prisma.user.update({
    where: { email },
    data: {
      resetToken,
      resetTokenExpiration,
    },
  });

  // send password reset email
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASSWORD!,
      },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER!,
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error sending email' }), { status: 500 });
  }
}
