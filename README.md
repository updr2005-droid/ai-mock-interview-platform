# 🤖 AI Mock Interview Platform

> An AI-powered mock interview and placement-preparation platform designed to simulate realistic technical and HR interviews, generate role-specific questions, evaluate candidate responses, and provide an interactive interview experience.

![AI Mock Interview Platform](https://img.shields.io/badge/AI-Mock%20Interview-8ef0c1?style=for-the-badge)
![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Ollama](https://img.shields.io/badge/AI-Ollama-black?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## 📌 Overview

The **AI Mock Interview Platform** is a full-stack web application that helps students and job seekers practice interviews through an AI-powered interview simulation.

The platform allows candidates to:

- Select a target job role
- Choose interview difficulty
- Upload their resume
- Select an AI interviewer
- Receive dynamically generated interview questions
- Answer interview questions
- Get AI-based evaluation and feedback
- Interact with voice-enabled interview functionality
- Review previous interview sessions
- Manage their candidate profile

The project is designed to make interview preparation more interactive, personalized, and accessible while exploring practical applications of **Generative AI, Large Language Models, speech technologies, and full-stack development**.

---

# ✨ Key Features

## 🎯 Personalized Interview Setup

Candidates can configure their interview before starting.

- Job role selection
- Interview difficulty selection
- Resume-based interview preparation
- Candidate name/profile information
- Structured interview flow

---

## 📄 Resume-Based Interview

The platform supports resume upload and uses the candidate's resume information to make interview questions more relevant to their background.

The goal is to generate questions around:

- Skills
- Projects
- Technologies
- Experience
- Role-specific knowledge

This creates a more realistic interview experience than using only generic questions.

---

## 🤖 AI-Generated Questions

The platform uses AI to dynamically generate interview questions based on the candidate's:

- Selected role
- Difficulty level
- Resume
- Previous question/answer context
- Interview progression

This allows the interview to follow a conversational flow instead of presenting a fixed list of questions.

---

## 🧠 AI Answer Evaluation

Candidate responses can be evaluated using AI.

The evaluation system is designed to consider factors such as:

- Relevance
- Technical correctness
- Explanation quality
- Understanding of the topic
- Overall answer quality

The platform can provide a score and feedback to help candidates identify areas for improvement.

---

## 🎙️ AI Interviewers

The platform provides multiple interviewer personalities/voices to make the interview experience more engaging.

Current interviewer options include:

- Maya
- Ethan
- Sophia
- James

Interviewer voice configuration is maintained separately in the backend.

---

## 🔊 Voice Interaction

The platform includes voice-related functionality for a more realistic interview experience.

The project integrates speech functionality through APIs and supports an AI interviewer-style interaction.

---

## 📊 Interview History

Candidates can review their previous interview sessions.

The history section is designed to help users:

- Review previous attempts
- Track interview sessions
- Analyze previous performance
- Identify areas for improvement

---

## 👤 Candidate Profile

The platform includes a profile section where candidates can manage their interview-related information.

Profile information can be used to personalize the interview experience.

---

## 🎨 Modern User Interface

The frontend uses a modern, responsive interface with reusable UI components.

The interface includes:

- Glass-style cards
- Gradient buttons
- Animated/visual hero sections
- Glow effects
- Interview-specific UI components
- Responsive navigation
- Structured interview setup screens

---

# 🧠 AI Architecture

The application is designed around a full-stack AI workflow.

```text
                     ┌──────────────────────┐
                     │      Candidate       │
                     └──────────┬───────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │   React Frontend     │
                     │      + Vite          │
                     └──────────┬───────────┘
                                │
                         HTTP / REST API
                                │
                                ▼
                     ┌──────────────────────┐
                     │   Express Backend    │
                     │      Node.js         │
                     └───────┬───────┬──────┘
                             │       │
                ┌────────────┘       └─────────────┐
                ▼                                  ▼
       ┌─────────────────┐               ┌─────────────────┐
       │   AI / Ollama   │               │    MongoDB      │
       │ Local LLM       │               │     Atlas       │
       └─────────────────┘               └─────────────────┘
                │
                ▼
       ┌─────────────────┐
       │ Question /      │
       │ Evaluation      │
       └─────────────────┘