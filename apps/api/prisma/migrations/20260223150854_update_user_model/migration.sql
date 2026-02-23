/*
  Warnings:

  - You are about to drop the column `logo_url` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "logo_url",
ADD COLUMN     "avatar_url" TEXT;
