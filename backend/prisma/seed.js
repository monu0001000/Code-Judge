const prisma = require("../prismaClient");

async function main() {
  console.log("Seeding problems...");

  await prisma.problem.create({
    data: {
      title: "Two Sum",
      description:
        "Given an array of integers and a target, return the indices of the two numbers such that they add up to target.",
      difficulty: "EASY",
      tags: ["Array", "HashMap"],
      testCases: {
        create: [
          { input: "4 9\n2 7 11 15", output: "0 1" },
          { input: "3 6\n3 2 4", output: "1 2" }
        ]
      }
    }
  });

  await prisma.problem.create({
    data: {
      title: "Longest Substring Without Repeating Characters",
      description:
        "Find the length of the longest substring without repeating characters.",
      difficulty: "MEDIUM",
      tags: ["Sliding Window", "String"],
      testCases: {
        create: [
          { input: "abcabcbb", output: "3" },
          { input: "bbbbb", output: "1" }
        ]
      }
    }
  });

  await prisma.problem.create({
    data: {
      title: "Word Ladder",
      description:
        "Given beginWord and endWord, find the length of shortest transformation sequence.",
      difficulty: "HARD",
      tags: ["Graph", "BFS"],
      testCases: {
        create: [
          { input: "hit cog\nhot dot dog lot log cog", output: "5" }
        ]
      }
    }
  });

  console.log("Problems seeded successfully!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });