import { NextResponse } from 'next/server';
import { prisma } from '@/lib';
import crypto from 'crypto';
import sendgridMail from '@sendgrid/mail';

sendgridMail.setApiKey(process.env.SENDGRID_API_KEY!);
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export async function POST(req: Request) {
  const { email } = await req.json();

  const urlToReset = `${process.env.FRONTEND_URL}` || `http://localhost:3000`;
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ message: 'User not found.' }, { status: 404 });
  }

  const resetToken = generateResetToken();
  const resetTokenExpiration = new Date(Date.now() + 3600000);

  await prisma.user.update({
    where: { email },
    data: {
      resetToken: resetToken,
      resetTokenExpiration: resetTokenExpiration,
    } as any,
  });

  const resetUrl = `${urlToReset}/reset-password?token=${resetToken}`;

  const msg = {
    to: email,
    from: process.env.SENDGRID_EMAIL || 'your-email@yourdomain.com',
    subject: 'Password Reset Request',
    html: `
      <p>Click <a href="${resetUrl}">here</a> to reset your password. The link will expire in 1 hour.</p>
    `,
  };

  try {
    await sendgridMail.send(msg);
    return NextResponse.json({ message: 'Password reset email sent.' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ message: 'Error sending email.' }, { status: 500 });
  }
}
