import MainLayout from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import {
  User,
  Mail,
  GraduationCap,
  Briefcase,
  FileText,
  Pencil,
  X,
  Save,
  Upload,
  Trash2,
  Eye,
  LogOut,
  Lock,
  Mic,
  Check,
  Trophy,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DEFAULT_PROFILE = {
  name: "Dhruv Upadhyay",
  email: "dhruv@example.com",
  education: "BCA Student",
  role: "Aspiring AI & Full Stack Developer",
  preferredRole: "Full Stack Developer",
  difficulty: "Medium",
  interviewer: "Maya",
  voiceEnabled: true,
  profilePicture: "",
};

export default function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [editProfile, setEditProfile] = useState(DEFAULT_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [showPicture, setShowPicture] = useState(false);
  const [message, setMessage] = useState("");

  // =========================
  // LOAD PROFILE
  // =========================
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("profile");

      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);

        const mergedProfile = {
          ...DEFAULT_PROFILE,
          ...parsed,
        };

        setProfile(mergedProfile);
        setEditProfile(mergedProfile);
      } else {
        localStorage.setItem(
          "profile",
          JSON.stringify(DEFAULT_PROFILE)
        );
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  }, []);

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // PROFILE PICTURE UPLOAD
  // =========================
  const handleProfilePicture = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image.");
      return;
    }

    // 5 MB limit
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image size should be less than 5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = reader.result;

      setEditProfile((prev) => ({
        ...prev,
        profilePicture: imageData,
      }));

      setMessage("Profile picture selected.");
    };

    reader.onerror = () => {
      setMessage("Failed to load image.");
    };

    reader.readAsDataURL(file);
  };

  // =========================
  // REMOVE PROFILE PICTURE
  // =========================
  const removeProfilePicture = () => {
    setEditProfile((prev) => ({
      ...prev,
      profilePicture: "",
    }));

    setMessage("Profile picture removed.");
  };

  // =========================
  // SAVE PROFILE
  // =========================
  const saveProfile = () => {
    try {
      localStorage.setItem(
        "profile",
        JSON.stringify(editProfile)
      );

      setProfile(editProfile);
      setIsEditing(false);

      setMessage("Profile updated successfully.");

      setTimeout(() => {
        setMessage("");
      }, 2500);
    } catch (error) {
      console.error("Error saving profile:", error);

      if (error.name === "QuotaExceededError") {
        setMessage(
          "Image is too large. Please choose a smaller image."
        );
      } else {
        setMessage("Failed to save profile.");
      }
    }
  };

  // =========================
  // CANCEL EDIT
  // =========================
  const cancelEdit = () => {
    setEditProfile(profile);
    setIsEditing(false);
    setMessage("");
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("interviewData");

    navigate("/login");
  };

  // =========================
  // AVATAR
  // =========================
  const Avatar = ({ size = "large", editable = false }) => {
    const sizeClass =
      size === "small"
        ? "w-12 h-12"
        : size === "medium"
        ? "w-20 h-20"
        : "w-32 h-32";

    return (
      <div className="relative inline-block">
        {profile.profilePicture ? (
          <img
            src={profile.profilePicture}
            alt={profile.name}
            className={`${sizeClass} rounded-full object-cover border-4 border-cyan-500/40 shadow-xl`}
          />
        ) : (
          <div
            className={`${sizeClass} rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center border-4 border-cyan-500/30 shadow-xl`}
          >
            <User
              className={
                size === "small"
                  ? "w-6 h-6"
                  : size === "medium"
                  ? "w-10 h-10"
                  : "w-16 h-16"
              }
            />
          </div>
        )}

        {editable && isEditing && (
          <label
            htmlFor="profile-picture"
            className="absolute bottom-0 right-0 bg-cyan-500 hover:bg-cyan-400 text-white p-2.5 rounded-full cursor-pointer shadow-lg transition"
            title="Change profile picture"
          >
            <Upload size={18} />

            <input
              id="profile-picture"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePicture}
            />
          </label>
        )}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">

        {/* =========================
            HEADER
        ========================== */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              My Profile
            </h1>

            <p className="text-gray-400 mt-2">
              Manage your profile and interview preferences
            </p>
          </div>

          {!isEditing ? (
            <button
              onClick={() => {
                setEditProfile(profile);
                setIsEditing(true);
              }}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold transition"
            >
              <Pencil size={18} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">

              <button
                onClick={cancelEdit}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-semibold transition"
              >
                <X size={18} />
                Cancel
              </button>

              <button
                onClick={saveProfile}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-500 hover:bg-green-400 text-white font-semibold transition"
              >
                <Save size={18} />
                Save
              </button>

            </div>
          )}
        </div>

        {/* =========================
            SUCCESS MESSAGE
        ========================== */}
        {message && (
          <div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-5 py-3 rounded-xl">
            {message}
          </div>
        )}

        {/* =========================
            PROFILE HEADER CARD
        ========================== */}
        <div className="bg-[#111827] border border-gray-700 rounded-3xl p-6 md:p-8">

          <div className="flex flex-col md:flex-row items-center md:items-start gap-7">

            {/* PROFILE IMAGE */}
            <div className="flex flex-col items-center">

              {isEditing ? (
                editProfile.profilePicture ? (
                  <div className="relative inline-block">

                    <img
                      src={editProfile.profilePicture}
                      alt={editProfile.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-cyan-500/40 shadow-xl"
                    />

                    <label
                      htmlFor="profile-picture-edit"
                      className="absolute bottom-0 right-0 bg-cyan-500 hover:bg-cyan-400 p-2.5 rounded-full cursor-pointer"
                    >
                      <Upload size={18} />

                      <input
                        id="profile-picture-edit"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePicture}
                      />
                    </label>

                  </div>
                ) : (
                  <div className="relative">

                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center border-4 border-cyan-500/30">
                      <User className="w-16 h-16 text-white" />
                    </div>

                    <label
                      htmlFor="profile-picture-edit"
                      className="absolute bottom-0 right-0 bg-cyan-500 hover:bg-cyan-400 p-2.5 rounded-full cursor-pointer"
                    >
                      <Upload size={18} />

                      <input
                        id="profile-picture-edit"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePicture}
                      />
                    </label>

                  </div>
                )
              ) : (
                <Avatar size="large" />
              )}

              {/* IMAGE BUTTONS */}
              {isEditing && editProfile.profilePicture && (
                <div className="flex gap-2 mt-4">

                  <button
                    onClick={() => setShowPicture(true)}
                    className="flex items-center gap-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
                  >
                    <Eye size={15} />
                    View
                  </button>

                  <button
                    onClick={removeProfilePicture}
                    className="flex items-center gap-1 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm"
                  >
                    <Trash2 size={15} />
                    Remove
                  </button>

                </div>
              )}
            </div>

            {/* PROFILE BASIC INFO */}
            <div className="text-center md:text-left flex-1">

              {!isEditing ? (
                <>
                  <h2 className="text-3xl font-bold text-white">
                    {profile.name}
                  </h2>

                  <p className="text-cyan-400 mt-1">
                    {profile.role}
                  </p>

                  <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">

                    <span className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg text-gray-300 text-sm">
                      <Mail size={15} />
                      {profile.email}
                    </span>

                    <span className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg text-gray-300 text-sm">
                      <GraduationCap size={15} />
                      {profile.education}
                    </span>

                  </div>
                </>
              ) : (
                <div className="space-y-4">

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={editProfile.name}
                      onChange={handleChange}
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={editProfile.email}
                      onChange={handleChange}
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none"
                    />
                  </div>

                </div>
              )}

            </div>
          </div>
        </div>

        {/* =========================
            PERSONAL INFORMATION
        ========================== */}
        <div className="bg-[#111827] border border-gray-700 rounded-3xl p-6 md:p-8">

          <div className="flex items-center gap-3 mb-6">

            <div className="p-3 bg-cyan-500/10 rounded-xl">
              <User className="text-cyan-400" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Personal Information
              </h2>

              <p className="text-sm text-gray-400">
                Your academic and professional information
              </p>
            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-6">

            {/* EDUCATION */}
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <GraduationCap size={16} />
                Education
              </label>

              {isEditing ? (
                <input
                  type="text"
                  name="education"
                  value={editProfile.education}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
                />
              ) : (
                <div className="bg-gray-900 rounded-xl px-4 py-3 text-white">
                  {profile.education}
                </div>
              )}
            </div>

            {/* CURRENT ROLE */}
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <Briefcase size={16} />
                Current Role
              </label>

              {isEditing ? (
                <input
                  type="text"
                  name="role"
                  value={editProfile.role}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
                />
              ) : (
                <div className="bg-gray-900 rounded-xl px-4 py-3 text-white">
                  {profile.role}
                </div>
              )}
            </div>

            {/* PREFERRED ROLE */}
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <Briefcase size={16} />
                Preferred Interview Role
              </label>

              {isEditing ? (
                <input
                  type="text"
                  name="preferredRole"
                  value={editProfile.preferredRole}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
                />
              ) : (
                <div className="bg-gray-900 rounded-xl px-4 py-3 text-white">
                  {profile.preferredRole}
                </div>
              )}
            </div>

            {/* DIFFICULTY */}
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <Trophy size={16} />
                Interview Difficulty
              </label>

              {isEditing ? (
                <select
                  name="difficulty"
                  value={editProfile.difficulty}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              ) : (
                <div className="bg-gray-900 rounded-xl px-4 py-3 text-white">
                  {profile.difficulty}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* =========================
            INTERVIEW PREFERENCES
        ========================== */}
        <div className="bg-[#111827] border border-gray-700 rounded-3xl p-6 md:p-8">

          <div className="flex items-center gap-3 mb-6">

            <div className="p-3 bg-purple-500/10 rounded-xl">
              <Mic className="text-purple-400" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Interview Preferences
              </h2>

              <p className="text-sm text-gray-400">
                Customize your mock interview experience
              </p>
            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-6">

            {/* INTERVIEWER */}
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <Star size={16} />
                Preferred Interviewer
              </label>

              {isEditing ? (
                <select
                  name="interviewer"
                  value={editProfile.interviewer}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
                >
                  <option value="Maya">Maya - HR</option>
                  <option value="Ethan">Ethan - Technical</option>
                  <option value="Sophia">Sophia - Data</option>
                  <option value="James">James - Corporate</option>
                </select>
              ) : (
                <div className="bg-gray-900 rounded-xl px-4 py-3 text-white">
                  {profile.interviewer}
                </div>
              )}
            </div>

            {/* VOICE */}
            <div>

              <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <Mic size={16} />
                AI Voice
              </label>

              {isEditing ? (
                <button
                  type="button"
                  onClick={() =>
                    setEditProfile((prev) => ({
                      ...prev,
                      voiceEnabled: !prev.voiceEnabled,
                    }))
                  }
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition ${
                    editProfile.voiceEnabled
                      ? "bg-green-500/10 border-green-500/40 text-green-400"
                      : "bg-gray-900 border-gray-700 text-gray-400"
                  }`}
                >
                  <span>
                    {editProfile.voiceEnabled
                      ? "Voice Enabled"
                      : "Voice Disabled"}
                  </span>

                  {editProfile.voiceEnabled && (
                    <Check size={18} />
                  )}
                </button>
              ) : (
                <div
                  className={`rounded-xl px-4 py-3 ${
                    profile.voiceEnabled
                      ? "bg-green-500/10 text-green-400"
                      : "bg-gray-900 text-gray-400"
                  }`}
                >
                  {profile.voiceEnabled
                    ? "Voice Enabled"
                    : "Voice Disabled"}
                </div>
              )}

            </div>

          </div>
        </div>

        {/* =========================
            RESUME / DOCUMENT
        ========================== */}
        <div className="bg-[#111827] border border-gray-700 rounded-3xl p-6 md:p-8">

          <div className="flex items-center gap-3">

            <div className="p-3 bg-orange-500/10 rounded-xl">
              <FileText className="text-orange-400" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Interview Profile
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                Your information is used to personalize AI interview questions.
              </p>
            </div>

          </div>

          <div className="mt-6 bg-gray-900 border border-gray-700 rounded-2xl p-5">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>
                <p className="text-white font-semibold">
                  Resume-based Interview
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  Questions will be generated according to your selected role
                  and uploaded resume.
                </p>
              </div>

              <button
                onClick={() => navigate("/interview-setup")}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold transition"
              >
                <FileText size={18} />
                Interview Setup
              </button>

            </div>
          </div>
        </div>

        {/* =========================
            ACCOUNT
        ========================== */}
        <div className="bg-[#111827] border border-gray-700 rounded-3xl p-6 md:p-8">

          <div className="flex items-center gap-3 mb-6">

            <div className="p-3 bg-red-500/10 rounded-xl">
              <Lock className="text-red-400" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Account
              </h2>

              <p className="text-gray-400 text-sm">
                Manage your account
              </p>
            </div>

          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>
      </div>

      {/* =========================
          IMAGE PREVIEW MODAL
      ========================== */}
      {showPicture && profile.profilePicture && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-5"
          onClick={() => setShowPicture(false)}
        >
          <div
            className="relative max-w-2xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >

            <img
              src={profile.profilePicture}
              alt={profile.name}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />

            <button
              onClick={() => setShowPicture(false)}
              className="absolute -top-4 -right-4 bg-red-500 hover:bg-red-400 text-white rounded-full p-2"
            >
              <X size={20} />
            </button>

          </div>
        </div>
      )}
    </MainLayout>
  );
}