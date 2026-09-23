
import * as CountUpModule from "react-countup";

console.log(CountUpModule);
import { motion } from "framer-motion";
import {
  Briefcase,
  BrainCircuit,
  FileCheck,
  Trophy,
} from "lucide-react";

const stats = [
  {
    icon: Briefcase,
    value: 200,
    suffix: "+",
    title: "Job Roles",
    desc: "Technical & Non-Technical",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: BrainCircuit,
    value: 5000,
    suffix: "+",
    title: "AI Questions",
    desc: "Generated Instantly",
    color: "from-violet-500 to-fuchsia-500",
  },
  {
    icon: FileCheck,
    value: 95,
    suffix: "%",
    title: "Resume Match",
    desc: "AI Skill Detection",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Trophy,
    value: 24,
    suffix: "/7",
    title: "AI Available",
    desc: "Practice Anytime",
    color: "from-orange-500 to-yellow-500",
  },
];

export default function Stats() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .7 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-blue-400">
            Platform Statistics
          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-white md:text-5xl">
            Trusted by Future Professionals
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-slate-400">
            Everything you need to prepare for interviews with
            AI-powered practice, resume analysis and detailed
            performance insights.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * .15,
                  duration: .6,
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                  scale: 1.03,
                }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
              >

                <div
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.color}`}
                />

                <div
                  className={`mb-6 inline-flex rounded-2xl bg-gradient-to-r ${item.color} p-4`}
                >
                  <Icon className="text-white" size={30} />
                </div>

                <h3 className="text-5xl font-extrabold text-white">

                 {item.value}

                  {item.suffix}

                </h3>

                <h4 className="mt-4 text-xl font-semibold text-white">
                  {item.title}
                </h4>

                <p className="mt-2 text-slate-400">
                  {item.desc}
                </p>

              </motion.div>
            );
          })}

        </div>
      </div>
    </section>
  );
}