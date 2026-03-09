require("dotenv").config();
const express = require("express");
const problemRoutes = require("./routes/problem.routes");
const prisma = require("./prismaClient");
const cors = require("cors");
const authMiddleware = require("./middleware/auth.middleware");
const submissionRoutes = require("./routes/submission.routes");
const authRoutes = require("./routes/auth.routes");
const aiRoutes = require("./routes/ai.routes");
const userRoutes = require("./routes/user.routes");
const discussionRoutes = require("./routes/discussion.routes");


const app = express();
app.use((req, res, next) => {
  console.log("HIT:", req.method, req.url);
  next();
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/user", userRoutes);
app.use("/api/discussions", discussionRoutes);



app.get("/", (req, res) => {
  res.send("Code-Judge API chaalu");
});

app.get("/test-db", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.user
  });
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


