import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { User, Briefcase, Database, Building2, ArrowRight } from "lucide-react";

const interviewers = [
  {
    id: "maya",
    name: "Maya HR",
    role: "HR Interviewer",
    description: "Focuses on communication, behavior and HR questions.",
    icon: User,
    voice: "EXAVITQu4vr4xnSDxMaL",
  },
  {
    id: "ethan",
    name: "Ethan Tech",
    role: "Technical Interviewer",
    description: "Focuses on programming, technical concepts and problem solving.",
    icon: Briefcase,
    voice: "21m00Tcm4TlvDq8ikWAM",
  },
  {
    id: "sophia",
    name: "Sophia Data",
    role: "Data Interviewer",
    description: "Focuses on SQL, Excel, Python, Power BI and data analysis.",
    icon: Database,
    voice: "AZnzlk1XvdvUeBnXmlld",
  },
  {
    id: "james",
    name: "James Corporate",
    role: "Corporate Interviewer",
    description: "Focuses on corporate communication and workplace situations.",
    icon: Building2,
    voice: "TxGEqnHWrfWFTfGW9XjX",
  },
];

export default function InterviewerSelection() {
  const navigate = useNavigate();

  const [selected, setSelected] = useState(null);

  const handleContinue = () => {
    if (!selected) {
      alert("Please select an interviewer first.");
      return;
    }

    localStorage.setItem(
      "selectedInterviewer",
      JSON.stringify(selected)
    );

    navigate("/interview-setup");
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 mb-4">
            <User className="w-8 h-8 text-blue-400" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Choose Your Interviewer
          </h1>

          <p className="text-gray-400 mt-3">
            Select an AI interviewer that matches your interview type.
          </p>
        </div>

        {/* Interviewers */}
        <div className="grid md:grid-cols-2 gap-6">

          {interviewers.map((interviewer) => {
            const Icon = interviewer.icon;

            const isSelected =
              selected?.id === interviewer.id;

            return (
              <button
                key={interviewer.id}
                onClick={() => setSelected(interviewer)}
                className={`text-left p-6 rounded-3xl border transition-all duration-200 ${
                  isSelected
                    ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10"
                    : "border-gray-700 bg-[#111827] hover:border-gray-500"
                }`}
              >

                <div className="flex items-start gap-5">

                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      isSelected
                        ? "bg-blue-600"
                        : "bg-[#1E293B]"
                    }`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <div className="flex-1">

                    <div className="flex items-center justify-between">

                      <div>
                        <h2 className="text-xl font-bold text-white">
                          {interviewer.name}
                        </h2>

                        <p className="text-blue-400 text-sm mt-1">
                          {interviewer.role}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="text-white text-sm">
                            ✓
                          </span>
                        </div>
                      )}

                    </div>

                    <p className="text-gray-400 mt-4 leading-6">
                      {interviewer.description}
                    </p>

                  </div>
                </div>
              </button>
            );
          })}

        </div>

        {/* Continue */}
        <div className="mt-10 flex justify-center">

          <button
            onClick={handleContinue}
            disabled={!selected}
            className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-8 py-4 rounded-2xl transition-all"
          >
            Continue to Setup
            <ArrowRight className="w-5 h-5" />
          </button>

        </div>

      </div>
    </MainLayout>
  );
}