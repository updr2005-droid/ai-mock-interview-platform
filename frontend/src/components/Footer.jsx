export default function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-800 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <div>
          <h2 className="text-2xl font-bold text-blue-500">
            AI Mock Interview
          </h2>

          <p className="mt-2 text-slate-400">
            Practice. Improve. Get Hired.
          </p>
        </div>

        <div className="flex gap-5 text-slate-400">
          <span>GitHub</span>
          <span>LinkedIn</span>
          <span>Email</span>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-slate-500">
        © 2026 AI Mock Interview Platform. All rights reserved.
      </p>
    </footer>
  );
}