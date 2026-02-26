/*
  Warnings:

  - The `expected` column on the `TestCase` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "TestCase" DROP COLUMN "expected",
ADD COLUMN     "expected" INTEGER;
