import {
  BrainCircuit,
  FileText,
  BarChart3,
  Briefcase,
  History,
  Sparkles,
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <BrainCircuit size={40} className="text-blue-500" />,
      title: "AI Interview Questions",
      desc: "Generate role-specific interview questions using AI.",
    },
    {
      icon: <FileText size={40} className="text-green-500" />,
      title: "Resume Analysis",
      desc: "Extract skills and identify strengths from your resume.",
    },
    {
      icon: <Briefcase size={40} className="text-purple-500" />,
      title: "Role Recommendation",
      desc: "Get personalized job role suggestions based on your resume.",
    },
    {
      icon: <BarChart3 size={40} className="text-orange-500" />,
      title: "Performance Analytics",
      desc: "Track scores and improve over multiple interviews.",
    },
    {
      icon: <History size={40} className="text-pink-500" />,
      title: "Interview History",
      desc: "Review previous interviews and monitor your progress.",
    },
    {
      icon: <Sparkles size={40} className="text-cyan-500" />,
      title: "Instant AI Feedback",
      desc: "Receive strengths, weaknesses and improvement suggestions instantly.",
    },
  ];

  return (
    <section className="py-24">
      <div className="text-center">
        <h2 className="text-4xl font-bold">Powerful Features</h2>
        <p className="mt-4 text-slate-400">
          Everything you need to prepare for your dream job.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className="rounded-3xl border border-slate-800 bg-slate-900 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10"
          >
            {feature.icon}

            <h3 className="mt-6 text-2xl font-bold">
              {feature.title}
            </h3>

            <p className="mt-4 text-slate-400">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}