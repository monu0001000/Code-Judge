const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  createSubmission,
  getSubmissionById,
  getUserDashboard
} = require("../controllers/submission.controller");

// ✅ Dashboard route (static first)
router.get("/dashboard", authMiddleware, getUserDashboard);

// ✅ Create submission
router.post("/", authMiddleware, createSubmission);

//  Dynamic route last
router.get("/:id", authMiddleware, getSubmissionById);

module.exports = router;