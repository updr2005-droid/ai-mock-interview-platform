import { TypeAnimation } from "react-type-animation";

export default function TypingRoles() {
  return (
    <div className="mt-8">
      <p className="mb-3 text-sm uppercase tracking-[0.3em] text-blue-400">
        Preparing For
      </p>

      <TypeAnimation
        sequence={[
          "Software Engineer",
          2000,
          "Frontend Developer",
          2000,
          "Backend Developer",
          2000,
          "Full Stack Developer",
          2000,
          "Data Analyst",
          2000,
          "Data Scientist",
          2000,
          "AI Engineer",
          2000,
          "Machine Learning Engineer",
          2000,
          "Cloud Engineer",
          2000,
          "Cybersecurity Analyst",
          2000,
          "Business Analyst",
          2000,
          "HR Executive",
          2000,
          "Digital Marketing Executive",
          2000,
        ]}
        wrapper="span"
        speed={55}
        repeat={Infinity}
        className="bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-2xl font-bold text-transparent md:text-3xl"
      />

      <p className="mt-3 text-slate-400">
        Practice realistic AI interviews tailored to your selected career path.
      </p>
    </div>
  );
}