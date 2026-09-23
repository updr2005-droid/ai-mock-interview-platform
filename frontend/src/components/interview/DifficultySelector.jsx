import { Sparkles } from "lucide-react";

export default function DifficultySelector({
  difficulty,
  setDifficulty,
}) {
  return (
    <div className="bg-[#1E293B] border border-gray-700 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h2 className="text-white font-semibold">
          Interview Difficulty
        </h2>
      </div>

      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        className="w-full bg-[#0F172A] text-white border border-gray-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </select>
    </div>
  );
}