export default function InterviewHistory({
  history,
  onDelete,
  onClear,
}) {
  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">
          Interview History
        </h2>

        {history.length > 0 && (
          <button
            onClick={onClear}
            className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-xl text-white font-semibold"
          >
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-[#1E293B] border border-gray-700 rounded-2xl p-8 text-center text-gray-400">
          No interviews yet.
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item._id}
              className="bg-[#1E293B] border border-gray-700 rounded-2xl p-5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {item.role}
                  </h3>

                  <p className="text-gray-400 mt-2">
                    Difficulty: {item.difficulty}
                  </p>

                  <p className="text-green-400 mt-2 font-semibold">
                    Score: {item.score}/10
                  </p>

                  <p className="text-gray-500 text-sm mt-2">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => onDelete(item._id)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white"
                >
                  Delete
                </button>
              </div>

              <div className="mt-5">
                <h4 className="text-white font-semibold">
                  Question
                </h4>

                <p className="text-gray-300 mt-2">
                  {item.question}
                </p>
              </div>

              <div className="mt-5">
                <h4 className="text-white font-semibold">
                  AI Feedback
                </h4>

                <pre className="text-gray-300 whitespace-pre-wrap mt-2">
                  {item.feedback}
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}