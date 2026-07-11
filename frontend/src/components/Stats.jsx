export default function Stats() {
  return (
    <section className="mt-20 grid gap-6 md:grid-cols-4">

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 hover:scale-105 transition duration-300">
        <h2 className="text-4xl font-bold text-blue-400">500+</h2>
        <p className="mt-2 text-slate-400">Interview Questions</p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 hover:scale-105 transition duration-300">
        <h2 className="text-4xl font-bold text-green-400">50+</h2>
        <p className="mt-2 text-slate-400">Job Roles</p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 hover:scale-105 transition duration-300">
        <h2 className="text-4xl font-bold text-yellow-400">95%</h2>
        <p className="mt-2 text-slate-400">Success Rate</p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 hover:scale-105 transition duration-300">
        <h2 className="text-4xl font-bold text-pink-400">24/7</h2>
        <p className="mt-2 text-slate-400">AI Support</p>
      </div>

    </section>
  );
}