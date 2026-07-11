import { useState } from "react";
import "./App.css";

function App() {
  const API_BASE = "http://localhost:5000";

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState("");
  const [history, setHistory] = useState([]);
  
  const averageScore =
  history.length > 0
    ? (
        history.reduce(
          (sum, item) => sum + Number(item.score),
          0
        ) / history.length
      ).toFixed(1)
    : 0;

  const [role, setRole] = useState("Software Engineer");
  const [difficulty, setDifficulty] = useState("Easy");

  const [resume, setResume] = useState(null);
  const [skills, setSkills] = useState("");
  const [suggestedRole, setSuggestedRole] = useState("");

  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  // =========================
  // Upload Resume
  // =========================
  const uploadResume = async () => {
    if (!resume) {
      alert("Please select a PDF resume.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("resume", resume);

      const res = await fetch(`${API_BASE}/upload-resume`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Upload failed");
      }

      setSkills(data.skills);
      setSuggestedRole(data.suggestedRole);
setRole(data.suggestedRole);
    } catch (err) {
      console.error(err);
      alert("Resume upload failed");
    }

    setUploading(false);
  };

  // =========================
  // Generate Question
  // =========================
  const generateQuestion = async () => {
    setLoading(true);
    setQuestion("");
    setAnswer("");
    setFeedback("");

    try {
      const res = await fetch(`${API_BASE}/question`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          difficulty,
          skills,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to generate question");
      }

      setQuestion(data.question);
      setQuestionCount(prev => prev + 1);
    } catch (err) {
      console.error(err);
      setQuestion("⚠️ Backend/Ollama Error");
    }

    setLoading(false);
  };

  // =========================
  // Evaluate Answer
  // =========================
  const evaluateAnswer = async () => {
    if (!answer.trim()) {
      alert("Please write your answer first!");
      return;
    }

    setEvaluating(true);

    try {
      const res = await fetch(`${API_BASE}/evaluate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          answer,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Evaluation failed");
      }
const scoreMatch =
  data.feedback.match(/Score:\s*(\d+)/i);

if (scoreMatch) {
  setScore(scoreMatch[1]);
}
      setFeedback(data.feedback);
      if (scoreMatch) {
  setHistory(prev => [
    ...prev,
    {
      question,
      score: scoreMatch[1],
    },
  ]);
}
    } catch (err) {
      console.error(err);
      setFeedback("⚠️ Could not evaluate answer");
    }

    setEvaluating(false);
  };

  return (
    <div className="container">
      <h1>AI Mock Interview Platform 🚀</h1>
      <h2>Welcome Dhruv</h2>

      <div className="card">
        <h3>Upload Resume</h3>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setResume(e.target.files[0])}
        />

        <br />
        <br />

        <button onClick={uploadResume}>
          {uploading ? "Processing Resume..." : "Upload Resume"}
        </button>

        {skills && (
          <div
            style={{
              marginTop: "20px",
              textAlign: "left",
              border: "1px solid #ccc",
              padding: "15px",
              borderRadius: "10px",
            }}
          >
            <h3>Detected Skills</h3>
            <p>{skills}</p>
            {suggestedRole && (
  <>
    <h3>Suggested Role</h3>
    <p>{suggestedRole}</p>
  </>
)}
          </div>
        )}

        <h3>Job Role</h3>

<select
  value={role}
  onChange={(e) => setRole(e.target.value)}
>
  <option>Software Engineer</option>
  <option>Frontend Developer</option>
  <option>Backend Developer</option>
  <option>Full Stack Developer</option>
  <option>Web Developer</option>

  <option>Java Developer</option>
  <option>Python Developer</option>
  <option>JavaScript Developer</option>
  <option>React Developer</option>
  <option>Node.js Developer</option>

  <option>AI Engineer</option>
  <option>Machine Learning Engineer</option>
  <option>Data Scientist</option>
  <option>Data Analyst</option>
  <option>Business Analyst</option>

  <option>DevOps Engineer</option>
  <option>Cloud Engineer</option>
  <option>Cybersecurity Analyst</option>

  <option>Database Administrator</option>
  <option>SQL Developer</option>

  <option>Mobile App Developer</option>
  <option>Android Developer</option>

  <option>QA Engineer</option>
  <option>Test Engineer</option>

  <option>System Administrator</option>
  <option>Network Engineer</option>
</select>

        <h3>Difficulty</h3>

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <br />
        <br />

        <button onClick={generateQuestion}>
          {loading ? "Generating..." : "Start Mock Interview"}
        </button>

        {question && (
          <div style={{ marginTop: "20px", textAlign: "left" }}>
            <h3>Question {questionCount}</h3>

            <p>{question}</p>

            <h3>Your Answer</h3>

            <textarea
              rows="6"
              cols="60"
              placeholder="Type your answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />

            <br />
            <br />
            <button onClick={evaluateAnswer}>
  {evaluating ? "Evaluating..." : "Submit Answer"}
            </button>

            <br /><br />

            <button onClick={generateQuestion}>
              Next Question
            </button>
          </div>
        )}
        {score && (
  <div
    style={{
      marginTop: "20px",
      padding: "20px",
      border: "2px solid green",
      borderRadius: "10px",
      textAlign: "center",
    }}
  >
    <h2>Score</h2>
    <h1>{score}/10</h1>
  </div>
)}

   {feedback && (
  <div
    style={{
      marginTop: "20px",
      textAlign: "left",
      border: "1px solid #ccc",
      padding: "15px",
      borderRadius: "10px",
    }}
  >
    <h3>AI Feedback</h3>

    <pre style={{ whiteSpace: "pre-wrap" }}>
      {feedback}
    </pre>
  </div>
)}

{history.length > 0 && (
  <div
    style={{
      marginTop: "20px",
      border: "1px solid #ccc",
      padding: "15px",
      borderRadius: "10px",
      textAlign: "left",
    }}
  >
    <h3>Interview History</h3>

    <h3>Average Score: {averageScore}/10</h3>

    {history.map((item, index) => (
      <p key={index}>
        Question {index + 1}: {item.score}/10
      </p>
    ))}
  </div>
)}    
      </div>
    </div>
  );
}

export default App;