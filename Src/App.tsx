import React, { useState, useEffect } from "react";
import { FileText, Video, GraduationCap, Briefcase, Sparkles, Menu, X, ArrowUpRight } from "lucide-react";
import LandingPage from "./components/LandingPage";
import ResumeScorer from "./components/ResumeScorer";
import MockInterview from "./components/MockInterview";
import SchemeFinder from "./components/SchemeFinder";

export default function App() {
  const [currentPath, setCurrentPath] = useState("/");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync state with browser location (supporting hash routing for preview safety)
  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash;
      if (hash) {
        setCurrentPath(hash.replace("#", ""));
      } else {
        // Also support standard pathname
        setCurrentPath(window.location.pathname || "/");
      }
    };

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);
    
    // Initial check
    handleLocationChange();

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderContent = () => {
    switch (currentPath) {
      case "/resume":
        return <ResumeScorer />;
      case "/interview":
        return <MockInterview />;
      case "/schemes":
        return <SchemeFinder />;
      case "/":
      default:
        return <LandingPage navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col justify-between selection:bg-orange-500/30 selection:text-orange-200">
      {/* Dynamic Background Gradients */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-orange-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 left-10 w-[45rem] h-[45rem] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Primary Header Layout */}
      <header className="sticky top-0 z-50 bg-[#0b0f19]/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo/Identity */}
            <div 
              onClick={() => navigate("/")} 
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/10 group-hover:scale-105 transition-transform">
                <Briefcase className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="font-display font-bold text-white text-lg tracking-tight block leading-none">
                  Rozgar Setu <span className="text-orange-500 font-mono text-sm">AI</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono font-medium tracking-wide">
                  LAST-MINUTE JOB SAVER
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => navigate("/")}
                id="nav-link-home"
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  currentPath === "/"
                    ? "text-orange-400 bg-orange-500/5"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => navigate("/resume")}
                id="nav-link-resume"
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  currentPath === "/resume"
                    ? "text-orange-400 bg-orange-500/5"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <FileText className="w-4 h-4" />
                Resume Scorer
              </button>
              <button
                onClick={() => navigate("/interview")}
                id="nav-link-interview"
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  currentPath === "/interview"
                    ? "text-orange-400 bg-orange-500/5"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Video className="w-4 h-4" />
                Mock Interview
              </button>
              <button
                onClick={() => navigate("/schemes")}
                id="nav-link-schemes"
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  currentPath === "/schemes"
                    ? "text-orange-400 bg-orange-500/5"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <GraduationCap className="w-4.5 h-4.5" />
                Schemes Finder
              </button>
            </nav>

            {/* CTA Badge */}
            <div className="hidden md:flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2.5 py-1 rounded-full">
                Placement Ready
              </span>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                id="mobile-menu-toggle-btn"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0b0f19] border-b border-slate-800 animate-fade-in">
            <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
              <button
                onClick={() => navigate("/")}
                className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium flex items-center gap-2 ${
                  currentPath === "/"
                    ? "text-orange-400 bg-orange-500/5 font-semibold"
                    : "text-slate-300 hover:bg-slate-900"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => navigate("/resume")}
                className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium flex items-center gap-2 ${
                  currentPath === "/resume"
                    ? "text-orange-400 bg-orange-500/5 font-semibold"
                    : "text-slate-300 hover:bg-slate-900"
                }`}
              >
                <FileText className="w-4.5 h-4.5 text-orange-400" />
                Resume Scorer
              </button>
              <button
                onClick={() => navigate("/interview")}
                className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium flex items-center gap-2 ${
                  currentPath === "/interview"
                    ? "text-orange-400 bg-orange-500/5 font-semibold"
                    : "text-slate-300 hover:bg-slate-900"
                }`}
              >
                <Video className="w-4.5 h-4.5 text-orange-400" />
                Mock Interview
              </button>
              <button
                onClick={() => navigate("/schemes")}
                className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium flex items-center gap-2 ${
                  currentPath === "/schemes"
                    ? "text-orange-400 bg-orange-500/5 font-semibold"
                    : "text-slate-300 hover:bg-slate-900"
                }`}
              >
                <GraduationCap className="w-4.5 h-4.5 text-orange-400" />
                Schemes Finder
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/40 py-8 text-center text-xs text-slate-500 font-sans space-y-3">
        <div className="flex justify-center items-center gap-1.5">
          <span className="w-2.5 h-1.5 bg-orange-500 rounded-sm"></span>
          <span className="w-2.5 h-1.5 bg-white rounded-sm"></span>
          <span className="w-2.5 h-1.5 bg-emerald-500 rounded-sm"></span>
          <span className="font-semibold text-slate-400 font-mono ml-1">Rozgar Setu AI for Bharat</span>
        </div>
        <p className="max-w-md mx-auto px-4 text-[11px] leading-relaxed">
          Specifically structured for Indian engineering, BCA, B.Sc, and commerce graduates to easily optimize placements and tap government initiatives.
        </p>
        <p className="text-[10px] font-mono text-slate-600">
          Powered by Gemini 2.5 Flash &middot; &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </footer>
    </div>
  );
}
