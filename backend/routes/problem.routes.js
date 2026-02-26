const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const prisma = require("../prismaClient");

const {
  createProblem,
  getAllProblems
} = require("../controllers/problems.controller");

// GET ALL PROBLEMS (protected)
router.get("/", authMiddleware, getAllProblems);

// GET SINGLE PROBLEM BY Id
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const problem = await prisma.problem.findUnique({
      where: { id },
      include: { testCases: true }
    });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.json(problem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ADMIN ONLY
router.post("/", authMiddleware, adminMiddleware, createProblem);

module.exports = router;
