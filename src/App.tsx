import React, { useState, useMemo, useEffect } from "react";
import { 
  Bell, CheckCircle2, Lock, Sparkles, X, Heart, Shield, 
  HelpCircle, CornerDownRight, ArrowUpRight, Search, Landmark 
} from "lucide-react";

import { AnnouncementStrip } from "./components/AnnouncementStrip";
import { Header } from "./components/Header";
import { Navbar } from "./components/Navbar";
import { TickerBar } from "./components/TickerBar";
import { HeroSection } from "./components/HeroSection";
import { FeaturedGridBoxes } from "./components/FeaturedGridBoxes";
import { SidebarLeft } from "./components/SidebarLeft";
import { SidebarRight } from "./components/SidebarRight";
import { Footer } from "./components/Footer";
import { FooterPagesModal } from "./components/FooterPagesModal";
import { PushNotificationHub } from "./components/PushNotificationHub";
import { SarkariResourceHub } from "./components/SarkariResourceHub";

// Centered views
import { StateSelectionCard } from "./components/StateSelectionCard";
import { CentralCategories } from "./components/CentralCategories";
import { LatestJobsTable } from "./components/LatestJobsTable";
import { ResultsAdmitGrids } from "./components/ResultsAdmitGrids";
import { StateJobView } from "./components/StateJobView";
import { JobDetailView } from "./components/JobDetailView";
import { StateGateway } from "./components/StateGateway";

import { CultureThemeId, getTheme } from "./components/CulturalThemer";
import { latestJobsList, trendingSearches, resultsLinks, admitCardsLinks, statesData } from "./data";
import { ViewState, JobRow } from "./types";
import AdminPanel from "./components/AdminPanel";
import { AdminLogin } from "./components/AdminLogin";

const STATE_MAP: Record<string, string[]> = {
  "Uttar Pradesh": ["up ", "uppsc", "upsssc", "lekhpal", "uttar pradesh", "u.p.", "uppbpb"],
  "Bihar": ["bihar", "bpsc", "bssc", "bseb", "patna"],
  "Rajasthan": ["rajasthan", "rpsc", "rsmssb", "reet", "jaipur"],
  "Madhya Pradesh": ["madhya pradesh", "mppsc", "vyapam", "bhopal"],
  "Maharashtra": ["maharashtra", "mpsc", "mumbai"],
  "Delhi": ["delhi", "dsssb", "dssb"],
  "West Bengal": ["west bengal", "wbpsc", "wbprb", "w.b.", "kolkata"],
  "Tamil Nadu": ["tamil nadu", "tnpsc", "chennai"],
  "Karnataka": ["karnataka", "kpsc", "bengaluru"],
  "Andhra Pradesh": ["andhra pradesh", "appsc"],
  "Telangana": ["telangana", "tspsc"],
  "Gujarat": ["gujarat", "gpsc", "gsssb"],
  "Kerala": ["kerala", "kpsc"],
  "Punjab": ["punjab", "ppsc"],
  "Haryana": ["haryana", "hssc", "hpsc"],
  "Odisha": ["odisha", "opsc", "ossc"],
  "Jharkhand": ["jharkhand", "jpsc", "jssc"],
  "Chhattisgarh": ["chhattisgarh", "cgpsc", "cgvyapam"],
  "Assam": ["assam", "apsc"],
  "Jammu & Kashmir": ["jammu", "kashmir", "jkpsc", "jkssb"],
  "Uttarakhand": ["uttarakhand", "ukpsc", "uksssc"],
  "Himachal Pradesh": ["himachal", "hppsc", "hpsssb"]
};

const isOtherStateContent = (text: string, selectedState: string): boolean => {
  if (!selectedState) return false;
  
  const textLower = text.toLowerCase();
  const selectedStateLower = selectedState.toLowerCase();
  
  for (const [stateName, keywords] of Object.entries(STATE_MAP)) {
    if (stateName.toLowerCase() === selectedStateLower) {
      continue;
    }
    
    // Check if any keyword matches
    const matchedKeyword = keywords.find(kw => textLower.includes(kw));
    if (matchedKeyword) {
      // It matches another state. Make sure it doesn't also contain the selected state's keywords
      const selectedKeywords = STATE_MAP[selectedState] || [selectedStateLower];
      const matchesSelected = selectedKeywords.some(kw => textLower.includes(kw));
      if (!matchesSelected) {
        return true; // Filter this out!
      }
    }
  }
  return false;
};

export default function App() {
  const [selectedStateName, setSelectedStateName] = useState<string>(() => {
    return localStorage.getItem("sarkari_selected_state") || "";
  });

  const [activeThemeId, setActiveThemeId] = useState<CultureThemeId>(() => {
    const storedState = localStorage.getItem("sarkari_selected_state");
    if (storedState) {
      return getTheme(storedState).id;
    }
    return (localStorage.getItem("sarkari_cultural_theme") as CultureThemeId) || "national";
  });

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem("sarkari_admin_authorized") === "true";
  });
  
  // Check URL query parameters or hashes on load/state change for direct URL admin access
  useEffect(() => {
    const handleUrlState = () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(window.location.search);
      if (hash === "#admin" || hash === "#admin-panel" || params.get("admin") === "true") {
        setIsAdminMode(true);
      }
    };
    handleUrlState();
    window.addEventListener("hashchange", handleUrlState);
    return () => window.removeEventListener("hashchange", handleUrlState);
  }, []);

  const [jobs, setJobs] = useState<JobRow[]>(latestJobsList);
  const [results, setResults] = useState(resultsLinks);
  const [admitCards, setAdmitCards] = useState(admitCardsLinks);
  const [states, setStates] = useState(statesData);

  // Monetization Custom Ad placements control states
  const [adSenseEnabled, setAdSenseEnabled] = useState(true);
  const [adSenseCode, setAdSenseCode] = useState("<!-- ca-pub-XXXXXXXXXXXXXXXX -->");
  const [stickyAdText, setStickyAdText] = useState("🔥 SARKARI RESULT UPDATE: Daily recruitment notification list added check eligibility rules live now!");

  const [viewState, setViewState] = useState<ViewState>("home");
  const [selectedJobIdOrTitle, setSelectedJobIdOrTitle] = useState("");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [qualificationFilter, setQualificationFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Overlays
  const [showAlertsPopup, setShowAlertsPopup] = useState(false);
  const [activeFooterPage, setActiveFooterPage] = useState<string | null>(null);
  // Overlay Success Indicators
  const [alertFormSubmited, setAlertFormSubmitted] = useState(false);

  // Scroll to main container on viewState modifications
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [viewState, selectedStateName, selectedJobIdOrTitle, isAdminMode]);

  const handleStateSelect = (stateName: string) => {
    setSelectedStateName(stateName);
    localStorage.setItem("sarkari_selected_state", stateName);
    setViewState("home");

    // Automatically adapt cultural theme to selected state of all 37 States & UTs!
    const matchedTheme = getTheme(stateName);
    setActiveThemeId(matchedTheme.id);
    localStorage.setItem("sarkari_cultural_theme", matchedTheme.id);
  };

  const handleJobSelect = (jobIdOrTitle: string) => {
    setSelectedJobIdOrTitle(jobIdOrTitle);
    setViewState("job");
  };

  const handleFilterByCategory = (categoryId: string) => {
    setCategoryFilter(categoryId);
    setSearchQuery("");
    setQualificationFilter("");
    setViewState("home");
  };

  const handleQualificationSelect = (qual: string) => {
    setQualificationFilter(qual);
    setSearchQuery("");
    setCategoryFilter("");
    setViewState("home");
  };

  const handleTickerOrTagSelect = (tag: string) => {
    setSearchQuery(tag);
    setQualificationFilter("");
    setCategoryFilter("");
    setViewState("home");
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setQualificationFilter("");
    setCategoryFilter("");
  };

  // Helper mapping from central category identifiers to jobs in latestJobsList
  const getJobsByCategory = (catId: string, baseList: JobRow[]): JobRow[] => {
    if (!catId || catId === "all") return baseList;
    switch (catId) {
      case "cat-banking":
        return baseList.filter(j => j.title.includes("SBI") || j.title.includes("IBPS") || j.department.toLowerCase().includes("bank"));
      case "cat-railway":
        return baseList.filter(j => j.title.includes("RRB") || j.department.toLowerCase().includes("rail"));
      case "cat-defence":
        return baseList.filter(j => j.title.includes("Police") || j.title.includes("CRPF") || j.department.toLowerCase().includes("police") || j.department.toLowerCase().includes("force"));
      case "cat-upsc":
        return baseList.filter(j => j.title.includes("UPSC") || j.title.includes("IAS"));
      case "cat-ssc":
        return baseList.filter(j => j.title.includes("SSC"));
      case "cat-teaching":
        return baseList.filter(j => j.title.includes("STET") || j.title.includes("Teacher") || j.title.includes("KVS") || j.title.includes("NVS"));
      case "cat-medical":
        return baseList.filter(j => j.title.includes("Nursing") || j.title.includes("AIIMS") || j.department.toLowerCase().includes("medical"));
      case "cat-it-tech":
        return baseList.filter(j => j.title.includes("CEPTAM") || j.title.includes("DRDO") || j.qualification.toLowerCase().includes("engineer"));
      case "cat-post":
        return baseList.filter(j => j.title.includes("GDS") || j.department.toLowerCase().includes("post"));
      case "cat-psu":
        return baseList.filter(j => j.title.includes("NTPC") || j.department.toLowerCase().includes("cooperation") || j.department.toLowerCase().includes("psu"));
      default:
        return baseList;
    }
  };

  // Filter jobs based on selected tags / qualifiers / categories
  const filteredLatestJobs = useMemo(() => {
    let list = jobs;

    if (selectedStateName) {
      list = list.filter(j => {
        const combinedText = `${j.title} ${j.department} ${j.jobLocation} ${j.jobType} ${j.fullRequirements || ""}`;
        return !isOtherStateContent(combinedText, selectedStateName);
      });
    }

    // Apply main query keywords
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(j => 
        j.title.toLowerCase().includes(q) || 
        j.department.toLowerCase().includes(q) || 
        j.qualification.toLowerCase().includes(q) ||
        j.jobLocation.toLowerCase().includes(q)
      );
    }

    // Apply qualification indices
    if (qualificationFilter) {
      const q = qualificationFilter.split(" ")[0].toLowerCase(); // e.g. "12th" out of "12th Pass Jobs"
      list = list.filter(j => j.qualification.toLowerCase().includes(q));
    }

    // Apply sectors filters
    if (categoryFilter) {
      list = getJobsByCategory(categoryFilter, list);
    }

    // Prioritize jobs in their selected state at the top of the home feed
    if (selectedStateName) {
      const stateLower = selectedStateName.toLowerCase();
      list = [...list].sort((a, b) => {
        const aMatch = a.jobLocation.toLowerCase().includes(stateLower) || a.title.toLowerCase().includes(stateLower);
        const bMatch = b.jobLocation.toLowerCase().includes(stateLower) || b.title.toLowerCase().includes(stateLower);
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
      });
    }

    return list;
  }, [searchQuery, qualificationFilter, categoryFilter, selectedStateName, jobs]);

  // Construct label showing focus highlights
  const filterLabel = useMemo(() => {
    if (searchQuery) return `Keyword Search: "${searchQuery}"`;
    if (qualificationFilter) return `Eligibility Rank: ${qualificationFilter}`;
    if (categoryFilter) {
      if (categoryFilter === "cat-banking") return "Sectors: Banking & Financial Institutions";
      if (categoryFilter === "cat-railway") return "Sectors: Indian Railways Board";
      if (categoryFilter === "cat-defence") return "Sectors: Defence, Uniformed Police & CAPFs";
      if (categoryFilter === "cat-upsc") return "Sectors: Union Civil Services (UPSC)";
      if (categoryFilter === "cat-ssc") return "Sectors: SSC Staff Selection";
      if (categoryFilter === "cat-teaching") return "Sectors: Academic Schools, KVS & NVS";
      if (categoryFilter === "cat-medical") return "Sectors: Clinical Health Councils";
      if (categoryFilter === "cat-it-tech") return "Sectors: Scientific & Technology Labs";
      if (categoryFilter === "cat-post") return "Sectors: India Post Office circles";
      if (categoryFilter === "cat-psu") return "Sectors: Maharatna PSUs";
      return "Sectors: Specialized Categories";
    }
    return undefined;
  }, [searchQuery, qualificationFilter, categoryFilter]);

  const filteredResults = useMemo(() => {
    if (!selectedStateName) return results;
    return results.filter(r => !isOtherStateContent(r.title, selectedStateName));
  }, [results, selectedStateName]);

  const filteredAdmitCards = useMemo(() => {
    if (!selectedStateName) return admitCards;
    return admitCards.filter(ac => !isOtherStateContent(ac.title, selectedStateName));
  }, [admitCards, selectedStateName]);

  if (!selectedStateName && !isAdminMode) {
    return <StateGateway onStateSelect={handleStateSelect} />;
  }

  return (
    <div className="min-h-full bg-slate-50 flex flex-col font-sans relative text-slate-800">
      
      {/* 1. Top Strip bar with Live clocks and traffic metrics */}
      {viewState !== "job" && <AnnouncementStrip />}

      {/* 2. Main Midnight Blue Premium Header */}
      <Header 
        onSearchFocus={() => handleTickerOrTagSelect("")}
        onAlertsSubscribe={() => setShowAlertsPopup(true)}
        onNavigateHome={() => {
          setViewState("home");
          setIsAdminMode(false);
        }}
        isAdminMode={isAdminMode}
        onToggleAdmin={() => setIsAdminMode(!isAdminMode)}
        activeThemeId={activeThemeId}
        onChangeTheme={(theme) => {
          setActiveThemeId(theme);
          localStorage.setItem("sarkari_cultural_theme", theme);
          
          if (theme === "national") {
            setSelectedStateName("");
            localStorage.removeItem("sarkari_selected_state");
          } else {
            // Find corresponding state name and keep both in persistent storage
            const matchedState = statesData.find(st => getTheme(st.name).id === theme);
            if (matchedState) {
              setSelectedStateName(matchedState.name);
              localStorage.setItem("sarkari_selected_state", matchedState.name);
            }
          }
        }}
        selectedStateName={selectedStateName}
      />

      {isAdminMode ? (
        <div className="flex-1 bg-slate-100 min-h-[calc(100vh-80px)]">
          {isAdminAuthenticated ? (
            <AdminPanel 
              jobs={jobs}
              setJobs={setJobs}
              results={results}
              setResults={setResults}
              admitCards={admitCards}
              setAdmitCards={setAdmitCards}
              states={states}
              setStates={setStates}
              onClose={() => setIsAdminMode(false)}
              onSignOut={() => {
                sessionStorage.removeItem("sarkari_admin_authorized");
                setIsAdminAuthenticated(false);
              }}
              adSenseEnabled={adSenseEnabled}
              setAdSenseEnabled={setAdSenseEnabled}
              adSenseCode={adSenseCode}
              setAdSenseCode={setAdSenseCode}
              stickyAdText={stickyAdText}
              setStickyAdText={setStickyAdText}
            />
          ) : (
            <AdminLogin 
              onLoginSuccess={() => setIsAdminAuthenticated(true)}
              onCancel={() => setIsAdminMode(false)}
            />
          )}
        </div>
      ) : (
        <>
          {/* 3. Dropdown Menu Navigation Bar */}
      {viewState !== "job" && (
        <Navbar 
          onNavigateHome={() => setViewState("home")}
          onStateSelect={handleStateSelect}
          onFilterByCategory={handleFilterByCategory}
          onAdmitCardsClick={() => handleTickerOrTagSelect("CGL")}
          onResultsClick={() => handleTickerOrTagSelect("IAS")}
          selectedStateName={selectedStateName}
        />
      )}

      {/* 4. Scrolling live ticker bar */}
      {viewState !== "job" && <TickerBar customAlertText={stickyAdText} />}

      {/* 5. Fluid responsive content area */}
      {viewState === "home" && (
        <>
          <HeroSection 
            onSearch={(val) => {
              setSearchQuery(val);
              setQualificationFilter("");
              setCategoryFilter("");
            }}
            onTagSelected={handleTickerOrTagSelect}
            activeJobsCount={jobs.length}
            activeThemeId={activeThemeId}
            selectedStateName={selectedStateName}
            onChangeState={selectedStateName ? undefined : () => {
              setSelectedStateName("");
              localStorage.removeItem("sarkari_selected_state");
            }}
          />
          <div className="pt-6">
            <FeaturedGridBoxes onJobSelect={handleJobSelect} selectedStateName={selectedStateName} />
          </div>
        </>
      )}

      {/* 6. MAIN 3-COLUMN HIGH DENSITY GRID STAGE */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* L1 Side panel - left (Only displayed on home view to optimize post reading readability) */}
          {viewState === "home" && (
            <div className="lg:col-span-1 order-2 lg:order-1">
              <SidebarLeft 
                onQuickLinkClick={(type) => {
                  if (type === "results") handleTickerOrTagSelect("UPSC");
                  else if (type === "admit") handleTickerOrTagSelect("CGL");
                  else handleResetFilters();
                }}
                onQualificationClick={handleQualificationSelect}
              />
            </div>
          )}

          {/* C1 Central operational view - Spans entire 4 cols on Post details and State views for premium reading layout */}
          <div className={`${
            viewState === "home" ? "lg:col-span-2" : "lg:col-span-4"
          } space-y-6 order-1 lg:order-2`}>
            
            {viewState === "home" && (
              <>
                {/* A. State Selection Grid */}
                {!selectedStateName && (
                  <StateSelectionCard 
                    onStateSelect={handleStateSelect} 
                    activeThemeId={activeThemeId}
                    selectedStateName={selectedStateName}
                  />
                )}

                {/* B. Central categories grid */}
                <CentralCategories 
                  onCategorySelect={handleFilterByCategory}
                  onJobSelect={handleJobSelect}
                  activeThemeId={activeThemeId}
                  selectedStateName={selectedStateName}
                />

                {/* C. Latest Jobs notifications table index */}
                <LatestJobsTable
                  onJobSelect={handleJobSelect}
                  onAlertsSubscribe={() => setShowAlertsPopup(true)}
                  filteredJobs={filteredLatestJobs}
                  activeFilterLabel={filterLabel}
                  onResetFilters={handleResetFilters}
                  activeThemeId={activeThemeId}
                />

                {/* D. Dual Results / Admit card lists */}
                <ResultsAdmitGrids 
                  onAdmitCardsClick={() => handleTickerOrTagSelect("CGL")}
                  onResultsClick={() => handleTickerOrTagSelect("IAS")}
                  results={filteredResults}
                  admitCards={filteredAdmitCards}
                  activeThemeId={activeThemeId}
                />

                {/* E. Prime Career Services & Directories Hub */}
                <SarkariResourceHub 
                  onJobSelect={handleJobSelect}
                  onAlertsSubscribe={() => setShowAlertsPopup(true)}
                />
              </>
            )}

            {viewState === "state" && (
              <StateJobView 
                stateName={selectedStateName}
                onBack={() => setViewState("home")}
                onJobSelect={handleJobSelect}
              />
            )}

            {viewState === "job" && (
              <JobDetailView 
                jobIdOrTitle={selectedJobIdOrTitle}
                onBack={() => setViewState("home")}
                onOpenAlerts={() => setShowAlertsPopup(true)}
                jobs={jobs}
                onJobSelect={handleJobSelect}
              />
            )}

          </div>

          {/* R1 Side panel - right (Only displayed on home view to optimize post reading readability) */}
          {viewState === "home" && (
            <div className="lg:col-span-1 order-3 lg:order-3">
              <SidebarRight 
                onStateClick={handleStateSelect}
                onJobSelect={handleJobSelect}
                onAlertsSubscribe={() => setShowAlertsPopup(true)}
                selectedStateName={selectedStateName}
              />
            </div>
          )}

        </div>
      </div>

      {/* Placement of top sections at the bottom during job post view state */}
      {viewState === "job" && (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-4 border-t border-slate-200 select-none">
          <div className="rounded-xl overflow-hidden shadow-sm border border-slate-250">
            <AnnouncementStrip />
            <Navbar 
              onNavigateHome={() => setViewState("home")}
              onStateSelect={handleStateSelect}
              onFilterByCategory={handleFilterByCategory}
              onAdmitCardsClick={() => handleTickerOrTagSelect("CGL")}
              onResultsClick={() => handleTickerOrTagSelect("IAS")}
              selectedStateName={selectedStateName}
            />
            <TickerBar customAlertText={stickyAdText} />
          </div>
        </div>
      )}
        </>
      )}

      {/* 7. Bottom popular trending search section */}
      <section className="bg-white border-t border-slate-200 py-6 select-none shadow-sm mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">📈</span>
            <h4 className="font-baloo text-base font-extrabold text-[#0a0f2e] uppercase tracking-wide">
              Trending Candidates Searches
            </h4>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {trendingSearches.map((tags, idx) => (
              <button
                key={idx}
                onClick={() => handleTickerOrTagSelect(tags.split(" ")[0])}
                className="bg-slate-100 hover:bg-[#cc0000] hover:text-white text-slate-700 text-xs font-semibold px-4 py-1.5 rounded-full transition-colors active:scale-95 border border-slate-200/50"
              >
                #{tags}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Fully comprehensive trust-building footer */}
      <Footer 
        onStateSelect={handleStateSelect}
        onFilterByCategory={handleFilterByCategory}
        onAlertsSubscribe={() => setShowAlertsPopup(true)}
        selectedStateName={selectedStateName}
        onFooterPageSelect={setActiveFooterPage}
      />

      {/* ==========================================
          MODALS OVERLAY DIALOG PORTALS
          ========================================== */}
      
      {/* A. Subscription alerts dialog overlay */}
      {showAlertsPopup && (
        <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden relative animate-scale-up select-none">
            <button
              onClick={() => {
                setShowAlertsPopup(false);
                setAlertFormSubmitted(false);
              }}
              className="absolute right-3.5 top-3.5 p-1 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            {/* Modal Heading */}
            <div className="bg-gradient-to-r from-[#003399] to-[#0c1445] p-5 pr-12 text-white flex gap-3.5 items-center">
              <div className="p-2.5 bg-amber-400 text-slate-950 rounded-xl shadow-lg">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h4 className="font-baloo font-extrabold text-sm sm:text-base leading-tight uppercase tracking-wide">Subscribe For Sarkari Alerts</h4>
                <p className="font-sans text-[10px] text-slate-200 leading-none mt-1">Receive immediate vacancies bulletins absolutely free</p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {!alertFormSubmited ? (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setAlertFormSubmitted(true);
                  }}
                  className="space-y-4 text-xs font-semibold"
                >
                  <div>
                    <label className="block text-slate-500 mb-1">Applicant Name *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Enter full legal name..." 
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#003399] focus:ring-1 focus:ring-[#003399]/30 rounded-lg p-2.5 outline-none font-sans"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 mb-1">State Residency *</label>
                      <select className="w-full bg-slate-50 border border-slate-200 focus:border-[#003399] focus:ring-1 focus:ring-[#003399]/30 rounded-lg p-2.5 outline-none font-sans">
                        <option>Uttar Pradesh</option>
                        <option>Bihar</option>
                        <option>Delhi</option>
                        <option>Rajasthan</option>
                        <option>Madhya Pradesh</option>
                        <option>Other States / UT</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Broad Sector interest *</label>
                      <select className="w-full bg-slate-50 border border-slate-200 focus:border-[#003399] focus:ring-1 focus:ring-[#003399]/30 rounded-lg p-2.5 outline-none font-sans">
                        <option>All Sectors</option>
                        <option>Railways Jobs</option>
                        <option>Banking & Clerical</option>
                        <option>Police & Defence</option>
                        <option>State PSC Boards</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">WhatsApp Mobile / Email address *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. +91 9988776655 or applicant@domain.in" 
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#003399] focus:ring-1 focus:ring-[#003399]/30 rounded-lg p-2.5 outline-none font-sans"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg text-[10px] text-slate-400 font-medium">
                    🛡️ <strong>GDPR Compliant:</strong> We do not publish subscription lists or transmit spam links. Unsubscribe with one click.
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#cc0000] text-white h-11 rounded-lg font-bold hover:bg-[#990000] transition-all shadow-lg shadow-red-500/20 text-xs tracking-wider uppercase active:scale-95 cursor-pointer block"
                  >
                    Activate Alerts Broadcast List
                  </button>
                </form>
              ) : (
                <div className="text-center py-6 space-y-4 animate-scale-up">
                  <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 animate-[spin_3s_linear]" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-baloo font-bold text-base text-navy-950">Subscription Verified!</h5>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto leading-normal">
                      We have enrolled your indices. Instant direct bulletins will be dispatched once newly audited recruitment links break.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowAlertsPopup(false);
                      setAlertFormSubmitted(false);
                    }}
                    className="bg-navy-950 hover:bg-navy-900 text-white font-bold text-xs tracking-wide uppercase px-6 py-2.5 rounded-xl transition-all shadow active:scale-95 cursor-pointer font-sans"
                  >
                    Acknowledge & Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* B. Footer legal pages overlay */}
      <FooterPagesModal 
        activePage={activeFooterPage} 
        onClose={() => setActiveFooterPage(null)} 
      />

      {/* C. Interactive Sarkari Push Notification Hub */}
      <PushNotificationHub onJobSelect={handleJobSelect} />

    </div>
  );
}
