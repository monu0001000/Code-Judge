-- Test cases are private by default. Only explicitly marked sample cases are
-- returned to the client; the judge always reads every case.
ALTER TABLE "TestCase" ADD COLUMN "isSample" BOOLEAN NOT NULL DEFAULT false;
