const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const prisma = require("../prismaClient");
const { analyzeCode } = require("../services/ai.service");

router.post("/analyze", authMiddleware, async (req, res) => {
  try {
    const { problemId, code } = req.body;

    const problem = await prisma.problem.findUnique({
      where: { id: problemId }
    });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const analysis = await analyzeCode(problem, code);

    return res.json({ analysis });

  } catch (error) {
    console.error("FULL AI ROUTE ERROR:", error);
    return res.status(500).json({
      message: "AI failed",
      error: error.message
    });
  }
});

console.log("analyzeCode:", analyzeCode);

module.exports = router;
