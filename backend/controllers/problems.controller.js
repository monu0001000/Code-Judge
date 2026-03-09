const prisma = require("../prismaClient");

exports.createProblem = async (req, res) => {
  try {
    const { title, description, difficulty, testCases } = req.body;

    // Basic validation
    if (!title || !description || !difficulty || !Array.isArray(testCases) || testCases.length === 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    // Create problem + test cases 
    const problem = await prisma.problem.create({
      data: {
        title,
        description,
        difficulty,
        testCases: {
          create: testCases.map(tc => ({
            input: tc.input,
            output: tc.output
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

    res.json(problems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
