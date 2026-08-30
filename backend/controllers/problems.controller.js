const prisma = require("../prismaClient");

exports.createProblem = async (req, res) => {
  try {
    const { title, description, difficulty, tags = [], testCases } = req.body;

    // Basic validation
    const validDifficulties = ["EASY", "MEDIUM", "HARD"];
    const hasInvalidTestCase = !Array.isArray(testCases) || testCases.some(
      (testCase) =>
        typeof testCase.input !== "string" ||
        typeof testCase.output !== "string" ||
        typeof testCase.isSample !== "boolean"
    );
    const hasSample = Array.isArray(testCases) && testCases.some((testCase) => testCase.isSample);
    const hasHiddenCase = Array.isArray(testCases) && testCases.some((testCase) => !testCase.isSample);

    if (
      !title ||
      !description ||
      !validDifficulties.includes(difficulty) ||
      !Array.isArray(tags) ||
      hasInvalidTestCase ||
      !hasSample ||
      !hasHiddenCase
    ) {
      return res.status(400).json({
        message: "Provide a title, description, valid difficulty, tags, and at least one sample and hidden test case"
      });
    }

    // Create problem + test cases 
    const problem = await prisma.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        testCases: {
          create: testCases.map(tc => ({
            input: tc.input,
            output: tc.output,
            isSample: tc.isSample
          }))
        }
      },
      include: {
        testCases: true
      }
    });

    res.status(201).json(problem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getAllProblems = async (req, res) => {
  try {
    const { difficulty, tag, search } = req.query;
    const userId = req.user?.userId;

    const filters = {};

    if (difficulty) {
      filters.difficulty = difficulty;
    }

    if (tag) {
      filters.tags = {
        has: tag
      };
    }

    if (search) {
      filters.title = {
        contains: search,
        mode: "insensitive"
      };
    }

    const problems = await prisma.problem.findMany({
      where: filters,
      select: {
        id: true,
        title: true,
        difficulty: true,
        tags: true,
        createdAt: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // Mark which of these the current user has already solved (at least one
    // ACCEPTED submission), so the Problems page can show a solved state
    // without a separate round trip per card.
    let solvedIds = new Set();
    if (userId) {
      const accepted = await prisma.submission.findMany({
        where: { userId, verdict: "ACCEPTED", problemId: { in: problems.map(p => p.id) } },
        select: { problemId: true }
      });
      solvedIds = new Set(accepted.map(s => s.problemId));
    }

    res.json(problems.map(p => ({ ...p, solved: solvedIds.has(p.id) })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
