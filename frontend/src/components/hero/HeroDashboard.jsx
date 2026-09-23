import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import {
  BrainCircuit,
  Mic,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function HeroDashboard() {
  return (
    <Tilt
      tiltMaxAngleX={8}
      tiltMaxAngleY={8}
      perspective={1200}
      glareEnable={true}
      glareMaxOpacity={0.08}
      glareColor="#ffffff"
      glarePosition="all"
      className="w-full max-w-xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-[0_0_80px_rgba(59,130,246,.15)]"
      >
        {/* Glow */}
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-blue-400">
              AI Interview
            </p>

            <h2 className="mt-2 text-3xl font-bold text-white">
              Dhruv
            </h2>

            <p className="text-slate-400">
             Senior Data Scientist
            </p>
          </div>

          <motion.div
            animate={{ scale: [1, 1.25, 1] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
            className="h-4 w-4 rounded-full bg-green-400"
          />
        </div>

        {/* Question */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-slate-400">
              Question 3 / 10
            </span>

            <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-300">
              Medium
            </span>
          </div>

          <h3 className="text-xl font-semibold text-white">
            Tell me about yourself.
          </h3>
        </div>

        {/* Live */}
        <div className="mt-6 flex items-center gap-2 text-green-400">
          <Mic size={18} />

          <motion.span
            animate={{
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
          >
            Listening...
          </motion.span>
        </div>

        {/* Progress */}
        <div className="mt-8 space-y-5">

          {[
            ["Communication", 92, "bg-blue-500"],
            ["Technical", 86, "bg-violet-500"],
            ["Confidence", 95, "bg-green-500"],
          ].map(([title, value, color]) => (
            <div key={title}>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-300">{title}</span>
                <span className="text-white">{value}%</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{
                    duration: 1.4,
                  }}
                  className={`h-full rounded-full ${color}`}
                />
              </div>
            </div>
          ))}

        </div>

        {/* Bottom Cards */}
        <div className="mt-8 grid grid-cols-2 gap-4">

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-blue-400">
              <BrainCircuit size={18} />
              <span className="text-sm">
                Resume Match
              </span>
            </div>

            <h2 className="mt-3 text-3xl font-bold text-white">
              94%
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-blue-600 to-violet-600 p-4">
            <div className="flex items-center gap-2 text-white">
              <Sparkles size={18} />
              <span className="text-sm">
                Overall Score
              </span>
            </div>

            <h2 className="mt-3 text-3xl font-bold text-white">
              9.4
            </h2>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center gap-2 text-green-400">
          <CheckCircle2 size={18} />
          <span className="text-sm">
            AI is analyzing your answers in real-time
          </span>
        </div>

      </motion.div>
    </Tilt>
  );
}