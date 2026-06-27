import React, { useState } from "react";
import { FileText, ArrowRight, Upload, Sparkles, AlertCircle, CheckCircle2, RotateCcw, HelpCircle } from "lucide-react";
import { ATSResponse } from "../types";

export default function ResumeScorer() {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ATSResponse | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelection(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    if (file.type !== "application/pdf" && !file.type.startsWith("text/")) {
      setError("Please upload a PDF or plain text resume file.");
      return;
    }
    setResumeFile(file);
    setError(null);
    
    // Also read text as fallback/additional support if it's text
    if (file.type.startsWith("text/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setResumeText(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError("Please paste the target Job Description first.");
      return;
    }
    if (!resumeFile && !resumeText.trim()) {
      setError("Please either upload a PDF resume or paste your resume content in the text box.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let payload: any = {
        jobDescription: jobDescription.trim()
      };

      if (resumeFile) {
        const base64 = await convertFileToBase64(resumeFile);
        payload.resumeBase64 = base64;
        payload.resumeType = resumeFile.type;
      } else {
        payload.resumeText = resumeText.trim();
      }

      const response = await fetch("/api/ats-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Analysis failed. Please try again.");
      }

      const data: ATSResponse = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong while scanning your resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetScorer = () => {
    setResult(null);
    setResumeFile(null);
    setResumeText("");
    setError(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/5";
    if (score >= 55) return "text-amber-400 border-amber-500/30 bg-amber-500/5";
    return "text-red-400 border-red-500/30 bg-red-500/5";
  };

  const getScoreCircleColor = (score: number) => {
    if (score >= 80) return "stroke-emerald-500";
    if (score >= 55) return "stroke-amber-500";
    return "stroke-red-500";
  };

  return (
    <div className="max-w-5xl mx-auto py-4 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
          ATS Resume Scorer & Enhancer
        </h1>
        <p className="text-slate-400 max-w-2xl text-sm md:text-base">
          Check if your resume will beat modern recruiter screens. Get customized keyword matching suggestions and an elite, AI-rewritten professional summary instantly.
        </p>
      </div>

      {!result ? (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Inputs Panel */}
          <div className="space-y-6">
            {/* Step 1: Resume Upload */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center text-xs font-mono">1</span>
                Upload Resume or Paste Text
              </h2>

              {/* Drag & Drop File Zone */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                  dragActive
                    ? "border-orange-500 bg-orange-500/5"
                    : "border-slate-800 hover:border-slate-700 bg-slate-950/40"
                }`}
              >
                <input
                  type="file"
                  id="resume-file-input"
                  onChange={handleFileChange}
                  accept=".pdf,text/plain"
                  className="hidden"
                />
                <label
                  htmlFor="resume-file-input"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-center text-orange-400">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {resumeFile ? resumeFile.name : "Click to upload or drag & drop"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {resumeFile ? `${(resumeFile.size / 1024).toFixed(1)} KB` : "Supports PDF or TXT files"}
                    </p>
                  </div>
                </label>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-800/60"></div>
                <span className="flex-shrink mx-4 text-xs font-mono text-slate-500 uppercase">Or Paste Plain Resume Text</span>
                <div className="flex-grow border-t border-slate-800/60"></div>
              </div>

              {/* Paste Text Area */}
              <div>
                <textarea
                  id="resume-text-textarea"
                  value={resumeText}
                  onChange={(e) => {
                    setResumeText(e.target.value);
                    if (resumeFile) setResumeFile(null); // Clear file if editing text
                  }}
                  placeholder="Paste text contents from your resume here..."
                  className="w-full h-40 bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-sm text-slate-300 focus:outline-none focus:border-orange-500/50 resize-none font-sans"
                />
              </div>
            </div>
          </div>

          {/* Job Description Panel */}
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center text-xs font-mono">2</span>
                  Target Job Description
                </h2>
                <p className="text-xs text-slate-400">
                  Paste the requirements, role description, or company flyer. We'll identify exact keywords, missing tech stacks, and soft skills.
                </p>
                <div>
                  <textarea
                    id="job-desc-textarea"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="E.g., We are looking for a React Developer with knowledge of Tailwind CSS, Express, Node.js, and strong problem-solving skills..."
                    className="w-full h-64 bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-sm text-slate-300 focus:outline-none focus:border-orange-500/50 resize-none font-sans"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 text-xs text-red-400 bg-red-950/20 border border-red-900/30 p-3 rounded-lg mt-3">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={loading}
                id="run-ats-scan-btn"
                className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 font-semibold text-white transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Scrutinizing ATS Compatibility...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-white animate-pulse" />
                    Verify ATS Score Now
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Results Section */
        <div className="space-y-8 animate-fade-in">
          {/* Upper Stats Card */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Score Ring Display */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider font-mono">ATS Compatibility Score</h3>
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="62" className="stroke-slate-800" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="72"
                    cy="72"
                    r="62"
                    className={`transition-all duration-1000 ease-out ${getScoreCircleColor(result.score)}`}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={389.5}
                    strokeDashoffset={389.5 - (389.5 * result.score) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-4xl md:text-5xl font-bold text-white font-mono">{result.score}</span>
                  <span className="text-slate-500 font-mono text-sm">/100</span>
                </div>
              </div>

              <div className={`px-3 py-1 rounded-full text-xs font-mono border ${getScoreColor(result.score)}`}>
                {result.score >= 80 ? "EXCELLENT MATCH" : result.score >= 55 ? "INTERMEDIATE" : "LOW ALIGNMENT"}
              </div>
            </div>

            {/* AI Rewritten Summary */}
            <div className="md:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-400" />
                    AI-Rewritten Resume Summary
                  </h3>
                  <span className="text-xs text-orange-400 font-mono uppercase bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">ATS PREFERRED</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed font-sans italic pt-1">
                  "{result.rewrittenSummary}"
                </p>
              </div>

              <div className="border-t border-slate-800/80 pt-4 text-xs text-slate-400 flex items-center justify-between">
                <span>Replace your current top summary with this to boost matching likelihood by 40%.</span>
                <button
                  onClick={() => navigator.clipboard.writeText(result.rewrittenSummary)}
                  className="text-orange-400 hover:text-orange-300 font-mono text-xs font-semibold cursor-pointer"
                >
                  COPY SUMMARY
                </button>
              </div>
            </div>
          </div>

          {/* Missing Keywords & Suggestions Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Missing Keywords */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500 animate-pulse" />
                Missing / Weak Keywords
              </h3>
              <p className="text-xs text-slate-400">
                These core skills or requirements were identified in the Job Description but are either absent or inadequately emphasized in your resume.
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {result.missingKeywords && result.missingKeywords.length > 0 ? (
                  result.missingKeywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20"
                    >
                      + {kw}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-emerald-400 flex items-center gap-1.5 font-mono">
                    <CheckCircle2 className="w-4 h-4" /> Perfect! You have all the primary job keywords covered.
                  </span>
                )}
              </div>
            </div>

            {/* Matching Skills */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Matching Strengths Found
              </h3>
              <p className="text-xs text-slate-400">
                Excellent! The ATS detected these strengths in your resume, align them nicely in your projects and experience sections.
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {result.matchingSkills && result.matchingSkills.length > 0 ? (
                  result.matchingSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                    >
                      ✓ {sk}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500 italic">No direct keyword matching detected. Please check your spelling and terms.</span>
                )}
              </div>
            </div>
          </div>

          {/* Actionable Improvement Steps */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-400" />
              Strategic Improvement Steps
            </h3>
            <ul className="space-y-3 pt-2">
              {result.suggestions && result.suggestions.map((sug, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-slate-300 leading-relaxed">
                  <span className="w-5 h-5 rounded-md bg-orange-500/10 text-orange-400 shrink-0 flex items-center justify-center font-mono text-xs font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions Bar */}
          <div className="flex justify-center pt-4">
            <button
              onClick={resetScorer}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all flex items-center gap-2 text-sm cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Analyze Another Resume / Job
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
