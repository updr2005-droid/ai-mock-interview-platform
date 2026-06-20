# AI Mock Interview Platform

An AI-powered mock interview platform that helps users practice interviews, receive feedback, and improve their performance.

## Features

* Role-based interview questions
* Multiple difficulty levels
* AI-generated interview questions
* Answer evaluation and feedback
* Resume upload support
* Interactive user interface
* Real-time interview experience

## Tech Stack

### Frontend

* React
* Vite
* CSS

### Backend

* Node.js
* Express.js

## Project Structure

```text
frontend/
backend/
src/
public/
```

## Installation

### Clone Repository

```bash
git clone https://github.com/updr2005-droid/ai-mock-interview-platform.git
```

### Install Dependencies

```bash
npm install
cd frontend
npm install
cd ../backend
npm install
```

### Run Application

Frontend:

```bash
npm run dev
```

Backend:

```bash
node server.js
```

## Future Improvements

* Resume-based personalized interview questions
* Improved AI answer evaluation
* Interview analytics dashboard
* Voice-based interviews
* Performance tracking

## Known Issue

During testing, a major issue was identified in the answer evaluation module. Irrelevant or nonsensical responses can sometimes receive high scores and generic positive feedback. Future updates will introduce stricter relevance validation and improved scoring logic.

## Author

Dhruv Upadhyay
