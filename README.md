🚀 CodeJudge – Full-Stack Coding Judge Platform

CodeJudge is a full-stack coding judge platform built using React, Node.js, Express, Prisma, and PostgreSQL. It allows users to solve algorithmic problems, submit code, receive automated verdicts, get AI-powered code review, and analyze performance through a personalized dashboard.

🛠 Tech Stack

Frontend

React (Vite)

Tailwind CSS

React Router

Axios

Monaco Editor

Backend

Node.js

Express

Prisma ORM

PostgreSQL

JWT Authentication

Groq (Llama 3.3 70B) for AI code analysis

✨ Features

🔐 Authentication

Secure JWT-based authentication (bcrypt password hashing)

Role-based schema (USER / ADMIN)

Client-side protected routes + server-side admin middleware

🧠 Problem Solving

Multi-testcase execution

Async submission evaluation

Verdict system (ACCEPTED, WRONG_ANSWER, RUNTIME_ERROR, TIME_LIMIT_EXCEEDED, PENDING)

Runtime measurement

🤖 AI Code Analysis

Groq-powered (Llama 3.3 70B) review of submitted code

Returns logic explanation, edge cases, time complexity, and improvement suggestions

📊 Dashboard Analytics

Problems solved count

Acceptance rate

Total submissions

Fastest runtime

Recent submissions tracking

📜 Submission History

View all previous submissions

Test case breakdown

Verdict visualization

💬 Discussions

Threaded/nested comments per problem

🧱 Database Design

Normalized relational schema

Enum-based verdict tracking

JSON storage for structured test results

UUID primary keys

🏗 System Architecture Overview

User submits code

Submission stored in database with PENDING verdict

Async judge service evaluates code against test cases

Verdict + runtime stored in DB

Dashboard aggregates performance metrics

⚠️ Known Limitations

Code execution currently runs via Node's `child_process`, not a fully isolated sandbox (Docker/isolated-vm sandboxing planned — see roadmap below)

JavaScript submissions only; multi-language support planned

Admin-only problem creation endpoint exists on the backend, but there's no admin UI yet

🗺 Roadmap

Isolated sandbox execution (Docker or isolated-vm)

Multi-language support (Python, C++, Java)

Admin panel UI for problem management

Problem search/filter/tagging
