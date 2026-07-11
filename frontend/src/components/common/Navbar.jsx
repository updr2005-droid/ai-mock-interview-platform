import { Link } from "react-router-dom";
import { BrainCircuit } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-white"
        >
          <BrainCircuit className="text-blue-500" size={30} />
          AI Mock Interview
        </Link>

        <div className="flex gap-8 text-slate-300">

          <Link
            to="/"
            className="transition hover:text-blue-400"
          >
            Home
          </Link>

          <Link
            to="/interview"
            className="transition hover:text-blue-400"
          >
            Interview
          </Link>

          <Link
            to="/history"
            className="transition hover:text-blue-400"
          >
            History
          </Link>

          <Link
            to="/profile"
            className="transition hover:text-blue-400"
          >
            Profile
          </Link>

        </div>
      </div>
    </nav>
  );
}