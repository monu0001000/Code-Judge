/*
  Warnings:

  - Made the column `expected` on table `TestCase` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "TestCase" ALTER COLUMN "expected" SET NOT NULL,
ALTER COLUMN "expected" SET DATA TYPE TEXT;
