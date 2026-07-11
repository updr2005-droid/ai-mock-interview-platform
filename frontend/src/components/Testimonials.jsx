import { Star } from "lucide-react";

const reviews = [
  {
    name: "Rahul Sharma",
    role: "Software Engineer",
    review:
      "This platform helped me prepare for technical interviews with confidence.",
  },
  {
    name: "Priya Verma",
    role: "Frontend Developer",
    review:
      "The AI feedback was detailed and helped me improve my answers.",
  },
  {
    name: "Aman Gupta",
    role: "Data Analyst",
    review:
      "Resume analysis and personalized questions were incredibly useful.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24">
      <div className="text-center">
        <h2 className="text-4xl font-bold">What Users Say</h2>
        <p className="mt-4 text-slate-400">
          Trusted by students and professionals.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="rounded-3xl border border-slate-800 bg-slate-900 p-8 transition hover:-translate-y-2 hover:border-blue-500"
          >
            <div className="mb-4 flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  fill="#facc15"
                  className="text-yellow-400"
                />
              ))}
            </div>

            <p className="text-slate-300 italic">
              "{review.review}"
            </p>

            <div className="mt-6">
              <h3 className="font-bold">{review.name}</h3>
              <p className="text-sm text-slate-500">{review.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}