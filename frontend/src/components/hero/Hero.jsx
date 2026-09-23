import {
  ArrowRight,
  PlayCircle,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeroBackground from "./HeroBackground";
import TypingRoles from "./TypingRoles";
import HeroDashboard from "./HeroDashboard";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center py-20">
       <HeroBackground />
      

      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl"></div>

      <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center w-full">

        {/* Left */}
        <div>

          <span className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
            🚀 AI Powered Mock Interviews
          </span>

          <h1 className="mt-6 text-5xl md:text-7xl font-extrabold leading-tight text-white">
            Practice Interviews.
            <br />
            <span className="text-blue-500">
              Get Hired Faster.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
            Practice realistic interviews with AI voice interviewers,
            resume-based questions, instant feedback, and performance
            analytics across <span className="text-white font-semibold">200+ job roles.</span>
          </p>
          <TypingRoles />

          <div className="mt-10 flex flex-wrap gap-4">

            <button
              onClick={() => navigate("/interview")}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white transition hover:bg-blue-700"
            >
              Start Interview
              <ArrowRight size={20} />
            </button>

            <button
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-7 py-4 text-white transition hover:bg-slate-800"
            >
              <PlayCircle size={20} />
              Watch Demo
            </button>

          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 text-sm text-slate-300">

            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-green-400" size={18} />
              Resume Analysis
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-green-400" size={18} />
              AI Voice Interview
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-green-400" size={18} />
              200+ Job Roles
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-green-400" size={18} />
              Instant Feedback
            </div>

          </div>

        </div>

       
    {/* Right */}
    <div className="flex justify-center lg:justify-end">
      <HeroDashboard />
    </div>

  </div>
</section>
  );
}