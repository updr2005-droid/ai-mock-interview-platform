import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Hero from "../components/hero/Hero";
import Stats from "../components/Stats";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

export default function Home() {
  const navigate = useNavigate();

  // =========================================================
  // PROFILE STATE
  // =========================================================

  const [profile, setProfile] = useState({
    name: "Dhruv Upadhyay",
    profilePicture: "",
    education: "",
    role: "",
    preferredRole: "",
  });

  // =========================================================
  // LOAD PROFILE FROM LOCAL STORAGE
  // =========================================================

  useEffect(() => {
    const loadProfile = () => {
      try {
        const savedProfile = localStorage.getItem("profile");

        if (savedProfile) {
          const parsedProfile = JSON.parse(savedProfile);

          setProfile((prev) => ({
            ...prev,
            ...parsedProfile,
          }));
        }
      } catch (error) {
        console.error("Unable to load profile:", error);
      }
    };

    // Load profile when Home opens
    loadProfile();

    // Listen for profile updates
    window.addEventListener("profileUpdated", loadProfile);

    return () => {
      window.removeEventListener("profileUpdated", loadProfile);
    };
  }, []);

  // =========================================================
  // PROFILE DATA
  // =========================================================

  const userName =
    profile?.name?.trim() || "Candidate";

  const profilePicture =
    profile?.profilePicture || "";

  const firstName =
    userName.split(" ")[0] || "Candidate";

  // =========================================================
  // UI
  // =========================================================

  return (
    <MainLayout>

      {/* =====================================================
          WELCOME SECTION
      ====================================================== */}

      <section className="relative overflow-hidden bg-gray-950 px-6 pt-8 pb-12">

        {/* Background Glow */}

        <div className="absolute top-0 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto">

          <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800 border border-gray-800 rounded-3xl p-7 md:p-10 shadow-2xl">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">

              {/* ================= LEFT ================= */}

              <div className="flex-1">

                {/* Badge */}

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-5">

                  <span>✨</span>

                  <span>AI Career Copilot</span>

                </div>

                {/* Profile + Heading */}

                <div className="flex items-center gap-4">

                  {/* Profile Picture */}

                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-blue-400/50 shadow-lg flex-shrink-0">

                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        alt={userName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl md:text-3xl font-bold text-white">
                        {firstName.charAt(0).toUpperCase()}
                      </span>
                    )}

                  </div>

                  <div>

                    <p className="text-gray-400 text-sm mb-1">
                      Welcome back
                    </p>

                    <h1 className="text-3xl md:text-4xl font-bold text-white">

                      {userName}

                      <span className="ml-2">
                        👋
                      </span>

                    </h1>

                  </div>

                </div>

                {/* Description */}

                <p className="text-gray-400 mt-5 max-w-2xl text-base md:text-lg leading-relaxed">

                  Ready to improve your interview skills and get closer to
                  your dream job? Your AI-powered interview journey starts here.

                </p>

                {/* Profile Info */}

                {(profile.education ||
                  profile.role ||
                  profile.preferredRole) && (

                  <div className="flex flex-wrap gap-3 mt-5">

                    {profile.education && (
                      <div className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-sm text-gray-300">
                        🎓 {profile.education}
                      </div>
                    )}

                    {profile.role && (
                      <div className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-sm text-gray-300">
                        💼 {profile.role}
                      </div>
                    )}

                    {profile.preferredRole && (
                      <div className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-sm text-gray-300">
                        🎯 {profile.preferredRole}
                      </div>
                    )}

                  </div>

                )}

                {/* Highlights */}

                <div className="flex flex-wrap gap-3 mt-5">

                  <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm">
                    🎤 Practice with AI
                  </div>

                  <div className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm">
                    📈 Track Progress
                  </div>

                  <div className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                    🚀 Build Confidence
                  </div>

                </div>

              </div>

              {/* ================= RIGHT CTA ================= */}

              <div className="flex flex-col gap-3 min-w-[220px]">

                <button
                  onClick={() =>
                    navigate("history")
                  }
                  className="px-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 hover:scale-[1.02]"
                >
                
                  📊 View My Progress
                </button>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          HERO
      ====================================================== */}

      <Hero />


      {/* =====================================================
          QUICK NAVIGATION
      ====================================================== */}

      <section className="bg-gray-950 px-6 py-10">

        <div className="max-w-6xl mx-auto">

          {/* Heading */}

          <div className="mb-7">

            <h2 className="text-2xl md:text-3xl font-bold text-white">
              What would you like to do? 🚀
            </h2>

            <p className="text-gray-400 mt-2">
              Choose an option and continue your career preparation.
            </p>

          </div>


          {/* Cards */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">


            {/* =================================================
                START INTERVIEW
            ================================================= */}

            <button
              onClick={() =>
                navigate("/interviewer-selection")
              }
              className="group p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-blue-500 hover:bg-gray-800 transition-all text-left hover:-translate-y-1"
            >

              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">
                🎤
              </div>

              <h3 className="text-lg font-bold text-white">
                Start Interview
              </h3>

              <p className="text-sm text-gray-400 mt-2">
                Choose an AI interviewer and start your mock interview.
              </p>

              <div className="text-blue-400 text-sm font-semibold mt-5">
                Start now →
              </div>

            </button>


            {/* =================================================
                HISTORY
            ================================================= */}

            <button
              onClick={() =>
                navigate("/history")
              }
              className="group p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-purple-500 hover:bg-gray-800 transition-all text-left hover:-translate-y-1"
            >

              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">
                📊
              </div>

              <h3 className="text-lg font-bold text-white">
                Interview History
              </h3>

              <p className="text-sm text-gray-400 mt-2">
                Check your previous interviews, scores and feedback.
              </p>

              <div className="text-purple-400 text-sm font-semibold mt-5">
                View history →
              </div>

            </button>


            {/* =================================================
                PROFILE
            ================================================= */}

            <button
              onClick={() =>
                navigate("/profile")
              }
              className="group p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-green-500 hover:bg-gray-800 transition-all text-left hover:-translate-y-1"
            >

              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">
                👤
              </div>

              <h3 className="text-lg font-bold text-white">
                My Profile
              </h3>

              <p className="text-sm text-gray-400 mt-2">
                View and manage your candidate profile.
              </p>

              <div className="text-green-400 text-sm font-semibold mt-5">
                Manage profile →
              </div>

            </button>


            {/* =================================================
                ACCOUNT
            ================================================= */}

            <button
              onClick={() =>
                navigate("/login")
              }
              className="group p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-yellow-500 hover:bg-gray-800 transition-all text-left hover:-translate-y-1"
            >

              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">
                🔐
              </div>

              <h3 className="text-lg font-bold text-white">
                Account
              </h3>

              <p className="text-sm text-gray-400 mt-2">
                Manage your account and interview data.
              </p>

              <div className="text-yellow-400 text-sm font-semibold mt-5">
                Open account →
              </div>

            </button>

          </div>

        </div>

      </section>


      {/* =====================================================
          STATS
      ====================================================== */}

      <Stats />


      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}

      <HowItWorks />


      {/* =====================================================
          FEATURES
      ====================================================== */}

      <Features />


      {/* =====================================================
          TESTIMONIALS
      ====================================================== */}

      <Testimonials />


      {/* =====================================================
          FOOTER
      ====================================================== */}

      <Footer />

    </MainLayout>
  );
}