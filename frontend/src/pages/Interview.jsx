import { useState } from "react";
import axios from "axios";
import ChooseInterviewer from "../components/ChooseInterviewer";
import {
  Briefcase,
  Upload,
  Sparkles,
  Send,
  FileText,
  BrainCircuit,
} from "lucide-react";

const ROLES = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "React Developer",
  "Node.js Developer",
  "Python Developer",
  "Java Developer",
  "Machine Learning Engineer",
  "Data Analyst",
  "Data Scientist",
  "AI Engineer",
  "Cyber Security Analyst",
  "Cloud Engineer",
  "DevOps Engineer",
];

export default function Interview() {
  const [role, setRole] = useState("Software Engineer");
  const [difficulty, setDifficulty] = useState("Easy");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState("");

  const [resume, setResume] = useState(null);
  const [skills, setSkills] = useState("");
  const [suggestedRole, setSuggestedRole] = useState("");
  const [resumeText, setResumeText] = useState("");

  const [candidateName, setCandidateName] = useState("");
  const [questionNumber, setQuestionNumber] = useState(1);

  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [loadingEvaluation, setLoadingEvaluation] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedInterviewer, setSelectedInterviewer] = useState(null);

  const speak = async (text) => {
  try {
    if (!selectedInterviewer) {
      alert("Please select an interviewer first!");
      return;
    }

    console.log("Selected Interviewer:", selectedInterviewer);
    console.log("Voice ID:", selectedInterviewer?.voice);

    const response = await axios.post(
      "http://localhost:5000/speak",
      {
        text,
        voiceId: selectedInterviewer.voice,
      },
      {
        responseType: "blob",
      }
    );

    const audio = new Audio(URL.createObjectURL(response.data));
    await audio.play();

  } catch (err) {
    console.error("Speech Error:", err);
  }
};
  const generateQuestion = async () => {
    try {
      setLoadingQuestion(true);
      setResult("");

      const res = await axios.post("http://localhost:5000/question", {
  role,
  difficulty,
  resumeText,
  candidateName,
  questionNumber,
});

     const generatedQuestion = res.data.question || "No question generated";

setQuestion(generatedQuestion);

setQuestionNumber(prev => prev + 1);

await speak(generatedQuestion);

setAnswer("");
    } catch (err) {
      console.error(err);
      alert("Failed to generate question");
    } finally {
      setLoadingQuestion(false);
    }
  };

  const uploadResume = async () => {
    if (!resume) {
      alert("Please select a resume first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);

    try {
      setUploading(true);

      const res = await axios.post(
        "http://localhost:5000/upload-resume",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSkills(res.data.skills || "No skills detected");
      setResumeText(res.data.resumeText || "");
      setCandidateName(res.data.candidateName || "Candidate");

      if (res.data.suggestedRole) {
        setSuggestedRole(res.data.suggestedRole);
        setRole(res.data.suggestedRole);
      }

      alert("Resume uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Resume upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      alert("Please enter your answer.");
      return;
    }

    try {
      setLoadingEvaluation(true);

      const res = await axios.post("http://localhost:5000/evaluate", {
        question,
        answer,
        role,
        difficulty,
        resumeName: resume?.name || "No Resume Uploaded",
      });

      setResult(res.data.feedback || "No feedback received");
    } catch (err) {
      console.error(err);
      alert("Evaluation failed.");
    } finally {
      setLoadingEvaluation(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] py-10 px-4">
      <div className="max-w-5xl mx-auto bg-[#111827] border border-gray-700 rounded-3xl p-6 md:p-10 shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-blue-600/20 border border-blue-500/30">
            <BrainCircuit className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white">
              AI <span className="text-blue-400">Mock Interview</span>
            </h1>
            <p className="text-gray-400 mt-1">
              Generate personalized interview questions and get AI feedback.
            </p>
            {!selectedInterviewer && (
  <>
    <h2 className="text-white text-2xl font-bold mt-8 mb-4">
      Choose Your AI Interviewer
    </h2>

    <ChooseInterviewer
      onSelect={(person) => setSelectedInterviewer(person)}
    />
  </>
)}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-8">
          <div className="bg-[#1E293B] border border-gray-700 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="w-5 h-5 text-blue-400" />
              <h2 className="text-white font-semibold">Select Job Role</h2>
            </div>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-[#0F172A] text-white border border-gray-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-[#1E293B] border border-gray-700 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h2 className="text-white font-semibold">Interview Difficulty</h2>
            </div>

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-[#0F172A] text-white border border-gray-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
        </div>

        <div className="bg-[#1E293B] border border-gray-700 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h2 className="text-white text-xl font-bold">Upload Resume</h2>
          </div>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResume(e.target.files?.[0] || null)}
            className="w-full bg-[#0F172A] text-gray-300 border border-gray-600 rounded-xl p-3 mb-4 file:bg-blue-600 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg file:mr-4"
          />

          <button
            onClick={uploadResume}
            disabled={uploading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-5 py-3 rounded-xl text-white font-semibold transition-colors"
          >
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading..." : "Upload Resume"}
          </button>

          {skills && (
            <div className="mt-5 bg-[#0F172A] border border-gray-700 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-2">Detected Skills</h3>
              <p className="text-gray-300 whitespace-pre-wrap leading-7">
                {skills}
              </p>
            </div>
          )}

          {suggestedRole && (
            <div className="mt-5 bg-[#0F172A] border border-cyan-500 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-1">Suggested Role</h3>
              <p className="text-cyan-400 font-bold text-lg">{suggestedRole}</p>
            </div>
          )}
        </div>

        <button
          onClick={generateQuestion}
          disabled={loadingQuestion}
          className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-4 rounded-2xl text-white font-bold text-lg transition-colors"
        >
          <Sparkles className="w-5 h-5" />
          {loadingQuestion ? "Generating..." : "Generate Question"}
        </button>

        {question && (
          <div className="mt-8 space-y-6">
            <div className="bg-[#1E293B] border border-blue-500 rounded-2xl p-6">
              <h2 className="text-white text-xl font-bold mb-3">Question</h2>
              <p className="text-gray-200 leading-7">{question}</p>
            </div>

            <div className="bg-[#1E293B] border border-gray-700 rounded-2xl p-6">
              <h2 className="text-white text-xl font-bold mb-3">Your Answer</h2>

              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full bg-[#0F172A] border border-gray-700 rounded-xl p-4 h-44 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />

              <button
                onClick={submitAnswer}
                disabled={loadingEvaluation}
                className="mt-4 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 px-5 py-3 rounded-xl text-white font-semibold transition-colors"
              >
                <Send className="w-4 h-4" />
                {loadingEvaluation ? "Evaluating..." : "Submit Answer"}
              </button>
            </div>
          </div>
        )}

        {result && (
          <div className="mt-8 bg-[#1E293B] border border-green-500 rounded-2xl p-6">
            <h2 className="text-white text-xl font-bold mb-3">AI Feedback</h2>
            <pre className="text-gray-200 whitespace-pre-wrap leading-7 font-sans">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}