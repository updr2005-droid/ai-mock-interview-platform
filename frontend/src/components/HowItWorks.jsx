import { Upload, MessageSquare, BarChart3 } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Upload size={40} className="text-blue-500" />,
      title: "Upload Resume",
      desc: "Upload your PDF resume and let AI analyze your skills.",
    },
    {
      icon: <MessageSquare size={40} className="text-green-500" />,
      title: "Practice Interview",
      desc: "Receive role-specific AI interview questions.",
    },
    {
      icon: <BarChart3 size={40} className="text-yellow-500" />,
      title: "Get Feedback",
      desc: "Receive AI score and detailed improvement suggestions.",
    },
  ];

  return (
    <section className="py-24">
      <div className="text-center">
        <h2 className="text-4xl font-bold">How It Works</h2>
        <p className="mt-3 text-slate-400">
          Get interview-ready in three simple steps.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className="rounded-3xl border border-slate-800 bg-slate-900 p-8 transition duration-300 hover:-translate-y-2 hover:border-blue-500"
          >
            <div className="mb-6">{step.icon}</div>

            <h3 className="text-2xl font-bold">{step.title}</h3>

            <p className="mt-4 text-slate-400">
              {step.desc}
            </p>

            <div className="mt-8 text-5xl font-bold text-slate-700">
              0{index + 1}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}