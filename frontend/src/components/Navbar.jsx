import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Mic,
  History,
  User,
} from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  const links = [
    {
      name: "Home",
      path: "/",
      icon: Home,
    },
    {
      name: "Interview",
      path: "/interview",
      icon: Mic,
    },
    {
      name: "History",
      path: "/history",
      icon: History,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#111827]/90 backdrop-blur border-b border-gray-700">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        <Link
          to="/"
          className="text-2xl font-extrabold text-white"
        >
          AI <span className="text-blue-400">Interview</span>
        </Link>


        <div className="flex gap-3">
          {links.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                  location.pathname === item.path
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </div>

      </div>
    </nav>
  );
}