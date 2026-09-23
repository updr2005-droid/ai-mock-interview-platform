import { interviewers } from "../data/interviewers";

export default function ChooseInterviewer({ onSelect }) {
  return (
    <div className="grid md:grid-cols-2 gap-6 my-8">
      {interviewers.map((person) => (
        <div
          key={person.id}
          className="bg-[#1E293B] border border-gray-700 rounded-2xl p-6 hover:border-blue-500 transition cursor-pointer"
          onClick={() => onSelect(person)}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
              style={{ background: person.color }}
            >
              {person.name[0]}
            </div>

            <div>
              <h2 className="text-white text-xl font-bold">
                {person.name}
              </h2>

              <p className="text-blue-400">
                {person.role}
              </p>

              <p className="text-gray-400 text-sm mt-1">
                {person.description}
              </p>
            </div>
          </div>

          <button
  type="button"
  onClick={(e) => {
    e.stopPropagation();
    onSelect(person);
  }}
  className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
>
  Select Interviewer
</button>

        </div>
      ))}
    </div>
  );
}