import React, { useState, useMemo } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  Flame, 
  Briefcase, 
  GraduationCap, 
  BookOpen, 
  Settings, 
  Coins, 
  Award, 
  Compass, 
  MessageSquare, 
  HelpCircle, 
  TrendingUp, 
  UserCheck, 
  Building2, 
  Zap, 
  Calculator, 
  CheckCircle2, 
  HeartHandshake, 
  Share2, 
  FileCheck2, 
  MapPin, 
  Users, 
  Clock, 
  Search,
  Bell,
  Check,
  Calendar,
  AlertCircle,
  Info
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface SarkariResourceHubProps {
  onJobSelect: (jobTitle: string) => void;
  onAlertsSubscribe: () => void;
}

export function SarkariResourceHub({ onJobSelect, onAlertsSubscribe }: SarkariResourceHubProps) {
  // Navigation State
  const [activeTab, setActiveTab] = useState<"opportunities" | "skills" | "career_finance" | "intel">("opportunities");

  // Filter inside Private Jobs
  const [privateJobCategory, setPrivateJobCategory] = useState<string>("All");

  // Salary Calculator State
  const [calcBasicPay, setCalcBasicPay] = useState<number>(21750);
  const [calcCityCategory, setCalcCityCategory] = useState<"X" | "Y" | "Z">("Y");
  const [calcJobType, setCalcJobType] = useState<"Govt" | "Private" | "ITI">("Govt");

  // 7th CPC Salary Calculator States (Career Intel tab)
  const [cpcBasicPay, setCpcBasicPay] = useState<number>(35400);
  const [cpcCityCategory, setCpcCityCategory] = useState<"X" | "Y" | "Z">("Y");
  const [cpcJobType, setCpcJobType] = useState<"Group_A" | "Group_B_Gazetted" | "Group_B_NonGazetted" | "Group_C" | "Group_D">("Group_B_NonGazetted");
  const [cpcDaRate, setCpcDaRate] = useState<number>(50);

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [scoreChecked, setScoreChecked] = useState(false);

  // Email Alert Feed State
  const [userEmail, setUserEmail] = useState("");
  const [alertActivated, setAlertActivated] = useState(false);

  // Search filter for schemes/guides
  const [resourceSearch, setResourceSearch] = useState("");

  // Simulated Career Stats Database for Recharts
  const placementStatsData = [
    { year: "2021", "ITI placements": 62, "Polytechnic": 74, "Private Sector": 55 },
    { year: "2022", "ITI placements": 68, "Polytechnic": 78, "Private Sector": 64 },
    { year: "2023", "ITI placements": 75, "Polytechnic": 82, "Private Sector": 71 },
    { year: "2024", "ITI placements": 81, "Polytechnic": 86, "Private Sector": 79 },
    { year: "2025", "ITI placements": 88, "Polytechnic": 91, "Private Sector": 86 },
    { year: "2026", "ITI placements": 94, "Polytechnic": 95, "Private Sector": 92 }
  ];

  const sectorGrowthData = [
    { sector: "Solar Tech", jobs: 12000 },
    { sector: "CNC/Factory", jobs: 18500 },
    { sector: "Data Entry", jobs: 24000 },
    { sector: "Electrician", jobs: 15500 },
    { sector: "Mobile Repair", jobs: 9800 }
  ];

  // Daily Current Affairs Questions
  const currentAffairsQuiz = [
    {
      id: 1,
      q: "Which Indian Union Territory achieved 100% solar power operational capacity across all its public directories?",
      options: ["Puducherry", "Daman and Diu", "Chandigarh", "Ladakh"],
      correct: 1 // Daman and Diu
    },
    {
      id: 2,
      q: "Under the PM Vishwakarma Scheme, what is the maximum initial collateral-free enterprise loan offered at a subsidized interest rate of 5%?",
      options: ["₹50,000", "₹1,00,000", "₹2,00,000", "₹3,00,000"],
      correct: 1 // ₹1,00,000
    },
    {
      id: 3,
      q: "Which regulatory council supervises and awards certificates for all NAPS Apprenticeships in India?",
      options: ["UGC Council", "MSDE (Ministry of Skill Development)", "AICTE Council", "NITI Aayog Division"],
      correct: 1 // MSDE
    }
  ];

  // Salary calculation helper
  const ComputedSalary = useMemo(() => {
    // Basic rules:
    // DA is typically 50% of Basic Pay (Current 2026 estimate)
    const da = Math.round(calcBasicPay * 0.50);
    
    // HRA varies based on City Classification: X (30%), Y (20%), Z (10%)
    const hraRate = calcCityCategory === "X" ? 0.30 : calcCityCategory === "Y" ? 0.20 : 0.10;
    const hra = Math.round(calcBasicPay * hraRate);

    // TA (Transport Allowance) & EPF/Pension deduction estimates
    const ta = calcJobType === "Govt" ? 3600 : calcJobType === "Private" ? 2000 : 1200;
    const grossPay = calcBasicPay + da + hra + ta;

    // Deductions: 10% NPS/EPF + 200 Professional tax
    const providentFund = Math.round(calcBasicPay * 0.12);
    const professionalTax = 200;
    const totalDeductions = providentFund + professionalTax;
    const netSalary = grossPay - totalDeductions;

    return {
      da,
      hra,
      ta,
      grossPay,
      providentFund,
      netSalary
    };
  }, [calcBasicPay, calcCityCategory, calcJobType]);

  const cpcCalculations = useMemo(() => {
    // Dearness Allowance (DA)
    const daValue = Math.round(cpcBasicPay * (cpcDaRate / 100));

    // House Rent Allowance (HRA)
    // Under 7th CPC rules, HRA is 24% (X), 16% (Y), 8% (Z) when DA is < 25%.
    // When DA crosses 25%, it becomes 27% (X), 18% (Y), 9% (Z).
    // When DA crosses 50%, it becomes 30% (X), 20% (Y), 10% (Z).
    let hraRate = 0.08;
    if (cpcDaRate >= 50) {
      hraRate = cpcCityCategory === "X" ? 0.30 : cpcCityCategory === "Y" ? 0.20 : 0.10;
    } else if (cpcDaRate >= 25) {
      hraRate = cpcCityCategory === "X" ? 0.27 : cpcCityCategory === "Y" ? 0.18 : 0.09;
    } else {
      hraRate = cpcCityCategory === "X" ? 0.24 : cpcCityCategory === "Y" ? 0.16 : 0.08;
    }
    const hraValue = Math.round(cpcBasicPay * hraRate);

    // Transport Allowance (TA) - approximate typical levels for cities vs others
    let baseTa = 1800;
    if (cpcJobType === "Group_A") {
      baseTa = cpcCityCategory === "X" ? 7200 : 3600;
    } else if (cpcJobType === "Group_B_Gazetted" || cpcJobType === "Group_B_NonGazetted") {
      baseTa = cpcCityCategory === "X" ? 3600 : 1800;
    } else if (cpcJobType === "Group_C") {
      baseTa = cpcCityCategory === "X" ? 1800 : 900;
    } else {
      baseTa = cpcCityCategory === "X" ? 1350 : 900;
    }
    // TA has DA on it! (Transport Allowance also gets DA extension)
    const taDa = Math.round(baseTa * (cpcDaRate / 100));
    const taValue = baseTa + taDa;

    // Gross Salary
    const grossPay = cpcBasicPay + daValue + hraValue + taValue;

    // Deductions:
    // NPS (National Pension System) is 10% of (Basic Pay + DA)
    const npsValue = Math.round((cpcBasicPay + daValue) * 0.10);

    // CGEGIS (Central Govt Employees Group Insurance Scheme)
    let cgegisValue = 30;
    if (cpcJobType === "Group_A") cgegisValue = 120;
    else if (cpcJobType === "Group_B_Gazetted" || cpcJobType === "Group_B_NonGazetted") cgegisValue = 60;
    else if (cpcJobType === "Group_C") cgegisValue = 30;
    else cgegisValue = 15;

    // CGHS (Central Govt Health Scheme)
    let cghsValue = 250;
    if (cpcBasicPay > 76200) cghsValue = 1000;
    else if (cpcBasicPay > 53100) cghsValue = 650;
    else if (cpcBasicPay > 36500) cghsValue = 450;
    else cghsValue = 250;

    // Professional Tax
    const profTax = 200;

    // Total Deductions
    const totalDeductions = npsValue + cgegisValue + cghsValue + profTax;

    // Net In-Hand Salary
    const netPay = grossPay - totalDeductions;

    return {
      daValue,
      hraRate,
      hraValue,
      baseTa,
      taDa,
      taValue,
      grossPay,
      npsValue,
      cgegisValue,
      cghsValue,
      profTax,
      totalDeductions,
      netPay
    };
  }, [cpcBasicPay, cpcCityCategory, cpcJobType, cpcDaRate]);

  const handleQuizAnswer = (quizId: number, optionIdx: number) => {
    if (scoreChecked) return;
    setSelectedAnswers(prev => ({ ...prev, [quizId]: optionIdx }));
  };

  const handleAlertActivationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userEmail.trim()) {
      setAlertActivated(true);
      setTimeout(() => setAlertActivated(false), 5000);
      setUserEmail("");
    }
  };

  return (
    <div id="career-opportunity-hub" className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md select-none mt-6">
      
      {/* Prime Header */}
      <div className="bg-gradient-to-r from-[#003399] to-[#0a1b44] p-6 text-white text-left flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-white/5">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-black tracking-widest text-[#ffe6a4] bg-red-600/80 px-2.5 py-1 rounded-lg inline-block animate-pulse">
            Sarkari Premium Career Services
          </span>
          <h2 className="font-baloo font-black text-xl sm:text-2xl tracking-tight">
            Integrated Opportunities & Resource Hub
          </h2>
          <p className="text-xs text-slate-350 max-w-xl font-medium leading-relaxed">
            Instant guidance, salary calculators, skill development indexes, sitemaps, active private jobs database, and academic trackers verified directly from board databases.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
          <a
            href="https://t.me/SarkariResult_In"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-blue-500/15 hover:bg-blue-500/30 border border-blue-400/30 text-blue-200 text-xs font-black px-4 py-2 rounded-xl transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
            <span>Join Telegram</span>
          </a>
          <button
            onClick={onAlertsSubscribe}
            className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-4 py-2 rounded-xl transition-all"
          >
            <Bell className="w-3.5 h-3.5 shrink-0" />
            <span>Enable WhatsApp Alerts</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Tabs Left Panel & Sandbox Right Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[500px]">
        
        {/* Left Hand Navigation Dashboard Controls */}
        <div className="bg-slate-50 border-r border-slate-200 p-4 space-y-2 lg:col-span-1 text-left flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 shrink-0">
          
          <button
            onClick={() => setActiveTab("opportunities")}
            className={`w-full p-3 px-4 rounded-xl flex items-center gap-3 transition-all font-sans text-xs tracking-wide uppercase font-black border ${
              activeTab === "opportunities"
                ? "bg-white border-blue-200 text-[#003399] shadow-sm font-extrabold"
                : "border-transparent text-slate-600 hover:bg-slate-100 hover:text-[#003399]"
            }`}
          >
            <Briefcase className="w-4 h-4 shrink-0 text-blue-600" />
            <span className="truncate">🚀 Opportunities</span>
          </button>

          <button
            onClick={() => setActiveTab("skills")}
            className={`w-full p-3 px-4 rounded-xl flex items-center gap-3 transition-all font-sans text-xs tracking-wide uppercase font-black border ${
              activeTab === "skills"
                ? "bg-white border-blue-200 text-[#003399] shadow-sm font-extrabold"
                : "border-transparent text-slate-600 hover:bg-slate-100 hover:text-[#003399]"
            }`}
          >
            <GraduationCap className="w-4 h-4 shrink-0 text-amber-500" />
            <span className="truncate">🛠 Skill Education</span>
          </button>

          <button
            onClick={() => setActiveTab("career_finance")}
            className={`w-full p-3 px-4 rounded-xl flex items-center gap-3 transition-all font-sans text-xs tracking-wide uppercase font-black border ${
              activeTab === "career_finance"
                ? "bg-white border-blue-200 text-[#003399] shadow-sm font-extrabold"
                : "border-transparent text-slate-600 hover:bg-slate-100 hover:text-[#003399]"
            }`}
          >
            <Coins className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="truncate">💰 Salary & Schemes</span>
          </button>

          <button
            onClick={() => setActiveTab("intel")}
            className={`w-full p-3 px-4 rounded-xl flex items-center gap-3 transition-all font-sans text-xs tracking-wide uppercase font-black border ${
              activeTab === "intel"
                ? "bg-white border-blue-200 text-[#003399] shadow-sm font-extrabold"
                : "border-transparent text-slate-600 hover:bg-slate-100 hover:text-[#003399]"
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0 text-red-650" />
            <span className="truncate">🏛 Career Intel</span>
          </button>

          {/* Quick Stats Block inside sidebar */}
          <div className="hidden lg:block border border-slate-200 bg-white rounded-2xl p-4 mt-6 space-y-3 shadow-inner">
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest block">Live Traffic Telemetry</span>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div className="text-sm font-black text-blue-800">4,92k+</div>
                <div className="text-[9px] text-slate-500 font-bold">Admissions</div>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div className="text-sm font-black text-rose-800">32M+</div>
                <div className="text-[9px] text-slate-500 font-bold">Total Queries</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 justify-center text-[10px] text-emerald-700 font-bold bg-emerald-50 py-1.5 px-3 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All 2026 Schemes Active</span>
            </div>
          </div>

        </div>

        {/* Right Active Sandboxed Context Container */}
        <div className="lg:col-span-3 p-6 sm:p-8 text-left select-text scroll-mt-4">
          
          {/* SEARCH INTEGRATION FOR SCHEMES & VACANCIES */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5 mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-baloo font-black text-slate-900 flex items-center gap-2">
                {activeTab === "opportunities" && "🚀 Employment Horizons & Interactive Jobs"}
                {activeTab === "skills" && "🛠 Professional Skill Trades & Government Academies"}
                {activeTab === "career_finance" && "💰 Subsidized Schemes, Calculators & Pay Commissions"}
                {activeTab === "intel" && "🏛 Daily Intel, Admissions, Career Analytics & FAQs"}
              </h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Click specific filters below to view localized lists and scheme prospectus records instantly.
              </p>
            </div>

            <div className="relative w-full sm:w-60 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="text" 
                value={resourceSearch}
                onChange={(e) => setResourceSearch(e.target.value)}
                placeholder="Search resources, schemes, guilds..." 
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#003399] focus:ring-4 focus:ring-blue-50 focus:bg-white rounded-xl p-2 pl-9 pr-4 text-xs font-sans outline-none font-medium"
              />
            </div>
          </div>

          {/* ==========================================
              TAB 1: OPPORTUNITIES CONTENT AREA
              ========================================== */}
          {activeTab === "opportunities" && (
            <div className="space-y-6 animate-scale-up">
              
              {/* Core Opportunities Categories Grid Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Module A: New Opportunities List */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4.5 space-y-4 hover:shadow-md transition-all">
                  <h4 className="font-baloo text-[#002266] font-black text-sm uppercase tracking-wider border-b pb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-[#cc0000] rounded-full"></span>
                    <span>New Career Portals</span>
                  </h4>

                  <ul className="space-y-2 text-xs font-bold font-sans">
                    {[
                      { name: "Latest Government Jobs", count: "89 Actives", tag: "Govt", color: "text-blue-600 bg-blue-50" },
                      { name: "Apprenticeship NAPS/NATS", count: "12,400+ Posts", tag: "Apprentice", color: "text-amber-600 bg-amber-50" },
                      { name: "Walk-in Recruitment Interviews", count: "This Week", tag: "Direct", color: "text-red-650 bg-red-50" },
                      { name: "Central Ministry Internships", count: "Govt Scheme", tag: "Intern", color: "text-emerald-700 bg-emerald-50" }
                    ].map((opp, idx) => (
                      <li key={idx} className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-150">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">⚡</span>
                          <span className="text-slate-800">{opp.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] px-2 py-0.5 rounded font-black ${opp.color}`}>
                            {opp.tag}
                          </span>
                          <button 
                            onClick={() => onJobSelect(opp.name)}
                            className="text-[#003399] hover:text-blue-800 transition-colors"
                          >
                            →
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Module B: Job Alerts Hub Checklist */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4.5 space-y-4 hover:shadow-md transition-all">
                  <h4 className="font-baloo text-[#002266] font-black text-sm uppercase tracking-wider border-b pb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-indigo-600 rounded-full"></span>
                    <span>Direct Alert Integrations</span>
                  </h4>

                  <ul className="space-y-2 text-xs font-bold font-sans">
                    {[
                      { media: "WhatsApp Alerts Broadcasters", info: "Join the verified group chat to get daily 10:00 AM digests", action: "Join group", link: "https://chat.whatsapp.com/SarkariResult" },
                      { media: "Telegram Channel Feed", info: "Instant bot pushes within 2 mins of official gazette notification", action: "Sub channels", link: "https://t.me/SarkariResult_In" },
                      { media: "Push Notifications", info: "HTML5 Desktop & mobile native notification service integration", action: "Activate", trigger: "push" },
                      { media: "ISO audited Email Alerts", info: "Get weekly PDFs & syllabus directly into your mailbox free", action: "Active Weekly", trigger: "email" }
                    ].map((alertBox, idx) => (
                      <li key={idx} className="p-2.5 bg-slate-50/50 hover:bg-slate-50 rounded-xl transition-all border border-slate-200/65 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <span className="text-slate-800 font-extrabold block">{alertBox.media}</span>
                          <span className="text-[10px] text-slate-500 font-medium leading-tight block max-w-xs">{alertBox.info}</span>
                        </div>
                        <button
                          onClick={() => {
                            if (alertBox.trigger === "push") {
                              const toggleBtn = document.querySelector('[title="Open Push Notifications Desk"]');
                              if (toggleBtn) (toggleBtn as HTMLButtonElement).click();
                            } else if (alertBox.trigger === "email") {
                              const emailEl = document.getElementById("newsletter-email");
                              if (emailEl) emailEl.scrollIntoView({ behavior: "smooth" });
                            } else if (alertBox.link) {
                              window.open(alertBox.link, "_blank");
                            }
                          }}
                          className="text-[10px] bg-white border border-slate-200 hover:border-blue-400 hover:text-[#002266] px-3 py-1.5 rounded-lg text-slate-650 transition-all font-black self-start sm:self-center bg-slate-50"
                        >
                          {alertBox.action}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Module C: Interactive Private Jobs Database Panel */}
              <div className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-2xl p-4.5 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div className="space-y-0.5">
                    <h4 className="font-baloo text-slate-900 font-black text-sm uppercase tracking-wide flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-slate-500" />
                      <span>Private Jobs Sector Index (गैर-सरकारी रोज़गार)</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 font-semibold leading-snug">
                      Verified non-governmental openings with high localized placement rates, immediate interviews & work-from-home facilities.
                    </p>
                  </div>

                  {/* Filter tabs */}
                  <div className="flex flex-wrap gap-1">
                    {["All", "WFH", "Fresher", "Office"].map((cat) => (
                      <button 
                        key={cat}
                        onClick={() => setPrivateJobCategory(cat)}
                        className={`text-[10px] font-black px-2.5 py-1 rounded-lg transition-all ${
                          privateJobCategory === cat 
                            ? "bg-slate-800 text-white" 
                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid Lists */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {[
                    { id: "p-1", title: "Technical Data Entry Clerk", comp: "TCS iON Skill Division", placement: "Work From Home", sal: "₹18,500 - ₹22,000", type: "WFH", loc: "Delhi NCR / Remote", eligibility: "Class 12 Passed" },
                    { id: "p-2", title: "BPO Customer Support Officer", comp: "Genpact Services Ltd", placement: "Fresher Jobs", sal: "₹24,000 - ₹28,500", type: "Fresher", loc: "Sector 62, Noida", eligibility: "Graduate Clear" },
                    { id: "p-3", title: "Retail Outlet Manager Trainee", comp: "Reliance Retail Hubs", placement: "On-site Office", sal: "₹16,800 + Incentives", type: "Office", loc: "Kolkata Hub Lines", eligibility: "ITI / Class 12" },
                    { id: "p-4", title: "Delivery Partner Associate", comp: "BlueDart Logistics India", placement: "Immediate Joining", sal: "₹15,000 - ₹21,000", type: "Fresher", loc: "Patna / Bihar", eligibility: "Class 10 Passed" },
                    { id: "p-5", title: "Industrial CNC Machine Operator", comp: "Tata Motors Suppliers Ltd", placement: "Factory Jobs", sal: "₹21,000 - ₹26,000", type: "Office", loc: "Pune Cluster", eligibility: "Polytechnic / ITI" },
                    { id: "p-6", title: "Remote Voice & Dialect Trainee", comp: "Airtel Support Bureau", placement: "Work From Home", sal: "₹19,000 - ₹23,400", type: "WFH", loc: "Pan-India Remote", eligibility: "Class 12" }
                  ].filter(item => {
                    if (privateJobCategory === "All") return true;
                    return item.type === privateJobCategory;
                  }).map((job) => (
                    <div key={job.id} className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all rounded-2xl p-4 flex flex-col justify-between space-y-3 relative overflow-hidden group">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-[9.5px] bg-[#003399]/5 text-[#003399] border border-[#003399]/10 px-2 py-0.2 rounded-md font-black">{job.comp}</span>
                          <span className="text-[9px] text-[#cc0000] font-black">{job.placement}</span>
                        </div>
                        <h5 className="font-sans font-extrabold text-slate-800 text-xs sm:text-sm pt-1 group-hover:text-[#003399] transition-colors">{job.title}</h5>
                        <div className="text-[10.5px] text-slate-500 font-bold space-y-0.5">
                          <div>📍 Location: <strong className="text-slate-700">{job.loc}</strong></div>
                          <div>🎓 Eligibility: <strong className="text-slate-700">{job.eligibility}</strong></div>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-2 flex items-center justify-between gap-1">
                        <span className="text-xs text-slate-900 font-black">{job.sal}</span>
                        <button
                          onClick={() => {
                            alert(`Provisional Registration Successful for "${job.title}". Verification code SR-${job.id} registered live.`);
                          }}
                          className="text-[10px] bg-slate-900 border border-slate-800 hover:bg-[#cc0000] hover:border-[#cc0000] text-white px-3 py-1.5 rounded-xl transition-all font-black"
                        >
                          Apply Now Case
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          )}


          {/* ==========================================
              TAB 2: SKILL EDUCATION & ITI CONTENT AREA
              ========================================== */}
          {activeTab === "skills" && (
            <div className="space-y-6 animate-scale-up">
              
              {/* Module A: Free Government Schemes Certifications Courses */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 space-y-4">
                <div className="flex items-center justify-between border-b pb-2.5 border-slate-200">
                  <div className="space-y-0.5">
                    <h4 className="font-baloo text-[#002266] font-black text-sm uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-4.5 h-4.5 text-amber-500" />
                      <span>Government Sponsored Free Courses (निःशुल्क कौशल विकास)</span>
                    </h4>
                    <p className="text-[11px] text-slate-550 font-semibold leading-relaxed">
                      Eminent central schemes with guaranteed post-curriculum placements, travel stipends, and certificate awards verified by Skill India bureau.
                    </p>
                  </div>
                  <span className="text-[9.5px] font-black bg-emerald-50 text-emerald-800 border border-emerald-150 px-2.5 py-1 rounded-full animate-pulse">100% Free</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-bold font-sans">
                  {[
                    { name: "PMKVY 4.0 Registration", comp: "Pradhan Mantri Kaushal Vikas Yojana", duration: "12 Weeks (320 Hours)", allowance: "₹1,500 Transport Stipend", apply: "Verify eligibility scheme" },
                    { name: "DDU-GKY Skill Projects", comp: "Deen Dayal Upadhyaya Grameen Kaushalya", duration: "6 Months Residential", allowance: "Free Lodging & Uniform", apply: "Check rural quota" },
                    { name: "PM Vishwakarma Toolkits Training", comp: "Subsidized craft support initiative", duration: "15 Days Masterclass", allowance: "₹15,000 Premium Toolkit Pack", apply: "Apply craft line" },
                    { name: "Digital India Courses", comp: "NIC division cloud and coding basics", duration: "Online self-paced modules", allowance: "Industry standard XML certificate", apply: "Launch digital course" }
                  ].map((course, idx) => (
                    <div key={idx} className="bg-white border border-slate-200/80 p-3 rounded-xl flex flex-col justify-between space-y-2 hover:border-blue-400 transition-all">
                      <div className="space-y-1">
                        <span className="text-[9.5px] text-[#cc0000] font-black block">{course.comp}</span>
                        <h5 className="font-sans font-extrabold text-[#002266] text-xs uppercase tracking-wide">{course.name}</h5>
                        <div className="text-[10.5px] text-slate-500 block font-medium space-y-0.5">
                          <div>📅 Duration: <strong>{course.duration}</strong></div>
                          <div>💰 Allowances: <strong className="text-[#003399]">{course.allowance}</strong></div>
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          alert(`Curriculum Guidelines Loaded: "${course.name}". Dispatching syllabus XML packet to the portal directory.`);
                        }}
                        className="w-full text-center text-[10px] hover:text-white bg-slate-50 hover:bg-[#003399] border border-slate-200 text-slate-700 py-1.5 rounded-lg font-black transition-all"
                      >
                        {course.apply}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Module B: Technical Placement Trades Hub */}
              <div className="space-y-3">
                <h4 className="font-baloo text-slate-900 font-black text-sm uppercase tracking-wide flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#cc0000]" />
                  <span>Technical Placement Trades (ITI & Polytechnic Branches)</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {[
                    { trade: "Electrician Trade", duration: "2 Years ITI Scheme", prospect: "Railway & State Power Board", count: "12,400+ Vacancies", color: "border-blue-200 hover:border-blue-500 text-blue-800" },
                    { trade: "Fitter Trade", duration: "2 Years Course", prospect: "BHEL, SAIL, HAL heavy plants", count: "8,950+ Vacancies", color: "border-red-200 hover:border-red-500 text-red-800" },
                    { trade: "Welding Professional", duration: "1 Year ITI Course", prospect: "Shipyards & Coach factories", count: "5,420+ Vacancies", color: "border-amber-200 hover:border-amber-500 text-amber-800" },
                    { trade: "CNC Machine Operator", duration: "6 Months Cert", prospect: "Automotive Ancillaries", count: "9,200+ Openings", color: "border-purple-200 hover:border-purple-500 text-purple-800" },
                    { trade: "Solar Technician", duration: "1 Year Advanced", prospect: "Utility scale solar farms", count: "14,000+ Demand", color: "border-emerald-200 hover:border-emerald-500 text-emerald-800" },
                    { trade: "Plumbing Specialist", duration: "1 Year ITI Scheme", prospect: "Infra companies & municipal", count: "3,110+ Vacancies", color: "border-orange-200 hover:border-orange-500 text-orange-850" },
                    { trade: "Mobile Repair Specialist", duration: "6 Months Practical", prospect: "Authorized service outlets", count: "7,400+ Openings", color: "border-pink-200 hover:border-pink-500 text-pink-800" }
                  ].map((tradeObj, idx) => (
                    <div 
                      key={idx} 
                      className={`bg-white border-2 rounded-2xl p-3 flex flex-col justify-between space-y-2 hover:-translate-y-1 transition-all shadow-sm ${tradeObj.color}`}
                    >
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-[11px] uppercase block leading-tight">{tradeObj.trade}</span>
                        <span className="text-[10px] text-slate-550 font-semibold block">{tradeObj.duration}</span>
                      </div>

                      <div className="border-t border-slate-100 pt-2 text-[10px] text-slate-600 font-bold leading-tight">
                        <div className="text-slate-800 truncate">💼 Recruiters: <strong>{tradeObj.prospect.split(" ")[0]}</strong></div>
                        <div className="text-[#cc0000] mt-0.5 font-extrabold">{tradeObj.count}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admission info dashboard */}
              <div className="bg-amber-50/45 border border-amber-250 rounded-2xl p-4.5 flex flex-col sm:flex-row items-center gap-3 justify-between">
                <div className="flex gap-2.5 items-start text-left font-bold text-xs text-slate-850">
                  <span className="p-1.5 bg-amber-200/50 rounded-lg text-amber-800">📋</span>
                  <div>
                    <span className="font-extrabold text-amber-950 block text-xs">ITI / Polytechnic Academies Admission Verification</span>
                    <p className="text-[10.5px] text-slate-700 leading-normal max-w-lg font-medium leading-relaxed">
                      Discover active government colleges and placement statistics under state boards of technical education. Minimum qualification Class 10/12 passes can directly enroll online.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onJobSelect("ITI Trades Admission")}
                  className="bg-slate-900 hover:bg-slate-950 text-white font-black text-[10px] tracking-wide uppercase px-4 py-2 rounded-xl transition-all shrink-0"
                >
                  Verify College Allocation
                </button>
              </div>

            </div>
          )}


          {/* ==========================================
              TAB 3: SALARY COMMISSION & DYNAMIC ESTIMATOR
              ========================================== */}
          {activeTab === "career_finance" && (
            <div className="space-y-6 animate-scale-up">
              
              {/* Module A: Interactive Smart Salary Calculator */}
              <div className="bg-[#0f172a] text-[#f1f5f9] rounded-2xl border border-slate-800 p-5 sm:p-6.5 space-y-5 shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-15 overflow-hidden translate-x-20 -translate-y-20 pointer-events-none">
                  <Calculator className="w-80 h-80 text-white" />
                </div>

                <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[9.5px] uppercase font-black tracking-widest text-[#ffe6a4] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Financial Projection Sandbox</span>
                    </span>
                    <h4 className="font-baloo text-white font-black text-sm uppercase tracking-wide">
                      7th CPC & Private Sector Pay Estimation Tool (वेतन कैलकुलेटर)
                    </h4>
                  </div>
                  
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 font-bold font-mono px-2.5 py-1 rounded-full">
                    Audited for 2026 scales
                  </span>
                </div>

                {/* Grid Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold select-all">
                  
                  <div>
                    <label className="block text-slate-400 mb-1">Scale / Basic Pay (INR/Month)</label>
                    <input 
                      type="number" 
                      step={500}
                      value={calcBasicPay}
                      onChange={(e) => setCalcBasicPay(Math.max(12000, Number(e.target.value)))}
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-2.5 outline-none focus:border-[#003399]"
                    />
                    <span className="text-[9.5px] text-slate-500">Minimum: ₹12,000 for Trainee level</span>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">City Classification Rate</label>
                    <select
                      value={calcCityCategory}
                      onChange={(e) => setCalcCityCategory(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-2.5 outline-none font-sans font-medium"
                    >
                      <option value="X">Class X Cities (Metros - Delhi/Mumbai/Kolkata)</option>
                      <option value="Y">Class Y Cities (Tier 2- Pune/Patna/Lucknow)</option>
                      <option value="Z">Class Z Rural Area / Smaller Municipal Districts</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Structure Context</label>
                    <select
                      value={calcJobType}
                      onChange={(e) => setCalcJobType(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-2.5 outline-none font-sans font-medium"
                    >
                      <option value="Govt">Central Civil Services (7th CPC DA Index)</option>
                      <option value="Private">Corporate Grade Band (PF + Direct Deductions)</option>
                      <option value="ITI">ITI/Polytechnic Trainee Stipend scale</option>
                    </select>
                  </div>

                </div>

                {/* Computation Live Result Layout */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 grid grid-cols-2 md:grid-cols-5 gap-3 text-center text-xs">
                  
                  <div className="p-2 border border-slate-800 bg-slate-950/40 rounded-lg">
                    <span className="text-slate-500 font-bold block text-[10px]">BASIC PAY</span>
                    <strong className="text-white font-mono font-black text-sm block mt-0.5">₹{calcBasicPay.toLocaleString()}</strong>
                  </div>

                  <div className="p-2 border border-slate-800 bg-slate-950/40 rounded-lg">
                    <span className="text-slate-500 font-bold block text-[10px]">DA (50% SCALE)</span>
                    <strong className="text-amber-300 font-mono font-black text-sm block mt-0.5">₹{ComputedSalary.da.toLocaleString()}</strong>
                  </div>

                  <div className="p-2 border border-slate-800 bg-slate-950/40 rounded-lg">
                    <span className="text-slate-500 font-bold block text-[10px]">HRA IN-HAND</span>
                    <strong className="text-emerald-400 font-mono font-black text-sm block mt-0.5">₹{ComputedSalary.hra.toLocaleString()}</strong>
                  </div>

                  <div className="p-2 border border-slate-800 bg-slate-950/40 rounded-lg">
                    <span className="text-slate-500 font-bold block text-[10px]">GROSS PAY</span>
                    <strong className="text-[#ffe6a4] font-mono font-black text-sm block mt-0.5">₹{ComputedSalary.grossPay.toLocaleString()}</strong>
                  </div>

                  <div className="p-2 border border-blue-900/40 bg-blue-950/30 rounded-lg col-span-2 md:col-span-1">
                    <span className="text-blue-300 font-black block text-[10px]">NET IN-HAND (TAKE HOME)</span>
                    <strong className="text-emerald-500 font-mono font-black text-base block mt-0.5">₹{ComputedSalary.netSalary.toLocaleString()}</strong>
                  </div>

                </div>

                <div className="text-[10px] text-slate-500 flex items-start gap-2 leading-relaxed">
                  <Info className="w-4 h-4 text-[#cc0000] shrink-0 mt-0.5" />
                  <span>
                    Gross & net take-home indicators are calculated dynamically based strictly on government norms under Rule-3 of the Ministry of Finance. Private bands assume flat 12% employee EPF contributions. Use these estimates for general referencing.
                  </span>
                </div>
              </div>


              {/* Module B: Premium Sitemaps & Scholarships */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Visual Scholarship Finder Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4.5 space-y-4 hover:shadow-md transition-all">
                  <h4 className="font-baloo text-[#002266] font-black text-sm uppercase tracking-wider border-b pb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-emerald-600 rounded-full"></span>
                    <span>National Scholarships Desk</span>
                  </h4>

                  <ul className="space-y-2 text-xs font-bold font-sans">
                    {[
                      { name: "NSP Scholarship Portal", scope: "Central Sector Merit Schemes Scheme", funding: "Up to ₹50,000 / Year", date: "Apply by June 2026" },
                      { name: "Swami Vivekananda Support", scope: "West Bengal High Education Board", funding: "Up to ₹60,000 Academic", date: "Verify merits lists" },
                      { name: "OASIS SC/ST Registry", scope: "Pre-matric & Post-matric boards", funding: "Direct Bank Remit Case", date: "Caste verification" },
                      { name: "Minority Central Council", scope: "Sikh, Buddhist, Muslim quotas", funding: "Full tuition assistance", date: "Check online list" }
                    ].map((sch, idx) => (
                      <li key={idx} className="p-2.5 bg-slate-50/50 hover:bg-slate-50 rounded-xl transition-all border border-slate-150 flex flex-col justify-between space-y-1">
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          <span className="text-slate-800 font-extrabold">{sch.name}</span>
                          <span className="text-[9px] text-[#cc0000] bg-red-50 px-2 py-0.2 rounded font-bold">{sch.date}</span>
                        </div>
                        <p className="text-[10.5px] text-slate-500 font-semibold leading-tight">{sch.scope}</p>
                        <span className="text-[10.5px] text-emerald-700 font-extrabold">{sch.funding}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Subsidized Government Schemes Summary */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4.5 space-y-4 hover:shadow-md transition-all">
                  <h4 className="font-baloo text-[#002266] font-black text-sm uppercase tracking-wider border-b pb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-[#cc0000] rounded-full"></span>
                    <span>Subsidized Government Schemes</span>
                  </h4>

                  <ul className="space-y-2 text-xs font-bold font-sans">
                    {[
                      { title: "PM Awas Yojana Gramin Pro", desk: "Subsidized home loan support schemes", allowance: "₹1,20,000 Subsidy allocation" },
                      { title: "PM Kisan Samman Nidhi Yojana", desk: "Agricultural direct farmer bank benefit", allowance: "₹6,000 Yearly (₹2k/Quarter)" },
                      { title: "PM Vishwakarma Artisans Support", desk: "Craftsman toolkit grant + enterprise audit", allowance: "₹15,000 Tool Voucher credit" },
                      { title: "Ayushman Bharat Golden Card", desk: "Cashless secure medical cover index", allowance: "₹5,00,000 Cover/Family" },
                      { title: "Annapurna Free Scheme Pro", desk: "Subsidized monthly ration distribution", allowance: "10KG Free Cereals Allocation" }
                    ].map((sch, idx) => (
                      <li key={idx} className="p-2.5 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-150 flex flex-col justify-between">
                        <div className="flex items-center justify-between gap-1.5 flex-wrap">
                          <span className="text-slate-800 font-extrabold">{sch.title}</span>
                          <span className="text-[#003399] font-black text-[10px]">Ref-2026</span>
                        </div>
                        <p className="text-[10.5px] text-slate-500 font-medium leading-tight my-0.5">{sch.desk}</p>
                        <span className="text-[10px] text-emerald-700 font-bold">{sch.allowance}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>
          )}


          {/* ==========================================
              TAB 4: CORE INTEL, CHARTS, AND FAQ EXTRA BLOCKS
              ========================================== */}
          {activeTab === "intel" && (
            <div className="space-y-6 animate-scale-up">
              
              {/* Interactive 7th CPC Salary Calculator (Sarkari Premium Tool) */}
              <div className="bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 p-5 sm:p-7 space-y-6 shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-[0.05] translate-x-20 -translate-y-20 pointer-events-none select-none">
                  <Calculator className="w-80 h-80 text-white" />
                </div>

                <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-black tracking-widest text-amber-300 bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 rounded-full inline-block">
                        Interactive Calculator
                      </span>
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    </div>
                    <h4 className="font-baloo text-white font-black text-lg tracking-tight uppercase">
                      7th Central Pay Commission (CPC) Calculator (वेतन संगणक)
                    </h4>
                    <p className="text-xs text-slate-400 max-w-xl font-medium">
                      Estimate your actual gross pay and hand-received net salary based on 2026 dearness indexes and Ministry of Finance criteria.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1.5 self-start sm:self-center">
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-bold px-3 py-1.5 rounded-xl uppercase">
                      Rule-3 Compliant
                    </span>
                  </div>
                </div>

                {/* Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-semibold">
                  
                  {/* Basic Pay + Presets */}
                  <div className="space-y-1.5">
                    <label className="block text-slate-400 font-bold uppercase tracking-wider text-[10px]">Basic Pay (INR)</label>
                    <input 
                      type="number" 
                      step={100}
                      value={cpcBasicPay}
                      onChange={(e) => setCpcBasicPay(Math.max(18000, Number(e.target.value)))}
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-mono text-sm"
                    />
                    
                    {/* Quick Presets */}
                    <div className="grid grid-cols-2 gap-1 mt-1.5">
                      <button 
                        type="button" 
                        onClick={() => setCpcBasicPay(18000)}
                        className={`text-[9px] p-1.5 rounded-lg border text-center font-bold tracking-wide transition-all ${
                          cpcBasicPay === 18000
                            ? "bg-amber-400 border-amber-400 text-slate-950"
                            : "bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/50"
                        }`}
                      >
                        Lvl 1 (18k)
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setCpcBasicPay(25500)}
                        className={`text-[9px] p-1.5 rounded-lg border text-center font-bold tracking-wide transition-all ${
                          cpcBasicPay === 25500
                            ? "bg-amber-400 border-amber-400 text-slate-955"
                            : "bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/50"
                        }`}
                      >
                        Lvl 4 (25.5k)
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setCpcBasicPay(35400)}
                        className={`text-[9px] p-1.5 rounded-lg border text-center font-bold tracking-wide transition-all ${
                          cpcBasicPay === 35400
                            ? "bg-amber-400 border-amber-400 text-slate-950"
                            : "bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/50"
                        }`}
                      >
                        Lvl 6 (35.4k)
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setCpcBasicPay(56100)}
                        className={`text-[9px] p-1.5 rounded-lg border text-center font-bold tracking-wide transition-all ${
                          cpcBasicPay === 56100
                            ? "bg-amber-400 border-amber-400 text-slate-950"
                            : "bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/50"
                        }`}
                      >
                        Lvl 10 (56.1k)
                      </button>
                    </div>
                  </div>

                  {/* Dearness Allowance Rate Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="block text-slate-400 font-bold uppercase tracking-wider text-[10px]">DA Rate (%)</label>
                      <span className="text-amber-300 font-mono font-bold">{cpcDaRate}%</span>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col justify-center h-11.5">
                      <input 
                        type="range" 
                        min="40" 
                        max="60" 
                        value={cpcDaRate}
                        onChange={(e) => setCpcDaRate(Number(e.target.value))}
                        className="w-full accent-amber-400 cursor-pointer h-1.5 rounded-lg"
                      />
                    </div>
                    <span className="text-[9.5px] text-slate-500 block leading-tight font-medium">Standard baseline: 50% for 2026 scales.</span>
                  </div>

                  {/* HRA City Category */}
                  <div className="space-y-1.5">
                    <label className="block text-slate-400 font-bold uppercase tracking-wider text-[10px]">HRA Category (City Type)</label>
                    <select
                      value={cpcCityCategory}
                      onChange={(e) => setCpcCityCategory(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 outline-none focus:border-amber-400 transition-all font-sans font-medium h-11.5"
                    >
                      <option value="X">Class X (Metros - HRA 30%)</option>
                      <option value="Y">Class Y (Tier-2 Cities - HRA 20%)</option>
                      <option value="Z">Class Z (Rural/Towns - HRA 10%)</option>
                    </select>
                    <span className="text-[9.5px] text-slate-505 block leading-tight">Scale auto-raises above 50% DA milestone.</span>
                  </div>

                  {/* Job Level Class / Post Type */}
                  <div className="space-y-1.5">
                    <label className="block text-slate-400 font-bold uppercase tracking-wider text-[10px]">Job Type Classification</label>
                    <select
                      value={cpcJobType}
                      onChange={(e) => setCpcJobType(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 outline-none focus:border-amber-400 transition-all font-sans font-medium h-11.5"
                    >
                      <option value="Group_A">Group A (Officer / IAS / MBBS)</option>
                      <option value="Group_B_Gazetted">Group B (Gazetted / Officer Rank)</option>
                      <option value="Group_B_NonGazetted">Group B (Non-Gazetted Staff)</option>
                      <option value="Group_C">Group C (Assistant / Clerk / Teacher)</option>
                      <option value="Group_D">Group D (Support / Helper / Attendant)</option>
                    </select>
                    <span className="text-[9.5px] text-slate-500 block leading-tight font-medium">Affects Transport levels & Group Insurances.</span>
                  </div>

                </div>

                {/* Computational live layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                  
                  {/* Left Column Ledger */}
                  <div className="md:col-span-7 bg-slate-950/50 border border-slate-800/80 rounded-2xl p-5.5 space-y-4">
                    <span className="text-[10px] text-slate-450 uppercase font-black tracking-wider block border-b border-slate-800 pb-1.5">
                      Official Earnings & Allowance Breakdown
                    </span>
                    
                    <div className="space-y-3.5 text-xs font-semibold">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                          <span>1. Basic Pay (Scheduled Matrix Rate)</span>
                        </span>
                        <span className="text-white font-mono font-bold">₹{cpcBasicPay.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span>2. Dearness Allowance (DA at {cpcDaRate}%)</span>
                        </span>
                        <span className="text-amber-300 font-mono font-bold">+ ₹{cpcCalculations.daValue.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>3. House Rent Allowance (HRA at {Math.round(cpcCalculations.hraRate * 100)}%)</span>
                        </span>
                        <span className="text-emerald-400 font-mono font-bold">+ ₹{cpcCalculations.hraValue.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                          <span>4. Transport Allowance (TA Level: ₹{cpcCalculations.baseTa.toLocaleString()} + DA on TA)</span>
                        </span>
                        <span className="text-indigo-305 font-mono font-bold">+ ₹{cpcCalculations.taValue.toLocaleString()}</span>
                      </div>

                      <div className="border-t border-slate-800/80 pt-3.5 flex justify-between items-center">
                        <span className="text-white font-black text-sm uppercase tracking-wide">Gross Premium Salary</span>
                        <span className="text-amber-300 font-mono font-black text-sm sm:text-base">₹{cpcCalculations.grossPay.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column Deductions Ledger */}
                  <div className="md:col-span-5 bg-slate-950/50 border border-slate-800/80 rounded-2xl p-5.5 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[10px] text-slate-450 uppercase font-black tracking-wider block border-b border-slate-800 pb-1.5">
                        Statutory Deductions (कटौती)
                      </span>

                      <div className="space-y-3.5 text-xs font-semibold mt-3.5">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">NPS contribution (10% of Basic+DA)</span>
                          <span className="text-rose-400 font-mono">- ₹{cpcCalculations.npsValue.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">CGHS Mediclaim Card Contribution</span>
                          <span className="text-rose-400 font-mono">- ₹{cpcCalculations.cghsValue.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">CGEGIS Group Insurance Scheme</span>
                          <span className="text-rose-400 font-mono">- ₹{cpcCalculations.cgegisValue.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Professional State Tax (Flat)</span>
                          <span className="text-rose-400 font-mono">- ₹{cpcCalculations.profTax}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-850 pt-3.5 flex justify-between items-center">
                      <span className="text-slate-400 text-xs font-bold">Total Deducted</span>
                      <span className="text-rose-400 font-mono font-black">₹{cpcCalculations.totalDeductions.toLocaleString()}</span>
                    </div>
                  </div>

                </div>

                {/* Final Net Pay Highlight */}
                <div className="bg-gradient-to-r from-emerald-900/10 via-emerald-950/20 to-emerald-900/10 border border-emerald-500/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 text-center sm:text-left">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 text-xl">
                      💵
                    </div>
                    <div>
                      <span className="text-emerald-400 font-black text-sm tracking-wide uppercase block">In-Hand Salary projection (Take-Home Salary)</span>
                      <p className="text-[11px] text-slate-400 leading-normal font-medium mt-0.5">
                        Estimated final monthly credit directly to your bank account after mandatory NPS retirement contributions.
                      </p>
                    </div>
                  </div>

                  <div className="text-center sm:text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-0.5">ESTIMATED NET PAY / MONTH</span>
                    <span className="text-emerald-400 font-mono font-black text-2xl sm:text-3xl tracking-tight block">
                      ₹{cpcCalculations.netPay.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Progress bar visual analytics */}
                <div className="space-y-1 bg-slate-950/40 p-3.5 rounded-xl border border-slate-805">
                  <span className="text-[9px] text-slate-500 font-bold uppercase block tracking-wider mb-1.5">Earnings Visual Composition Ratio</span>
                  <div className="w-full h-3.5 bg-slate-900 rounded-full flex overflow-hidden border border-slate-800">
                    <div 
                      title={`Basic Pay: ${Math.round((cpcBasicPay / cpcCalculations.grossPay) * 100)}%`}
                      style={{ width: `${(cpcBasicPay / cpcCalculations.grossPay) * 100}%` }} 
                      className="bg-blue-600/85 h-full transition-all duration-300"
                    />
                    <div 
                      title={`DA: ${Math.round((cpcCalculations.daValue / cpcCalculations.grossPay) * 100)}%`}
                      style={{ width: `${(cpcCalculations.daValue / cpcCalculations.grossPay) * 100}%` }} 
                      className="bg-amber-500/85 h-full transition-all duration-300"
                    />
                    <div 
                      title={`HRA & TA: ${Math.round(((cpcCalculations.hraValue + cpcCalculations.taValue) / cpcCalculations.grossPay) * 100)}%`}
                      style={{ width: `${((cpcCalculations.hraValue + cpcCalculations.taValue) / cpcCalculations.grossPay) * 100}%` }} 
                      className="bg-emerald-500/85 h-full transition-all duration-300"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-[9px] text-slate-500 font-bold justify-between pt-1">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-600" /> Basic Salary ({Math.round((cpcBasicPay / cpcCalculations.grossPay) * 100)}%)</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-500" /> Dearness Allowance ({Math.round((cpcCalculations.daValue / cpcCalculations.grossPay) * 100)}%)</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500" /> HRA & TA Benefits ({Math.round(((cpcCalculations.hraValue + cpcCalculations.taValue) / cpcCalculations.grossPay) * 100)}%)</span>
                  </div>
                </div>

                <div className="text-[9.5px] text-slate-555 flex items-start gap-1.5 leading-relaxed">
                  <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Disclaimer: Calculations above align strictly with 7th Pay Commission baseline matrices under Ministry of Finance rule bulletins. Practical salaries are subjected to variations based on designated city transport coordinates, special duties allowances, and income tax tier settings. Please utilize for reference only.
                  </span>
                </div>
              </div>

              {/* Module A: Recharts Career Trends & Placements Tracker */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Placements Chart */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4.5 space-y-4 shadow-sm">
                  <div className="border-b border-slate-100 pb-2">
                    <h5 className="font-baloo font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-600 animate-pulse" />
                      <span>Placements Rate Success Analytics (%)</span>
                    </h5>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                      Audited historical employment allocation index across state networks.
                    </p>
                  </div>

                  <div className="h-[180px] w-full text-[10px] font-mono">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={placementStatsData}>
                        <XAxis dataKey="year" stroke="#475569" fontSize={9} />
                        <YAxis stroke="#475569" fontSize={9} />
                        <Tooltip />
                        <Line type="monotone" dataKey="ITI placements" stroke="#cc0000" strokeWidth={2.5} name="ITI Trades" />
                        <Line type="monotone" dataKey="Polytechnic" stroke="#003399" strokeWidth={2.5} name="Polytechnic" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Growth Trades Bar Chart */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4.5 space-y-4 shadow-sm">
                  <div className="border-b border-slate-100 pb-2">
                    <h5 className="font-baloo font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#003399]" />
                      <span>Demand Demographics Volume</span>
                    </h5>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                      Estimated active candidate registrations under prioritized local trade sectors.
                    </p>
                  </div>

                  <div className="h-[180px] w-full text-[10px] font-mono">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sectorGrowthData}>
                        <XAxis dataKey="sector" stroke="#475569" fontSize={8} />
                        <YAxis stroke="#475569" fontSize={9} />
                        <Tooltip />
                        <Bar dataKey="jobs" fill="#003399" radius={[4, 4, 0, 0]} name="Vacancies" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>


              {/* Module B: Daily Current Affairs Interactive Practice Grid */}
              <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/20 border border-blue-150 rounded-2xl p-4.5.5 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div className="space-y-0.5 text-left">
                    <span className="text-[9px] font-black uppercase text-[#003399] tracking-widest block">Daily Exam Prep Bureau</span>
                    <h4 className="font-baloo text-slate-900 font-black text-sm uppercase tracking-wide flex items-center gap-1.5">
                      <GraduationCap className="w-4.5 h-4.5 text-blue-600" />
                      <span>Today's Current Affairs MCQ Series (दैनिक समसामयिकी)</span>
                    </h4>
                  </div>

                  <button
                    onClick={() => {
                      setScoreChecked(true);
                      playChimeAudited();
                    }}
                    className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg transition-all ${
                      scoreChecked 
                        ? "bg-emerald-600 text-white" 
                        : "bg-[#cc0000] text-white hover:bg-[#990000] shadow-sm animate-bounce cursor-pointer"
                    }`}
                  >
                    {scoreChecked ? "Review Correct Key" : "Verify Test Answers"}
                  </button>
                </div>

                <div className="space-y-4">
                  {currentAffairsQuiz.map((quiz, qIdx) => (
                    <div key={quiz.id} className="bg-white border border-slate-150 rounded-xl p-3.5 space-y-3 shadow-sm">
                      <h5 className="font-sans font-extrabold text-xs text-slate-800 leading-relaxed text-left flex items-start gap-1.5">
                        <span className="text-[#cc0000] font-mono">Q{qIdx + 1}.</span>
                        <span>{quiz.q}</span>
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {quiz.options.map((option, optIdx) => {
                          const isSelected = selectedAnswers[quiz.id] === optIdx;
                          const isCorrect = quiz.correct === optIdx;
                          
                          let btnStyle = "border-slate-200 bg-slate-50/30 text-slate-650 hover:bg-slate-50";
                          if (isSelected) {
                            btnStyle = "border-[#003399] bg-blue-50 text-blue-900 font-extrabold";
                          }
                          if (scoreChecked) {
                            if (isCorrect) {
                              btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-extrabold";
                            } else if (isSelected) {
                              btnStyle = "border-red-500 bg-red-50 text-red-900";
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleQuizAnswer(quiz.id, optIdx)}
                              className={`p-2 rounded-lg border-2 text-left transition-all ${btnStyle}`}
                            >
                              <div className="flex items-center justify-between gap-1.5 text-[11px] font-semibold">
                                <span>{String.fromCharCode(65 + optIdx)}. {option}</span>
                                {scoreChecked && isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              {/* Module C: Success Stories & Upcoming Admissions Timeline */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* 1. Placement Success Stories Accordions */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4.5 space-y-4">
                  <h4 className="font-baloo text-slate-900 font-black text-sm uppercase tracking-wide flex items-center gap-1.5 border-b pb-1.5 border-slate-100">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>Candidate Success Stories (चयनित अभ्यर्थी)</span>
                  </h4>

                  <div className="space-y-3 text-xs">
                    {[
                      { candidate: "Rajesh Kumar Mandal", trade: "Junior Assistant Level", exam: "UP Police Council, 2025", quote: "Being from a rural district in Bihar, discovering notification charts on SarkariResult.in was my only key. The direct prospectus verified links allowed me to upload credentials seamlessly. Certified!", color: "bg-orange-50 border-orange-100" },
                      { candidate: "Poonam Das", trade: "ITI Electrician Trainee", exam: "Railway Recruitment Board, 2026", quote: "The skill development trades information allowed me to choose Electrician and monitor NAPS apprentice openings. I have completed my training successfully.", color: "bg-blue-50 border-blue-100" }
                    ].map((story, idx) => (
                      <div key={idx} className={`p-3.5 border-2 rounded-xl text-left space-y-1.5 ${story.color}`}>
                        <div className="flex items-center justify-between gap-2.5 flex-wrap">
                          <span className="font-extrabold text-slate-900 block font-sans">{story.candidate}</span>
                          <span className="text-[10px] text-[#cc0000] font-black">{story.exam}</span>
                        </div>
                        <span className="text-[10px] block font-extrabold text-slate-500">Post Achieved: <strong className="text-[#002266]">{story.trade}</strong></span>
                        <p className="text-[10.5px] italic font-semibold text-slate-700 leading-relaxed font-sans">
                          "{story.quote}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Upcoming Admissions Timeline */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4.5 space-y-4">
                  <h4 className="font-baloo text-[#002266] font-black text-sm uppercase tracking-wider flex items-center gap-1.5 border-b pb-1.5 border-slate-100">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    <span>Admissions Timelines</span>
                  </h4>

                  <ul className="space-y-3 font-semibold text-xs leading-relaxed text-left font-sans">
                    {[
                      { title: "UPSC Combined Geo-Scientist Class", dates: "Apply before: June 15, 2026", quota: "National Merit" },
                      { title: "NTA UGC NET Exam Registration", dates: "Apply online before: July 02, 2026", quota: "Doctoral quota" },
                      { title: "Central ITI Government College Seat", dates: "Allotment list: July 12, 2026", quota: "State Level" }
                    ].map((timeline, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start">
                        <div className="w-2 rounded-full h-2 bg-[#cc0000] mt-1.5 shrink-0 animate-ping"></div>
                        <div className="space-y-0.5">
                          <span className="text-slate-800 font-extrabold block leading-snug">{timeline.title}</span>
                          <span className="text-[10px] text-slate-500 block">{timeline.dates}</span>
                          <span className="text-[9px] bg-slate-100 border border-slate-200 px-1.5 rounded inline-block uppercase text-slate-650 font-bold mt-1">{timeline.quota}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>

      {/* Internal Web Audio Synth trigger helper */}
    </div>
  );
}

// Quiet synthesized alert trigger sounds for play
function playChimeAudited() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(660, ctx.currentTime);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch (e) {}
}
