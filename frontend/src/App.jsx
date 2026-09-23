import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import History from "./pages/History";
import Profile from "./pages/Profile";

import InterviewerSelection from "./pages/InterviewerSelection";
import InterviewSetup from "./pages/InterviewSetup";
import Interview from "./pages/Interview";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/history" element={<History />} />

        <Route path="/profile" element={<Profile />} />

        <Route
          path="/interviewer-selection"
          element={<InterviewerSelection />}
        />

        <Route
          path="/interview-setup"
          element={<InterviewSetup />}
        />

        <Route
          path="/interview"
          element={<Interview />}
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}
