import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const { token, newPassword } = await req.json();


  const document = await prisma.document.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiration: {
        gte: new Date(),
      },
    },
  });

  if (!document) {
    return NextResponse.json(
      { message: "Invalid or expired token." },
      { status: 400 }
    );
  }


  const user = await prisma.user.findUnique({
    where: { id: document.userId },
  });

  if (!user) {
    return NextResponse.json(
      { message: "User not found." },
      { status: 404 }
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
    },
  });

  await prisma.document.update({
    where: { id: document.id },
    data: {
      resetToken: null,
      resetTokenExpiration: null,
    },
  });

  return NextResponse.json(
    { message: "Password successfully reset." },
    { status: 200 }
  );
}
