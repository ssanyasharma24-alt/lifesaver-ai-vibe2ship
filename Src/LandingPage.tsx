import React from "react";
import { FileText, Video, Sparkles, Award, ArrowRight, ShieldCheck, CheckCircle, GraduationCap } from "lucide-react";

interface LandingPageProps {
  navigate: (path: string) => void;
}

export default function LandingPage({ navigate }: LandingPageProps) {
  return (
    <div className="space-y-16 py-4 animate-fade-in">
      {/* Hero Section */}
      <div className="relative text-center max-w-4xl mx-auto space-y-6 pt-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl -z-10" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium tracking-wide uppercase font-mono mb-4">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          Last-Minute Job Prep Engine for Bharat
        </div>

        <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-white leading-tight">
          Interview Kal Hai?<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 text-glow">
            Aaj Raat Ready Ho Jao!
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
          Over 83% of Indian graduates get rejected due to scattered govt scheme info, un-optimized resumes, and zero mock practice. <strong className="text-orange-400 font-medium">Rozgar Setu AI</strong> fixes that in minutes.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button
            onClick={() => navigate("/interview")}
            id="hero-start-interview-btn"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 font-semibold text-white transition-all shadow-lg hover:shadow-orange-500/20 active:scale-95 flex items-center justify-center gap-2"
          >
            <Video className="w-5 h-5" />
            Start Mock Interview
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate("/resume")}
            id="hero-scan-resume-btn"
            className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 font-semibold text-white transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <FileText className="w-5 h-5 text-orange-400" />
            Scan ATS Score
          </button>
        </div>
      </div>

      {/* Problem highlight banner */}
      <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-orange-950/20 border border-red-900/30 rounded-2xl p-6 md:p-8 max-w-5xl mx-auto flex flex-col md:flex-row gap-6 items-center">
        <div className="bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/20 text-center shrink-0">
          <div className="text-4xl md:text-5xl font-mono font-bold">83%</div>
          <div className="text-xs uppercase font-mono tracking-wider mt-1 text-red-300">Fail Placement</div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-display font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-400" />
            Why do so many Indian students struggle to get hired?
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Most company portals use automatic <strong className="text-slate-100">Applicant Tracking Systems (ATS)</strong> that filter out resumes before an HR manager even sees them. Furthermore, students miss out on critical <strong className="text-slate-100">Govt Schemes</strong> offering free skill certifications or direct stipends (PMKVY, NAPS) because information is too scattered.
          </p>
        </div>
      </div>

      {/* Grid of Tools (The Solution) */}
      <div className="space-y-6 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-center text-white">
          Three Tools, One Night to Prepare
        </h2>
        <p className="text-center text-slate-400 max-w-md mx-auto text-sm">
          Everything you need is built-in and free. Zero logins, zero configurations.
        </p>

        <div className="grid md:grid-cols-3 gap-6 pt-4">
          {/* Tool 1: ATS Resume Scorer */}
          <div 
            id="tool-card-resume"
            onClick={() => navigate("/resume")}
            className="group bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-orange-500/30 rounded-2xl p-6 transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white group-hover:text-orange-400 transition-colors">
                  ATS Resume Scorer
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Upload your PDF resume and paste the target Job Description. Get instant scoring, keyword alignment, and a professionally rewritten summary to pass corporate filters.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-400 mt-6 font-mono group-hover:translate-x-1.5 transition-transform">
              OPTIMIZE RESUME <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Tool 2: AI Mock Interview */}
          <div 
            id="tool-card-interview"
            onClick={() => navigate("/interview")}
            className="group bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-orange-500/30 rounded-2xl p-6 transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white group-hover:text-amber-400 transition-colors">
                  AI Mock Interview
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Practice questions tailored for specific recruiters like TCS, Wipro, or top startups. Speak your answer directly through the mic and get immediate HR scoring and structural feedback.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mt-6 font-mono group-hover:translate-x-1.5 transition-transform">
              START PRACTICE <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Tool 3: Govt Scheme Finder */}
          <div 
            id="tool-card-schemes"
            onClick={() => navigate("/schemes")}
            className="group bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-orange-500/30 rounded-2xl p-6 transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors">
                  Scheme & Apprenticeship Finder
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Avoid scattered Government portals. Quickly find active schemes (like PMKVY, NAPS stipend offers) matching your Age, State, and Qualification with clear pathways to apply.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mt-6 font-mono group-hover:translate-x-1.5 transition-transform">
              FIND STIPENDS <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Live Impact Counter banner */}
      <div className="max-w-4xl mx-auto border border-slate-800 bg-slate-900/30 rounded-2xl p-6 flex flex-col sm:flex-row justify-around text-center gap-6">
        <div>
          <div className="text-3xl font-bold text-white font-mono">100%</div>
          <div className="text-xs text-slate-400 mt-1 uppercase font-mono">Free & Open Access</div>
        </div>
        <div className="hidden sm:block border-r border-slate-800" />
        <div>
          <div className="text-3xl font-bold text-white font-mono">Bharat-First</div>
          <div className="text-xs text-slate-400 mt-1 uppercase font-mono">Tailored for Indian Tech & Govt Roles</div>
        </div>
        <div className="hidden sm:block border-r border-slate-800" />
        <div>
          <div className="text-3xl font-bold text-white font-mono">1-Click</div>
          <div className="text-xs text-slate-400 mt-1 uppercase font-mono">AI Coach Response</div>
        </div>
      </div>
    </div>
  );
}
