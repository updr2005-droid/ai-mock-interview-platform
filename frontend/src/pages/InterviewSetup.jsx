import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import MainLayout from "../layouts/MainLayout";

import {
  Upload,
  FileText,
  Briefcase,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

import { jobRoles } from "../data/jobRoles";

export default function InterviewSetup() {

  const navigate = useNavigate();

  const [resume, setResume] = useState(null);

  const [role, setRole] = useState("Software Engineer");

  const [difficulty, setDifficulty] = useState("Easy");

  const [skills, setSkills] = useState("");

  const [suggestedRole, setSuggestedRole] = useState("");

  const [resumeText, setResumeText] = useState("");

  const [candidateName, setCandidateName] = useState("");

  const [uploading, setUploading] = useState(false);

  const [uploaded, setUploaded] = useState(false);

  const [questionCount, setQuestionCount] = useState(5);

  const roleOptions = jobRoles.map((item) => ({
    value: item,
    label: item,
  }));

  const interviewer =
    JSON.parse(
      localStorage.getItem("selectedInterviewer")
    );

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

      setSkills(
        res.data.skills || "No skills detected"
      );

      setResumeText(
        res.data.resumeText || ""
      );

      setCandidateName(
        res.data.candidateName || "Candidate"
      );

      if (res.data.suggestedRole) {

        setSuggestedRole(
          res.data.suggestedRole
        );

        setRole(
          res.data.suggestedRole
        );
      }

      setUploaded(true);

      alert("Resume uploaded successfully!");

    } catch (error) {

      console.error(error);

      alert("Resume upload failed.");

    } finally {

      setUploading(false);

    }
  };

  const startInterview = () => {

  if (!uploaded) {
    alert("Please upload your resume first.");
    return;
  }

  const interviewData = {
    interviewer,
    role,
    difficulty,
    questionCount,
    resumeText,
    resumeName: resume?.name || "",
    candidateName,
    skills,
  };

  localStorage.setItem(
    "interviewData",
    JSON.stringify(interviewData)
  );

  navigate("/interview");
};

  return (
    <MainLayout>

      <div className="max-w-5xl mx-auto">

        {/* Progress */}
        <div className="flex items-center justify-center gap-3 mb-10">

          <div className="flex items-center gap-2 text-gray-500">
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">
              ✓
            </div>
            <span>Interviewer</span>
          </div>

          <div className="w-16 h-px bg-blue-500" />

          <div className="flex items-center gap-2 text-blue-400">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
              2
            </div>
            <span>Setup</span>
          </div>

          <div className="w-16 h-px bg-gray-700" />

          <div className="flex items-center gap-2 text-gray-500">
            <div className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center">
              3
            </div>
            <span>Interview</span>
          </div>

        </div>

        {/* Heading */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold text-white">
            Interview Setup
          </h1>

          <p className="text-gray-400 mt-2">
            Upload your resume and configure your interview.
          </p>

        </div>

        {/* Selected Interviewer */}
        {interviewer && (
          <div className="mb-6 bg-[#111827] border border-blue-500/40 rounded-2xl p-5">

            <p className="text-gray-400 text-sm">
              Selected Interviewer
            </p>

            <div className="flex items-center justify-between mt-2">

              <div>
                <h2 className="text-white text-lg font-bold">
                  {interviewer.name}
                </h2>

                <p className="text-blue-400 text-sm">
                  {interviewer.role}
                </p>
              </div>

              <button
                onClick={() =>
                  navigate("/interviewer-selection")
                }
                className="text-gray-400 hover:text-white text-sm"
              >
                Change
              </button>

            </div>

          </div>
        )}

        {/* Resume */}
        <div className="bg-[#111827] border border-gray-700 rounded-3xl p-6 md:p-8">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-11 h-11 bg-cyan-500/10 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-cyan-400" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Upload Resume
              </h2>

              <p className="text-gray-400 text-sm">
                PDF, DOC or DOCX
              </p>
            </div>

          </div>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              setResume(
                e.target.files?.[0] || null
              );
              setUploaded(false);
            }}
            className="w-full bg-[#0F172A] text-gray-300 border border-gray-700 rounded-xl p-3 file:bg-blue-600 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg file:mr-4"
          />

          <button
            onClick={uploadResume}
            disabled={uploading}
            className="mt-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl"
          >
            <Upload className="w-4 h-4" />

            {uploading
              ? "Uploading..."
              : uploaded
              ? "Resume Uploaded ✓"
              : "Upload Resume"}
          </button>

          {/* Skills */}
          {skills && (

            <div className="mt-6 bg-[#0F172A] border border-gray-700 rounded-2xl p-5">

              <div className="flex items-center gap-2 mb-3">

                <CheckCircle className="w-5 h-5 text-green-400" />

                <h3 className="text-white font-semibold">
                  Detected Skills
                </h3>

              </div>

              <p className="text-gray-300 whitespace-pre-wrap leading-7">
                {skills}
              </p>

            </div>

          )}

          {/* Suggested Role */}
          {suggestedRole && (

            <div className="mt-5 bg-cyan-500/5 border border-cyan-500/40 rounded-2xl p-5">

              <p className="text-gray-400 text-sm">
                AI Suggested Role
              </p>

              <p className="text-cyan-400 text-lg font-bold mt-1">
                {suggestedRole}
              </p>

            </div>

          )}

          {/* Role */}
          <div className="mt-8">

            <div className="flex items-center gap-2 mb-3">

              <Briefcase className="w-5 h-5 text-blue-400" />

              <h2 className="text-white font-semibold">
                Select Job Role
              </h2>

            </div>

            <Select
              options={roleOptions}
              value={roleOptions.find(
                (item) =>
                  item.value === role
              )}
              onChange={(selected) =>
                setRole(
                  selected?.value || ""
                )
              }
              isSearchable
              placeholder="Search job role..."
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "#0F172A",
                  borderColor: "#4B5563",
                  minHeight: "50px",
                  borderRadius: "12px",
                }),

                menu: (base) => ({
                  ...base,
                  backgroundColor: "#0F172A",
                  zIndex: 100,
                }),

                option: (
                  base,
                  state
                ) => ({
                  ...base,
                  backgroundColor:
                    state.isFocused
                      ? "#1E293B"
                      : "#0F172A",
                  color: "white",
                }),

                singleValue: (
                  base
                ) => ({
                  ...base,
                  color: "white",
                }),

                input: (base) => ({
                  ...base,
                  color: "white",
                }),

                placeholder: (
                  base
                ) => ({
                  ...base,
                  color: "#94A3B8",
                }),
              }}
            />

          </div>

          {/* Difficulty */}

          {/* Number of Questions */}
<div className="mt-6">

  <div className="flex items-center gap-2 mb-3">

    <FileText className="w-5 h-5 text-cyan-400" />

    <h2 className="text-white font-semibold">
      Number of Questions
    </h2>

  </div>

  <select
    value={questionCount}
    onChange={(e) =>
      setQuestionCount(Number(e.target.value))
    }
    className="w-full bg-[#0F172A] text-white border border-gray-600 rounded-xl p-3"
  >
    <option value={5}>5 Questions</option>
    <option value={10}>10 Questions</option>
    <option value={15}>15 Questions</option>
    <option value={20}>20 Questions</option>
  </select>

</div>
          <div className="mt-6">

            <div className="flex items-center gap-2 mb-3">

              <Sparkles className="w-5 h-5 text-purple-400" />

              <h2 className="text-white font-semibold">
                Interview Difficulty
              </h2>

            </div>

            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(
                  e.target.value
                )
              }
              className="w-full bg-[#0F172A] text-white border border-gray-600 rounded-xl p-3"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>

          </div>

        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">

          <button
            onClick={() =>
              navigate("/interviewer-selection")
            }
            className="flex items-center gap-2 text-gray-400 hover:text-white px-5 py-3"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <button
            onClick={startInterview}
            disabled={!uploaded}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-7 py-4 rounded-xl"
          >
            Start Interview
            <ArrowRight className="w-5 h-5" />
          </button>

        </div>

      </div>

    </MainLayout>
  );
}