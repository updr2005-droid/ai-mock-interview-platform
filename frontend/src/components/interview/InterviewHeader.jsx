import { BrainCircuit } from "lucide-react";
import ChooseInterviewer from "../ChooseInterviewer";

export default function InterviewHeader({
  selectedInterviewer,
  setSelectedInterviewer,
}) {
  return (
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
  );
}