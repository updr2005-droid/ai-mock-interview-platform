import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Mic,
  History,
  User,
} from "lucide-react";

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* NAVBAR */}
      <header className="w-full border-b border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">

          <div className="h-20 flex items-center justify-between">

            {/* LOGO */}
            <button
              onClick={() => navigate("/")}
              className="text-xl font-bold"
            >
              AI Mock Interview
            </button>

            {/* NAVIGATION */}
            <nav className="flex items-center gap-2">

              {/* HOME */}
              <button
                onClick={() => navigate("/")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  location.pathname === "/"
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <Home size={18} />
                Home
              </button>

              {/* INTERVIEW */}
              <button
                onClick={() => navigate("/interviewer-selection")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  location.pathname.startsWith("/interview") ||
                  location.pathname === "/interviewer-selection"
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <Mic size={18} />
                Interview
              </button>

              {/* HISTORY */}
              <button
                onClick={() => navigate("/history")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  location.pathname === "/history"
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <History size={18} />
                History
              </button>

              {/* PROFILE */}
              <button
                onClick={() => navigate("/profile")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  location.pathname === "/profile"
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <User size={18} />
                Profile
              </button>

            </nav>

            {/* START INTERVIEW */}
            <button
              onClick={() => navigate("/interviewer-selection")}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold"
            >
              Start Interview
            </button>

          </div>

        </div>
      </header>

      {/* PAGE CONTENT */}
      <main>
        {children}
      </main>

    </div>
  );
}