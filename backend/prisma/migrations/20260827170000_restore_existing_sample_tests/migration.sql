-- These five seed cases were public in the application before testcase
-- visibility was introduced. Restore only these known examples, leaving any
-- other test cases private by default.
UPDATE "TestCase"
SET "isSample" = true
WHERE ("input", "output") IN (
  ('4 9\n2 7 11 15', '0 1'),
  ('3 6\n3 2 4', '1 2'),
  ('abcabcbb', '3'),
  ('bbbbb', '1'),
  ('hit cog\nhot dot dog lot log cog', '5')
);
