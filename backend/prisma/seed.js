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
          { input: "4 9\n2 7 11 15", output: "0 1", isSample: true },
          { input: "3 6\n3 2 4", output: "1 2", isSample: true },
          { input: "4 8\n2 7 11 6", output: "0 3", isSample: false }
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
          { input: "abcabcbb", output: "3", isSample: true },
          { input: "bbbbb", output: "1", isSample: true },
          { input: "pwwkew", output: "3", isSample: false }
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
          { input: "hit cog\nhot dot dog lot log cog", output: "5", isSample: true },
          { input: "a c\na b c", output: "2", isSample: false }
        ]
      }
    }
  });

  await prisma.problem.create({
    data: {
      title: "Reverse a String",
      description:
        "Given a string s, return the string reversed. Input: a single line containing s.",
      difficulty: "EASY",
      tags: ["String"],
      testCases: {
        create: [
          { input: "hello", output: "olleh", isSample: true },
          { input: "world", output: "dlrow", isSample: true },
          { input: "racecar", output: "racecar", isSample: false }
        ]
      }
    }
  });

  await prisma.problem.create({
    data: {
      title: "Valid Anagram",
      description:
        "Given two space-separated words on one line, return true if they are anagrams of each other, otherwise false.",
      difficulty: "EASY",
      tags: ["String", "HashMap"],
      testCases: {
        create: [
          { input: "listen silent", output: "true", isSample: true },
          { input: "rat car", output: "false", isSample: true },
          { input: "anagram nagaram", output: "true", isSample: false }
        ]
      }
    }
  });

  await prisma.problem.create({
    data: {
      title: "Valid Parentheses",
      description:
        "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Return true or false.",
      difficulty: "EASY",
      tags: ["String", "Stack"],
      testCases: {
        create: [
          { input: "()[]{}", output: "true", isSample: true },
          { input: "(]", output: "false", isSample: true },
          { input: "([)]", output: "false", isSample: false },
          { input: "{[]}", output: "true", isSample: false }
        ]
      }
    }
  });

  await prisma.problem.create({
    data: {
      title: "Binary Search",
      description:
        "Given a sorted array of integers and a target value, return the index of target in the array, or -1 if not found. Input: first line is the array (space-separated), second line is the target.",
      difficulty: "EASY",
      tags: ["Array"],
      testCases: {
        create: [
          { input: "-1 0 3 5 9 12\n9", output: "4", isSample: true },
          { input: "-1 0 3 5 9 12\n2", output: "-1", isSample: true },
          { input: "5\n5", output: "0", isSample: false }
        ]
      }
    }
  });

  await prisma.problem.create({
    data: {
      title: "Maximum Subarray",
      description:
        "Given an array of integers (space-separated), find the contiguous subarray with the largest sum and return that sum.",
      difficulty: "MEDIUM",
      tags: ["Array", "Dynamic Programming"],
      testCases: {
        create: [
          { input: "-2 1 -3 4 -1 2 1 -5 4", output: "6", isSample: true },
          { input: "1", output: "1", isSample: true },
          { input: "5 4 -1 7 8", output: "23", isSample: false }
        ]
      }
    }
  });

  await prisma.problem.create({
    data: {
      title: "Climbing Stairs",
      description:
        "You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps. Return the number of distinct ways to reach the top. Input: a single integer n.",
      difficulty: "EASY",
      tags: ["Dynamic Programming"],
      testCases: {
        create: [
          { input: "2", output: "2", isSample: true },
          { input: "3", output: "3", isSample: true },
          { input: "5", output: "8", isSample: false }
        ]
      }
    }
  });

  await prisma.problem.create({
    data: {
      title: "Number of Islands",
      description:
        "Given a grid of '1' (land) and '0' (water) with rows separated by newlines, return the number of islands. An island is formed by connecting adjacent lands horizontally or vertically.",
      difficulty: "HARD",
      tags: ["Graph", "BFS"],
      testCases: {
        create: [
          { input: "11110\n11010\n11000\n00000", output: "1", isSample: true },
          { input: "11000\n11000\n00100\n00011", output: "3", isSample: true },
          { input: "1", output: "1", isSample: false }
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
