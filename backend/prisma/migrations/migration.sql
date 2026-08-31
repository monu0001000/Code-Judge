-- Tracks which language a submission was written in. Existing rows default
-- to "javascript" since that was the only language before multi-language
-- support was added.
ALTER TABLE "Submission" ADD COLUMN "language" TEXT NOT NULL DEFAULT 'javascript';
