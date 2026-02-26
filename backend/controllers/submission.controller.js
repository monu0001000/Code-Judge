// backend/controllers/submission.controller.js
const prisma = require("../prismaClient");
const { judgeSubmission } = require("../services/judge.service");

exports.createSubmission = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { problemId, code } = req.body;

    console.log("Problem ID from request:", problemId);

    if (!problemId || !code) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: { testCases: true }
    });

    console.log("Problem found:", problem);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const submission = await prisma.submission.create({
      data: {
        code,
        verdict: "PENDING",
        userId,
        problemId,
      },
    });

    judgeSubmission(submission.id).catch(async (err) => {
      console.error("Judge failed:", err);
      await prisma.submission.update({
        where: { id: submission.id },
        data: { verdict: "ERROR" },
      });
    });

    return res.status(201).json(submission);

  } catch (err) {
    console.error("Create submission error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;   

    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        problem: {
          select: { title: true },
        },
      },
    });

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    res.json(submission);
  } catch (err) {
    console.error("Get submission error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;

    const submissions = await prisma.submission.findMany({
      where: { userId },
      include: {
        problem: {
          select: { title: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const totalSubmissions = submissions.length;

    const acceptedSubmissions = submissions.filter(
      s => s.verdict === "ACCEPTED"
    ).length;

    const solvedProblems = new Set(
      submissions
        .filter(s => s.verdict === "ACCEPTED")
        .map(s => s.problemId)
    ).size;

    const acceptanceRate = totalSubmissions
      ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(1)
      : 0;

    const fastestRuntime = submissions.length
      ? Math.min(
          ...submissions
            .filter(s => s.runtimeMs)
            .map(s => s.runtimeMs)
        )
      : null;

    res.json({
      stats: {
        solvedProblems,
        totalSubmissions,
        acceptanceRate,
        fastestRuntime
      },
      submissions
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};




