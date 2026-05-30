import React, { useState, useMemo, createContext, useEffect } from "react";
import { 
  Sparkles, Bell, Calendar, Search, MapPin, Briefcase, Award, 
  GraduationCap, Clock, AlertTriangle, ChevronRight, Menu, X, 
  Printer, Share2, ArrowLeft, Copy, Download, ExternalLink 
} from "lucide-react";
import { Job, ExamResult, AdmitCard, SiteSettings, PushNotificationSetting, PushNotificationAlert } from "../types";
import { STATE_CARDS, JOB_CATS, QUALS, CAT_COLORS } from "../data";

// Shared interface imported or used locally
export interface AppContextType {
  jobs: Job[];
  results: ExamResult[];
  admits: AdmitCard[];
  ticker: string;
  siteSettings: SiteSettings;
  addToast: (msg: string, type: "success" | "warn" | "error") => void;
  setView: (view: "site" | "admin") => void;
  isLoading: boolean;
  pushSubscription: PushNotificationSetting;
  setPushSubscription: React.Dispatch<React.SetStateAction<PushNotificationSetting>>;
  pushAlerts: PushNotificationAlert[];
  setPushAlerts: React.Dispatch<React.SetStateAction<PushNotificationAlert[]>>;
  sendPushAlertToClient: (title: string, body: string, category: string, url?: string) => void;
  currentUser: any;
  loginWithGoogle: () => Promise<void>;
  logoutAdmin: () => Promise<void>;
}

export const AppContext = createContext<AppContextType | null>(null);

export const Website: React.FC = () => {
  const context = React.useContext(AppContext);
  if (!context) return null;

  const { 
    jobs, results, admits, ticker, siteSettings, setView, addToast,
    pushSubscription, setPushSubscription, pushAlerts, setPushAlerts, sendPushAlertToClient,
    currentUser, loginWithGoogle, logoutAdmin
  } = context;

  // Local navigation state
  const [sitePage, setSitePage] = useState<"home" | "state" | "job">("home");
  const [selectedState, setSelectedState] = useState<string | null>(() => {
    return localStorage.getItem("userStateSelection") || "All India";
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [showPushBanner, setShowPushBanner] = useState(() => {
    return localStorage.getItem("pushBannerDismissed") !== "true" && !pushSubscription.subscribed;
  });

  // Subscriber permission request trigger
  const handleSubscribeToPush = async () => {
    if (!("Notification" in window)) {
      addToast("⚠ Your browser does not support native push notifications, but the integrated Web Push simulation has been authorized!", "warn");
      setPushSubscription({
        subscribed: true,
        channels: ["Central Jobs", "State Jobs", "Admit Cards", "Exam Results"]
      });
      setShowPushBanner(false);
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setPushSubscription({
          subscribed: true,
          channels: ["Central Jobs", "State Jobs", "Admit Cards", "Exam Results"]
        });
        setShowPushBanner(false);
        sendPushAlertToClient(
          "🔔 Subscription Connected!",
          "You will now receive SARKARI RESULT Instant alerts direct in this active sandbox tab.",
          "Central Jobs"
        );
      } else {
        // Fallback subscription if blocked so they can still test the system
        addToast("⚠ Push permission was ignored or denied. We enabled the inside-app simulated Push alert workflow for you!", "warn");
        setPushSubscription({
          subscribed: true,
          channels: ["Central Jobs", "State Jobs", "Admit Cards", "Exam Results"]
        });
        setShowPushBanner(false);
      }
    } catch (err) {
      setPushSubscription({
        subscribed: true,
        channels: ["Central Jobs", "State Jobs", "Admit Cards", "Exam Results"]
      });
      setShowPushBanner(false);
    }
  };

  const handleDismissPushBanner = () => {
    localStorage.setItem("pushBannerDismissed", "true");
    setShowPushBanner(false);
    addToast("Alert subscription prompt dismissed. You can always subscribe using the bell icon in the header!", "success");
  };

  const togglePushChannel = (channel: string) => {
    setPushSubscription(prev => {
      const isSelected = prev.channels.includes(channel);
      const nextChannels = isSelected 
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel];
      addToast(`${isSelected ? "Disabled" : "Enabled"} alerts for ${channel}!`, "success");
      return {
        ...prev,
        channels: nextChannels
      };
    });
  };


  useEffect(() => {
    const timerTick = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timerTick);
  }, []);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showStateSelectorModal, setShowStateSelectorModal] = useState(false);

  // Dynamically inject Google structured JSON-LD Script tag to document head on the fly!
  useEffect(() => {
    const removeExisting = () => {
      const el = document.getElementById("dynamic-sarkari-jsonld");
      if (el) el.remove();
    };

    if (sitePage === "job" && selectedJob) {
      removeExisting();

      // Get schema data
      let schemaText = selectedJob.seo?.structuredDataSchema || "";
      if (!schemaText) {
        // Fallback default JobPosting rich microdata schema
        schemaText = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "JobPosting",
          "title": selectedJob.title,
          "hiringOrganization": {
            "@type": "Organization",
            "name": selectedJob.org,
            "sameAs": selectedJob.applyLink || "https://sarkariresultlive.in"
          },
          "datePosted": selectedJob.created?.split("T")[0] || "2026-05-30",
          "validThrough": selectedJob.lastDate,
          "description": selectedJob.desc || `${selectedJob.title} announced by ${selectedJob.org}.`
        }, null, 2);
      }

      try {
        const script = document.createElement("script");
        script.id = "dynamic-sarkari-jsonld";
        script.type = "application/ld+json";
        script.textContent = schemaText;
        document.head.appendChild(script);
      } catch (err) {
        console.warn("Failed to inject JSON-LD script into document head:", err);
      }
    } else {
      removeExisting();
    }

    return () => {
      removeExisting();
    };
  }, [sitePage, selectedJob]);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [qualificationFilter, setQualificationFilter] = useState("");
  const [stateSearch, setStateSearch] = useState("");
  const [viewAllCategory, setViewAllCategory] = useState<string | null>(null);
  const [viewAllSearch, setViewAllSearch] = useState("");
  const [homeLayoutMode, setHomeLayoutMode] = useState<"grid" | "list">("grid");

  // Clean navigation functions
  const goHome = () => {
    setSitePage("home");
    setSelectedState("All India");
    localStorage.removeItem("userStateSelection");
    setSelectedJob(null);
    setSearchQuery("");
    setCategoryFilter("");
    setQualificationFilter("");
    setViewAllCategory(null);
    setViewAllSearch("");
    setStateSearch("");
    window.scrollTo({ top: 0, behavior: "smooth" });
    addToast("🏠 Returned to Home. All filters cleared!", "success");
  };

  const goState = (stName: string) => {
    setSelectedState(stName);
    localStorage.setItem("userStateSelection", stName);
    setSitePage("home"); // Landing on Home under state context
    setSelectedJob(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goJob = (jb: Job) => {
    setSelectedJob(jb);
    setSitePage("job");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    if (sitePage === "job" && selectedState) {
      setSitePage("state");
    } else if (sitePage === "job") {
      setSitePage("home");
    } else if (sitePage === "state") {
      setSitePage("home");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Dynamic vacancies counters
  const activeJobs = useMemo(() => {
    return jobs.filter((j) => j.status === "active");
  }, [jobs]);

  const stateJobCount = useMemo(() => {
    const counts: Record<string, number> = {};
    activeJobs.forEach((job) => {
      const st = job.state;
      counts[st] = (counts[st] || 0) + 1;
    });
    return counts;
  }, [activeJobs]);

  const categoryJobCount = useMemo(() => {
    const counts: Record<string, number> = {};
    activeJobs.forEach((job) => {
      const cat = job.category;
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [activeJobs]);

  // Master job rules filters
  const filteredJobs = useMemo(() => {
    let list = activeJobs;

    if (selectedState) {
      list = list.filter(
        (j) => j.state === selectedState || j.state === "All India"
      );
    }

    if (categoryFilter) {
      list = list.filter((j) => j.category === categoryFilter);
    }

    if (qualificationFilter) {
      list = list.filter((j) => j.qual === qualificationFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.org.toLowerCase().includes(q) ||
          j.qual.toLowerCase().includes(q) ||
          j.state.toLowerCase().includes(q)
      );
    }

    return list;
  }, [activeJobs, selectedState, categoryFilter, qualificationFilter, searchQuery]);

  // Handle stat clicks
  const selectCategory = (cat: string) => {
    setCategoryFilter(cat);
    setSitePage("home");
    // Preserve selectedState so homepage auto-personalization survives category sift!
    setSearchQuery("");
    window.scrollTo({ top: 450, behavior: "smooth" });
  };

  // State search
  const filteredStates = useMemo(() => {
    if (!stateSearch) return STATE_CARDS;
    const q = stateSearch.toLowerCase();
    return STATE_CARDS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) || s.short.toLowerCase().includes(q)
    );
  }, [stateSearch]);

  const copyLinkToClipboard = () => {
    if (selectedJob) {
      const dummyUrl = `${window.location.origin}?job=${selectedJob.id}`;
      navigator.clipboard.writeText(dummyUrl);
      addToast("📋 Portal link copied to clipboard successfully!", "success");
    }
  };

  // Static exam dates
  const staticExams = [
    { title: "SSC Grade C Stenographer Grade Exam", date: "June 22, 2025" },
    { title: "UPSC IAS Preliminary Recruitment Exam", date: "June 12, 2025" },
    { title: "Bihar Police Constable Re-test Date", date: "July 04, 2025" },
    { title: "RRB NTPC Graduate Exam Stage-1", date: "August 18, 2025" }
  ];

  if (!selectedState) {
    return (
      <div className="min-h-screen bg-[#F0F4FF] text-slate-800 flex flex-col justify-center items-center py-10 px-4 relative overflow-hidden font-sans select-none">
        
        <div className="max-w-4xl w-full flex flex-col gap-6 text-center z-10 animate-fade-up">
          {/* Sarkari Result Style Logo */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 bg-[#022a7e] border-4 border-[#ff0000] p-4 rounded-xl shadow-2xl">
              <span className="text-3xl sm:text-5xl font-black text-white tracking-tighter">SARKARI</span>
              <span className="text-3xl sm:text-5xl font-black bg-[#ffde00] text-[#022a7e] px-2.5 py-0.5 rounded shadow-inner rotate-[-2deg]">RESULT</span>
            </div>
            <div className="mt-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#022a7e] tracking-tight">
                WWW.SARKARIRESULT.COM
              </h1>
              <p className="text-xs uppercase tracking-widest text-[#ff0000] font-black mt-1">
                ⭐⭐⭐ India's No. 1 Sourced Job Notification Portal 2026 ⭐⭐⭐
              </p>
            </div>
          </div>

          {/* Card containing selection items */}
          <div className="bg-white border-2 border-[#022a7e] p-6 sm:p-8 rounded-xl shadow-2xl flex flex-col gap-5">
            <div>
              <h2 className="text-lg md:text-2xl font-black text-[#ff0000] flex items-center justify-center gap-2 uppercase">
                🇮🇳 Select Your State / UT to Personalize
              </h2>
              <p className="text-xs text-slate-600 mt-1 font-bold">
                Get central administrative alerts compiled matches with local notifications from police, civil state commissions, and boards!
              </p>
            </div>

            {/* Sticky interactive filter input for state cards */}
            <div className="bg-[#f0f4ff] border-2 border-[#022a7e]/40 rounded-lg py-2 px-4 flex items-center gap-2 max-w-md w-full mx-auto">
              <Search className="w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Instant Search State or Union Territory..."
                value={stateSearch}
                onChange={(e) => setStateSearch(e.target.value)}
                className="bg-transparent border-0 text-slate-800 placeholder-slate-400 outline-none w-full text-xs font-bold focus:ring-0"
              />
              {stateSearch && (
                <button onClick={() => setStateSearch("")} className="text-slate-500 hover:text-slate-800 cursor-pointer select-none">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick action: State selection grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[360px] overflow-y-auto scrollbar-thin pr-1 select-none">
              <button
                onClick={() => {
                  setSelectedState("All India");
                  localStorage.setItem("userStateSelection", "All India");
                  addToast("🌎 Showing All India National jobs catalog!", "success");
                }}
                className="group bg-[#f8fafc] border-2 border-dashed border-[#ff0000]/60 p-3.5 rounded-lg text-left cursor-pointer transition-all duration-200 hover:bg-[#ff0000] hover:border-[#ff0000] hover:text-white flex items-center justify-between shadow-sm"
              >
                <div className="flex flex-col text-left leading-none">
                  <span className="font-sans font-black text-sm text-[#ff0000] group-hover:text-white transition leading-none">
                    ALL REGIONS
                  </span>
                  <span className="text-[10px] uppercase font-extrabold text-slate-500 group-hover:text-white transition mt-1.5">
                    All India / UTs
                  </span>
                </div>
              </button>
              {filteredStates.map((st) => {
                const count = stateJobCount[st.name] || 0;
                return (
                  <button
                    key={st.name}
                    onClick={() => {
                      setSelectedState(st.name);
                      localStorage.setItem("userStateSelection", st.name);
                      addToast(`🗺️ Homepage customized for ${st.name}!`, "success");
                    }}
                    className="group bg-[#f8fafc] border-2 border-slate-200 p-3.5 rounded-lg text-left cursor-pointer transition-all duration-200 hover:bg-[#022a7e] hover:border-[#022a7e] hover:text-white flex items-center justify-between shadow-sm"
                  >
                    <div className="flex flex-col text-left leading-none">
                      <span className="font-sans font-black text-sm text-[#022a7e] group-hover:text-white transition leading-none">
                        {st.short}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-500 group-hover:text-white transition mt-1.5">
                        {st.name}
                      </span>
                    </div>
                    <span className="bg-slate-200 text-slate-700 text-[10px] font-black px-1.5 py-0.5 rounded-full group-hover:bg-white/20 group-hover:text-white leading-none">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4FF] text-slate-800 flex flex-col font-sans mb-22 md:mb-0">
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-ticker-loop {
          display: flex;
          width: max-content;
          animation: ticker 45s linear infinite;
        }
        .animate-ticker-loop:hover {
          animation-play-state: paused;
        }
        .animate-blink-orange {
          animation: blink 1.2s infinite;
        }
        .state-card-hover {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .state-card-hover:hover {
          background-color: #0a0f2e !important;
          color: #ffffff !important;
          transform: translateY(-4px);
          border-color: #FF6B00 !important;
          box-shadow: 0 10px 18px rgba(10, 15, 46, 0.2);
        }
        .state-card-hover:hover .state-code {
          color: #FF6B00 !important;
        }
        .nav-hover-menu:hover .dropdown-menu-list {
          display: block !important;
        }
        .table-row-hover:hover {
          background-color: #fff7ed !important;
        }
        .job-link-hover:hover {
          color: #FF6B00 !important;
          padding-left: 4px;
        }
        .widget-link-hover {
          transition: all 0.15s ease;
        }
        .widget-link-hover:hover {
          color: #FF6B00 !important;
          padding-left: 6px;
        }
        .scale-hover {
          transition: transform 0.2s ease;
        }
        .scale-hover:hover {
          transform: scale(1.02);
        }
      `}</style>

      {/* TOP INFO STRIP (36px Height, Black, Centered updates, Live Clock) */}
      <div className="bg-[#05070f] text-white text-xs h-9 min-h-[36px] px-4 shadow-sm flex items-center justify-between z-[210] border-b border-slate-900 select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
          <span className="font-extrabold text-emerald-400 tracking-wider text-[11px] uppercase">
            🟢 LIVE: 125 New Jobs Available
          </span>
        </div>
        <div className="hidden md:block text-slate-400 text-[10px] font-black uppercase tracking-widest font-mono">
          Latest Recruitment Updates
        </div>
        <div className="text-slate-350 font-mono text-[10px] sm:text-xs font-bold bg-white/5 px-2.5 py-0.5 rounded-md border border-white/5 flex items-center gap-1.5 shadow-inner">
          <Clock className="w-3.5 h-3.5 text-[#FFB800]" />
          <span>
            {currentTime.toLocaleDateString(undefined, {
              weekday: "short",
              day: "numeric",
              month: "short"
            })} &bull; {currentTime.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* STICKY HEADER */}
      <header className="sticky top-0 bg-gradient-to-r from-[#01143f] via-[#022a7e] to-[#01143f] shadow-[0_4px_30px_rgba(0,0,0,0.3)] z-[200] border-b-4 border-[#ffde00] transition-all">
        <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-4 flex flex-row justify-between items-center gap-2 sm:gap-3.5">
          
          {/* Sarkari Result Classic Logo & Tagline - Dynamic Navigation Control */}
          <div 
            className="flex items-center gap-2.5 sm:gap-4 cursor-pointer group shrink-0 select-none active:scale-95 transition-transform duration-150" 
            onClick={goHome}
            title="Sarkari Result Home"
          >
            <div className="relative bg-gradient-to-br from-[#ff0a0a] via-[#ff0000] to-[#a30000] border-2 border-[#ffde00] p-2 sm:p-3 rounded-2xl text-center shadow-[0_4px_18px_rgba(255,0,0,0.4)] transform group-hover:scale-110 group-hover:rotate-1 transition-all duration-300 ring-4 ring-red-500/20">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-2xl pointer-events-none animate-pulse"></div>
              <span className="text-base sm:text-2xl font-black text-white block leading-none tracking-tight drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)] font-sans">SR</span>
              <span className="text-[5px] sm:text-[8px] font-black text-[#ffde00] block tracking-normal uppercase leading-none mt-1 whitespace-nowrap">ESTD 2026</span>
            </div>
            
            <div className="text-left font-sans">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight leading-none select-none drop-shadow-[0_2px_10px_rgba(255,222,0,0.15)] group-hover:text-white transition-colors duration-300">
                <span className="text-white">SARKARI</span>{" "}
                <span className="text-[#ffcb05] drop-shadow-[0_2px_12px_rgba(255,203,5,0.6)]">RESULT</span>
              </h1>
              <div className="flex items-center flex-wrap gap-2 mt-0.5 sm:mt-1.5">
                <p className="text-[7px] sm:text-[10px] uppercase tracking-widest text-[#56f082] font-black leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  WWW.SARKARIRESULT.COM
                </p>
                <span className="bg-emerald-500 text-white text-[6px] sm:text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase leading-none animate-pulse scale-90 sm:scale-100 origin-left select-none">
                  LIVE ⚡
                </span>
                {selectedState && selectedState !== "All India" && (
                  <span className="bg-[#FF6B00] border border-orange-400 text-white text-[8px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm shrink-0 uppercase tracking-wide leading-none select-none">
                    📍 {selectedState} HUB
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Animated Statistics Cards in Center - Sarkari Classic Style Counters */}
          <div className="hidden lg:flex items-center gap-2 select-none">
            <div className="bg-white/10 hover:bg-white/15 border border-white/20 px-3 py-1.5 rounded-lg text-center flex items-center gap-2 duration-150 shadow-sm">
              <span className="text-[#ffde00] text-xs font-black tracking-wider uppercase">💼 5000+ Central Recruitments</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="bg-white/10 hover:bg-white/15 border border-white/20 px-3 py-1.5 rounded-lg text-center flex items-center gap-2 duration-150 shadow-sm">
              <span className="text-[#56f082] text-xs font-black tracking-wider uppercase">📊 1200+ New Results</span>
              <span className="w-2 h-2 rounded-full bg-[#ff0000] animate-pulse"></span>
            </div>
            <div className="bg-white/10 hover:bg-white/15 border border-white/20 px-3 py-1.5 rounded-lg text-center flex items-center gap-2 duration-150 shadow-sm">
              <span className="text-white text-xs font-black tracking-wider uppercase">🪪 800+ Admit Cards</span>
              <span className="w-2 h-2 rounded-full bg-sky-300 animate-pulse"></span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Real-time Web Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                className={`p-2 sm:p-2.5 rounded-xl border flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md relative active:scale-95 ${
                  pushSubscription.subscribed 
                    ? "bg-[#10b981]/15 text-[#34d399] border-[#10b981]/30 hover:bg-[#10b981]/25 animate-none" 
                    : "bg-white/10 text-[#ffcb05] border-white/20 hover:bg-white/15 animate-pulse"
                }`}
                title="Job Alerts & Notification Radar"
              >
                <Bell className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${!pushSubscription.subscribed ? "animate-bounce" : ""}`} />
                
                {/* Unsubscribed Badge Indicator */}
                {!pushSubscription.subscribed && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#ff4d4d] border border-white text-[7px] font-black text-white rounded-full w-4 h-4 flex items-center justify-center shadow-md select-none">
                    !
                  </span>
                )}
                {pushSubscription.subscribed && pushAlerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-[8px] font-black text-white rounded-full w-3.5 h-3.5 flex items-center justify-center shadow-md animate-pulse">
                    {pushAlerts.length}
                  </span>
                )}
              </button>

              {/* Bell Dropdown Panel */}
              {isNotificationDropdownOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border-2 border-slate-200 shadow-2xl rounded-2xl overflow-hidden z-[999] text-left animate-fade-up">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-[#01143f] to-[#022a7e] text-white p-4 select-none">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Bell className="w-4 h-4 text-[#ffcb05]" />
                        <span className="font-extrabold text-sm uppercase tracking-wide">Job Alerts Radar</span>
                      </div>
                      <button 
                        onClick={() => setIsNotificationDropdownOpen(false)}
                        className="text-slate-300 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <p className="text-[10px] text-slate-300 font-semibold mt-1">
                      Configure your real-time notification triggers and alert categories.
                    </p>

                    {/* Status Toggle Banner */}
                    <div className="mt-3 bg-white/5 border border-white/10 p-2.5 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${pushSubscription.subscribed ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                        <span className="text-[11px] font-bold">
                          Status: {pushSubscription.subscribed ? '🟢 Web Alerts Active' : '⚪ Unsubscribed'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          if (pushSubscription.subscribed) {
                            setPushSubscription(prev => ({ ...prev, subscribed: false }));
                            addToast("Job Alerts subscription paused.", "warn");
                          } else {
                            handleSubscribeToPush();
                          }
                        }}
                        className={`text-[9px] font-black uppercase px-2 py-1 rounded transition border cursor-pointer ${
                          pushSubscription.subscribed 
                            ? "bg-amber-500 hover:bg-amber-650 text-white border-amber-600" 
                            : "bg-emerald-500 hover:bg-emerald-650 text-white border-emerald-600"
                        }`}
                      >
                        {pushSubscription.subscribed ? "Pause" : "Turn On"}
                      </button>
                    </div>
                  </div>

                  {/* Channels Configuration */}
                  <div className="p-3 bg-slate-50 border-b border-slate-150 select-none">
                    <h4 className="text-[9px] uppercase font-black tracking-widest text-[#FF6B00] mb-2">📡 Push Alert Channels</h4>
                    <div className="grid grid-cols-2 gap-1.5">
                      {["Central Jobs", "State Jobs", "Admit Cards", "Exam Results"].map(chan => {
                        const isChecked = pushSubscription.channels.includes(chan);
                        return (
                          <button
                            key={chan}
                            onClick={() => togglePushChannel(chan)}
                            disabled={!pushSubscription.subscribed}
                            className={`flex items-center justify-between p-2 rounded-lg border text-[10px] font-bold transition cursor-pointer text-left ${
                              !pushSubscription.subscribed 
                                ? "opacity-50 cursor-not-allowed bg-slate-100 border-slate-200 text-slate-450"
                                : isChecked
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            <span>{chan}</span>
                            <span className="text-xs">{isChecked ? "✅" : "🔕"}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Alerts Inbox Queue List */}
                  <div className="p-4 max-h-56 overflow-y-auto divide-y divide-slate-100">
                    <div className="flex items-center justify-between pb-2">
                      <span className="text-[9px] uppercase font-black tracking-widest text-slate-500 font-mono">📥 Notification Inbox ({pushAlerts.length})</span>
                      {pushAlerts.length > 0 && (
                        <button 
                          onClick={() => {
                            setPushAlerts([]);
                            addToast("Notification queue cleared!", "success");
                          }}
                          className="text-[9px] font-black text-rose-600 uppercase hover:underline cursor-pointer"
                        >
                          Clear All
                        </button>
                      )}
                    </div>

                    {pushAlerts.length === 0 ? (
                      <div className="py-6 text-center">
                        <p className="text-xs text-slate-400 font-bold font-sans">No alerts received yet</p>
                        <p className="text-[10px] text-slate-450 mt-1">Select channel targets to receive live updates!</p>
                      </div>
                    ) : (
                      pushAlerts.map(alert => (
                        <div key={alert.id} className="py-2.5 flex flex-col gap-0.5 font-sans">
                          <div className="flex justify-between items-start gap-2">
                            <span className="bg-blue-50 text-[#022a7e] border border-blue-100 font-black text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded leading-none">
                              {alert.category}
                            </span>
                            <span className="text-[8px] font-mono text-slate-400 font-semibold uppercase">
                              {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <h5 className="font-extrabold text-[11px] text-slate-800 leading-tight mt-1">{alert.title}</h5>
                          <p className="text-[10px] text-slate-500 leading-snug font-medium">{alert.body}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Active Test Action */}
                  <div className="p-3 bg-slate-50 border-t border-slate-150 flex items-center justify-center">
                    <button
                      onClick={() => {
                        sendPushAlertToClient(
                          "📣 Device Service Test",
                          "Your Web Push Notification Service is active and working perfectly!",
                          "Central Jobs"
                        );
                      }}
                      className="text-[10px] font-black uppercase text-[#022a7e] hover:text-red-650 flex items-center gap-1 select-none cursor-pointer"
                    >
                      ⚡ Test Local Bell Chime
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowStateSelectorModal(true)}
              className="bg-[#ff0000] hover:bg-red-700 text-white px-2 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-black flex items-center gap-1.5 border border-red-500 cursor-pointer tracking-wider select-none shadow-md hover:shadow-red-900/40 active:scale-95 transition-all uppercase"
            >
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ffde00]" />
              <span>{selectedState || "Select State"} ▼</span>
            </button>
            {currentUser?.email === "prokashmal799@gmail.com" && (
              <button
                onClick={() => setView("admin")}
                className="flex bg-[#ffde00] text-[#022a7e] hover:bg-[#ffe633] px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-black tracking-wider uppercase transition-all duration-150 shadow-md cursor-pointer items-center gap-1 border border-[#ffde00] active:scale-95"
              >
                ⚙️ <span className="hidden xs:inline">Super</span> Admin
              </button>
            )}
            {currentUser ? (
              <div className="hidden md:flex items-center gap-2 bg-white/10 border border-white/20 pl-2.5 pr-3 py-1.5 rounded-xl text-white select-none">
                <div className="w-5 h-5 rounded-full bg-[#ffde00] text-[#022a7e] font-black text-[9px] flex items-center justify-center border border-white shrink-0 overflow-hidden uppercase">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="" className="w-5 h-5 rounded-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    currentUser.email?.slice(0, 2)
                  )}
                </div>
                <span className="text-[10px] font-bold truncate max-w-[80px]" title={currentUser.email}>
                  {currentUser.displayName || currentUser.email?.split("@")[0]}
                </span>
                <button
                  onClick={logoutAdmin}
                  className="ml-2 bg-red-600/30 hover:bg-red-650 border border-red-500/20 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider transition cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="hidden md:block bg-white/10 hover:bg-white/20 text-white border border-white/30 px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-150 cursor-pointer active:scale-95"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* SARKARI RED NAV BAR */}
      <nav className="bg-gradient-to-r from-[#c30010] via-[#ef233c] to-[#c30010] text-white font-sans text-xs sm:text-xs font-black shadow-xl sticky top-[53px] sm:top-[77px] z-[190] border-b-4 border-[#ffcb05] overflow-x-auto scrollbar-none select-none">
        <div className="max-w-7xl mx-auto px-2 flex flex-row flex-nowrap items-center whitespace-nowrap min-w-max">
          
          <button 
            onClick={goHome} 
            className="hover:bg-black/15 hover:text-amber-200 px-5 py-3.5 flex items-center gap-2 border-r border-white/10 transition-all duration-300 uppercase tracking-wider relative group cursor-pointer active:scale-95"
          >
            <span className="text-sm">🏠</span> Home
            <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ffde00] to-yellow-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full shadow-[0_2px_10px_rgba(255,222,0,0.8)]"></span>
          </button>

          <button 
            onClick={() => selectCategory("Central Government")}
            className="hover:bg-black/15 hover:text-amber-200 px-5 py-3.5 border-r border-white/10 transition-all duration-300 uppercase tracking-wider text-left relative group font-black cursor-pointer active:scale-95"
          >
            <span className="text-sm">🏛</span> Central Recruitment
            <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ffde00] to-yellow-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full shadow-[0_2px_10px_rgba(255,222,0,0.8)]"></span>
          </button>

          {/* State Jobs with States Dropdown */}
          <div className="relative nav-hover-menu">
            <button 
              onClick={() => setShowStateSelectorModal(true)}
              className="hover:bg-black/15 hover:text-amber-200 px-5 py-3.5 flex items-center gap-1.5 border-r border-white/10 transition-all duration-300 uppercase tracking-wider relative group cursor-pointer active:scale-95"
            >
              <span className="text-sm">📍</span> State Jobs ▾
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ffde00] to-yellow-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full shadow-[0_2px_10px_rgba(255,222,0,0.8)]"></span>
            </button>
            <div className="absolute left-0 w-64 bg-gradient-to-b from-[#0a0f2e] to-[#01061f] border-t-4 border-[#ffcb05] rounded-b-2xl shadow-[0_15px_40px_rgba(0,0,0,0.55)] hidden dropdown-menu-list max-h-[320px] overflow-y-auto z-[300] border-x border-b border-white/5 backdrop-blur-md scrollbar-thin">
              {STATE_CARDS.map((st) => (
                <button
                  key={st.name}
                  onClick={() => goState(st.name)}
                  className="block w-full text-left px-5 py-3 text-xs text-slate-100 hover:bg-[#ef233c] hover:text-white transition-all dropdown-item font-extrabold border-b border-white/5 hover:pl-6 duration-200 cursor-pointer"
                >
                  📍 {st.name} ({stateJobCount[st.name] || 0})
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => { goHome(); setTimeout(() => { const el = document.getElementById("results-anchor"); el?.scrollIntoView({ behavior: "smooth" }); }, 150); }}
            className="hover:bg-black/15 hover:text-amber-200 px-5 py-3.5 border-r border-white/10 transition-all duration-300 uppercase tracking-wider relative group cursor-pointer active:scale-95"
          >
            <span className="text-sm">📊</span> Results
            <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ffde00] to-yellow-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full shadow-[0_2px_10px_rgba(255,222,0,0.8)]"></span>
          </button>
          
          <button 
            onClick={() => { goHome(); setTimeout(() => { const el = document.getElementById("admits-anchor"); el?.scrollIntoView({ behavior: "smooth" }); }, 150); }}
            className="hover:bg-black/15 hover:text-amber-200 px-5 py-3.5 border-r border-white/10 transition-all duration-300 uppercase tracking-wider relative group cursor-pointer active:scale-95"
          >
            <span className="text-sm">🪪</span> Admit Card
            <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ffde00] to-yellow-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full shadow-[0_2px_10px_rgba(255,222,0,0.8)]"></span>
          </button>

          <button 
            onClick={() => addToast("Detailed syllabus handbooks are integrated into individual recruitment description cards. Please click on job card.", "warn")}
            className="hover:bg-black/15 hover:text-amber-200 px-5 py-3.5 border-r border-white/10 transition-all duration-300 uppercase tracking-wider relative group cursor-pointer active:scale-95"
          >
            <span className="text-sm">📚</span> Syllabus
            <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ffde00] to-yellow-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full shadow-[0_2px_10px_rgba(255,222,0,0.8)]"></span>
          </button>

          <button 
            onClick={() => addToast("Official answer keys will be uploaded raw once central authorities declare results.", "warn")}
            className="hover:bg-black/15 hover:text-amber-200 px-5 py-3.5 transition-all duration-300 uppercase tracking-wider relative group cursor-pointer active:scale-95"
          >
            <span className="text-sm">✅</span> Answer Key
            <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ffde00] to-yellow-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full shadow-[0_2px_10px_rgba(255,222,0,0.8)]"></span>
          </button>
        </div>
      </nav>

      {/* BREAKING NEWS TICKER (Dark Navy, Orange LIVE Badge, Scrolling Marquee) */}
      <div className="bg-[#0A0F2E] border-b border-slate-800 text-white text-xs flex items-center overflow-hidden h-9 select-none">
        <div className="bg-[#FF6B00] text-white px-4 h-full flex items-center gap-1.5 z-10 font-black tracking-widest uppercase text-[11px] shrink-0 shadow-[4px_0_15px_rgba(255,107,0,0.4)]">
          <span className="w-2.5 h-2.5 rounded-full bg-white block animate-ping"></span>
          <span>LIVE ⚡</span>
        </div>
        <div className="relative flex-1 overflow-hidden h-full flex items-center">
          <div className="animate-ticker-loop whitespace-nowrap cursor-pointer uppercase font-extrabold text-[#FFB800] tracking-wider select-none flex items-center py-2 text-[11px]">
            <span>
              SSC CGL Notification Released &bull; RRB NTPC Recruitment Open &bull; India Post GDS Apply Online Live &bull; UPSC CDS Registration Started &bull;&nbsp;
              {ticker ? `${ticker} \u2022 ` : ""} 
              SSC CGL Notification Released &bull; RRB NTPC Recruitment Open &bull; India Post GDS Apply Online Live &bull; UPSC CDS Registration Started &bull;&nbsp;
              {ticker ? `${ticker} \u2022 ` : ""}
            </span>
          </div>
        </div>
      </div>

      {/* BODY MAIN ENVELOPE */}
      <main className="max-w-7xl mx-auto w-full px-4 py-3 flex-1 flex flex-col gap-6">



        {/* BREADCRUMB INDICATOR */}
        {sitePage !== "home" || categoryFilter || qualificationFilter || searchQuery ? (
          <div className="flex items-center justify-between bg-white border border-slate-200 py-3.5 px-5 rounded-2xl shadow-sm animate-fade-up">
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 font-semibold">
              <button onClick={goHome} className="text-[#1a56db] hover:underline hover:text-[#FF6B00]">Home</button>
              <ChevronRight className="w-4 h-4 text-slate-300" />
              {sitePage === "state" && (
                <>
                  <span className="text-slate-400">States</span>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                  <span className="text-slate-800 font-bold">{selectedState}</span>
                </>
              )}
              {sitePage === "job" && selectedJob && (
                <>
                  <button onClick={goBack} className="text-[#1a56db] hover:underline hover:text-[#FF6B00]">
                    {selectedJob.state}
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                  <span className="text-slate-800 font-bold line-clamp-1 max-w-sm">{selectedJob.title}</span>
                </>
              )}
              {sitePage === "home" && (categoryFilter || qualificationFilter || searchQuery) && (
                <>
                  <span className="text-slate-400">Active Filters</span>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                  <span className="text-[#FF6B00] font-bold">
                    {categoryFilter && `Category: ${categoryFilter}`}
                    {qualificationFilter && `Credentials: ${qualificationFilter}`}
                    {searchQuery && `Keyword: "${searchQuery}"`}
                  </span>
                </>
              )}
            </div>
            <button
              onClick={goBack}
              className="text-xs font-black text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg bg-slate-50 flex items-center gap-1 cursor-pointer transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          </div>
        ) : null}

        {/* 3-COLUMN LAYOUT MAIN AREA */}
        <div className="flex flex-col lg:flex-row gap-5">
          


          {/* CENTRAL CONTENT GRID */}
          <section className="flex-1 flex flex-col gap-6 order-1 lg:order-2">

            {/* SITE BREAD STATE: JOB DETAIL PAGE */}
            {sitePage === "job" && selectedJob ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-up">
                
                {/* Job Hero Banner */}
                <div 
                  className="p-6 md:p-8 text-white flex flex-col gap-3 relative"
                  style={{ backgroundColor: "#0a0f2e" }}
                >
                  <div className="absolute top-0 right-0 p-4">
                    {selectedJob.isHot && (
                      <span className="bg-[#e8192c] text-white text-[9px] font-black uppercase tracking-wider py-1 px-3 rounded-full shadow-lg block animate-pulse">
                        🔥 HOT RECRUITMENT
                      </span>
                    )}
                  </div>

                  <span className="text-xs uppercase font-extrabold tracking-widest text-[#FFB800]">
                    {selectedJob.org}
                  </span>
                  <h2 className="text-xl md:text-3xl font-black font-baloo leading-tight tracking-tight">
                    {selectedJob.title}
                  </h2>
                  <p className="text-xs md:text-sm text-slate-300 font-semibold -mt-1">
                    Designation Category: <span className="text-[#FF6B00] font-bold">{selectedJob.category}</span> &bull; State Jurisdiction: <span className="text-white font-bold">{selectedJob.state}</span>
                  </p>

                  {/* Badges strip */}
                  <div className="flex flex-wrap gap-2.5 mt-3.5">
                    <span className="bg-white/10 text-white border border-white/20 text-xs font-semibold py-1.5 px-3.5 rounded-lg flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#FFB800]" /> Last Date: <strong className="text-[#FFB800]">{selectedJob.lastDate}</strong>
                    </span>
                    <span className="bg-white/10 text-white border border-white/20 text-xs font-semibold py-1.5 px-3.5 rounded-lg flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-400" /> Vacancies: <strong className="text-emerald-400">{selectedJob.vacancy}</strong>
                    </span>
                    <span className="bg-white/10 text-white border border-white/20 text-xs font-semibold py-1.5 px-3.5 rounded-lg flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-sky-400" /> Credentials: <strong className="text-sky-400">{selectedJob.qual}</strong>
                    </span>
                  </div>
                </div>

                {/* Body details */}
                <div className="p-6 flex flex-col gap-6">

                  {/* Description Box */}
                  <div>
                    <h3 className="font-baloo text-base font-extrabold text-slate-900 border-b-2 border-slate-100 pb-2 flex items-center gap-2">
                      <span className="w-1.5 h-4.5 bg-[#FF6B00] rounded-full"></span> 📝 About This Recruitment
                    </h3>
                    <p className="text-slate-600 text-sm font-sans font-medium leading-relaxed mt-3.5 bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-line">
                      {selectedJob.desc || "Information regarding statutory board rules, selection criteria, exams schedules, Syllabus indices, physical standards and credentials check lists are appended under notification circular links. Candidates should download structural documents to prepare correctly."}
                    </p>
                  </div>

                  {/* Stat recruitment summary tables */}
                  <div>
                    <h3 className="font-baloo text-base font-extrabold text-slate-900 border-b-2 border-slate-100 pb-2 flex items-center gap-2 mb-3.5">
                      <span className="w-1.5 h-4.5 bg-[#FFB800] rounded-full"></span> 🕵️ Complete Structural Overview
                    </h3>
                    <div className="border border-slate-150 rounded-xl overflow-hidden shadow-sm">
                      <table className="w-full text-xs font-sans font-medium text-left">
                        <tbody>
                          {[
                            { label: "Conducting Body / Authority", val: selectedJob.org },
                            { label: "Notification Title / Post Name", val: selectedJob.title },
                            { label: "Available Positions Count", val: selectedJob.vacancy },
                            { label: "Assoc. Category Group", val: selectedJob.category },
                            { label: "Minimum Eligible Age Bracket", val: `${selectedJob.ageLow || "18"} to ${selectedJob.ageHigh || "32"} Years` },
                            { label: "Compensation pay Scale", val: selectedJob.salary || "As per Notification Scale guidelines" },
                            { label: "Official Status", val: selectedJob.status.toUpperCase() }
                          ].map((row, rIdx) => (
                            <tr key={rIdx} className="border-b border-slate-100 last:border-0 odd:bg-slate-50">
                              <td className="p-3 w-1/3 font-extrabold text-slate-500 uppercase tracking-wide text-[10px]">{row.label}</td>
                              <td className="p-3 font-bold text-slate-800">{row.val}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Fee and Dates double column grids */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Fee list */}
                    <div className="bg-white rounded-xl border border-slate-150 p-4 shadow-sm flex flex-col gap-3">
                      <h4 className="font-baloo font-black text-xs uppercase tracking-wider text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        💳 Statutory Application Fee
                      </h4>
                      <div className="text-xs font-medium space-y-2 flex-1">
                        <div className="flex justify-between pb-1.5 border-b border-light">
                          <span className="text-slate-500 font-bold">General / OBC:</span>
                          <span className="text-slate-800 font-extrabold">{selectedJob.fee || "₹100"}</span>
                        </div>
                        <div className="flex justify-between pb-1.5 border-b border-light">
                          <span className="text-slate-500 font-bold">SC / ST / Reserved:</span>
                          <span className="text-slate-800 font-extrabold">{selectedJob.feeSC || "Free"}</span>
                        </div>
                        <div className="flex justify-between pb-1.5 border-b border-light">
                          <span className="text-slate-500 font-bold">Female Candidates:</span>
                          <span className="text-slate-800 font-extrabold">{selectedJob.feeFemale || "Free"}</span>
                        </div>
                        <div className="flex justify-between pt-1">
                          <span className="text-slate-400 text-[10px] italic">Payment Mode: Netbanking, UPI, CSC card swipe channels</span>
                        </div>
                      </div>
                    </div>

                    {/* Dates list */}
                    <div className="bg-white rounded-xl border border-slate-150 p-4 shadow-sm flex flex-col gap-3">
                      <h4 className="font-baloo font-black text-xs uppercase tracking-wider text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        ⏳ Milestone Timelines
                      </h4>
                      <div className="text-xs font-medium space-y-2 flex-1">
                        <div className="flex justify-between pb-1.5 border-b border-light">
                          <span className="text-slate-500 font-bold">Release Registration:</span>
                          <span className="text-slate-800 font-extrabold">Active</span>
                        </div>
                        <div className="flex justify-between pb-1.5 border-b border-light">
                          <span className="text-[#e8192c] font-black">Registration Close:</span>
                          <span className="text-[#e8192c] font-black">{selectedJob.lastDate}</span>
                        </div>
                        <div className="flex justify-between pb-1.5 border-b border-light">
                          <span className="text-slate-500 font-bold">Online Exam date:</span>
                          <span className="text-slate-800 font-bold">To be Announced</span>
                        </div>
                        <div className="flex justify-between pt-1">
                          <span className="text-slate-400 text-[10px] italic">Marking schemes: Standard deduction rules as printed</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* 6 Grid action buttons */}
                  <div>
                    <h3 className="font-baloo text-base font-extrabold text-slate-900 border-b-2 border-slate-100 pb-2 flex items-center gap-2 mb-3.5">
                      <span className="w-1.5 h-4.5 bg-[#16a34a] rounded-full"></span> ⛓️ Official Statutory Prospectus Linkage
                    </h3>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                      
                      <a
                        href={selectedJob.notifLink || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-[#0a0f2e] text-white hover:bg-[#1a2550] flex flex-col items-center justify-center p-3 rounded-xl border border-slate-800 shadow-sm text-center font-bold tracking-tight text-xs h-18 text-decoration-none"
                      >
                        <Download className="w-5 h-5 mb-1.5 text-[#FFB800]" />
                        <span>Download Notification</span>
                      </a>

                      <a
                        href={selectedJob.applyLink || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-[#16a34a] text-white hover:bg-green-700 flex flex-col items-center justify-center p-3 rounded-xl shadow-sm text-center font-bold tracking-tight text-xs h-18 text-decoration-none"
                      >
                        <ExternalLink className="w-5 h-5 mb-1.5 text-white" />
                        <span>Apply Online Link</span>
                      </a>

                      <button
                        onClick={() => addToast("Form printable option is triggered upon uploading registered ID.", "warn")}
                        className="bg-[#FF6B00] text-white hover:bg-orange-600 flex flex-col items-center justify-center p-3 rounded-xl shadow-sm text-center font-bold tracking-tight text-xs h-18 cursor-pointer"
                      >
                        <Printer className="w-5 h-5 mb-1.5 text-white" />
                        <span>Print Application</span>
                      </button>

                      <button
                        onClick={() => addToast("The admit cards has not been prepared for download yet.", "warn")}
                        className="bg-purple-800 text-white hover:bg-purple-950 flex flex-col items-center justify-center p-3 rounded-xl shadow-sm text-center font-bold tracking-tight text-xs h-18 cursor-pointer"
                      >
                        <span>Download Admit</span>
                      </button>

                      <button
                        onClick={() => addToast("Results sheets will be uploaded after examination cycle.", "warn")}
                        className="bg-[#1a56db] text-white hover:bg-[#1e3a8a] flex flex-col items-center justify-center p-3 rounded-xl shadow-sm text-center font-bold tracking-tight text-xs h-18 cursor-pointer"
                      >
                        <span>Check Exam Results</span>
                      </button>

                      <button
                        onClick={() => addToast("Statutory answer keys will be compiled eventually.", "warn")}
                        className="bg-[#e8192c] text-white hover:bg-[#cc1625] flex flex-col items-center justify-center p-3 rounded-xl shadow-sm text-center font-bold tracking-tight text-xs h-18 cursor-pointer"
                      >
                        <span>Official Answer Key</span>
                      </button>

                    </div>
                  </div>

                  {/* Share buttons row */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-150 flex flex-col sm:flex-row justify-between items-center gap-3 mt-2">
                    <span className="text-xs font-bold text-slate-700">📣 Inform Your Colleagues & Friends:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { addToast("Sharing link copied directly! Send it via WhatsApp.", "success"); copyLinkToClipboard(); }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 rounded-lg font-black tracking-wide flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Share2 className="w-4 h-4" /> Share WhatsApp
                      </button>
                      <button
                        onClick={copyLinkToClipboard}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs px-4 py-2 rounded-lg font-black tracking-wide flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Copy className="w-4 h-4" /> Copy Link
                      </button>
                    </div>
                  </div>

                  {/* FAQs and SEO Google Simulator Container */}
                  <div className="space-y-6 mt-6">
                    
                    {/* ACCORDION FAQ BLOCK */}
                    <div className="bg-white border-2 border-slate-150 rounded-2xl p-5 shadow-sm text-left">
                      <h3 className="font-baloo text-base font-extrabold text-slate-905 border-b-2 border-slate-100 pb-2.5 flex items-center gap-2 mb-4">
                        <span className="w-1.5 h-4.5 bg-indigo-600 rounded-full"></span> 📑 Frequently Asked Questions (FAQ) & Guidelines
                      </h3>

                      {(!selectedJob.faq || selectedJob.faq.length === 0) ? (
                        <div className="space-y-4">
                          {[
                            {
                              question: `What is the closing timeline for registered ${selectedJob.org} applications?`,
                              answer: `Interested applicants must submit online forms before ${selectedJob.lastDate}. Detailed instruction schemes are highlighted in the prospectus handbook.`
                            },
                            {
                              question: `Is there an age relief factor for SC/ST candidates in ${selectedJob.org} recruitment?`,
                              answer: `Yes, upper age relaxation concessions are applied as per central statutory mandate codes. These are detailed inside the official notification circular.`
                            },
                            {
                              question: `Can I change my registered exam center after application fee settlement?`,
                              answer: `No, change requests for designated centers are strictly prohibited. Triple-check all parameters before confirming the final registration.`
                            }
                          ].map((item, idx) => (
                            <details key={idx} className="group border border-slate-150 rounded-xl [&_summary::-webkit-details-marker]:hidden bg-slate-50/25 transition">
                              <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-4 text-slate-900 select-none">
                                <h4 className="text-xs font-extrabold font-sans leading-snug flex items-center gap-2">
                                  <span className="text-[#FF6B00] font-black font-baloo text-[14px]">Q.</span> {item.question}
                                </h4>
                                <span className="relative size-5 shrink-0">
                                  <svg className="absolute inset-0 size-5 opacity-100 group-open:opacity-0 text-slate-500 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9" /></svg>
                                  <svg className="absolute inset-0 size-5 opacity-0 group-open:opacity-100 text-slate-500 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9" /></svg>
                                </span>
                              </summary>
                              <div className="border-t border-slate-150 p-4 text-xs font-semibold leading-relaxed text-slate-700 font-sans bg-white rounded-b-xl">
                                {item.answer}
                              </div>
                            </details>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {selectedJob.faq.map((item, idx) => (
                            <details key={idx} className="group border border-slate-150 rounded-xl [&_summary::-webkit-details-marker]:hidden bg-slate-50/25 transition">
                              <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-4 text-slate-900 select-none">
                                <h4 className="text-xs font-extrabold font-sans leading-snug flex items-center gap-2">
                                  <span className="text-indigo-600 font-black font-mono text-[14px]">Q.</span> {item.question}
                                </h4>
                                <span className="relative size-5 shrink-0">
                                  <svg className="absolute inset-0 size-5 opacity-100 group-open:opacity-0 text-slate-500 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9" /></svg>
                                  <svg className="absolute inset-0 size-5 opacity-0 group-open:opacity-100 text-slate-500 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9" /></svg>
                                </span>
                              </summary>
                              <div className="border-t border-slate-150 p-4 text-xs font-semibold leading-relaxed text-slate-700 font-sans bg-white rounded-b-xl">
                                {item.answer}
                              </div>
                            </details>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* SEO OPTIMIZER GOOGLE SIMULATOR FOR RANK 1 */}
                    <div className="bg-[#f8f9fc] border-2 border-slate-200 rounded-2xl p-5 text-left space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                          <span className="inline-block px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">Rank #1 Google SEO Active</span>
                          <span className="text-[10px] text-slate-500 font-bold">Search Preview Standard</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold font-mono">Mobile View Grid</div>
                      </div>

                      {/* Google Snippet Live Card Simulator */}
                      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-1.5 font-sans">
                        <div className="flex items-center gap-2.5 text-slate-800 select-none">
                          <div className="w-6 h-6 rounded-full bg-slate-105 border border-slate-200 flex items-center justify-center font-bold text-[#e01e22] text-[11px]">📢</div>
                          <div className="leading-tight text-left">
                            <div className="text-[11px] font-extrabold text-slate-800">Sarkari Alerts Portal</div>
                            <div className="text-[10px] text-emerald-700 flex items-center gap-1 leading-none font-mono">
                              <span>https://sarkarialerts.com &rsaquo; jobs &rsaquo; {selectedJob.title.toLowerCase().replace(/[^a-z0-str0-9]+/g, '-')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Title link */}
                        <a href="#" className="block text-[#1a0dab] hover:underline text-sm font-bold tracking-tight leading-tight mt-1 text-left text-decoration-none">
                          {selectedJob.seo?.metaTitle || `${selectedJob.title} Recruitment 2026 at ${selectedJob.org} - Apply Online`}
                        </a>

                        {/* Description */}
                        <p className="text-[11px] leading-relaxed text-slate-600 text-left">
                          <span className="text-slate-505 font-semibold">
                            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} &mdash;&nbsp;
                          </span>
                          {selectedJob.seo?.metaDesc || `Official prospectus announced by ${selectedJob.org}. Over ${selectedJob.vacancy} positions available. Final deadline date closes on ${selectedJob.lastDate}. Download handbook and apply online.`}
                        </p>

                        {/* Focus Keywords Tags */}
                        {selectedJob.seo?.focusKeywords && (
                          <div className="pt-2 flex flex-wrap gap-1">
                            {selectedJob.seo.focusKeywords.split(',').map((kw, i) => (
                              <span key={i} className="text-[9px] bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 font-medium font-mono">
                                #{kw.trim()}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Standard Schema Microdata badges */}
                        <div className="pt-2.5 flex items-center gap-3 border-t border-slate-100 text-[10px] text-slate-400 font-semibold select-none">
                          <span className="flex items-center gap-1 text-[#ea4335]">
                            <strong>⚡ Google Schema:</strong> JobPosting Verified
                          </span>
                          <span className="text-slate-300">|</span>
                          <span className="text-emerald-700">✓ JSON-LD Script Injected</span>
                        </div>
                      </div>

                      {/* Display JSON-LD Active Script markup */}
                      <details className="group border border-slate-200 rounded-xl bg-slate-50 text-xs">
                        <summary className="flex cursor-pointer items-center justify-between p-3 select-none text-slate-700 font-extrabold">
                          <span>🔍 View Injected Metadata Script (Structured JSON-LD)</span>
                          <span className="transition group-open:-rotate-180">
                            <svg fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="18"><path d="M6 9l6 6 6-6"></path></svg>
                          </span>
                        </summary>
                        <div className="border-t border-slate-200 p-3 bg-slate-900 text-lime-400 font-mono text-[10px] whitespace-pre-wrap rounded-b-xl overflow-x-auto text-left leading-relaxed">
                          {selectedJob.seo?.structuredDataSchema || JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "JobPosting",
                            "title": selectedJob.title,
                            "hiringOrganization": selectedJob.org,
                            "datePosted": "2026-05-30",
                            "validThrough": selectedJob.lastDate
                          }, null, 2)}
                        </div>
                      </details>
                      
                    </div>

                  </div>

                </div>
              </div>
            ) : null}

            {/* SITE HOME/STATE BREAD BODY */}
            {sitePage !== "job" ? (
              <div className="flex flex-col gap-6 font-sans">

                {/* DYNAMIC SCROLLING MARQUEE BLUE LINKS */}
                <div className="bg-[#ffffdf] border-2 border-[#e6db55] p-2 overflow-hidden flex items-center select-none shadow-sm rounded">
                  <div className="bg-[#e8192c] text-white text-[9px] sm:text-[10px] font-black uppercase px-2 py-[3px] leading-none shrink-0 rounded animate-pulse mr-2.5">
                    📢 Breaking
                  </div>
                  {/* Clean CSS-driven horizontal scrolling ticker */}
                  <div className="flex-1 overflow-hidden relative">
                    <div className="whitespace-nowrap flex items-center gap-1 animate-ticker text-[#002f9c] text-xs sm:text-[13px] font-bold hover:[animation-play-state:paused] cursor-pointer">
                      {(() => {
                        const tickerJobs = selectedState && selectedState !== "All India"
                          ? activeJobs.filter(jb => jb.state === selectedState || jb.state === "All India")
                          : activeJobs;
                        const displayJobs = tickerJobs.length > 0 ? tickerJobs : activeJobs;
                        return (
                          <>
                            {displayJobs.map((jb) => (
                              <div key={jb.id} className="inline-flex items-center gap-1">
                                <button
                                  onClick={() => goJob(jb)}
                                  className="hover:text-amber-500 hover:underline font-extrabold cursor-pointer text-[#002f9c] text-[12px] sm:text-[13px] select-none"
                                >
                                  {jb.state !== "All India" && <span className="text-[#FF6B00] font-black mr-1 uppercase">[{jb.state}]</span>}
                                  {jb.title}
                                </button>
                                <span className="text-[10px] text-green-600 font-extrabold align-super animate-pulse ml-0.5">[NEW]</span>
                                <span className="text-slate-300 mx-3 select-none">||</span>
                              </div>
                            ))}
                            {/* Duplicate for continuity */}
                            {displayJobs.map((jb) => (
                              <div key={`dup-${jb.id}`} className="inline-flex items-center gap-1">
                                <button
                                  onClick={() => goJob(jb)}
                                  className="hover:text-amber-500 hover:underline font-extrabold cursor-pointer text-[#002f9c] text-[12px] sm:text-[13px] select-none"
                                >
                                  {jb.state !== "All India" && <span className="text-[#FF6B00] font-black mr-1 uppercase">[{jb.state}]</span>}
                                  {jb.title}
                                </button>
                                <span className="text-[10px] text-green-600 font-extrabold align-super animate-pulse ml-0.5">[NEW]</span>
                                <span className="text-slate-300 mx-3 select-none">||</span>
                              </div>
                            ))}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* DYNAMIC SELECTED STATE HUD CALLOUT BANNER - SATISFIES STATE SELECTION TRIGGER IMMEDIATE HOME PAGE CHANGE */}
                {selectedState && selectedState !== "All India" && (
                  <div className="bg-gradient-to-r from-[#01143f] via-[#022a7e] to-[#01143f] border-2 border-[#FF6B00] rounded-2xl p-5 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg animate-fade-up">
                    <div className="flex items-center gap-3.5 text-left">
                      <div className="p-3 bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/40 rounded-2xl shrink-0 animate-pulse">
                        <MapPin className="w-6 h-6 text-[#FFB800]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-[#FF6B00] text-white font-black uppercase px-2 py-0.5 rounded tracking-widest leading-none">STATE PERSONALIZATION ACTIVE</span>
                          <span className="text-[9px] text-[#56f082] font-black tracking-wider animate-pulse uppercase leading-none">SELECT STATE WORKING LIVE</span>
                        </div>
                        <h2 className="text-lg font-black text-[#ffde00] tracking-tight mt-1 uppercase">
                          {selectedState} Customized Portal Hub
                        </h2>
                        <p className="text-xs text-slate-200 font-bold leading-relaxed max-w-2xl mt-1">
                          The homepage is dynamically loaded for <strong className="text-[#FFB800]">{selectedState}</strong> state recruitments, admit cards, and results. These records are highlighted at the top of their respective lists for fast access.
                        </p>
                      </div>
                    </div>
                    {/* Interaction Buttons right on banner */}
                    <div className="flex flex-wrap gap-2 shrink-0 w-full md:w-auto">
                      <button
                        onClick={() => {
                          setSelectedState("All India");
                          localStorage.setItem("userStateSelection", "All India");
                          addToast("🌎 Switched to All India National Jobs Hub!", "success");
                        }}
                        className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition cursor-pointer text-white shadow-sm flex items-center justify-center gap-1 w-full sm:w-auto"
                      >
                        🌎 All India
                      </button>
                      <button
                        onClick={() => setShowStateSelectorModal(true)}
                        className="bg-[#FF6B00] hover:bg-orange-600 px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition cursor-pointer text-white shadow-md flex items-center justify-center gap-1 w-full sm:w-auto"
                      >
                        ✏️ Change Location
                      </button>
                    </div>
                  </div>
                )}

                {/* HIGH CONTRAST BLOCK BANNER BUTTONS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-0.5 font-sans">
                  {[
                    { title: "SSC CGL 17k positions Form", bg: "bg-[#e11d48] border-[#9f1239]", q: "CGL", id: 1001 },
                    { title: "UP Police 60k Constable Apply", bg: "bg-[#0284c7] border-[#075985]", q: "UP Police", id: 1002 },
                    { title: "India Post GDS 35,500 Cycle", bg: "bg-[#16a34a] border-[#166534]", q: "Dak Sevak", id: 1003 },
                    { title: " rrb ntpc Graduate level Exam", bg: "bg-[#ea580c] border-[#9a3412]", q: "RRB NTPC", id: 1004 },
                    { title: "SBI Clerk Application open", bg: "bg-[#c026d3] border-[#86198f]", q: "SBI Clerk", id: 1005 },
                    { title: "WB Police 11K Constable Live", bg: "bg-[#2563eb] border-[#1e40af]", q: "WB Police", id: 1007 },
                    { title: "BPSC 71st Civil prelims Form", bg: "bg-[#0d9488] border-[#115e59]", q: "BPSC", id: 1010 },
                    { title: "Bihar Police 24K Constable", bg: "bg-[#ca8a04] border-[#854d0e]", q: "Bihar Police", id: 1009 }
                  ].map((block, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const match = jobs.find(j => j.title.toLowerCase().includes(block.q.toLowerCase()));
                        if (match) goJob(match);
                        else {
                          const matchById = jobs.find(j => j.id === block.id);
                          if (matchById) goJob(matchById);
                          else addToast(`Opening dynamic circular: ${block.title}`, "success");
                        }
                      }}
                      className={`${block.bg} text-white font-extrabold text-[12px] sm:text-xs text-center py-3.5 px-2.5 rounded shadow-md border-b-4 border-black/20 flex items-center justify-center font-sans tracking-wide leading-tight cursor-pointer transition hover:brightness-105 active:scale-95 leading-normal select-none overflow-hidden h-[54px]`}
                    >
                      <span className="line-clamp-2 uppercase">{block.title}</span>
                    </button>
                  ))}
                </div>

                {/* INTERACTIVE SEARCH, FILTER & LAYOUT SWITCHER BAR */}
                <div className="bg-[#022a7e]/5 border border-[#022a7e]/15 p-4 rounded-xl flex flex-col lg:flex-row gap-4 items-center justify-between shadow-sm font-sans select-none text-left">
                  <div className="flex flex-col gap-1 w-full lg:w-auto">
                    <span className="text-[9px] uppercase font-black tracking-widest text-[#FF6B00] leading-none">📡 RECRUITMENTS CONTROL RADAR</span>
                    <h3 className="text-base font-black text-[#022a7e] leading-snug">Search & Custom Sifter</h3>
                  </div>
                  
                  {/* Controls Container */}
                  <div className="flex flex-wrap md:flex-nowrap gap-2 w-full lg:w-auto items-stretch sm:items-center">
                    {/* Search Field input */}
                    <div className="bg-white border-2 border-slate-250 hover:border-[#022a7e] focus-within:border-[#022a7e] rounded-lg py-1.5 px-3 flex items-center gap-1.5 shadow-sm transition w-full sm:w-auto min-w-[220px]">
                      <Search className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        placeholder="Search posts (SSC, Police, Civil...)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-0 text-slate-800 placeholder-slate-400 outline-none w-full text-xs font-bold focus:ring-0 p-0"
                      />
                      {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-800 cursor-pointer">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Category Filter */}
                    <select
                      value={categoryFilter}
                      onChange={(e) => {
                        setCategoryFilter(e.target.value);
                        addToast(e.target.value ? `Category set to ${e.target.value}` : "Cleared category", "success");
                      }}
                      className="bg-white border-2 border-slate-250 hover:border-[#022a7e] rounded-lg text-xs font-bold py-1.5 px-2.5 outline-none text-slate-700 shadow-sm transition cursor-pointer shrink-0 min-w-[140px]"
                    >
                      <option value="">All Categories</option>
                      {JOB_CATS.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>

                    {/* Qualification Filter */}
                    <select
                      value={qualificationFilter}
                      onChange={(e) => {
                        setQualificationFilter(e.target.value);
                        addToast(e.target.value ? `Credentials set to ${e.target.value}` : "Cleared credentials", "success");
                      }}
                      className="bg-white border-2 border-slate-250 hover:border-[#022a7e] rounded-lg text-xs font-bold py-1.5 px-2.5 outline-none text-slate-700 shadow-sm transition cursor-pointer shrink-0 min-w-[145px]"
                    >
                      <option value="">All Qualifications</option>
                      {QUALS.map(q => (
                        <option key={q} value={q}>{q}</option>
                      ))}
                    </select>

                    {/* Layout Toggler Switcher */}
                    <div className="bg-[#022a7e]/10 border border-[#022a7e]/15 p-1 rounded-lg flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setHomeLayoutMode("grid");
                          addToast("🏛 Classic Grid directory board restored!", "success");
                        }}
                        className={`text-[11px] font-black px-3 py-1.5 rounded-md flex items-center gap-1.5 cursor-pointer uppercase transition-all duration-150 ${homeLayoutMode === "grid" ? "bg-[#022a7e] text-white shadow-md" : "text-slate-700 hover:bg-white/40"}`}
                        title="Classic Grid Board View"
                      >
                        👥 Grid board
                      </button>
                      <button
                        onClick={() => {
                          setHomeLayoutMode("list");
                          addToast("📋 Complete interactive Posts list loaded!", "success");
                        }}
                        className={`text-[11px] font-black px-3 py-1.5 rounded-md flex items-center gap-1.5 cursor-pointer uppercase transition-all duration-150 ${homeLayoutMode === "list" ? "bg-[#022a7e] text-white shadow-md" : "text-slate-700 hover:bg-white/40"}`}
                        title="Post List View"
                      >
                        📋 Post list
                      </button>
                    </div>

                  </div>
                </div>

                {/* CONDITIONAL RENDER: IF ACTIVE FILTER OR LIST MODE IS ENGAGED, SHOW SEPARATE LIST, ELSE MASSIVE 8 COLS */}
                {searchQuery || categoryFilter || qualificationFilter || homeLayoutMode === "list" ? (
                  <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm overflow-hidden text-left">
                    <div className="bg-gradient-to-r from-[#0a0f2e] to-[#12183d] text-white p-4 flex flex-col sm:flex-row justify-between items-center gap-2">
                      <div>
                        <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                          <span className="w-1.5 h-4.5 bg-[#FF6B00] rounded-full inline-block"></span>
                          <span>
                            {searchQuery || categoryFilter || qualificationFilter 
                              ? `🔍 Filter Search Results (${filteredJobs.length} Alerts found)`
                              : `📋 Complete Recruitment List (${filteredJobs.length} Alerts compiled)`}
                          </span>
                        </h3>
                        <p className="text-[10px] text-slate-350 font-semibold mt-0.5">Showing matching active government alerts</p>
                      </div>
                      {(searchQuery || categoryFilter || qualificationFilter) && (
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setCategoryFilter("");
                            setQualificationFilter("");
                            addToast("Filters reset successfully!", "success");
                          }}
                          className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-black px-3 py-1 rounded transition border border-white/20 cursor-pointer uppercase shrink-0"
                        >
                          Clear Filters &times;
                        </button>
                      )}
                    </div>

                    {filteredJobs.length === 0 ? (
                      <div className="p-12 text-center text-slate-450">
                        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                        <p className="font-extrabold text-xs">No matching recruitment notices found.</p>
                        <p className="text-[11px] text-slate-400 mt-1">Try broadening parameters or clearing state filter above.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-dashed divide-slate-200">
                        {filteredJobs.map((jb) => (
                          <div
                            key={jb.id}
                            onClick={() => goJob(jb)}
                            className="p-4 hover:bg-orange-50/45 transition cursor-pointer flex items-center justify-between gap-4"
                          >
                            <div className="flex items-start gap-2 text-left">
                              <span className="text-[#e21b1b] shrink-0 font-bold mt-1 text-sm select-none">■</span>
                              <div>
                                <h4 className="text-sm font-black text-[#002f9c] hover:underline leading-tight">{jb.title}</h4>
                                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1 text-[11px] text-slate-500 font-bold uppercase">
                                  <span className="text-[#FF6B00]">🏢 {jb.org}</span>
                                  <span>&bull;</span>
                                  <span>📍 {jb.state}</span>
                                  <span>&bull;</span>
                                  <span className="text-emerald-700">💼 Vacancy: {jb.vacancy}</span>
                                  <span>&bull;</span>
                                  <span className="text-rose-600">⌛ Apply Till: {jb.lastDate}</span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); goJob(jb); }}
                              className="bg-[#1f93ff] hover:bg-[#002f9c] text-white text-[10px] font-black px-3 py-1.5 rounded transition uppercase tracking-wider shrink-0"
                            >
                              View Page
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    
                    {/* MAJESTIC 3-COLUMN CLASSIC CATEGORY DIRECTORY BOARD GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="jobs-anchor">
                      
                      {/* Box 1: Results Column (Top Priority) */}
                      <div className="bg-white border-2 border-emerald-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between" id="results-anchor" style={{ minHeight: "440px" }}>
                        <div className="bg-gradient-to-r from-[#006400] to-[#166534] text-white py-3.5 px-4 text-center font-sans text-sm sm:text-base font-black tracking-wider select-none uppercase shadow-sm flex items-center justify-center gap-2">
                          <Award className="w-4.5 h-4.5 text-[#ffcb05]" />
                          <span>{selectedState && selectedState !== "All India" ? `🏆 ${selectedState} Results` : "Results"}</span>
                        </div>
                        <ul className="p-4 divide-y divide-dashed divide-slate-150 text-left text-xs leading-relaxed flex-1 flex flex-col gap-1 justify-start font-sans">
                          {(() => {
                            const isStateSet = selectedState && selectedState !== "All India";
                            const activeResults = results.filter(r => r.status === "published");
                            
                            const sorted = [...activeResults].sort((a, b) => {
                              if (isStateSet) {
                                if (a.state === selectedState && b.state !== selectedState) return -1;
                                if (a.state !== selectedState && b.state === selectedState) return 1;
                              }
                              return 0;
                            });

                            return sorted.slice(0, 8).map((res) => {
                              const isMatch = isStateSet && res.state === selectedState;
                              return (
                                <li key={res.id} className={`flex items-start gap-2.5 py-2 px-2 rounded-xl transition-all duration-150 ${isMatch ? "bg-emerald-50 border border-emerald-200/50" : "hover:bg-emerald-50/50"}`}>
                                  <span className={`shrink-0 font-bold text-xs select-none pt-0.5 ${isMatch ? "text-emerald-700" : "text-[#ff0000]"}`}>■</span>
                                  <a
                                    href={res.link || "#"}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[#002f9c] hover:text-[#ff3c00] text-[12px] sm:text-[13px] font-extrabold text-left leading-normal transition hover:underline group ml-1"
                                  >
                                    {isMatch && <span className="text-[9px] bg-emerald-600 text-white font-black px-1.5 py-0.5 rounded mr-1.5 select-none inline-block animate-pulse">YOUR STATE</span>}
                                    {res.title}
                                    <span className="text-[10px] bg-[#10b981]/15 text-[#059669] border border-[#10b981]/30 font-black px-1.5 py-0.5 rounded ml-1.5 inline-block animate-pulse">NEW</span>
                                  </a>
                                </li>
                              );
                            });
                          })()}
                        </ul>
                        <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-center items-center select-none">
                          <button
                            onClick={() => setViewAllCategory("Latest Results")}
                            className="bg-[#006400] hover:bg-green-700 text-white font-black text-[11px] py-2 px-6 rounded-xl cursor-pointer uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-sm hover:shadow-green-105"
                          >
                            View All Results
                          </button>
                        </div>
                      </div>

                      {/* Box 2: Admit Card Column */}
                      <div className="bg-white border-2 border-blue-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between" id="admits-anchor" style={{ minHeight: "440px" }}>
                        <div className="bg-gradient-to-r from-[#022a7e] to-[#1e40af] text-white py-3.5 px-4 text-center font-sans text-sm sm:text-base font-black tracking-wider select-none uppercase shadow-sm flex items-center justify-center gap-2">
                          <Calendar className="w-4.5 h-4.5 text-[#ffcb05]" />
                          <span>{selectedState && selectedState !== "All India" ? `📅 ${selectedState} Admit Cards` : "Admit Cards"}</span>
                        </div>
                        <ul className="p-4 divide-y divide-dashed divide-slate-150 text-left text-xs leading-relaxed flex-1 flex flex-col gap-1 justify-start font-sans">
                          {(() => {
                            const isStateSet = selectedState && selectedState !== "All India";
                            const activeAdmits = admits.filter(a => a.status === "published");
                            
                            const sorted = [...activeAdmits].sort((a, b) => {
                              if (isStateSet) {
                                if (a.state === selectedState && b.state !== selectedState) return -1;
                                if (a.state !== selectedState && b.state === selectedState) return 1;
                              }
                              return 0;
                            });

                            return sorted.slice(0, 8).map((adm) => {
                              const isMatch = isStateSet && adm.state === selectedState;
                              return (
                                <li key={adm.id} className={`flex items-start gap-2.5 py-2 px-2 rounded-xl transition-all duration-150 ${isMatch ? "bg-blue-50 border border-blue-200/50" : "hover:bg-blue-50/50"}`}>
                                  <span className={`shrink-0 font-bold text-xs select-none pt-0.5 ${isMatch ? "text-blue-700" : "text-[#ff0000]"}`}>■</span>
                                  <a
                                    href={adm.link || "#"}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[#002f9c] hover:text-[#ff3c00] text-[12px] sm:text-[13px] font-extrabold text-left leading-normal transition hover:underline group ml-1"
                                  >
                                    {isMatch && <span className="text-[9px] bg-indigo-600 text-white font-black px-1.5 py-0.5 rounded mr-1.5 select-none inline-block">YOUR STATE</span>}
                                    {adm.title}
                                    <span className="text-[10px] bg-[#10b981]/15 text-[#059669] border border-[#10b981]/30 font-black px-1.5 py-0.5 rounded ml-1.5 inline-block animate-pulse">NEW</span>
                                  </a>
                                </li>
                              );
                            });
                          })()}
                        </ul>
                        <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-center items-center select-none">
                          <button
                            onClick={() => setViewAllCategory("Admit Cards")}
                            className="bg-[#022a7e] hover:bg-blue-800 text-white font-black text-[11px] py-2 px-6 rounded-xl cursor-pointer uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-sm hover:shadow-blue-105"
                          >
                            View All Admit Cards
                          </button>
                        </div>
                      </div>

                      {/* Box 3: Central Jobs Column */}
                      <div className="bg-white border-2 border-red-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between" style={{ minHeight: "440px" }}>
                        <div className="bg-gradient-to-r from-[#7c0707] to-[#a31d1d] text-white py-3.5 px-4 text-center font-sans text-sm sm:text-base font-black tracking-wider select-none uppercase shadow-sm flex items-center justify-center gap-2">
                          <Briefcase className="w-4.5 h-4.5 text-[#ffcb05]" />
                          <span>Central Recruitment</span>
                        </div>
                        <ul className="p-4 divide-y divide-dashed divide-slate-150 text-left text-xs leading-relaxed flex-1 flex flex-col gap-1 justify-start">
                          {(() => {
                            const central = activeJobs.filter(jb => jb.state === "All India");
                            return central.slice(0, 8).map((jb) => (
                              <li key={jb.id} className="flex items-start gap-2.5 py-2 px-2 hover:bg-red-50/50 rounded-xl transition-all duration-150">
                                <span className="text-[#ff0000] shrink-0 font-bold text-xs select-none pt-0.5">■</span>
                                <button
                                  onClick={() => goJob(jb)}
                                  className="text-[#002f9c] hover:text-[#ff3c00] text-[12px] sm:text-[13px] font-extrabold text-left leading-normal cursor-pointer transition hover:underline"
                                >
                                  {jb.title}
                                  {jb.isNew && <span className="text-[10px] bg-[#10b981]/15 text-[#059669] border border-[#10b981]/30 font-black px-1.5 py-0.5 rounded ml-1.5 inline-block animate-pulse">NEW</span>}
                                </button>
                              </li>
                            ));
                          })()}
                        </ul>
                        <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-center items-center select-none">
                          <button
                            onClick={() => setViewAllCategory("Latest Jobs")}
                            className="bg-[#7c0707] hover:bg-red-800 text-white font-black text-[11px] py-2 px-6 rounded-xl cursor-pointer uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-sm hover:shadow-red-105"
                          >
                            View All Central Jobs
                          </button>
                        </div>
                      </div>

                      {/* Box 4: State Jobs Column */}
                      <div className="bg-white border-2 border-orange-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between" style={{ minHeight: "440px" }}>
                        <div className="bg-gradient-to-r from-[#b45309] to-[#d97706] text-white py-3.5 px-4 text-center font-sans text-sm sm:text-base font-black tracking-wider select-none uppercase shadow-sm flex items-center justify-center gap-2">
                          <MapPin className="w-4.5 h-4.5 text-[#ffcb05] animate-pulse" />
                          <span>{selectedState && selectedState !== "All India" ? `📍 ${selectedState} Jobs` : "State Recruitment"}</span>
                        </div>
                        <ul className="p-4 divide-y divide-dashed divide-slate-150 text-left text-xs leading-relaxed flex-1 flex flex-col gap-1 justify-start">
                          {(() => {
                            const isStateSet = selectedState && selectedState !== "All India";
                            const stateSpecific = activeJobs.filter(jb => jb.state !== "All India");
                            
                            const displayedSpecific = isStateSet 
                              ? stateSpecific.filter(jb => jb.state === selectedState) 
                              : stateSpecific;
                            
                            if (isStateSet && displayedSpecific.length === 0) {
                              const fallbackJobs = [...stateSpecific].sort((a, b) => {
                                if (a.isNew && !b.isNew) return -1;
                                if (!a.isNew && b.isNew) return 1;
                                return 0;
                              });

                              return (
                                <div className="flex-1 flex flex-col justify-center items-center text-center p-3 text-slate-500 my-auto">
                                  <AlertTriangle className="w-7 h-7 text-amber-500 mb-1.5 animate-bounce" />
                                  <p className="font-extrabold text-[11px] text-slate-800">No active postings for {selectedState}</p>
                                  <p className="text-[10px] text-slate-500 mt-1 max-w-[220px] leading-snug">Showing other state recruitments sorted below.</p>
                                  
                                  <div className="mt-4 w-full divide-y divide-dashed divide-slate-150 text-left">
                                    {fallbackJobs.slice(0, 4).map((jb) => (
                                      <div key={jb.id} className="py-2 hover:bg-slate-50 px-1.5 rounded transition">
                                        <button onClick={() => goJob(jb)} className="text-[#002f9c] hover:underline font-extrabold text-[12px] leading-snug block text-left w-full">
                                          <span className="text-[9px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded font-black mr-1.5 border border-amber-200 inline-block">{jb.state}</span>
                                          {jb.title}
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            }

                            const sorted = [...displayedSpecific].sort((a, b) => {
                              if (selectedState && selectedState !== "All India") {
                                if (a.state === selectedState && b.state !== selectedState) return -1;
                                if (a.state !== selectedState && b.state === selectedState) return 1;
                              }
                              return 0;
                            });

                            return sorted.slice(0, 8).map((jb) => (
                              <li key={jb.id} className="flex items-start gap-2.5 py-2 px-2 hover:bg-orange-50/50 rounded-xl transition-all duration-150">
                                <span className="text-[#ff0000] shrink-0 font-bold text-xs select-none pt-0.5">■</span>
                                <button
                                  onClick={() => goJob(jb)}
                                  className="text-[#002f9c] hover:text-[#ff3c00] text-[12px] sm:text-[13px] font-extrabold text-left leading-normal cursor-pointer transition hover:underline animate-fade-in"
                                >
                                  <span className="text-[10px] bg-amber-50 text-[#c2410c] px-1.5 py-0.5 rounded font-black mr-1.5 border border-orange-200 inline-block">{jb.state}</span>
                                  {jb.title}
                                  {jb.isNew && <span className="text-[10px] bg-[#10b981]/15 text-[#059669] border border-[#10b981]/30 font-black px-1.5 py-0.5 rounded ml-1.5 inline-block animate-pulse">NEW</span>}
                                </button>
                              </li>
                            ));
                          })()}
                        </ul>
                        <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-center items-center select-none">
                          <button
                            onClick={() => setViewAllCategory("State Jobs")}
                            className="bg-[#b45309] hover:bg-amber-700 text-white font-black text-[11px] py-2 px-6 rounded-xl cursor-pointer uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-sm hover:shadow-orange-105"
                          >
                            View All State Jobs
                          </button>
                        </div>
                      </div>

                      {/* Box 5: Answer Key Column */}
                      <div className="bg-white border-2 border-purple-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between" style={{ minHeight: "440px" }}>
                        <div className="bg-gradient-to-r from-[#6b21a8] to-[#8b5cf6] text-white py-3.5 px-4 text-center font-sans text-sm sm:text-base font-black tracking-wider select-none uppercase shadow-sm flex items-center justify-center gap-2">
                          <Sparkles className="w-4.5 h-4.5 text-[#ffcb05]" />
                          <span>{selectedState && selectedState !== "All India" ? `🔑 ${selectedState} Answer Keys` : "Answer Key"}</span>
                        </div>
                        <ul className="p-4 divide-y divide-dashed divide-slate-150 text-left text-xs leading-relaxed flex-1 flex flex-col gap-1 justify-start font-sans">
                          {(() => {
                            const defaultList = [
                              "SSC Combined Graduate Level (CGL) 2026 Tier-1 Answer Key",
                              "UPSC Civil Services Pre GS Paper 1 & 2 Answer Keys",
                              "Railway NTPC Stage-1 Computer Based Test Answer Key",
                              "UP Police Constable Written Shift 1 & 2 Answer Key",
                              "Bihar Police Constable Re-test Provisional Answer Sheet",
                              "WBPSC Clerkship Entrance Objective Test Answer Keys",
                              "CSIR UGC NET June General Science Answer Sheet Release",
                              "SBI Clerk Junior Associate Mains exam Answer Paper"
                            ];
                            const displayedList = selectedState && selectedState !== "All India"
                              ? [
                                  `👑 ${selectedState} State Eligibility Test (SET) Answer Key 2026`,
                                  `⚡ ${selectedState} State Police Written Exam Shift 1 Answer Sheet`,
                                  ...defaultList.filter(item => !item.includes("UP Police") && !item.includes("Bihar Police") && !item.includes("WBPSC"))
                                ]
                              : defaultList;

                            return displayedList.map((text, idx) => {
                              const isMatch = selectedState && selectedState !== "All India" && (text.startsWith("👑") || text.startsWith("⚡"));
                              return (
                                <li key={idx} className={`flex items-start gap-2.5 py-2 px-2 rounded-xl transition-all duration-150 ${isMatch ? "bg-purple-50 border border-purple-200/50" : "hover:bg-purple-50/50"}`}>
                                  <span className={`shrink-0 font-bold text-xs select-none pt-0.5 ${isMatch ? "text-purple-700" : "text-[#ff0000]"}`}>■</span>
                                  <button
                                    onClick={() => addToast(`Opening statutory solution sheet: ${text}`, "success")}
                                    className="text-[#002f9c] hover:text-[#ff3c00] text-[12px] sm:text-[13px] font-extrabold text-left leading-normal cursor-pointer transition hover:underline animate-fade-in"
                                  >
                                    {text}
                                  </button>
                                </li>
                              );
                            });
                          })()}
                        </ul>
                        <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-center items-center select-none">
                          <button
                            onClick={() => setViewAllCategory("Answer Key")}
                            className="bg-[#6b21a8] hover:bg-purple-800 text-white font-black text-[11px] py-2 px-6 rounded-xl cursor-pointer uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-sm hover:shadow-purple-105"
                          >
                            View All Answer Keys
                          </button>
                        </div>
                      </div>

                      {/* Box 6: Syllabus Column */}
                      <div className="bg-white border-2 border-sky-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between" style={{ minHeight: "440px" }}>
                        <div className="bg-gradient-to-r from-[#0c4a6e] to-[#0369a1] text-white py-3.5 px-4 text-center font-sans text-sm sm:text-base font-black tracking-wider select-none uppercase shadow-sm flex items-center justify-center gap-2">
                          <GraduationCap className="w-4.5 h-4.5 text-[#ffcb05]" />
                          <span>{selectedState && selectedState !== "All India" ? `📚 ${selectedState} Syllabus` : "Syllabus"}</span>
                        </div>
                        <ul className="p-4 divide-y divide-dashed divide-slate-150 text-left text-xs leading-relaxed flex-1 flex flex-col gap-1 justify-start font-sans">
                          {(() => {
                            const defaultList = [
                              "UPSC Civil Services IAS Pre & Mains Detailed Exam Scheme",
                              "SSC CGL combined Graduate Level exams structural syllabus",
                              "Railway Board RRB NTPC Written Exam Syllabus PDF",
                              "Bihar Police CSBC Constable physical and Written standards",
                              "West Bengal Police Constable Exam pattern and syllabus",
                              "UP Police Constable objective test syllabus handout",
                              "SBI Clerk Clerical customer support study blueprints",
                              "IBPS Specialist Officers written syllabus formulation"
                            ];
                            const displayedList = selectedState && selectedState !== "All India"
                              ? [
                                  `📚 ${selectedState} PSC Combined State Civil Services detailed Exam Scheme`,
                                  `🎯 ${selectedState} State Police Constable & Sub-Inspector Physical syllabus`,
                                  ...defaultList.filter(item => !item.includes("Bihar") && !item.includes("West Bengal") && !item.includes("UP Police"))
                                ]
                              : defaultList;

                            return displayedList.map((text, idx) => {
                              const isMatch = selectedState && selectedState !== "All India" && (text.startsWith("📚") || text.startsWith("🎯"));
                              return (
                                <li key={idx} className={`flex items-start gap-2.5 py-2 px-2 rounded-xl transition-all duration-150 ${isMatch ? "bg-sky-50 border border-sky-200/50" : "hover:bg-sky-50/50"}`}>
                                  <span className={`shrink-0 font-bold text-xs select-none pt-0.5 ${isMatch ? "text-sky-700" : "text-[#ff0000]"}`}>■</span>
                                  <button
                                    onClick={() => addToast(`Downloading dynamic handbook: ${text}`, "success")}
                                    className="text-[#002f9c] hover:text-[#ff3c00] text-[12px] sm:text-[13px] font-extrabold text-left leading-normal cursor-pointer transition hover:underline animate-fade-in"
                                  >
                                    {text}
                                  </button>
                                </li>
                              );
                            });
                          })()}
                        </ul>
                        <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-center items-center select-none">
                          <button
                            onClick={() => setViewAllCategory("Syllabus")}
                            className="bg-[#0c4a6e] hover:bg-sky-900 text-white font-black text-[11px] py-2 px-6 rounded-xl cursor-pointer uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-sm hover:shadow-sky-105"
                          >
                            View All Syllabus PDF
                          </button>
                        </div>
                      </div>

                      {/* Box 7: Admission Column */}
                      <div className="bg-white border-2 border-rose-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between" style={{ minHeight: "440px" }}>
                        <div className="bg-gradient-to-r from-[#991b1b] to-[#dc2626] text-white py-3.5 px-4 text-center font-sans text-sm sm:text-base font-black tracking-wider select-none uppercase shadow-sm flex items-center justify-center gap-2">
                          <GraduationCap className="w-4.5 h-4.5 text-[#ffcb05]" />
                          <span>{selectedState && selectedState !== "All India" ? `🎓 ${selectedState} Admissions` : "Admission"}</span>
                        </div>
                        <ul className="p-4 divide-y divide-dashed divide-slate-150 text-left text-xs leading-relaxed flex-1 flex flex-col gap-1 justify-start font-sans">
                          {(() => {
                            const defaultList = [
                              "NTA NEET UG National Entrance MBBs Admission 25-26 Form",
                              "NTA JEE Mains Phase II Engineering Online Admission form",
                              "Delhi University DU PG admission course choices Form",
                              "UP Rajarshi Tandon Open University B.Ed entrance prospectus",
                              "IIT Joint Admission Test for Masters (JAM) Form 2026",
                              "NTA UGC NET Exam June phase admissions open portal",
                              "Jawahar Navodaya Vidyalaya Class 6 admission registration",
                              "UPSC free coaching scheme online admissions UP/Bihar"
                            ];
                            const displayedList = selectedState && selectedState !== "All India"
                              ? [
                                  `🎓 ${selectedState} State Centralised B.Ed / D.El.Ed Admissions 2026`,
                                  `🏛 ${selectedState} State coaching scheme for Civil Services pre-admissions`,
                                  ...defaultList.filter(item => !item.includes("UP Rajarshi") && !item.includes("UP/Bihar"))
                                ]
                              : defaultList;

                            return displayedList.map((text, idx) => {
                              const isMatch = selectedState && selectedState !== "All India" && (text.startsWith("🎓") || text.startsWith("🏛"));
                              return (
                                <li key={idx} className={`flex items-start gap-2.5 py-2 px-2 rounded-xl transition-all duration-150 ${isMatch ? "bg-red-50 border border-red-200/50" : "hover:bg-red-50/50"}`}>
                                  <span className={`shrink-0 font-bold text-xs select-none pt-0.5 ${isMatch ? "text-red-700" : "text-[#ff0000]"}`}>■</span>
                                  <button
                                    onClick={() => addToast(`Opening admissions workspace: ${text}`, "success")}
                                    className="text-[#002f9c] hover:text-[#ff3c00] text-[12px] sm:text-[13px] font-extrabold text-left leading-normal cursor-pointer transition hover:underline animate-fade-in"
                                  >
                                    {text}
                                  </button>
                                </li>
                              );
                            });
                          })()}
                        </ul>
                        <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-center items-center select-none">
                          <button
                            onClick={() => setViewAllCategory("Admission")}
                            className="bg-[#991b1b] hover:bg-red-800 text-white font-black text-[11px] py-2 px-6 rounded-xl cursor-pointer uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-sm hover:shadow-red-105"
                          >
                            View All Admissions
                          </button>
                        </div>
                      </div>

                      {/* Box 8: Certificate Verification Column */}
                      <div className="bg-white border-2 border-amber-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between" style={{ minHeight: "440px" }}>
                        <div className="bg-gradient-to-r from-[#b45309] to-[#d97706] text-white py-3.5 px-4 text-center font-sans text-sm sm:text-base font-black tracking-wider select-none uppercase shadow-sm flex items-center justify-center gap-2">
                          <Award className="w-4.5 h-4.5 text-[#ffcb05]" />
                          <span>{selectedState && selectedState !== "All India" ? `🛡️ ${selectedState} Verification` : "Certificate Verification"}</span>
                        </div>
                        <ul className="p-4 divide-y divide-dashed divide-slate-150 text-left text-xs leading-relaxed flex-1 flex flex-col gap-1 justify-start font-sans">
                          {(() => {
                            const defaultList = [
                              "Aadhaar Card link to verified Mobile Number Online Portal",
                              "Voter ID Card Online corrections application form 2026",
                              "Link PAN Card to Aadhaar Card online status check",
                              "UP Caste, Income, residence certification digital search",
                              "Bihar new structural Ration Card digitized list search",
                              "Digilocker digital app download guide for CBSE certificates",
                              "Income tax return ITR-1 filing online instructions",
                              "EWS Economically Weaker Section certificate eligibility"
                            ];
                            const displayedList = selectedState && selectedState !== "All India"
                              ? [
                                  `🛡️ ${selectedState} Caste, Income & Domicile Verification Portal`,
                                  `📋 ${selectedState} Non-Creamy Layer (NCL) certificate formats`,
                                  ...defaultList.filter(item => !item.includes("UP Caste") && !item.includes("Bihar new"))
                                ]
                              : defaultList;

                            return displayedList.map((text, idx) => {
                              const isMatch = selectedState && selectedState !== "All India" && (text.startsWith("🛡️") || text.startsWith("📋"));
                              return (
                                <li key={idx} className={`flex items-start gap-2.5 py-2 px-2 rounded-xl transition-all duration-150 ${isMatch ? "bg-amber-50 border border-amber-200/50" : "hover:bg-amber-50/50"}`}>
                                  <span className={`shrink-0 font-bold text-xs select-none pt-0.5 ${isMatch ? "text-amber-700" : "text-[#ff0000]"}`}>■</span>
                                  <button
                                    onClick={() => addToast(`Direct link access active: ${text}`, "success")}
                                    className="text-[#002f9c] hover:text-[#ff3c00] text-[12px] sm:text-[13px] font-extrabold text-left leading-normal cursor-pointer transition hover:underline animate-fade-in"
                                  >
                                    {text}
                                  </button>
                                </li>
                              );
                            });
                          })()}
                        </ul>
                        <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-center items-center select-none">
                          <button
                            onClick={() => setViewAllCategory("Certifications")}
                            className="bg-[#b45309] hover:bg-amber-605 text-white font-black text-[11px] py-2 px-6 rounded-xl cursor-pointer uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-sm hover:shadow-orange-105"
                          >
                            View All Verifications
                          </button>
                        </div>
                      </div>

                      {/* Box 9: Important Links Column */}
                      <div className="bg-white border-2 border-indigo-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between" style={{ minHeight: "440px" }}>
                        <div className="bg-gradient-to-r from-[#581c87] to-[#7c3aed] text-white py-3.5 px-4 text-center font-sans text-sm sm:text-base font-black tracking-wider select-none uppercase shadow-sm flex items-center justify-center gap-2">
                          <Sparkles className="w-4.5 h-4.5 text-[#ffcb05]" />
                          <span>{selectedState && selectedState !== "All India" ? `🌟 ${selectedState} Important Links` : "Important Links"}</span>
                        </div>
                        <ul className="p-4 divide-y divide-dashed divide-slate-150 text-left text-xs leading-relaxed flex-1 flex flex-col gap-1 justify-start font-sans">
                          {(() => {
                            const defaultList = [
                              "UP Scholarship Online Form 2026 fresh & Renewal entries",
                              "PM Kisan Samman Nidhi 18th Installment KYC checklist",
                              "National Scholarship Portal (NSP) Online registrations open",
                              "West Bengal SVMCM Swami Vivekananda Merit Means scholarship",
                              "Bihar Board class XII intermediate registration Form 25-27",
                              "Standard central SC, ST caste Certificate guidelines PDF",
                              "Voter Card download online epip card print instructions",
                              "Standard Central OBC Non-Creamy Layer formats circular"
                            ];
                            const displayedList = selectedState && selectedState !== "All India"
                              ? [
                                  `🎓 ${selectedState} State Merit Scholarship (Fresh & Renewal)`,
                                  `⚡ ${selectedState} State Digital Ration Card online correction`,
                                  ...defaultList.filter(item => !item.includes("UP Scholarship") && !item.includes("West Bengal") && !item.includes("Bihar Board"))
                                ]
                              : defaultList;

                            return displayedList.map((text, idx) => {
                              const isMatch = selectedState && selectedState !== "All India" && (text.startsWith("🎓") || text.startsWith("⚡"));
                              return (
                                <li key={idx} className={`flex items-start gap-2 py-1.5 px-2 rounded-xl transition-all duration-150 ${isMatch ? "bg-indigo-50 border border-indigo-200/50" : "hover:bg-indigo-50/50"}`}>
                                  <span className={`shrink-0 font-bold text-xs select-none pt-0.5 ${isMatch ? "text-indigo-700" : "text-[#ff0505]"}`}>■</span>
                                  <button
                                    onClick={() => addToast(`Opening statutory board reference: ${text}`, "success")}
                                    className="text-[#002f9c] hover:text-[#ff3c00] text-[12px] sm:text-[13px] font-extrabold text-left leading-normal cursor-pointer transition hover:underline"
                                  >
                                    {text}
                                  </button>
                                </li>
                              );
                            });
                          })()}
                        </ul>
                        <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-center items-center select-none">
                          <button
                            onClick={() => setViewAllCategory("Important Links")}
                            className="bg-[#581c87] hover:bg-purple-950 text-white font-black text-[11px] py-2 px-6 rounded-xl cursor-pointer uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-sm hover:shadow-[#581c87]/15"
                          >
                            View All Links
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>
                )}

              </div>
            ) : null}

          </section>

          {/* RIGHT SIDEBAR with interactive alerts */}
          <aside className="w-full lg:w-[200px] shrink-0 flex flex-col gap-4 order-3">
            


            {/* Google advertisement Sidebar unit placeholder */}
            <div className="bg-slate-200 border border-slate-350 p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-inner h-60 select-none">
              <span className="text-slate-400 font-mono text-[9px] uppercase tracking-widest font-black leading-none mb-1.5 block">Advertisement</span>
              <div className="text-[11px] font-mono text-slate-500 border border-dashed border-slate-300 w-full p-2 text-center rounded-lg">
                📢 Adsense Google unit &bull; slot {siteSettings.sidebarSlot || "1122"}
              </div>
            </div>

            {/* Answer & Syllabus list directory placeholder */}
            <div className="bg-[#0a0f2e] text-white rounded-2xl p-4 shadow-xl select-none">
              <h4 className="font-baloo text-base font-extrabold text-[#FFB800] leading-none mb-2 text-left bg-white/5 p-2 rounded-lg border border-white/10 uppercase">
                👮 Police Alerts
              </h4>
              <p className="text-[10px] text-slate-300 leading-normal text-left font-sans font-medium mb-3">
                Rapid exam syllabus blueprints and study indexes for State Police Constable & Sub Inspector can be unlocked immediately.
              </p>
              <button 
                onClick={() => selectCategory("Police Jobs")}
                className="w-full bg-[#FF6B00] hover:bg-orange-600 text-white font-extrabold text-[10px] py-1.5 rounded-lg uppercase tracking-wider block transition cursor-pointer"
              >
                Explore vacancies
              </button>
            </div>

          </aside>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-[#050b1f] text-slate-200 border-t-4 border-[#ffde00] pt-12 pb-8 px-4 sm:px-6 md:px-8 z-40 select-none font-sans relative overflow-hidden">
        {/* Decorative subtle background mesh */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-orange-500/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto flex flex-col gap-10 relative z-10">
          
          {/* Top Footer Banner */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800 text-center">
            <div className="flex flex-col sm:flex-row items-center gap-3 cursor-pointer select-none" onClick={goHome}>
              <div className="bg-[#ff0000] border-2 border-[#ffde00] p-1.5 rounded-lg text-center shadow-lg transform hover:scale-105 transition-all">
                <span className="text-lg font-black text-white block leading-none">SR</span>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-xl font-black tracking-tight">
                  <span className="text-white">SARKARI</span> <span className="text-[#ffcb05]">RESULT</span>
                </div>
                <p className="text-[10px] text-emerald-400 font-extrabold tracking-widest uppercase mt-0.5">
                  India's Premier Job Network
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[#12193b] border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-300 font-semibold justify-center">
              <span className="inline-block w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
              <span>⚡ Real-Time Recruitment Engine &bull; ESTD 2026</span>
            </div>
          </div>

          {/* Main Footer Directory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center justify-items-center">
            
            {/* Column 1: Editorial Profile */}
            <div className="flex flex-col items-center gap-4 text-center max-w-sm">
              <h4 className="text-white font-extrabold text-sm uppercase tracking-wider relative px-3">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#ffde00] rounded"></span>
                About Our Directory
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                WWW.SARKARIRESULT.COM is India's most visited independent government job portal. We specialize in aggregating, cataloging, and verifying information from central registries, state commissions, and public boards.
              </p>
              
              <div className="bg-[#0c122e] border border-emerald-900/30 rounded-xl p-3 flex flex-col items-center gap-2.5 w-full">
                <span className="text-emerald-400 text-base leading-none select-none">🛡️</span>
                <div className="text-center font-sans">
                  <span className="text-xs font-black text-emerald-400 block uppercase tracking-wide leading-none mb-1">Verified Sourcing</span>
                  <span className="text-[10px] text-slate-400 font-medium leading-normal">All indexed links point exclusively to official gazettes and authorized web domains.</span>
                </div>
              </div>
            </div>

            {/* Column 2: Regional Networks */}
            <div className="flex flex-col items-center gap-4 text-center max-w-md">
              <h4 className="text-white font-extrabold text-sm uppercase tracking-wider relative px-3">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#FF6B00] rounded"></span>
                State & Central Networks
              </h4>
              <p className="text-[11px] text-slate-400 font-medium">
                Tap on any region to filter dynamic recruitment listings and local boards:
              </p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {STATE_CARDS.map((st) => (
                  <button
                    key={st.name}
                    onClick={() => goState(st.name)}
                    className="bg-slate-900/60 hover:bg-[#ff0000] border border-slate-800 hover:border-transparent text-slate-300 hover:text-white px-2.5 py-1 rounded text-[10px] font-black cursor-pointer transition-all uppercase tracking-wide"
                  >
                    {st.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Column 3: Support & Contact */}
            <div className="flex flex-col items-center gap-4 text-center max-w-sm">
              <h4 className="text-white font-extrabold text-sm uppercase tracking-wider relative px-3">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-purple-500 rounded"></span>
                Support & Contact
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                For administrative queries, corrections, or sitemap indexing suggestions, write to us directly:
              </p>
              <a 
                href="mailto:weblink@sarkariresult.com" 
                className="bg-[#12193b] hover:bg-[#1a2355] border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-center gap-2 group transition-all text-decoration-none w-full"
              >
                <span className="text-[#ffde00] text-lg select-none">✉️</span>
                <div className="text-center sm:text-left font-sans">
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block leading-none">Official Mail ID</span>
                  <span className="text-xs font-bold text-[#ffde00] group-hover:underline block mt-0.5">weblink@sarkariresult.com</span>
                </div>
              </a>
              <div className="flex flex-col items-center gap-2 mt-1">
                <button 
                  onClick={() => addToast("Sarkari Result Live Support Hotline is available Mon-Fri 10AM-6PM IST", "success")} 
                  className="text-center text-xs font-bold text-slate-400 hover:text-[#ffde00] transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>📞</span> Help Center Desk
                </button>
                <button 
                  onClick={() => addToast("Interactive Sitemap features scheduled in release 2.5", "success")} 
                  className="text-center text-xs font-bold text-slate-400 hover:text-[#ffde00] transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>🗺️</span> Recruitment Map
                </button>
              </div>
            </div>

          </div>

          {/* Legal / Disclaimer Styled Card */}
          <div className="border border-slate-800 bg-[#070d24] rounded-2xl p-5 text-xs text-slate-400 leading-relaxed text-center border-t-2 border-amber-500 shadow-inner max-w-4xl mx-auto">
            <h5 className="text-amber-400 font-black uppercase text-[11px] tracking-wider mb-2 flex items-center justify-center gap-1.5 select-none">
              <span>⚠️</span> Important Public Disclaimer
            </h5>
            <p className="font-sans font-medium text-slate-400 leading-relaxed">
              <strong>WWW.SARKARIRESULT.COM</strong> is an independent aggregate private portal. It is not affiliated, representing, or connected to any central/state government ministry, public sector undertaking, education board, or civil service recruiting commission. Sourced materials are directly extracted from official public media releases, newspapers, or authorized government web portals. Candidates must double-check recruitment circulars from signed PDF brochures of respective departments prior to registrations or fee payments.
            </p>
          </div>

          {/* Bottom Copyright and Fast Policy Links */}
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-sans text-center">
            <span className="font-bold select-none">
              &copy; 2026 SARKARI RESULT - SarkariResultLive.in Group. Designed for extreme readability & trust.
            </span>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-slate-300 font-bold select-none">
              <button onClick={() => addToast("Our privacy rule guarantees zero telemetry sharing with advertising modules.", "success")} className="hover:text-[#ffde00] hover:underline cursor-pointer">Privacy Policy</button>
              <span>&bull;</span>
              <button onClick={() => addToast("All listed elements conform to our quality validation standards.", "success")} className="hover:text-[#ffde00] hover:underline cursor-pointer">Terms of Use</button>
              <span>&bull;</span>
              <button onClick={() => addToast("Sarkari Result Live Support desk reached at helpdesk@sarkariresultlive.in", "success")} className="hover:text-[#ffde00] hover:underline cursor-pointer">Legal Notice</button>
            </div>
          </div>

        </div>
      </footer>

      {/* RENDER DIALOG MODAL: INTERACTIVE STATE SWITCHER POPUP */}
      {showStateSelectorModal && (
        <div className="fixed inset-0 z-[400] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in select-none">
          <div className="bg-[#1a2550] border border-slate-700 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-fade-up text-white font-sans max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-[#0a0f2e] to-[#1a2550] border-b border-slate-800 p-5 flex justify-between items-center shrink-0">
              <div className="text-left">
                <h3 className="font-baloo font-black text-base sm:text-lg text-[#FFB800] leading-none mb-1">
                  ✏️ Switch State / UT Preference
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">Select a new region or pick All India to modify lists</p>
              </div>
              <button 
                onClick={() => { setShowStateSelectorModal(false); setStateSearch(""); }} 
                className="bg-slate-800/80 hover:bg-slate-700 text-white p-2 rounded-xl border border-slate-700 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 flex flex-col gap-4 overflow-y-auto scrollbar-thin">
              {/* Local search filter */}
              <div className="bg-[#0a0f2e]/60 border border-slate-800 rounded-xl py-2 px-4 flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Type state or UT name to filter..."
                  value={stateSearch}
                  onChange={(e) => setStateSearch(e.target.value)}
                  className="bg-transparent border-0 text-white placeholder-slate-500 outline-none w-full text-xs font-semibold focus:ring-0"
                />
                {stateSearch && (
                  <button onClick={() => setStateSearch("")} className="text-slate-400 hover:text-white cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Grid selectors */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                <button
                  onClick={() => {
                    setSelectedState("All India");
                    localStorage.setItem("userStateSelection", "All India");
                    setShowStateSelectorModal(false);
                    setStateSearch("");
                    addToast("🌎 Showing All India National jobs catalog!", "success");
                  }}
                  className={`group border p-3 rounded-xl text-left cursor-pointer transition-all duration-150 flex items-center justify-between ${selectedState === "All India" ? "bg-[#FF6B00] border-[#FF6B00] text-white" : "bg-[#0a0f2e]/40 border-slate-800 hover:bg-[#FF6B00] hover:text-white hover:border-[#FF6B00]"}`}
                >
                  <div className="flex flex-col text-left leading-none">
                    <span className="font-baloo font-extrabold text-xs text-[#FFB800] group-hover:text-white transition leading-none">ALL</span>
                    <span className="text-[9px] uppercase font-bold text-slate-300 group-hover:text-white transition mt-1">All India</span>
                  </div>
                </button>

                {filteredStates.map((st) => {
                  const count = stateJobCount[st.name] || 0;
                  const active = selectedState === st.name;
                  return (
                    <button
                      key={st.name}
                      onClick={() => {
                        setSelectedState(st.name);
                        localStorage.setItem("userStateSelection", st.name);
                        setShowStateSelectorModal(false);
                        setStateSearch("");
                        addToast(`🗺️ Preference switched to ${st.name}!`, "success");
                      }}
                      className={`group border p-3 rounded-xl text-left cursor-pointer transition-all duration-150 flex items-center justify-between ${active ? "bg-[#FF6B00] border-[#FF6B00] text-white" : "bg-[#0a0f2e]/40 border-slate-800 hover:bg-[#FF6B00] hover:text-white hover:border-[#FF6B00]"}`}
                    >
                      <div className="flex flex-col text-left leading-none">
                        <span className="font-baloo font-extrabold text-xs text-[#FFB800] group-hover:text-white transition leading-none">{st.short}</span>
                        <span className="text-[10px] uppercase font-bold text-slate-300 group-hover:text-white transition mt-1 line-clamp-1">{st.name}</span>
                      </div>
                      <span className="bg-white/5 border border-white/10 text-[9px] text-slate-400 font-extrabold px-1.5 py-0.5 rounded-full group-hover:bg-white/15 group-hover:text-white leading-none">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDER DIALOG MODAL: INTERACTIVE DIRECTORY VIEW ALL POPUP */}
      {viewAllCategory && (
        <div className="fixed inset-0 z-[400] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in text-slate-800">
          <div className="bg-white border-2 border-[#2a30bb] rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-fade-up flex flex-col max-h-[85vh]">
            <div className="bg-[#2a30bb] text-white p-5 flex justify-between items-center shrink-0 border-b-2 border-white/15 shadow select-none">
              <div className="text-left font-sans">
                <h3 className="font-baloo font-black text-lg text-white leading-none mb-1 flex items-center gap-1.5">
                  📁 Complete Board: {viewAllCategory === "Latest Jobs" ? "Central Recruitment" : viewAllCategory === "State Jobs" ? "State Recruitment" : viewAllCategory}
                </h3>
                <p className="text-[11px] text-blue-100 font-bold font-sans tracking-wide">Search and browse all indexed files dynamically below</p>
              </div>
              <button 
                onClick={() => { setViewAllCategory(null); setViewAllSearch(""); }} 
                className="bg-white/10 hover:bg-white/20 text-white p-1.5 rounded-lg border border-white/20 transition cursor-pointer leading-none"
              >
                <X className="w-5 h-5 animate-pulse" />
              </button>
            </div>
            
            <div className="p-5 flex flex-col gap-4 overflow-y-auto scrollbar-thin">
              {/* Internal search filter */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 flex items-center gap-2 text-slate-600">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder={`Search in ${viewAllCategory === "Latest Jobs" ? "Central Recruitment" : viewAllCategory === "State Jobs" ? "State Recruitment" : viewAllCategory} list...`}
                  value={viewAllSearch}
                  onChange={(e) => setViewAllSearch(e.target.value)}
                  className="bg-transparent border-0 text-slate-800 placeholder-slate-400 outline-none w-full text-xs font-semibold focus:ring-0"
                />
                {viewAllSearch && (
                  <button onClick={() => setViewAllSearch("")} className="text-slate-405 hover:text-slate-800 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Central item listing table */}
              <div className="border border-slate-150 rounded-xl overflow-hidden divide-y divide-dashed divide-slate-200 max-h-[350px] overflow-y-auto pr-1">
                {(() => {
                  const term = viewAllSearch.toLowerCase();
                  
                  // Latest Job (Central Recruitment)
                  if (viewAllCategory === "Latest Jobs") {
                    const list = jobs.filter(j => j.state === "All India" && (j.title.toLowerCase().includes(term) || j.org.toLowerCase().includes(term)));
                    if (list.length === 0) return <p className="p-8 text-center text-slate-400 text-xs font-bold font-sans">No active posts match "{viewAllSearch}"</p>;
                    return list.map(j => (
                      <div key={j.id} onClick={() => { goJob(j); setViewAllCategory(null); }} className="p-3.5 hover:bg-orange-50/40 text-left transition-all cursor-pointer flex justify-between items-center gap-2 group">
                        <div className="flex items-start gap-2">
                          <span className="text-[#e21b1b] font-bold shrink-0 mt-0.5 select-none">■</span>
                          <div>
                            <p className="text-xs sm:text-[13px] text-[#002f9c] font-black group-hover:underline leading-snug">{j.title}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{j.org} &bull; State: {j.state}</p>
                          </div>
                        </div>
                        <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black tracking-wider px-2 py-1 rounded border border-emerald-100 uppercase shrink-0 whitespace-nowrap leading-none">View Page</span>
                      </div>
                    ));
                  }

                  // State Jobs (State Recruitment)
                  if (viewAllCategory === "State Jobs") {
                    const list = jobs.filter(j => j.state !== "All India" && (j.title.toLowerCase().includes(term) || j.org.toLowerCase().includes(term)));
                    if (list.length === 0) return <p className="p-8 text-center text-slate-400 text-xs font-bold font-sans">No active state recruitment posts match "{viewAllSearch}"</p>;
                    return list.map(j => (
                      <div key={j.id} onClick={() => { goJob(j); setViewAllCategory(null); }} className="p-3.5 hover:bg-orange-50/40 text-left transition-all cursor-pointer flex justify-between items-center gap-2 group">
                        <div className="flex items-start gap-2">
                          <span className="text-[#e21b1b] font-bold shrink-0 mt-0.5 select-none">■</span>
                          <div>
                            <p className="text-xs sm:text-[13px] text-[#002f9c] font-black group-hover:underline leading-snug">{j.title}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{j.org} &bull; State: {j.state}</p>
                          </div>
                        </div>
                        <span className="bg-orange-50 text-orange-700 text-[9px] font-black tracking-wider px-2 py-1 rounded border border-orange-100 uppercase shrink-0 whitespace-nowrap leading-none">View Page</span>
                      </div>
                    ));
                  }

                  // Admit Card
                  if (viewAllCategory === "Admit Cards") {
                    const list = admits.filter(a => a.status === "published" && (a.title.toLowerCase().includes(term) || a.exam.toLowerCase().includes(term)));
                    if (list.length === 0) return <p className="p-8 text-center text-slate-400 text-xs font-bold font-sans">No active admit entries match "{viewAllSearch}"</p>;
                    return list.map(a => (
                      <a key={a.id} href={a.link || "#"} target="_blank" rel="noreferrer" className="p-3.5 hover:bg-orange-50/40 text-left transition-all cursor-pointer flex justify-between items-center gap-2 group text-decoration-none">
                        <div className="flex items-start gap-2">
                          <span className="text-[#e21b1b] font-bold shrink-0 mt-0.5 select-none">■</span>
                          <div>
                            <p className="text-xs sm:text-[13px] text-[#002f9c] font-black group-hover:underline leading-snug">{a.title}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{a.exam} &bull; Region: {a.state}</p>
                          </div>
                        </div>
                        <span className="bg-sky-50 text-sky-750 text-[9px] font-black tracking-wider px-2 py-1 rounded border border-sky-100 uppercase shrink-0 whitespace-nowrap leading-none">Download</span>
                      </a>
                    ));
                  }

                  // Results
                  if (viewAllCategory === "Latest Results") {
                    const list = results.filter(r => r.status === "published" && (r.title.toLowerCase().includes(term) || r.exam.toLowerCase().includes(term)));
                    if (list.length === 0) return <p className="p-8 text-center text-slate-400 text-xs font-bold font-sans">No active results match "{viewAllSearch}"</p>;
                    return list.map(r => (
                      <a key={r.id} href={r.link || "#"} target="_blank" rel="noreferrer" className="p-3.5 hover:bg-orange-50/40 text-left transition-all cursor-pointer flex justify-between items-center gap-2 group text-decoration-none">
                        <div className="flex items-start gap-2">
                          <span className="text-[#e21b1b] font-bold shrink-0 mt-0.5 select-none">■</span>
                          <div>
                            <p className="text-xs sm:text-[13px] text-[#002f9c] font-black group-hover:underline leading-snug">{r.title}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{r.exam} &bull; Released: {r.date}</p>
                          </div>
                        </div>
                        <span className="bg-purple-50 text-purple-750 text-[9px] font-black tracking-wider px-2 py-1 rounded border border-purple-100 uppercase shrink-0 whitespace-nowrap leading-none">Results</span>
                      </a>
                    ));
                  }

                  // General fallback categories
                  let itemsList: string[] = [];
                  if (viewAllCategory === "Answer Key") {
                    const defaultList = [
                      "SSC Combined Graduate Level (CGL) 2026 Tier-1 Answer Key",
                      "UPSC Civil Services Pre GS Paper 1 & 2 Answer Keys",
                      "Railway NTPC Stage-1 Computer Based Test Answer Key",
                      "UP Police Constable Written Shift 1 & 2 Answer Key",
                      "Bihar Police Constable Re-test Provisional Answer Sheet",
                      "WBPSC Clerkship Entrance Objective Test Answer Keys",
                      "CSIR UGC NET June General Science Answer Sheet Release",
                      "SBI Clerk Junior Associate Mains exam Answer Paper"
                    ];
                    itemsList = selectedState && selectedState !== "All India"
                      ? [
                          `👑 ${selectedState} State Eligibility Test (SET) General Answer Sheet 2026`,
                          `⚡ ${selectedState} State Police Written Exam Shift 1 Answer Keys`,
                          ...defaultList.filter(item => !item.includes("UP Police") && !item.includes("Bihar Police") && !item.includes("WBPSC"))
                        ]
                      : defaultList;
                  } else if (viewAllCategory === "Syllabus") {
                    const defaultList = [
                      "UPSC Civil Services IAS Pre & Mains Detailed Exam Scheme",
                      "SSC CGL combined Graduate Level exams structural syllabus",
                      "Railway Board RRB NTPC Written Exam Syllabus PDF",
                      "Bihar Police CSBC Constable physical and Written standards",
                      "West Bengal Police Constable Exam pattern and syllabus",
                      "UP Police Constable objective test syllabus handout",
                      "SBI Clerk Clerical customer support study blueprints",
                      "IBPS Specialist Officers written syllabus formulation"
                    ];
                    itemsList = selectedState && selectedState !== "All India"
                      ? [
                          `📚 ${selectedState} PSC Combined State Civil Services detailed Exam Scheme`,
                          `🎯 ${selectedState} State Police Constable & Sub-Inspector Physical syllabus`,
                          ...defaultList.filter(item => !item.includes("Bihar") && !item.includes("West Bengal") && !item.includes("UP Police"))
                        ]
                      : defaultList;
                  } else if (viewAllCategory === "Admission") {
                    const defaultList = [
                      "NTA NEET UG National Entrance MBBs Admission 25-26 Form",
                      "NTA JEE Mains Phase II Engineering Online Admission form",
                      "Delhi University DU PG admission course choices Form",
                      "UP Rajarshi Tandon Open University B.Ed entrance prospectus",
                      "IIT Joint Admission Test for Masters (JAM) Form 2026",
                      "NTA UGC NET Exam June phase admissions open portal",
                      "Jawahar Navodaya Vidyalaya Class 6 admission registration",
                      "UPSC free coaching scheme online admissions UP/Bihar"
                    ];
                    itemsList = selectedState && selectedState !== "All India"
                      ? [
                          `🎓 ${selectedState} State Centralised B.Ed / D.El.Ed Admissions 2026`,
                          `🏛 ${selectedState} State coaching scheme for Civil Services pre-admissions`,
                          ...defaultList.filter(item => !item.includes("UP Rajarshi") && !item.includes("UP/Bihar"))
                        ]
                      : defaultList;
                  } else if (viewAllCategory === "Certifications") {
                    const defaultList = [
                      "Aadhaar Card link to verified Mobile Number Online Portal",
                      "Voter ID Card Online corrections application form 2026",
                      "Link PAN Card to Aadhaar Card online status check",
                      "UP Caste, Income, residence certification digital search",
                      "Bihar new structural Ration Card digitized list search",
                      "Digilocker digital app download guide for CBSE certificates",
                      "Income tax return ITR-1 filing online instructions",
                      "EWS Economically Weaker Section certificate eligibility"
                    ];
                    itemsList = selectedState && selectedState !== "All India"
                      ? [
                          `🛡️ ${selectedState} Caste, Income & Domicile Digital Certificate Verification`,
                          `📋 ${selectedState} Non-Creamy Layer (NCL) certificate formats & search`,
                          ...defaultList.filter(item => !item.includes("UP Caste") && !item.includes("Bihar new"))
                        ]
                      : defaultList;
                  } else if (viewAllCategory === "Important Links") {
                    const defaultList = [
                      "UP Scholarship Online Form 2026 fresh & Renewal entries",
                      "PM Kisan Samman Nidhi 18th Installment KYC checklist",
                      "National Scholarship Portal (NSP) Online registrations open",
                      "West Bengal SVMCM Swami Vivekananda Merit Means scholarship",
                      "Bihar Board class XII intermediate registration Form 25-27",
                      "Standard central SC, ST caste Certificate guidelines PDF",
                      "Voter Card download online epip card print instructions",
                      "Standard Central OBC Non-Creamy Layer formats circular"
                    ];
                    itemsList = selectedState && selectedState !== "All India"
                      ? [
                          `🎓 ${selectedState} State Merit Scholarship (Fresh & Renewal Entries)`,
                          `⚡ ${selectedState} State Digital Ration Card online correction form`,
                          ...defaultList.filter(item => !item.includes("UP Scholarship") && !item.includes("West Bengal") && !item.includes("Bihar Board"))
                        ]
                      : defaultList;
                  }

                  const matched = itemsList.filter(item => item.toLowerCase().includes(term));
                  if (matched.length === 0) return <p className="p-8 text-center text-slate-400 text-xs font-bold font-sans">No items match "{viewAllSearch}"</p>;
                  return matched.map((text, idx) => (
                    <div key={idx} onClick={() => { addToast(`🔗 Redirect portal active: ${text}`, "success"); setViewAllCategory(null); }} className="p-3.5 hover:bg-orange-50/40 text-left transition-all cursor-pointer flex justify-between items-center gap-2 group">
                      <div className="flex items-start gap-2">
                        <span className="text-[#e21b1b] font-bold shrink-0 mt-0.5 select-none">■</span>
                        <span className="text-xs sm:text-[13px] text-[#002f9c] font-black group-hover:underline leading-snug">{text}</span>
                      </div>
                      <span className="bg-slate-50 text-slate-500 group-hover:bg-[#2a30bb] group-hover:text-white text-[9px] font-black tracking-wider px-2 py-0.5 rounded border border-slate-205 uppercase shrink-0 transition-colors whitespace-nowrap leading-loose select-none">Visit Link</span>
                    </div>
                  ));
                })()}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MOBILE STICKY BOTTOM NAV BAR */}
      <div className="md:hidden fixed bottom-2 left-2 right-2 bg-gradient-to-r from-[#050b1f] via-[#022a7e] to-[#050b1f] border-2 border-[#ffde00] rounded-2xl text-slate-100 py-2 px-3 flex justify-between items-center z-[250] shadow-[0_8px_32px_rgba(0,0,0,0.5)] shrink-0 h-16 select-none backdrop-blur-md">
        {[
          { 
            label: "Home", 
            icon: (active: boolean) => <Briefcase className={`w-5 h-5 mx-auto transition-all duration-350 ${active ? "text-[#ffde00] scale-110 drop-shadow-[0_0_8px_rgba(255,222,0,0.5)]" : "text-white"}`} />, 
            action: goHome,
            active: sitePage === "home" && !categoryFilter && !qualificationFilter && !searchQuery
          },
          { 
            label: "Jobs", 
            icon: (active: boolean) => <Award className={`w-5 h-5 mx-auto transition-all duration-350 ${active ? "text-[#ff6b00] scale-110 drop-shadow-[0_0_8px_rgba(255,107,0,0.5)]" : "text-[#ffde00]"}`} />, 
            action: () => selectCategory("Central Government"),
            active: categoryFilter === "Central Government"
          },
          { 
            label: "Results", 
            icon: (active: boolean) => <Calendar className={`w-5 h-5 mx-auto transition-all duration-350 ${active ? "text-white scale-110" : "text-[#56f082]"}`} />, 
            action: () => { goHome(); setTimeout(() => { const el = document.getElementById("results-anchor"); el?.scrollIntoView({ behavior: "smooth" }); }, 150); },
            active: false
          },
          { 
            label: "Admit Card", 
            icon: (active: boolean) => <GraduationCap className={`w-5 h-5 mx-auto transition-all duration-350 ${active ? "text-white scale-110" : "text-sky-300"}`} />, 
            action: () => { goHome(); setTimeout(() => { const el = document.getElementById("admits-anchor"); el?.scrollIntoView({ behavior: "smooth" }); }, 150); },
            active: false
          },
          { 
            label: "State", 
            icon: (active: boolean) => <MapPin className={`w-5 h-5 mx-auto transition-all duration-350 ${active ? "text-white scale-110" : "text-red-400"}`} />, 
            action: () => setShowStateSelectorModal(true),
            active: showStateSelectorModal || (selectedState !== "All India" && sitePage !== "job")
          }
        ].map((btn, idx) => {
          const isActive = btn.active;
          return (
            <button
              key={idx}
              onClick={btn.action}
              className="flex-grow flex-shrink-0 text-center flex flex-col items-center justify-center relative active:scale-95 transition-all duration-150 cursor-pointer py-1"
              style={{ width: "20%" }}
            >
              <div className={`relative p-1.5 rounded-xl transition-all duration-150 ${isActive ? "bg-white/10 ring-1 ring-white/15" : ""}`}>
                {btn.icon(isActive)}
                {/* Active mini glow dot */}
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#ffde00] rounded-full border border-[#022a7e] animate-pulse" />
                )}
              </div>
              <span className={`mt-1 font-sans uppercase tracking-widest text-[8px] leading-none transition-colors duration-150 ${isActive ? "text-[#ffde00] font-black" : "text-slate-300 font-bold"}`}>
                {btn.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Push Subscription Promo Card */}
      {showPushBanner && (
        <div className="fixed bottom-20 sm:bottom-6 right-2 sm:right-6 w-11/12 max-w-sm bg-gradient-to-br from-[#01143f] to-[#022a7e] text-white border-2 border-[#ffcb05] rounded-2xl shadow-[0_12px_44px_rgba(0,0,0,0.5)] z-[999] overflow-hidden p-4 sm:p-5 animate-fade-up">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex items-start gap-3.5 relative">
            <div className="bg-[#ff0000] border border-yellow-400 text-white p-2 text-center rounded-xl animate-bounce shadow-lg mt-1 select-none">
              <Bell className="w-5 h-5 text-yellow-300" />
            </div>
            <div className="flex-1 text-left font-sans">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase font-black tracking-widest text-[#56f082]">INSTANT JOB ALERTS</span>
                <button 
                  onClick={handleDismissPushBanner}
                  className="text-slate-300 hover:text-white"
                  title="Dismiss alert prompt"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <h4 className="font-extrabold text-xs text-[#ffcb05] mt-1 pr-4 whitespace-nowrap overflow-hidden text-ellipsis">Sub to Web Push Alerts!</h4>
              <p className="text-[10px] text-slate-200 leading-relaxed font-semibold mt-1">
                Receive crucial Job Notifications, Admit Card releases, and Exam Results on your device instantly!
              </p>
              
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={handleSubscribeToPush}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-600 font-extrabold text-[10px] uppercase px-3.5 py-2 rounded-xl transition cursor-pointer active:scale-95 shadow-lg shadow-emerald-950/20"
                >
                  🔔 Allow Alerts
                </button>
                <button
                  onClick={handleDismissPushBanner}
                  className="text-[10px] font-extrabold text-slate-300 hover:text-white uppercase px-2 py-1 transition cursor-pointer"
                >
                  No, Thanks
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
