// backend/controllers/submission.controller.js
const prisma = require("../prismaClient");
const { judgeSubmission } = require("../services/judge.service");

const MAX_SUBMISSION_CODE_LENGTH = 50_000;
const SUPPORTED_LANGUAGES = ["javascript", "python", "cpp", "java"];

exports.createSubmission = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { problemId, code, language = "javascript" } = req.body;

    if (!problemId || typeof code !== "string" || !code.trim()) {
      return res.status(400).json({ message: "A problem ID and code are required" });
    }

    if (!SUPPORTED_LANGUAGES.includes(language)) {
      return res.status(400).json({ message: `Unsupported language: ${language}` });
    }

    if (code.length > MAX_SUBMISSION_CODE_LENGTH) {
      return res.status(400).json({
        message: `Code is too long (max ${MAX_SUBMISSION_CODE_LENGTH} characters)`
      });
    }

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: { testCases: true }
    });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const submission = await prisma.submission.create({
      data: {
        code,
        language,
        verdict: "PENDING",
        userId,
        problemId,
      },
    });

    judgeSubmission(submission.id).catch(async (err) => {
      console.error("Judge failed:", err);
      await prisma.submission.update({
        where: { id: submission.id },
        data: { verdict: "RUNTIME_ERROR" },
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
    const userId = req.user.userId;

    const submission = await prisma.submission.findFirst({
      where: { id, userId },
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
          select: { title: true, difficulty: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const totalSubmissions = submissions.length;

    const acceptedSubmissions = submissions.filter(
      s => s.verdict === "ACCEPTED"
    ).length;

    const solvedProblemIds = new Set(
      submissions
        .filter(s => s.verdict === "ACCEPTED")
        .map(s => s.problemId)
    );
    const solvedProblems = solvedProblemIds.size;

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

    // Verdict breakdown — powers a bar chart of how submissions actually land.
    const verdictBreakdown = {
      ACCEPTED: 0,
      WRONG_ANSWER: 0,
      RUNTIME_ERROR: 0,
      TIME_LIMIT_EXCEEDED: 0,
      PENDING: 0
    };
    for (const s of submissions) {
      if (verdictBreakdown[s.verdict] !== undefined) verdictBreakdown[s.verdict] += 1;
    }

    // Solved (distinct, ACCEPTED-only) problems by difficulty.
    const solvedByDifficulty = { EASY: 0, MEDIUM: 0, HARD: 0 };
    const seen = new Set();
    for (const s of submissions) {
      if (s.verdict === "ACCEPTED" && !seen.has(s.problemId) && s.problem?.difficulty) {
        seen.add(s.problemId);
        solvedByDifficulty[s.problem.difficulty] += 1;
      }
    }

    // Submissions per day for the last 14 days, oldest first — a light
    // activity trend rather than a full calendar heatmap.
    const DAYS = 14;
    const dayKey = (d) => d.toISOString().slice(0, 10);
    const counts = {};
    for (let i = 0; i < DAYS; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      counts[dayKey(d)] = 0;
    }
    for (const s of submissions) {
      const key = dayKey(new Date(s.createdAt));
      if (key in counts) counts[key] += 1;
    }
    const submissionsOverTime = Object.keys(counts)
      .sort()
      .map(date => ({ date, count: counts[date] }));

    res.json({
      stats: {
        solvedProblems,
        totalSubmissions,
        acceptanceRate,
        fastestRuntime
      },
      verdictBreakdown,
      solvedByDifficulty,
      submissionsOverTime,
      submissions
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};




