import { NextRequest, NextResponse } from 'next/server';
import { PasswordResetManager } from '@/providers/main';
import { prisma } from '@/lib';
import sendgridMail from '@sendgrid/mail';

const apiKey = process.env.SENDGRID_API_KEY!;

sendgridMail.setApiKey(apiKey);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ message: 'Invalid email' }, { status: 400 });
    }

    await PasswordResetManager.initiateReset(email, request);

    const resetUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!resetUser?.resetToken) {
      return NextResponse.json({ message: 'If this email exists, reset link was sent.' }, { status: 200 });
    }

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetUser.resetToken}`;

    await sendgridMail.send({
      to: email,
      from: process.env.SENDGRID_EMAIL || 'no-reply@yourdomain.com',
      subject: 'Password Reset Request',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link will expire in 1 hour.</p>`,
    });

    return NextResponse.json({ message: 'If this email exists, reset link was sent.' }, { status: 200 });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({ message: 'Failed to send reset email.' }, { status: 500 });
  }
}
