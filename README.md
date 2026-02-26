🚀 CodeJudge – Full-Stack Competitive Programming Platform

CodeJudge is a full-stack competitive programming platform built using React, Node.js, Express, Prisma, and PostgreSQL. It allows users to solve algorithmic problems, submit code, receive automated verdicts, and analyze performance through a personalized dashboard.

🛠 Tech Stack

Frontend

React (Vite)

Tailwind CSS

React Router

Axios

Backend

Node.js

Express

Prisma ORM

PostgreSQL

JWT Authentication

✨ Features
🔐 Authentication

Secure JWT-based authentication

Role-based schema (USER / ADMIN)

Protected routes

🧠 Problem Solving

Multi-testcase execution

Async submission evaluation

Verdict system (ACCEPTED, WRONG_ANSWER, TLE, etc.)

Runtime measurement

📊 Dashboard Analytics

Problems solved count

Acceptance rate

Total submissions

Fastest runtime

Recent submissions tracking

📜 Submission History

View all previous submissions

Full code replay

Test case breakdown

Verdict visualization

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
