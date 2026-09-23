import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";
import {
  History as HistoryIcon,
  Award,
  Clock,
  Briefcase,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {};

      const res = await axios.get(
        "http://localhost:5000/history",
        config
      );

      // Make sure history is always an array
      if (Array.isArray(res.data)) {
        setHistory(res.data);
      } else if (Array.isArray(res.data.history)) {
        setHistory(res.data.history);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error("History fetch error:", err);

      if (err.response?.status === 401) {
        setError("Please login again to view your interview history.");
      } else if (err.response?.status === 404) {
        setError("History API route not found. Check your backend route.");
      } else {
        setError(
          "Unable to load interview history. Make sure the backend is running."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getScoreColor = (score) => {
    const value = Number(score);

    if (value >= 8) return "text-green-400";
    if (value >= 5) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBg = (score) => {
    const value = Number(score);

    if (value >= 8) return "bg-green-500/10 border-green-500/30";
    if (value >= 5) return "bg-yellow-500/10 border-yellow-500/30";
    return "bg-red-500/10 border-red-500/30";
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#020817] px-4 py-8 md:px-8 lg:px-10">

        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <HistoryIcon className="w-7 h-7 text-blue-400" />
                </div>

                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Interview History
                  </h1>

                  <p className="text-gray-400 mt-1">
                    Review your previous mock interview attempts
                  </p>
                </div>
              </div>
            </div>

            {/* Refresh */}
            {!loading && (
              <button
                onClick={fetchHistory}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="max-w-7xl mx-auto flex flex-col items-center justify-center h-[50vh]">
            <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>

            <p className="text-gray-300 text-lg mt-5">
              Loading History...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="max-w-7xl mx-auto">
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-red-400 mt-1" />

                <div>
                  <h2 className="text-lg font-semibold text-red-400">
                    Something went wrong
                  </h2>

                  <p className="text-gray-300 mt-1">
                    {error}
                  </p>

                  <button
                    onClick={fetchHistory}
                    className="mt-4 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && history.length === 0 && (
          <div className="max-w-7xl mx-auto">
            <div className="bg-[#111827] border border-gray-700 rounded-2xl p-10 text-center">

              <div className="w-16 h-16 mx-auto rounded-full bg-blue-500/10 flex items-center justify-center">
                <HistoryIcon className="w-8 h-8 text-blue-400" />
              </div>

              <h2 className="text-2xl font-bold text-white mt-5">
                No Interviews Yet
              </h2>

              <p className="text-gray-400 mt-2">
                Complete your first mock interview to see your history here.
              </p>
            </div>
          </div>
        )}

        {/* History Cards */}
        {!loading && !error && history.length > 0 && (
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Total Interviews */}
            <div className="bg-[#111827] border border-gray-700 rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <Briefcase className="text-blue-400 w-6 h-6" />

                <div>
                  <p className="text-gray-400 text-sm">
                    Total Interviews
                  </p>

                  <p className="text-white text-2xl font-bold">
                    {history.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Interview List */}
            {history.map((item, index) => (
              <div
                key={item._id || item.id || index}
                className="bg-[#111827] border border-gray-700 hover:border-blue-500/40 rounded-2xl p-6 transition"
              >

                {/* Top Section */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 text-sm">
                        #{history.length - index}
                      </span>

                      <h2 className="text-xl md:text-2xl font-bold text-blue-400">
                        {item.role || "Interview"}
                      </h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-400">

                      <span className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        {item.difficulty || "Not specified"}
                      </span>

                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {formatDate(item.createdAt)}
                      </span>

                    </div>
                  </div>

                  {/* Score */}
                  <div
                    className={`border rounded-xl px-5 py-3 ${getScoreBg(
                      item.score
                    )}`}
                  >
                    <div className="flex items-center gap-2">
                      <Award
                        className={`w-5 h-5 ${getScoreColor(
                          item.score
                        )}`}
                      />

                      <div>
                        <p className="text-xs text-gray-400">
                          Score
                        </p>

                        <p
                          className={`text-2xl font-bold ${getScoreColor(
                            item.score
                          )}`}
                        >
                          {item.score ?? 0}
                          <span className="text-sm text-gray-400">
                            /10
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700 my-6"></div>

                {/* Question */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                    Question
                  </h3>

                  <p className="text-white mt-2 leading-relaxed">
                    {item.question || "No question available."}
                  </p>
                </div>

                {/* Answer */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                    Your Answer
                  </h3>

                  <div className="mt-2 bg-[#020617] border border-gray-700 rounded-xl p-4">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {item.answer || "No answer recorded."}
                    </p>
                  </div>
                </div>

                {/* Feedback */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                    AI Feedback
                  </h3>

                  <div className="mt-2 bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {item.feedback || "No feedback available."}
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}