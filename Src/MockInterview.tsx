import React, { useState, useEffect, useRef } from "react";
import { Video, Mic, MicOff, AlertCircle, Sparkles, Send, RefreshCw, Trophy, Star, ArrowRight, BookOpen } from "lucide-react";
import { InterviewFeedbackResponse } from "../types";

export default function MockInterview() {
  const [company, setCompany] = useState("TCS");
  const [role, setRole] = useState("React Developer");
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Interview state
  const [questionNumber, setQuestionNumber] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [history, setHistory] = useState<Array<{
    question: string;
    answer: string;
    score: number;
    critique: string;
    improvedAnswer: string;
  }>>([]);

  // Voice recognition
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if webkitSpeechRecognition is available
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-IN"; // Tailored for Indian English pronunciation!

      rec.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          setUserAnswer((prev) => (prev ? prev + " " : "") + finalTranscript);
        }
      };

      rec.onerror = (e: any) => {
        console.error("Speech recognition error", e);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please type your answer or try a supported browser like Chrome.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/mock-interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, role }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to start interview.");
      }

      const data = await response.json();
      setCurrentQuestion(data.question);
      setStarted(true);
      setQuestionNumber(1);
      setHistory([]);
      setUserAnswer("");
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      setError("Please dictate or type an answer before submitting.");
      return;
    }

    // Stop listening if active
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/mock-interview/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          role,
          question: currentQuestion,
          answer: userAnswer.trim(),
          questionNumber,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to analyze feedback.");
      }

      const data: InterviewFeedbackResponse = await response.json();
      
      // Save current Q&A + feedback to history
      setHistory((prev) => [
        ...prev,
        {
          question: currentQuestion,
          answer: userAnswer.trim(),
          score: data.score,
          critique: data.critique,
          improvedAnswer: data.improvedAnswer,
        },
      ]);

      if (questionNumber >= 5 || data.nextQuestion.toLowerCase().includes("concludes") || data.nextQuestion.toLowerCase().includes("thank you")) {
        // Complete the mock session
        setCurrentQuestion("");
        setQuestionNumber(6); // marks complete
      } else {
        setCurrentQuestion(data.nextQuestion);
        setQuestionNumber((prev) => prev + 1);
        setUserAnswer("");
      }
    } catch (err: any) {
      setError(err.message || "Failed to process evaluation.");
    } finally {
      setLoading(false);
    }
  };

  const averageScore = history.length > 0 
    ? (history.reduce((acc, curr) => acc + curr.score, 0) / history.length).toFixed(1)
    : "0";

  return (
    <div className="max-w-5xl mx-auto py-4 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
          AI Mock Interview Coach
        </h1>
        <p className="text-slate-400 max-w-2xl text-sm md:text-base">
          Simulate rapid-fire interviews with HR managers from major Indian recruiters. Speak naturally, test your delivery, and receive elite response upgrades.
        </p>
      </div>

      {!started ? (
        /* Configuration Phase */
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto space-y-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-orange-400" />
            Set Up Your Practice Session
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-slate-400 font-semibold">Target Recruiter / Company</label>
              <select
                id="interview-company-select"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-3 text-sm text-slate-200 focus:outline-none focus:border-orange-500/50"
              >
                <option value="TCS">TCS (Tata Consultancy Services)</option>
                <option value="Infosys">Infosys</option>
                <option value="Wipro">Wipro</option>
                <option value="Reliance Jio">Reliance Jio</option>
                <option value="Razorpay">Razorpay (Indian Fintech Startup)</option>
                <option value="Cognizant">Cognizant</option>
                <option value="Zomato">Zomato / Swiggy</option>
                <option value="Generic Indian MNC">Generic Tech Services Firm</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-slate-400 font-semibold">Target Job Role</label>
              <select
                id="interview-role-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-3 text-sm text-slate-200 focus:outline-none focus:border-orange-500/50"
              >
                <option value="React Developer">Frontend / React Developer</option>
                <option value="Software Engineer Trainee">Software Engineer / Graduate Trainee</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="Business Development Associate">Business Development Associate (BDA)</option>
                <option value="Customer Support Executive">Customer Operations / Support</option>
                <option value="Quality Assurance Engineer">QA Tester / Automation</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl flex items-start gap-3 text-xs text-slate-300">
            <Sparkles className="w-4.5 h-4.5 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">How it works:</span> Gemini will act as your dedicated HR interviewer. It asks exactly one question at a time. Click "Speak Answer" to talk natively or type your answer. You will get a 1-10 rating and improved coaching after each question.
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-950/20 border border-red-900/30 text-xs text-red-400 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleStart}
            id="start-interview-btn"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Preparing Interview Panel...
              </>
            ) : (
              <>
                <Video className="w-5 h-5" />
                Start Mock Interview (5 Questions)
              </>
            )}
          </button>
        </div>
      ) : questionNumber <= 5 ? (
        /* Active Interview Phase */
        <div className="grid md:grid-cols-12 gap-8 items-start">
          {/* Main Interview Panel */}
          <div className="md:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
            {/* Status Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Live Practice Session</span>
              </div>
              <div className="text-xs font-mono text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded border border-orange-500/20">
                Question {questionNumber} of 5
              </div>
            </div>

            {/* Simulated Video Feed or Interviewer Frame */}
            <div className="relative aspect-video rounded-xl bg-slate-950 overflow-hidden border border-slate-800/80 flex items-center justify-center">
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-lg text-xs font-mono">
                <span className="text-slate-400">HR Manager:</span>
                <span className="text-white font-semibold">{company} Panel</span>
              </div>
              <div className="absolute top-4 right-4 text-xs font-mono text-slate-400 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-lg">
                Role: {role}
              </div>

              {/* Graphical Visualizer */}
              <div className="text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto text-orange-400">
                  <Video className="w-8 h-8" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <p className="text-xs uppercase font-mono tracking-wider text-orange-400/80 font-medium">Listening to candidate response</p>
                  <p className="text-sm text-slate-300 italic">"Be professional, clear, and refer to project metrics where possible."</p>
                </div>
              </div>
            </div>

            {/* HR Question Box */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-5 space-y-2">
              <span className="text-xs font-mono uppercase text-orange-400 font-bold">HR Interviewer Question:</span>
              <p className="text-base text-white leading-relaxed font-semibold">
                "{currentQuestion}"
              </p>
            </div>

            {/* Answer Input Area */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase text-slate-400 font-semibold">Your Answer</label>
                {recognitionRef.current && (
                  <button
                    onClick={toggleListening}
                    id="dictate-answer-btn"
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border transition-all cursor-pointer ${
                      isListening
                        ? "text-red-400 border-red-500/30 bg-red-500/10 animate-pulse"
                        : "text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white bg-slate-950/60"
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-3.5 h-3.5 text-red-400" />
                        Stop Dictating
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5 text-orange-400" />
                        Speak Answer (En-IN STT)
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="relative">
                <textarea
                  id="user-answer-textarea"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder={isListening ? "Listening... start speaking naturally. Click stop when finished." : "Type your answer here or click Speak Answer to dictate..."}
                  className="w-full h-40 bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 focus:outline-none focus:border-orange-500/50 resize-none font-sans leading-relaxed"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-950/20 border border-red-900/30 text-xs text-red-400 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSubmitAnswer}
                  id="submit-answer-btn"
                  disabled={loading || !userAnswer.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-45 disabled:scale-100 text-white font-semibold rounded-xl flex items-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                      Evaluating Answer...
                    </>
                  ) : (
                    <>
                      Submit Response
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar: Live Feedback & Progress Log */}
          <div className="md:col-span-5 space-y-6">
            {/* Live Progress Tracker */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">Session History</h3>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, idx) => {
                  const item = history[idx];
                  const isActive = idx === questionNumber - 1;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                        isActive
                          ? "bg-orange-500/5 border-orange-500/30"
                          : item
                          ? "bg-slate-950/40 border-slate-800"
                          : "bg-slate-950/10 border-slate-800/30 opacity-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center ${
                          isActive
                            ? "bg-orange-500/20 text-orange-400"
                            : item
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-slate-800 text-slate-500"
                        }`}>
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-white">Question {idx + 1}</p>
                          <p className="text-[10px] text-slate-500 uppercase font-mono mt-0.5">
                            {isActive ? "ACTIVE QUESTION" : item ? `Score: ${item.score}/10` : "LOCKED"}
                          </p>
                        </div>
                      </div>
                      {item && (
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {item.score}/10
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Instant feedback card for the PREVIOUS question */}
            {history.length > 0 && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-orange-400 font-bold">Latest Feedback</h4>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                    Last Score: {history[history.length - 1].score}/10
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-500">Expert HR Critique</span>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1 font-sans">
                      "{history[history.length - 1].critique}"
                    </p>
                  </div>
                  <div className="pt-2">
                    <span className="text-[10px] font-mono uppercase text-slate-500">How to frame it ideally</span>
                    <p className="text-xs text-orange-200/90 leading-relaxed mt-1 font-sans italic bg-orange-950/20 p-2.5 rounded-lg border border-orange-900/20">
                      "{history[history.length - 1].improvedAnswer}"
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Interview Complete / Summary State */
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950/30 border border-slate-800 rounded-2xl p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-glow">
              <Trophy className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
                Mock Interview Concluded!
              </h2>
              <p className="text-slate-400 max-w-md mx-auto text-sm">
                Excellent job completing all 5 technical and behavioral rounds with {company}. Here is your session summary.
              </p>
            </div>

            {/* Final score card */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-6 max-w-sm mx-auto flex items-center justify-around">
              <div>
                <div className="text-xs font-mono uppercase text-slate-500">Questions</div>
                <div className="text-2xl font-bold text-white font-mono mt-1">5 / 5</div>
              </div>
              <div className="border-r border-slate-800 h-8" />
              <div>
                <div className="text-xs font-mono uppercase text-slate-500 font-bold text-orange-400">Average Rating</div>
                <div className="text-2xl font-bold text-orange-400 font-mono mt-1 flex items-center justify-center gap-1">
                  <Star className="w-5 h-5 fill-orange-400 text-orange-400" />
                  {averageScore} / 10
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleStart}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:from-orange-600 hover:to-amber-600 transition-all flex items-center gap-2 text-sm cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Practice Again
              </button>
            </div>
          </div>

          {/* Deep dive of all questions & answers */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-400" />
              Comprehensive Q&A Breakdown
            </h3>

            <div className="space-y-6">
              {history.map((item, idx) => (
                <div key={idx} className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-sm font-semibold text-white font-mono">Round {idx + 1} Question</span>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Score: {item.score} / 10
                    </span>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-xs text-slate-400 font-mono uppercase">Question:</span>
                      <p className="text-slate-200 mt-1 font-medium">"{item.question}"</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-mono uppercase">Your Answer:</span>
                      <p className="text-slate-300 mt-1 italic">"{item.answer}"</p>
                    </div>
                    <div className="pt-2 border-t border-slate-800/40 grid sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-amber-400 font-mono uppercase">Expert Feedback:</span>
                        <p className="text-slate-400 mt-1 text-xs leading-relaxed">"{item.critique}"</p>
                      </div>
                      <div>
                        <span className="text-xs text-emerald-400 font-mono uppercase">Ideal Professional Upgrade:</span>
                        <p className="text-orange-200/90 mt-1 text-xs leading-relaxed italic bg-orange-950/20 p-2 rounded">"{item.improvedAnswer}"</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
