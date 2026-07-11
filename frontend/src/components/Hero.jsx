import {
  ArrowRight,
  BrainCircuit,
  FileText,
  Trophy,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="grid items-center gap-12 py-20 lg:grid-cols-2">
      {/* Left */}
      <div>
        <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
          🚀 AI Powered Interview Practice
        </span>

        <h1 className="mt-6 text-5xl font-extrabold leading-tight md:text-6xl">
          Ace Every
          <span className="text-blue-500"> Technical Interview</span>
        </h1>

        <p className="mt-6 max-w-xl text-lg text-slate-400">
          Practice realistic AI interviews, upload your resume, receive
          detailed feedback, improve your confidence and track your
          performance.
        </p>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate("/interview")}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-semibold hover:bg-blue-700"
          >
            Start Interview
            <ArrowRight size={20} />
          </button>

          <button
            onClick={() =>
              document
                .getElementById("features")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="rounded-xl border border-slate-700 px-6 py-4 hover:bg-slate-900"
          >
            Learn More
          </button>
        </div>
      </div>

      {/* Right */}
      <div className="grid gap-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-3">
            <BrainCircuit className="text-blue-500" />
            <h2 className="text-xl font-bold">AI Interview</h2>
          </div>

          <p className="mt-4 text-slate-400">
            Generate realistic interview questions using AI.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-3">
            <FileText className="text-green-500" />
            <h2 className="text-xl font-bold">Resume Analysis</h2>
          </div>

          <p className="mt-4 text-slate-400">
            Detect skills and recommend the best job role.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-3">
            <Trophy className="text-yellow-500" />
            <h2 className="text-xl font-bold">Performance Tracking</h2>
          </div>

          <p className="mt-4 text-slate-400">
            View scores, interview history and AI feedback.
          </p>
        </div>
      </div>
    </section>
  );
}