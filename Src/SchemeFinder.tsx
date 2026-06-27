import React, { useState } from "react";
import { GraduationCap, MapPin, Sparkles, AlertCircle, ArrowUpRight, HelpCircle, PhoneCall, ExternalLink } from "lucide-react";
import { Scheme } from "../types";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", 
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", 
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", 
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh"
];

export default function SchemeFinder() {
  const [age, setAge] = useState("21");
  const [state, setState] = useState("Uttar Pradesh");
  const [education, setEducation] = useState("B.Tech / Graduate");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!age || !state || !education) {
      setError("Please fill in all search parameters.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/scheme-finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ age, state, education }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to retrieve schemes.");
      }

      const data = await response.json();
      setSchemes(data.schemes || []);
      setHasSearched(true);
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "apprenticeship":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "skill development":
        return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
      case "self-employment / loan":
        return "text-orange-400 bg-orange-500/10 border-orange-500/20";
      default:
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-4 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
          Govt Schemes & Apprentice Finder
        </h1>
        <p className="text-slate-400 max-w-2xl text-sm md:text-base">
          Get direct, central and state-level government schemes matched specifically to your background. Avoid endless web portals and apply immediately for stipends, skill trainings, and certifications.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-8 items-start">
        {/* Search Parameter Form */}
        <div className="md:col-span-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <form onSubmit={handleSearch} className="space-y-5">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-5 h-5 text-orange-400" />
              Configure Profile
            </h2>

            {/* Age Field */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-slate-400 font-semibold">Age (Years)</label>
              <input
                type="number"
                id="scheme-age-input"
                min="15"
                max="60"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-3 text-sm text-slate-200 focus:outline-none focus:border-orange-500/50"
              />
            </div>

            {/* State Field */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-slate-400 font-semibold">Home State</label>
              <select
                id="scheme-state-select"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-3 text-sm text-slate-200 focus:outline-none focus:border-orange-500/50 scrollbar-thin"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Education level */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-slate-400 font-semibold">Education Level</label>
              <select
                id="scheme-edu-select"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-3 text-sm text-slate-200 focus:outline-none focus:border-orange-500/50"
              >
                <option value="10th Pass">Class 10 (High School)</option>
                <option value="12th Pass">Class 12 (Intermediate)</option>
                <option value="ITI / Diploma">ITI / Polytechnic Diploma</option>
                <option value="B.Tech / Graduate">B.Tech / BE / Non-Tech Graduate</option>
                <option value="Post-Graduate">Post-Graduate / Masters</option>
              </select>
            </div>

            {error && (
              <div className="p-3 bg-red-950/20 border border-red-900/30 text-xs text-red-400 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              id="find-schemes-btn"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Matching Schemes...
                </>
              ) : (
                <>
                  <GraduationCap className="w-5 h-5" />
                  Find Eligible Schemes
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results / Informational list */}
        <div className="md:col-span-8 space-y-6">
          {!hasSearched ? (
            /* Idle Placeholder */
            <div className="bg-slate-900/20 border border-slate-800 border-dashed rounded-2xl p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center mx-auto">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-base font-semibold text-white">Find Your Fit in seconds</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Enter your information in the search panel. Our model scans actual live Central Ministry and state skill councils to deliver actionable, high-stipend programs.
                </p>
              </div>
            </div>
          ) : schemes.length === 0 ? (
            /* Empty Search Results */
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
              <p className="text-slate-400 font-sans">No matching schemes found for this exact configuration. Try adjusting your age or education level slightly.</p>
            </div>
          ) : (
            /* Schemes List */
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider font-mono text-slate-400">
                  {schemes.length} Tailored Schemes Found
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                  <MapPin className="w-3 h-3" /> State: {state}
                </div>
              </div>

              <div className="grid gap-6">
                {schemes.map((scheme, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900/60 border border-slate-800 hover:border-orange-500/20 rounded-2xl p-6 space-y-4 transition-all"
                  >
                    {/* Category & Title */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono border font-semibold uppercase tracking-wider ${getCategoryColor(scheme.category)}`}>
                          {scheme.category}
                        </span>
                        <h4 className="text-lg font-bold text-white font-display">
                          {scheme.name}
                        </h4>
                      </div>
                      
                      <a
                        href={scheme.applyUrl.startsWith("http") ? scheme.applyUrl : "https://www.india.gov.in/my-government/schemes"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-750 border border-slate-700/60 hover:border-orange-500/40 text-xs font-semibold text-white rounded-xl flex items-center justify-center gap-1.5 shrink-0 transition-colors self-start sm:self-center"
                      >
                        Official Website
                        <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
                      </a>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-300 leading-relaxed font-sans">
                      {scheme.description}
                    </p>

                    {/* Highlights Grid */}
                    <div className="grid sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800/60 text-xs font-sans">
                      <div className="space-y-1 bg-slate-950/40 border border-slate-900 p-3 rounded-xl">
                        <span className="font-semibold text-orange-400 font-mono block uppercase text-[10px] tracking-wide">Financial / Skill Benefits</span>
                        <p className="text-slate-300 leading-relaxed">{scheme.benefits}</p>
                      </div>
                      <div className="space-y-1 bg-slate-950/40 border border-slate-900 p-3 rounded-xl">
                        <span className="font-semibold text-emerald-400 font-mono block uppercase text-[10px] tracking-wide">Candidate Eligibility</span>
                        <p className="text-slate-300 leading-relaxed">{scheme.eligibility}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Informational helpful support message */}
              <div className="bg-slate-900/30 border border-slate-800 p-5 rounded-2xl flex items-start gap-4 text-xs text-slate-400 leading-relaxed">
                <PhoneCall className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold text-white block">Struggling with applying?</span>
                  <span>Many Indian schemes require basic identification cards like Aadhaar Card, PAN Card, or bank details for Direct Benefit Transfers (DBT) of stipends. Keep these ready when clicking to apply on government links.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
