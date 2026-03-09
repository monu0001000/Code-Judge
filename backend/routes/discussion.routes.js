const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  createDiscussion,
  getProblemDiscussions
} = require("../controllers/discussion.controller");

router.post("/", authMiddleware, createDiscussion);
router.get("/:problemId", authMiddleware, getProblemDiscussions);

module.exports = router;