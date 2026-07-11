export default function StatsCards({ history }) {
  const totalInterviews = history.length;

  const scores = history
    .map((item) => Number(item.score) || 0)
    .filter((score) => score >= 0);

  const averageScore =
    scores.length > 0
      ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
      : 0;

  const highestScore =
    scores.length > 0 ? Math.max(...scores) : 0;

  const cardClass =
    "bg-[#1E293B] rounded-2xl border border-gray-700 p-6";

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <div className={cardClass}>
        <h3 className="text-gray-400 text-sm">
          Total Interviews
        </h3>

        <p className="text-4xl font-bold text-white mt-3">
          {totalInterviews}
        </p>
      </div>

      <div className={cardClass}>
        <h3 className="text-gray-400 text-sm">
          Average Score
        </h3>

        <p className="text-4xl font-bold text-green-400 mt-3">
          {averageScore}/10
        </p>
      </div>

      <div className={cardClass}>
        <h3 className="text-gray-400 text-sm">
          Highest Score
        </h3>

        <p className="text-4xl font-bold text-blue-400 mt-3">
          {highestScore}/10
        </p>
      </div>
    </div>
  );
}