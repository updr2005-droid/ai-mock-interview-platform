import { useState } from "react";
import axios from "axios";

export default function Interview() {
  const [role, setRole] = useState("Software Engineer");
  const [difficulty, setDifficulty] = useState("Easy");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const [resume, setResume] = useState(null);
  const [skills, setSkills] = useState("");
  const [suggestedRole, setSuggestedRole] = useState("");
  const [uploading, setUploading] = useState(false);
  const [resumeText, setResumeText] = useState("");

const generateQuestion = async () => {
  try {
    setLoading(true);

    const response = await axios.post("http://localhost:5000/question", {
      role,
      difficulty,
      resumeText,
    });

    setQuestion(response.data.question);
    setAnswer("");
    setResult("");
  } catch (err) {
    console.error(err);
    alert("Failed to generate question");
  } finally {
    setLoading(false);
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

    // Backend se skills aur suggested role lena
    setSkills(res.data.skills || "No skills detected");

  setResumeText(res.data.resumeText || "");

    if (res.data.suggestedRole) {
      setSuggestedRole(res.data.suggestedRole);
      setRole(res.data.suggestedRole); // Dropdown bhi auto update hoga
    }

    alert("Resume uploaded successfully!");
  } catch (err) {
    console.error("Resume Upload Error:", err);
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
      setLoading(true);

      const res = await axios.post("http://localhost:5000/evaluate", {
        question,
        answer,
      });

      setResult(res.data.feedback);
    } catch (err) {
      alert("Evaluation failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] py-12 px-6">
     <div className="max-w-6xl mx-auto bg-[#111827] border border-gray-700 rounded-3xl p-10 shadow-2xl">

       <h1 className="text-5xl font-extrabold text-white mb-10">
  AI <span className="text-blue-500">Mock Interview</span>
</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-8">

  {/* Job Role */}
  <div>
    <h2 className="text-white text-lg font-semibold mb-2">
      Select Job Role
    </h2>

    <select
      value={role}
      onChange={(e) => setRole(e.target.value)}
      className="w-full bg-[#1E293B] text-white border border-gray-600 rounded-xl p-4"
    >
      <option>Software Engineer</option>
      <option>Frontend Developer</option>
      <option>Backend Developer</option>
      <option>Full Stack Developer</option>
      <option>Web Developer</option>
      <option>React Developer</option>
      <option>Node.js Developer</option>
      <option>Java Developer</option>
      <option>Python Developer</option>
      <option>C++ Developer</option>
      <option>Android Developer</option>
      <option>iOS Developer</option>
      <option>Flutter Developer</option>
      <option>DevOps Engineer</option>
      <option>Cloud Engineer</option>
      <option>AI Engineer</option>
      <option>Machine Learning Engineer</option>
      <option>Data Scientist</option>
      <option>Data Analyst</option>
      <option>Data Engineer</option>
      <option>Cyber Security Analyst</option>
      <option>Network Engineer</option>
      <option>QA Engineer</option>
      <option>UI/UX Designer</option>
      <option>Business Analyst</option>
      <option>Product Manager</option>
    </select>
  </div>

  {/* Difficulty */}
  <div>
    <h2 className="text-white text-lg font-semibold mb-2">
      Interview Difficulty
    </h2>

    <select
      value={difficulty}
      onChange={(e) => setDifficulty(e.target.value)}
      className="w-full bg-[#1E293B] text-white border border-gray-600 rounded-xl p-4"
    >
      <option>Easy</option>
      <option>Medium</option>
      <option>Hard</option>
    </select>
  </div>

</div>

        {/* Resume Upload UI */}

       <div className="bg-[#1E293B] border border-gray-700 rounded-2xl p-6 mb-8">
          <h2 className="text-white text-2xl font-bold mb-5 flex items-center gap-2">
  📄 Upload Your Resume
</h2>

<label className="block text-gray-300 font-medium mb-3">
  Choose Resume (PDF, DOC, DOCX)
</label>

<input
  type="file"
  accept=".pdf,.doc,.docx"
  onChange={(e) => setResume(e.target.files[0])}
  className="
    w-full
    bg-[#0F172A]
    text-gray-300
    border-2
    border-blue-500
    rounded-xl
    p-3
    cursor-pointer
    transition-all
    duration-300
    hover:border-cyan-400
    hover:shadow-lg
    hover:shadow-blue-500/30

    file:bg-gradient-to-r
    file:from-blue-600
    file:to-cyan-500
    file:text-white
    file:font-semibold
    file:border-0
    file:px-5
    file:py-2
    file:rounded-lg
    file:cursor-pointer
    file:mr-4
  "
/>
          <button
            onClick={uploadResume}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-white font-semibold"
          >
            {uploading ? "Uploading..." : "Upload Resume"}
          </button>
{skills && (
  <div className="mt-6">
    <h3 className="text-white text-lg font-bold mb-2">
      Detected Skills
    </h3>

    <div className="bg-[#0F172A] border border-gray-700 rounded-xl p-4">
      <p className="text-gray-300 whitespace-pre-wrap leading-7">
        {skills}
      </p>
    </div>
  </div>
)}

{suggestedRole && (
  <div className="mt-6">
    <h3 className="text-white text-lg font-bold mb-2">
      Suggested Role
    </h3>

    <div className="bg-[#0F172A] border border-blue-500 rounded-xl p-4">
      <p className="text-cyan-400 text-lg font-semibold">
        {suggestedRole}
      </p>
    </div>
  </div>
)}
        </div>

        <button
          onClick={generateQuestion}
         className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl text-white font-bold w-full"
        >
          {loading ? "Generating..." : "Generate Question"}
        </button>

        {question && (
          <>
            <div className="mt-8 bg-[#1E293B] border border-blue-500 rounded-2xl p-6 text-white">
              <h2 className="font-bold mb-2">Question</h2>
              {question}
            </div>

            <textarea
             className="w-full bg-[#0F172A] border border-gray-700 rounded-2xl p-5 mt-6 h-48 text-white"
              placeholder="Type your answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />

            <button
              onClick={submitAnswer}
             className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-xl text-white font-bold mt-6 w-full"
            >
              {loading ? "Evaluating..." : "Submit Answer"}
            </button>
          </>
        )}

        {result && (
          <div className="mt-8 bg-[#1E293B] border border-green-500 rounded-2xl p-6 text-white">
            <h2 className="font-bold mb-2">AI Feedback</h2>
            <pre className="whitespace-pre-wrap">{result}</pre>
          </div>
        )}

      </div>
    </div>
  );
}