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

🔒 Sandboxed Execution

Every submission runs inside `isolated-vm` — a separate V8 heap with its own memory ceiling and a wall-clock timeout

No filesystem, network, or process access from submitted code (no `require`, no `fs`, no `process`)

Public "try it live" demo on the landing page runs through the same sandbox, rate-limited per IP

🤖 AI Code Analysis

Groq-powered (Llama 3.3 70B) review of submitted code

Returns logic explanation, edge cases, time complexity, and improvement suggestions

📊 Dashboard Analytics

Problems solved count

Acceptance rate

Total submissions

Fastest runtime

Verdict breakdown chart

Solved-by-difficulty chart

14-day submission activity trend

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

JavaScript submissions only; multi-language support planned

Admin-only problem creation endpoint exists on the backend, but there's no admin UI yet

🗺 Roadmap

Multi-language support (Python, C++, Java)

Admin panel UI for problem management

Problem search/filter/tagging
