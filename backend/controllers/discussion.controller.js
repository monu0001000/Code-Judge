const prisma = require("../prismaClient");

// Create new discussion
exports.createDiscussion = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { problemId, content, parentId } = req.body;

    if (!problemId || !content) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const discussion = await prisma.discussion.create({
      data: {
        content,
        userId,
        problemId,
        parentId: parentId || null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    res.status(201).json(discussion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get discussions for specific problem
exports.getProblemDiscussions = async (req, res) => {
  try {
    const { problemId } = req.params;

    const discussions = await prisma.discussion.findMany({
      where: {
        problemId: problemId,
        parentId: null
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            },
            replies: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true
                  }
                }
              }
            }
          }
        }
      }
    });

    res.json(discussions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};