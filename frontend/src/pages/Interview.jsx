
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";

import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  User,
  Loader2,
  Trophy,
  Volume2,
  RotateCcw,
  Clock,
} from "lucide-react";

// ======================================================
// INTERVIEWER CONFIG
// ======================================================

const INTERVIEWERS = {
  maya: {
    name: "Maya",
    role: "HR Interviewer",
    avatar:
      "https://api.dicebear.com/9.x/avataaars/svg?seed=Maya&backgroundColor=b6e3f4",
  },

  ethan: {
    name: "Ethan",
    role: "Technical Interviewer",
    avatar:
      "https://api.dicebear.com/9.x/avataaars/svg?seed=Ethan&backgroundColor=c0aede",
  },

  sophia: {
    name: "Sophia",
    role: "Data Interviewer",
    avatar:
      "https://api.dicebear.com/9.x/avataaars/svg?seed=Sophia&backgroundColor=ffd5dc",
  },

  james: {
    name: "James",
    role: "Corporate Interviewer",
    avatar:
      "https://api.dicebear.com/9.x/avataaars/svg?seed=James&backgroundColor=d1d4f9",
  },
};

// ======================================================
// NORMALIZE INTERVIEWER
// ======================================================

const normalizeInterviewer = (interviewer) => {
  if (!interviewer) return "maya";

  if (typeof interviewer === "object") {
    interviewer =
      interviewer.name ||
      interviewer.interviewer ||
      interviewer.label ||
      "Maya";
  }

  const value = String(interviewer).toLowerCase();

  if (value.includes("ethan")) return "ethan";
  if (value.includes("sophia")) return "sophia";
  if (value.includes("james")) return "james";

  return "maya";
};

// ======================================================
// GET SAVED PROFILE
// ======================================================

const getSavedProfile = () => {
  try {
    const saved = localStorage.getItem("profile");

    if (!saved) return {};

    return JSON.parse(saved);
  } catch (error) {
    console.error("Profile loading error:", error);
    return {};
  }
};

export default function Interview() {
  const navigate = useNavigate();

  // ======================================================
  // STATE
  // ======================================================

  const [interviewData, setInterviewData] = useState(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [currentQuestion, setCurrentQuestion] = useState(1);

  const [answers, setAnswers] = useState([]);

  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  const [isCompleted, setIsCompleted] = useState(false);

  const [error, setError] = useState("");

  const [speaking, setSpeaking] = useState(false);

  const [recording, setRecording] = useState(false);

  const [elapsedTime, setElapsedTime] = useState(0);

  // ======================================================
  // PROFILE
  // ======================================================

  const [profile, setProfile] = useState(getSavedProfile());

  // ======================================================
  // REFS
  // ======================================================

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const timerRef = useRef(null);

  // ======================================================
  // LOAD INTERVIEW DATA
  // ======================================================

  useEffect(() => {
    try {
      const savedInterview =
        localStorage.getItem("interviewData");

      if (!savedInterview) {
        navigate("/interviewer-selection");
        return;
      }

      const parsed = JSON.parse(savedInterview);

      setInterviewData(parsed);

      // Refresh profile data
      setProfile(getSavedProfile());
    } catch (err) {
      console.error("Interview data error:", err);
      navigate("/interviewer-selection");
    }
  }, [navigate]);

  // ======================================================
  // INTERVIEWER
  // ======================================================

  const interviewerKey = useMemo(() => {
    return normalizeInterviewer(
      interviewData?.interviewer || profile?.interviewer
    );
  }, [interviewData, profile]);

  const interviewer =
    INTERVIEWERS[interviewerKey] || INTERVIEWERS.maya;

  // ======================================================
  // USER DATA
  // ======================================================

  const candidateName =
    interviewData?.candidateName ||
    profile?.name ||
    "Candidate";

  const userAvatar =
    profile?.profilePicture ||
    "";

  const role =
    interviewData?.role ||
    profile?.preferredRole ||
    "General Interview";

  const difficulty =
    interviewData?.difficulty ||
    profile?.difficulty ||
    "Medium";

  const resumeText =
    interviewData?.resumeText ||
    "";

  const totalQuestions =
    Number(interviewData?.questionCount) || 5;

  // ======================================================
  // TIMER
  // ======================================================

  useEffect(() => {
    if (isCompleted) {
      clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isCompleted]);

  // ======================================================
  // FORMAT TIME
  // ======================================================

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(mins).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
  };

  // ======================================================
  // GENERATE QUESTION
  // ======================================================

  const generateQuestion = async (questionNumber) => {
    try {
      setLoadingQuestion(true);
      setError("");
      setQuestion("");
      setAnswer("");

      const previousAnswers = answers.map((item) => ({
        question: item.question,
        answer: item.answer,
        score: item.score,
        feedback: item.feedback,
      }));

      const response = await axios.post(
        "http://localhost:5000/question",
        {
          role,
          difficulty,
          resumeText,
          candidateName,

          questionNumber,

          previousAnswers,

          previousQuestions: answers.map(
            (item) => item.question
          ),

          interviewer: interviewer.name,
        }
      );

      const generatedQuestion =
        response?.data?.question ||
        response?.data?.text ||
        response?.data?.message ||
        "";

      if (!generatedQuestion) {
        throw new Error("No question received from server.");
      }

      setQuestion(generatedQuestion.trim());

      // Automatically speak question
      if (profile?.voiceEnabled !== false) {
        setTimeout(() => {
          speakQuestion(generatedQuestion.trim());
        }, 300);
      }
    } catch (err) {
      console.error("Question generation error:", err);

      setError(
        err?.response?.data?.error ||
          "Unable to generate the question. Please try again."
      );
    } finally {
      setLoadingQuestion(false);
    }
  };

  // ======================================================
  // START INTERVIEW
  // ======================================================

  useEffect(() => {
    if (!interviewData) return;

    if (question || loadingQuestion || answers.length > 0) {
      return;
    }

    generateQuestion(1);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewData]);

  // ======================================================
  // SPEAK QUESTION - ELEVENLABS
  // ======================================================

  const speakQuestion = async (text) => {
    if (!text) return;

    try {
      setSpeaking(true);

      const response = await axios.post(
        "http://localhost:5000/speak",
        {
          text,
          interviewer: interviewer.name,
        },
        {
          responseType: "blob",
        }
      );

      const audioBlob = response.data;

      if (!audioBlob || audioBlob.size === 0) {
        throw new Error("Empty audio received.");
      }

      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);

      audio.onended = () => {
        setSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (err) {
      console.error("Voice error:", err);
      setSpeaking(false);
    }
  };

  // ======================================================
  // MICROPHONE
  // ======================================================

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError(
          "Microphone is not supported in this browser."
        );
        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      const recorder = new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      };

      recorder.start();

      setRecording(true);
      setError("");
    } catch (err) {
      console.error("Microphone error:", err);

      setError(
        "Microphone permission denied. Please allow microphone access."
      );
    }
  };

  const stopRecording = () => {
    try {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }

      setRecording(false);
    } catch (err) {
      console.error(err);
      setRecording(false);
    }
  };

  const toggleRecording = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // ======================================================
  // SUBMIT ANSWER
  // ======================================================

  const submitAnswer = async () => {
    if (!answer.trim()) {
      setError("Please enter your answer before submitting.");
      return;
    }

    if (answer.trim().length < 3) {
      setError("Please provide a meaningful answer.");
      return;
    }

    try {
      setSubmittingAnswer(true);
      setError("");

      const response = await axios.post(
        "http://localhost:5000/evaluate",
        {
          question,
          answer: answer.trim(),

          role,
          difficulty,

          resumeText,

          candidateName,

          interviewer: interviewer.name,
        }
      );

      const result = response.data || {};

      const score =
        Number(result.score) ||
        0;

      const feedback =
        result.feedback ||
        "No feedback available.";

      const newAnswer = {
        question,
        answer: answer.trim(),
        score,
        feedback,
      };

      setAnswers((prev) => [
        ...prev,
        newAnswer,
      ]);

    } catch (err) {
      console.error("Answer evaluation error:", err);

      setError(
        err?.response?.data?.error ||
          "Unable to evaluate your answer. Please try again."
      );
    } finally {
      setSubmittingAnswer(false);
    }
  };

  // ======================================================
  // CHECK WHETHER CURRENT QUESTION IS ANSWERED
  // ======================================================

  const currentAnswerResult =
    answers.length >= currentQuestion
      ? answers[currentQuestion - 1]
      : null;

  // ======================================================
  // NEXT QUESTION
  // ======================================================

  const goToNextQuestion = async () => {
    if (!currentAnswerResult) {
      setError(
        "Please submit your answer before moving to the next question."
      );
      return;
    }

    if (currentQuestion >= totalQuestions) {
      finishInterview();
      return;
    }

    const nextNumber = currentQuestion + 1;

    setCurrentQuestion(nextNumber);

    await generateQuestion(nextNumber);
  };

  // ======================================================
  // FINISH INTERVIEW
  // ======================================================

  const finishInterview = () => {
    clearInterval(timerRef.current);

    setIsCompleted(true);

    try {
      localStorage.setItem(
        "lastInterviewResult",
        JSON.stringify({
          candidateName,
          role,
          difficulty,
          interviewer: interviewer.name,
          answers,
          totalQuestions,
          elapsedTime,
          completedAt: new Date().toISOString(),
        })
      );
    } catch (err) {
      console.error("Result save error:", err);
    }
  };

  // ======================================================
  // RESTART
  // ======================================================

  const restartInterview = () => {
    setQuestion("");
    setAnswer("");
    setAnswers([]);
    setCurrentQuestion(1);
    setIsCompleted(false);
    setError("");
    setElapsedTime(0);

    generateQuestion(1);
  };

  // ======================================================
  // TOTAL SCORE
  // ======================================================

  const totalScore = useMemo(() => {
    if (!answers.length) return 0;

    const sum = answers.reduce(
      (total, item) => total + Number(item.score || 0),
      0
    );

    return (sum / answers.length).toFixed(1);
  }, [answers]);

  // ======================================================
  // SCORE MESSAGE
  // ======================================================

  const getScoreMessage = () => {
    const score = Number(totalScore);

    if (score >= 9) {
      return "Outstanding performance! 🎉";
    }

    if (score >= 8) {
      return "Excellent performance! 🚀";
    }

    if (score >= 7) {
      return "Good job! Keep improving. 💪";
    }

    if (score >= 5) {
      return "Good attempt. More practice will help. 📚";
    }

    return "Keep practicing. You can improve! 🔥";
  };

  // ======================================================
  // LOADING SCREEN
  // ======================================================

  if (!interviewData) {
    return (
      <MainLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  // ======================================================
  // COMPLETED SCREEN
  // ======================================================

  if (isCompleted) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto py-10 px-4">

          <div className="bg-[#111827] border border-gray-700 rounded-3xl p-8 md:p-12 text-center">

            <div className="mx-auto w-24 h-24 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
              <Trophy className="w-12 h-12 text-yellow-400" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mt-6">
              Interview Completed!
            </h1>

            <p className="text-gray-400 mt-3">
              Great work, {candidateName}.
            </p>

            {/* SCORE */}
            <div className="mt-8 bg-gray-900 rounded-2xl p-8">

              <p className="text-gray-400 text-sm">
                Overall Score
              </p>

              <div className="text-6xl font-bold text-cyan-400 mt-2">
                {totalScore}
                <span className="text-2xl text-gray-500">
                  /10
                </span>
              </div>

              <p className="text-cyan-300 mt-3">
                {getScoreMessage()}
              </p>

            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">

              <div className="bg-gray-900 rounded-xl p-5">
                <p className="text-gray-400 text-sm">
                  Questions
                </p>

                <p className="text-white text-2xl font-bold mt-1">
                  {answers.length}
                </p>
              </div>

              <div className="bg-gray-900 rounded-xl p-5">
                <p className="text-gray-400 text-sm">
                  Interviewer
                </p>

                <p className="text-white text-lg font-bold mt-1">
                  {interviewer.name}
                </p>
              </div>

              <div className="bg-gray-900 rounded-xl p-5 col-span-2 md:col-span-1">
                <p className="text-gray-400 text-sm">
                  Duration
                </p>

                <p className="text-white text-2xl font-bold mt-1">
                  {formatTime(elapsedTime)}
                </p>
              </div>

            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">

              <button
                onClick={restartInterview}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold transition"
              >
                <RotateCcw size={18} />
                Practice Again
              </button>

              <button
                onClick={() => navigate("/history")}
                className="px-6 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-semibold transition"
              >
                View History
              </button>

              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 rounded-xl border border-gray-700 hover:bg-gray-800 text-white font-semibold transition"
              >
                Dashboard
              </button>

            </div>

          </div>

        </div>
      </MainLayout>
    );
  }

  // ======================================================
  // MAIN INTERVIEW UI
  // ======================================================

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* ================================================
            TOP BAR
        ================================================= */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <button
            onClick={() => navigate("/interviewer-selection")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition w-fit"
          >
            <ArrowLeft size={18} />
            Exit Interview
          </button>

          <div className="flex items-center gap-3">

            <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 px-4 py-2 rounded-xl">
              <Clock size={16} className="text-cyan-400" />

              <span className="text-gray-300 text-sm">
                {formatTime(elapsedTime)}
              </span>
            </div>

            <div className="bg-gray-900 border border-gray-700 px-4 py-2 rounded-xl">

              <span className="text-gray-400 text-sm">
                Question{" "}
              </span>

              <span className="text-white font-semibold">
                {currentQuestion}
              </span>

              <span className="text-gray-500">
                /{totalQuestions}
              </span>

            </div>

          </div>
        </div>

        {/* ================================================
            PROGRESS BAR
        ================================================= */}

        <div className="mb-8">

          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Interview Progress</span>

            <span>
              {Math.round(
                ((currentQuestion - 1) /
                  totalQuestions) *
                  100
              )}
              %
            </span>
          </div>

          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">

            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
              style={{
                width: `${
                  ((currentQuestion - 1) /
                    totalQuestions) *
                  100
                }%`,
              }}
            />

          </div>
        </div>

        {/* ================================================
            INTERVIEWER CARD
        ================================================= */}

        <div className="bg-[#111827] border border-gray-700 rounded-3xl p-5 md:p-6 mb-6">

          <div className="flex items-center gap-4">

            {/* INTERVIEWER AVATAR */}

            <div className="relative flex-shrink-0">

              <img
                src={interviewer.avatar}
                alt={interviewer.name}
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-cyan-500/30 bg-gray-800"
              />

              {speaking && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-cyan-500 flex items-center justify-center animate-pulse">
                  <Volume2 size={14} />
                </div>
              )}

            </div>

            {/* INTERVIEWER INFO */}

            <div className="flex-1">

              <div className="flex flex-wrap items-center gap-2">

                <h2 className="text-xl font-bold text-white">
                  {interviewer.name}
                </h2>

                <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  AI Interviewer
                </span>

              </div>

              <p className="text-gray-400 text-sm mt-1">
                {interviewer.role}
              </p>

              <p className="text-gray-500 text-xs mt-1">
                Interviewing for:{" "}
                <span className="text-gray-300">
                  {role}
                </span>
              </p>

            </div>

            {/* SPEAK BUTTON */}

            <button
              onClick={() => speakQuestion(question)}
              disabled={
                !question ||
                speaking ||
                profile?.voiceEnabled === false
              }
              className="p-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Play question"
            >
              {speaking ? (
                <Loader2
                  size={20}
                  className="animate-spin"
                />
              ) : (
                <Volume2 size={20} />
              )}
            </button>

          </div>

        </div>

        {/* ================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-5 py-4">
            {error}
          </div>
        )}

        {/* ================================================
            QUESTION
        ================================================= */}

        <div className="bg-[#111827] border border-gray-700 rounded-3xl p-6 md:p-8 mb-6">

          <div className="flex items-start gap-4">

            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <Sparkles
                size={20}
                className="text-cyan-400"
              />
            </div>

            <div className="flex-1">

              <p className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-2">
                Question {currentQuestion}
              </p>

              {loadingQuestion ? (
                <div className="flex items-center gap-3 text-gray-400 py-4">

                  <Loader2
                    size={22}
                    className="animate-spin text-cyan-400"
                  />

                  <span>
                    {currentQuestion === 1
                      ? "Preparing your interview..."
                      : "Generating your next question..."}
                  </span>

                </div>
              ) : (
                <h1 className="text-xl md:text-2xl font-semibold text-white leading-relaxed">
                  {question}
                </h1>
              )}

            </div>

          </div>

        </div>

        {/* ================================================
            USER ANSWER
        ================================================= */}

        <div className="bg-[#111827] border border-gray-700 rounded-3xl p-6 md:p-8">

          <div className="flex items-center gap-4 mb-5">

            {/* USER AVATAR */}

            <div className="flex-shrink-0">

              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={candidateName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500/30"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center border-2 border-cyan-500/30">
                  <User size={22} />
                </div>
              )}

            </div>

            <div>
              <p className="text-white font-semibold">
                {candidateName}
              </p>

              <p className="text-gray-500 text-sm">
                Your answer
              </p>
            </div>

          </div>

          <textarea
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setError("");
            }}
            disabled={
              submittingAnswer ||
              loadingQuestion ||
              !!currentAnswerResult
            }
            placeholder="Type your answer here..."
            rows={7}
            className="w-full resize-none bg-gray-900 border border-gray-700 rounded-2xl p-5 text-white placeholder-gray-500 outline-none focus:border-cyan-500 transition disabled:opacity-60"
          />

          {/* RECORD BUTTON */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">

            <button
              onClick={toggleRecording}
              disabled={
                submittingAnswer ||
                loadingQuestion ||
                !!currentAnswerResult
              }
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition ${
                recording
                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                  : "bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800"
              }`}
            >
              {recording ? (
                <>
                  <MicOff size={18} />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic size={18} />
                  Use Microphone
                </>
              )}
            </button>

            {/* SUBMIT */}

            {!currentAnswerResult && (
              <button
                onClick={submitAnswer}
                disabled={
                  submittingAnswer ||
                  loadingQuestion ||
                  !answer.trim()
                }
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold transition"
              >
                {submittingAnswer ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Evaluating...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Answer
                  </>
                )}
              </button>
            )}

          </div>

        </div>

        {/* ================================================
            FEEDBACK
        ================================================= */}

        {currentAnswerResult && (
          <div className="mt-6 bg-[#111827] border border-green-500/20 rounded-3xl p-6 md:p-8">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <CheckCircle
                    className="text-green-400"
                    size={24}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">
                    Answer Evaluated
                  </h3>

                  <p className="text-sm text-gray-400">
                    Here is your AI feedback
                  </p>
                </div>

              </div>

              <div className="text-right">

                <p className="text-xs text-gray-500">
                  Score
                </p>

                <p className="text-3xl font-bold text-cyan-400">
                  {currentAnswerResult.score}
                  <span className="text-lg text-gray-500">
                    /10
                  </span>
                </p>

              </div>

            </div>

            <div className="mt-5 bg-gray-900 rounded-2xl p-5">

              <p className="text-sm text-gray-400 mb-2">
                AI Feedback
              </p>

              <p className="text-gray-200 leading-relaxed">
                {currentAnswerResult.feedback}
              </p>

            </div>

            {/* NEXT QUESTION */}

            <div className="flex justify-end mt-6">

              <button
                onClick={goToNextQuestion}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold transition"
              >
                {currentQuestion >= totalQuestions ? (
                  <>
                    <Trophy size={18} />
                    Finish Interview
                  </>
                ) : (
                  <>
                    Next Question
                    <ArrowLeft
                      size={18}
                      className="rotate-180"
                    />
                  </>
                )}
              </button>

            </div>

          </div>
        )}

        {/* ================================================
            QUESTION INDICATORS
        ================================================= */}

        <div className="flex justify-center gap-2 mt-8">

          {Array.from(
            { length: totalQuestions },
            (_, index) => {
              const number = index + 1;

              const completed =
                answers.length >= number;

              const active =
                currentQuestion === number;

              return (
                <div
                  key={number}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition ${
                    completed
                      ? "bg-green-500 text-white"
                      : active
                      ? "bg-cyan-500 text-white"
                      : "bg-gray-800 text-gray-500"
                  }`}
                >
                  {completed ? (
                    <CheckCircle size={16} />
                  ) : (
                    number
                  )}
                </div>
              );
            }
          )}

        </div>

      </div>
    </MainLayout>
  );
}


