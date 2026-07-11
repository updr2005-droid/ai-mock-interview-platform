import Navbar from "../components/common/Navbar";

export default function MainLayout({ children }) {
  return (
   <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

  {/* Background Glow */}
  <div className="absolute -top-40 left-0 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl"></div>

  <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl"></div>

  <Navbar />

  <main className="relative mx-auto max-w-7xl px-6 py-10">
    {children}
  </main>

</div>
  );
}