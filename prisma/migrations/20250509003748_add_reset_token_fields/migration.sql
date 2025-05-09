-- AlterTable
ALTER TABLE "Document" ADD COLUMN "resetToken" TEXT;
ALTER TABLE "Document" ADD COLUMN "resetTokenExpiration" DATETIME;
