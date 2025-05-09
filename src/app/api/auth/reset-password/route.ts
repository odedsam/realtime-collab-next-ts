import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: Request): Promise<Response> {
  const { token, password }: { token: string; password: string } = await req.json();

  if (!token || !password) {
    return new Response(JSON.stringify({ error: 'Token and password are required' }), { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { resetToken: token },
  });

  if (!user || user.resetTokenExpiration < Date.now()) {
    return new Response(JSON.stringify({ error: 'Invalid or expired token' }), { status: 400 });
  }

  //  new password hashed
  const hashedPassword = await bcrypt.hash(password, 10);

  // udate the user's password and clear the reset token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiration: null,
    },
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
