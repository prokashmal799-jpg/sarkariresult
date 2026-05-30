import React, { useState, useMemo, useContext } from "react";
import { 
  Plus, Edit2, Trash2, LayoutDashboard, Briefcase, FileText, 
  Settings, ArrowLeft, Terminal, Sparkles, Check, CheckCircle, 
  AlertTriangle, CreditCard, Calendar, Shield, Activity, RefreshCw,
  Search, X, Bell
} from "lucide-react";
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  Tooltip, Cell, AreaChart, Area 
} from "recharts";
import { Job, ExamResult, AdmitCard, SiteSettings } from "../types";
import { AppContext } from "./Website";
import { JOB_CATS, STATE_CARDS, QUALS } from "../data";

export const AdminPanel: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { 
    jobs, results, admits, ticker, siteSettings, setView, addToast, isLoading,
    pushSubscription, setPushSubscription, pushAlerts, setPushAlerts, sendPushAlertToClient
  } = context;

  const currentUser = (context as any).currentUser;
  const loginWithGoogle = (context as any).loginWithGoogle;
  const logoutAdmin = (context as any).logoutAdmin;

  // Since context from App holds shared triggers, let's access setters by cast or type
  // Our App.tsx will declare the variables and setters in context so we can mutate cleanly!
  const setJobs = (context as any).setJobs;
  const setResults = (context as any).setResults;
  const setAdmits = (context as any).setAdmitCards; // From app.tsx state mappings
  const setTicker = (context as any).setTicker;
  const setSiteSettings = (context as any).setSiteSettings;

  // Sidebar collapsed state
  const [collapsed, setCollapsed] = useState(false);

  // Auto-collapse sidebar on smaller mobile/tablet screens for optimized grid layout space
  React.useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setCollapsed(true);
    }
  }, []);

  // Administrative path navigation router
  const [adminPage, setAdminPage] = useState<
    "dashboard" | "add-job" | "jobs" | "results" | "admitcards" | "ticker" | "settings" | "push"
  >("dashboard");

  // Push notification custom draft composer state
  const [pushForm, setPushForm] = useState({
    title: "",
    body: "",
    category: "Central Jobs",
    url: ""
  });

  // Selection keys for edits
  const [editJobId, setEditJobId] = useState<number | null>(null);
  
  // Modal controllers for simpler modules
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [editResultId, setEditResultId] = useState<number | null>(null);

  const [admitModalOpen, setAdmitModalOpen] = useState(false);
  const [editAdmitId, setEditAdmitId] = useState<number | null>(null);

  // Filter keys inside tables
  const [jobsSearch, setJobsSearch] = useState("");

  // AI generator spinning loader
  const [aiLoading, setAiLoading] = useState(false);

  // 1. Dashboard calculations
  const totalJobs = jobs.length;
  const activeJobsCount = jobs.filter((j) => j.status === "active").length;
  const hotJobsCount = jobs.filter((j) => j.isHot).length;
  const totalResults = results.length;
  const totalAdmits = admits.length;

  // Data processing for Recharts (Active Jobs grouped by Category)
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    JOB_CATS.forEach((cat) => {
      counts[cat] = 0;
    });
    jobs.forEach((job) => {
      if (counts[job.category] !== undefined) {
        counts[job.category] += 1;
      }
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name: name.replace(" Jobs", ""), count }))
      .filter((item) => item.count > 0);
  }, [jobs]);

  // Data processing for States distribution Chart
  const stateChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    jobs.forEach((j) => {
      counts[j.state] = (counts[j.state] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name: name.slice(0, 10), count }))
      .slice(0, 7);
  }, [jobs]);

  // 2. Action triggers and form templates
  const [jobForm, setJobForm] = useState<Partial<Job>>({
    title: "",
    org: "",
    category: JOB_CATS[0],
    state: "All India",
    vacancy: "",
    lastDate: "",
    qual: QUALS[5], // Graduate default
    salary: "",
    fee: "₹100",
    feeSC: "Free",
    feeFemale: "Free",
    ageLow: "18",
    ageHigh: "32",
    applyLink: "",
    notifLink: "",
    status: "active",
    isHot: false,
    isNew: true,
    desc: ""
  });

  // Load JobForm helper for Adding or Editing
  const triggerAddJob = () => {
    setEditJobId(null);
    setJobForm({
      title: "",
      org: "",
      category: JOB_CATS[0],
      state: "All India",
      vacancy: "",
      lastDate: "",
      qual: QUALS[5],
      salary: "",
      fee: "₹100",
      feeSC: "Free",
      feeFemale: "Free",
      ageLow: "18",
      ageHigh: "32",
      applyLink: "",
      notifLink: "",
      status: "active",
      isHot: false,
      isNew: true,
      desc: ""
    });
    setAdminPage("add-job");
  };

  const triggerEditJob = (job: Job) => {
    setEditJobId(job.id);
    setJobForm({
      ...job,
      faq: job.faq || [],
      seo: job.seo || {
        metaTitle: "",
        metaDesc: "",
        focusKeywords: "",
        structuredDataSchema: ""
      }
    });
    setAdminPage("add-job");
  };

  // Automated AI recruitment announcement copy simulation
  const handleAiGenerate = () => {
    if (!jobForm.title || !jobForm.org) {
      addToast("⚠ Provide Job Title and Authority Board first!", "warn");
      return;
    }
    setAiLoading(true);
    setTimeout(() => {
      const generatedAnnouncement = `🚨 STATUTORY RECRUITMENT NOTICE: ${jobForm.title} 🚨\n\n${jobForm.org} has officially released the recruitment prospectus for filling up ${jobForm.vacancy || "designated"} operational positions of public scope.\n\n📌 KEY ELIGIBILITY PARTICULARS:\n• Employing Authority: ${jobForm.org}\n• Region Allocation: ${jobForm.state}\n• Required Credentials: ${jobForm.qual}\n• Remuneration Scale: ${jobForm.salary || "As per central matrix indices"}\n• Designated Category: ${jobForm.category}\n\n💳 FEE METRIC:\n• General / Other Classes: ${jobForm.fee || "₹100"}\n• SC / ST Classes: ${jobForm.feeSC || "Free"}\n• Females: ${jobForm.feeFemale || "Free"}\n\n⚠️ IMPORTANT RULE REGISTRATION: Registered candidates are urgently advised to download the statutory notification sheet via ${jobForm.notifLink || "Official website links"}. Check all eligibility guidelines completely before uploading qualifications. Fill forms with factual particulars, remit charges, and download printable verification cards before the timeline deadline of ${jobForm.lastDate || "the statutory closing date"}.`;
      
      setJobForm((p) => ({ ...p, desc: generatedAnnouncement }));
      setAiLoading(false);
      addToast("✨ AI Recruitment Announcement generated properly!", "success");
    }, 1200);
  };

  // CRUD Job publisher
  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.title || !jobForm.org || !jobForm.lastDate || !jobForm.vacancy) {
      addToast("⚠ Please complete all required form fields (*)", "warn");
      return;
    }

    if (editJobId) {
      // Editing
      const updated = jobs.map((j) => 
        j.id === editJobId ? { ...(jobForm as Job), id: editJobId, created: j.created } : j
      );
      setJobs(updated);
      addToast("✅ Statutory Job Posting is configured and modified!", "success");
    } else {
      // Adding new
      const newJob: Job = {
        ...(jobForm as Job),
        id: Date.now(),
        created: new Date().toISOString()
      };
      setJobs([newJob, ...jobs]);
      addToast("✅ New Statutory Job Posting published instantly to Website!", "success");
    }
    setAdminPage("jobs");
  };

  // CRUD Delete job
  const handleDeleteJob = (id: number) => {
    if (confirm("🚨 Are you absolutely sure you want to delete this job posting? It will instantly disappear from the public website.")) {
      const filtered = jobs.filter((j) => j.id !== id);
      setJobs(filtered);
      addToast("🗑 Job posting successfully deleted from public portals.", "success");
    }
  };

  // 3. Results controls
  const [resultForm, setResultForm] = useState<Partial<ExamResult>>({
    title: "",
    exam: "",
    date: "",
    link: "",
    state: "All India",
    status: "published"
  });

  const triggerAddResult = () => {
    setEditResultId(null);
    setResultForm({
      title: "",
      exam: "",
      date: new Date().toISOString().split("T")[0],
      link: "https://",
      state: "All India",
      status: "published"
    });
    setResultModalOpen(true);
  };

  const triggerEditResult = (res: ExamResult) => {
    setEditResultId(res.id);
    setResultForm(res);
    setResultModalOpen(true);
  };

  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resultForm.title || !resultForm.exam) {
      addToast("⚠ Please complete all result fields", "warn");
      return;
    }

    if (editResultId) {
      const updated = results.map((r) => 
        r.id === editResultId ? { ...(resultForm as ExamResult), id: editResultId } : r
      );
      setResults(updated);
      addToast("✅ Examination Result record successfully updated!", "success");
    } else {
      const newRes: ExamResult = {
        ...(resultForm as ExamResult),
        id: Date.now()
      };
      setResults([newRes, ...results]);
      addToast("✅ Live Exam Result published instantly to Website!", "success");
    }
    setResultModalOpen(false);
  };

  const handleDeleteResult = (id: number) => {
    if (confirm("Delete this result record?")) {
      setResults(results.filter((r) => r.id !== id));
      addToast("🗑 Result deleted.", "success");
    }
  };

  // 4. Admit Cards controls
  const [admitForm, setAdmitForm] = useState<Partial<AdmitCard>>({
    title: "",
    exam: "",
    examDate: "",
    link: "",
    state: "All India",
    status: "published"
  });

  const triggerAddAdmit = () => {
    setEditAdmitId(null);
    setAdmitForm({
      title: "",
      exam: "",
      examDate: "",
      link: "https://",
      state: "All India",
      status: "published"
    });
    setAdmitModalOpen(true);
  };

  const triggerEditAdmit = (adm: AdmitCard) => {
    setEditAdmitId(adm.id);
    setAdmitForm(adm);
    setAdmitModalOpen(true);
  };

  const handleSaveAdmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!admitForm.title || !admitForm.examDate) {
      addToast("⚠ Please complete all required admit card fields", "warn");
      return;
    }

    if (editAdmitId) {
      const updated = admits.map((a) =>
        a.id === editAdmitId ? { ...(admitForm as AdmitCard), id: editAdmitId } : a
      );
      setAdmits(updated);
      addToast("✅ Examination Admit Card successfully updated!", "success");
    } else {
      const newAdm: AdmitCard = {
        ...(admitForm as AdmitCard),
        id: Date.now()
      };
      setAdmits([newAdm, ...admits]);
      addToast("✅ Live Admit Card published instantly!", "success");
    }
    setAdmitModalOpen(false);
  };

  const handleDeleteAdmit = (id: number) => {
    if (confirm("Delete this admit card record?")) {
      setAdmits(admits.filter((a) => a.id !== id));
      addToast("🗑 Admit Card record deleted.", "success");
    }
  };

  // 5. Notice ticker controls
  const [tickerEdit, setTickerEdit] = useState(ticker);

  const handleSaveTicker = () => {
    setTicker(tickerEdit);
    addToast("📡 Banner Notice updates broadcasted across entire portal!", "success");
  };

  const handleResetTicker = () => {
    const defaultText = "🚨 Latest Update: SSC CGL 2025 Combined Graduate Level Online forms are active til 15-June-2025. Apply now! | UP Police Constable Recruitment 60,244 vacancies last date extended to 30-June-2025. | Download UPSC IAS Civils Admission passes now.";
    setTickerEdit(defaultText);
    setTicker(defaultText);
    addToast("↩ Marquee notice reset to default static circular.", "success");
  };

  // 6. Settings controls
  const [settingsForm, setSettingsForm] = useState<SiteSettings>({ ...siteSettings });

  const handleSaveSettings = () => {
    setSiteSettings(settingsForm);
    addToast("⚙ Portal configurations updated successfully!", "success");
  };

  // Filter Jobs Table
  const filteredJobs = useMemo(() => {
    if (!jobsSearch) return jobs;
    const q = jobsSearch.toLowerCase();
    return jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.org.toLowerCase().includes(q) ||
        j.category.toLowerCase().includes(q) ||
        j.state.toLowerCase().includes(q)
    );
  }, [jobs, jobsSearch]);

  return (
    <div className="flex h-screen bg-[#F0F4FF] overflow-hidden text-slate-800 font-sans">
      
      {/* RED DANGER HEADER TOP STRIP */}
      <div className="absolute top-0 left-0 right-0 h-10.5 bg-[#cc0000] text-white flex items-center justify-between px-4 z-40 shadow-md">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-yellow-350 fill-yellow-350" />
          <span className="font-extrabold text-xs uppercase tracking-widest font-mono">
            {siteSettings.siteName} &bull; SARKARI SECURE SUPER ADMIN CENTER
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-yellow-400 text-[#003399] font-black text-[9px] px-2 py-0.5 rounded-full uppercase leading-none">
            {activeJobsCount} Active Vacancies
          </span>
          <button
            onClick={() => setView("site")}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1 rounded text-xs font-black tracking-wide uppercase transition cursor-pointer"
          >
            🌐 View Site
          </button>
        </div>
      </div>

      {/* SIDEBAR NAVIGATION CONTROL (COLLAPSIBLE DARK BLUE) */}
      <aside 
        className={`bg-[#003399] text-white flex flex-col pt-11 justify-between shadow-2xl transition-all duration-300 z-30 shrink-0 select-none ${collapsed ? "w-[58px]" : "w-[220px]"}`}
      >
        <div className="flex flex-col gap-5 pt-3">
          
          {/* Collapse logo block */}
          <div className="flex items-center justify-between p-4 border-b border-white/15 h-16">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <Shield className="w-7 h-7 text-yellow-400" />
                <div>
                  <span className="block font-black font-baloo text-sm tracking-tight leading-none text-white">Sarkari Controller</span>
                  <span className="text-[8px] tracking-widest text-[#FF6B00] uppercase font-bold">Authenticated Admin</span>
                </div>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-white hover:bg-white/10 p-1.5 rounded-lg border border-white/15 transition cursor-pointer mx-auto"
            >
              {collapsed ? "»" : "«"}
            </button>
          </div>

          {/* Links list */}
          <nav className="flex flex-col gap-1.5 px-2 font-semibold">
            {[
              { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
              { id: "jobs", label: "Manage Jobs", icon: <Briefcase className="w-4.5 h-4.5" /> },
              { id: "add-job", label: "Publish Job Card", action: triggerAddJob, icon: <Plus className="w-4.5 h-4.5" /> },
              { id: "results", label: "Results Ledger", icon: <FileText className="w-4.5 h-4.5" /> },
              { id: "admitcards", label: "Admit Downloaders", icon: <Calendar className="w-4.5 h-4.5" /> },
              { id: "ticker", label: "Notice Marquee", icon: <Terminal className="w-4.5 h-4.5" /> },
              { id: "push", label: "Push Broadcasts", icon: <Bell className="w-4.5 h-4.5" /> },
              { id: "settings", label: "Site Configuration", icon: <Settings className="w-4.5 h-4.5" /> }
            ].map((link) => {
              const active = adminPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={link.action || (() => setAdminPage(link.id as any))}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-left text-xs tracking-wide cursor-pointer transition-all duration-150 relative ${active ? "bg-[rgba(255,107,0,0.18)] text-[#fbbf24] border-l-4 border-[#FF6B00]" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}
                >
                  <span className="shrink-0">{link.icon}</span>
                  {!collapsed && <span className="truncate">{link.label}</span>}
                </button>
              );
            })}

            {/* View Website instant selector block */}
            <button
              onClick={() => setView("site")}
              className="w-full mt-4 flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-left text-xs bg-emerald-600/25 border-l-4 border-emerald-500 hover:bg-[#16a34a] text-emerald-400 hover:text-white transition cursor-pointer"
            >
              <Activity className="w-4.5 h-4.5 shrink-0" />
              {!collapsed && <span className="font-bold">🌐 View Website</span>}
            </button>
          </nav>
        </div>

        {/* Supervision dynamic login avatar/warning at footer */}
        {!collapsed && (
          <div className="p-3.5 border-t border-white/10 bg-black/25 flex flex-col gap-2 min-h-[70px]">
            {currentUser ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-orange-500 border border-white/20 flex items-center justify-center font-bold font-mono text-xs text-white uppercase shadow-inner">
                    {currentUser.email === "prokashmal799@gmail.com" ? "SA" : (currentUser.email?.slice(0, 2) || "AD")}
                  </div>
                  <div className="text-left leading-none max-w-[100px]">
                    <p className="text-[10px] font-bold text-white truncate" title={currentUser.email || "Active Admin"}>
                      {currentUser.displayName || currentUser.email?.split("@")[0] || "Admin Session"}
                    </p>
                    {currentUser.email === "prokashmal799@gmail.com" ? (
                      <span className="text-[7.5px] text-emerald-400 font-extrabold flex items-center gap-0.5 mt-1 tracking-wider uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 block animate-pulse"></span> WRITES LIVE
                      </span>
                    ) : (
                      <span className="text-[7.5px] text-rose-400 font-extrabold flex items-center gap-0.5 mt-1 tracking-wider uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 block"></span> READ ONLY
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={logoutAdmin}
                  className="text-xs bg-white/10 hover:bg-rose-600/30 text-slate-300 hover:text-rose-200 border border-white/10 px-2 py-1 rounded-lg transition-all cursor-pointer font-bold active:scale-95"
                >
                  Exit
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <p className="text-[9px] text-amber-200/80 font-semibold tracking-wide text-center">
                  ⚠️ SQLite / Firestore Read Only mode
                </p>
                <button
                  onClick={loginWithGoogle}
                  className="w-full flex items-center justify-center gap-1.5 bg-[#FF6B00] hover:bg-orange-500 text-white font-black text-[10px] tracking-wider uppercase py-1.5 px-2 rounded-lg transition-all shadow active:scale-95 cursor-pointer border border-[#FF6B00]"
                >
                  🔑 Google Auth
                </button>
              </div>
            )}
          </div>
        )}
      </aside>

      {/* CORE WORKSPACE CONTENT AND SWITCHER MODULE */}
      <main className="flex-1 flex flex-col pt-10.5 overflow-hidden">
        
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-white">
            <RefreshCw className="w-10 h-10 text-[#003399] animate-spin mb-3" />
            <p className="text-slate-500 text-sm font-semibold">Synchronizing central government databases securely...</p>
          </div>
        ) : (
          <div className="flex-1 p-6 overflow-y-auto space-y-6">

            {/* SUB ROUTER VIEW: A) DASHBOARD */}
            {adminPage === "dashboard" && (
              <div className="space-y-6">
                
                {/* Firebase Authentication Security Banner */}
                {(!currentUser || currentUser.email !== "prokashmal799@gmail.com") && (
                  <div className="bg-amber-50 border-2 border-dashed border-amber-300 rounded-2xl p-5 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="flex gap-3.5">
                      <AlertTriangle className="w-10 h-10 text-amber-600 shrink-0 mt-1" />
                      <div>
                        <h4 className="text-sm font-extrabold text-amber-950 font-baloo tracking-wide">
                          Administrative Write Access Pending (Read-Only State Active)
                        </h4>
                        <p className="text-xs text-amber-800 mt-1.5 max-w-3xl leading-relaxed font-medium">
                          Our portal is wired directly into persistent Firebase Firestore databases. Deployed security rules restrict write privileges to the authorized administrator: <strong className="text-yellow-950 bg-yellow-250 px-1.5 py-0.5 rounded font-mono font-bold text-[11px]">prokashmal799@gmail.com</strong>. Authenticate with Google now to sync statutory entries live!
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={loginWithGoogle}
                      className="cursor-pointer shrink-0 bg-[#003399] hover:bg-blue-800 text-white font-extrabold text-xs px-4.5 py-2.5 rounded-xl uppercase tracking-wider transition-all shadow-md flex items-center gap-2 border border-[#003399] active:scale-95"
                    >
                      🔑 Sign In with Google
                    </button>
                  </div>
                )}

                {/* Welcome strip banner */}
                <div className="bg-[#003399] text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
                  <div className="absolute right-0 top-0 opacity-10 p-6">
                    <Shield className="w-32 h-32 text-yellow-300" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold font-baloo text-yellow-350">
                      Welcome, Senior Recruiter Controller
                    </h2>
                    <p className="text-xs text-slate-300 max-w-xl mt-1.5 font-medium">
                      All administrative notifications are broadcasted instantly to thousands of Indian candidates searching credentials catalogs, admit cards, and merit lists.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={triggerAddJob}
                      className="bg-[#FF6B00] hover:bg-orange-600 text-white text-xs px-4 py-2 rounded-xl font-bold tracking-wide uppercase transition shadow-md cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add Job
                    </button>
                    <button
                      onClick={() => setView("site")}
                      className="bg-white/15 hover:bg-white/25 text-white text-xs px-4 py-2 rounded-xl border border-white/20 font-bold tracking-wide uppercase transition cursor-pointer"
                    >
                      View Live Site
                    </button>
                  </div>
                </div>

                {/* Stat numbers cells */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 select-none">
                  {[
                    { title: "Total Job Cards", val: totalJobs, bg: "bg-white text-blue-800 border-l-4 border-blue-600" },
                    { title: "Active Vacancies", val: activeJobsCount, bg: "bg-white text-emerald-800 border-l-4 border-emerald-500" },
                    { title: "Exam Results", val: totalResults, bg: "bg-white text-[#7e3af2] border-l-4 border-purple-500" },
                    { title: "Admit Card Sheets", val: totalAdmits, bg: "bg-white text-amber-800 border-l-4 border-amber-500" }
                  ].map((stat, idx) => (
                    <div key={idx} className={`p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col ${stat.bg}`}>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">{stat.title}</span>
                      <strong className="text-2xl font-black font-baloo leading-none">{stat.val}</strong>
                    </div>
                  ))}
                </div>

                {/* Double visualization chart boards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  
                  {/* Category distributions */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col gap-4">
                    <h3 className="font-baloo text-xs uppercase tracking-wider font-extrabold text-slate-500 border-b border-light pb-2">
                      Active Jobs Distribution by Category
                    </h3>
                    <div className="h-56">
                      {chartData.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-slate-400 text-xs">No active posts available for metrics.</div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                            <YAxis stroke="#94a3b8" fontSize={9} allowDecimals={false} />
                            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 10 }} />
                            <Bar dataKey="count" fill="#FF6B00" radius={[4, 4, 0, 0]}>
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#FF6B00" : "#003399"} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>

                  {/* Operational updates history logs list */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col gap-4">
                    <h3 className="font-baloo text-xs uppercase tracking-wider font-extrabold text-slate-500 border-b border-light pb-2">
                      Regional State Distribution Analysis
                    </h3>
                    <div className="h-56">
                      {stateChartData.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-slate-400 text-xs">No jobs locations designated.</div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={stateChartData}>
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                            <YAxis stroke="#94a3b8" fontSize={9} />
                            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 10 }} />
                            <Area type="monotone" dataKey="count" stroke="#003399" fill="#F0F4FF" strokeWidth={2.5} />
                          </AreaChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>

                </div>

                {/* Shortcuts toolbar */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <h3 className="font-sans font-extrabold text-[#003399] text-xs uppercase tracking-wider mb-4 border-b border-light pb-2.5">
                    ⚙ Super Admin Shortcuts
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 select-none">
                    <button onClick={triggerAddJob} className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-center hover:border-blue-400 hover:bg-blue-50 transition cursor-pointer flex flex-col items-center">
                      <Briefcase className="w-5 h-5 text-[#003399] mb-1.5" />
                      <span className="text-[11px] font-bold text-slate-700">Add New Job</span>
                    </button>
                    <button onClick={triggerAddResult} className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-center hover:border-purple-400 hover:bg-[#F0F4FF] transition cursor-pointer flex flex-col items-center">
                      <FileText className="w-5 h-5 text-purple-700 mb-1.5" />
                      <span className="text-[11px] font-bold text-slate-700">Add Exam Result</span>
                    </button>
                    <button onClick={triggerAddAdmit} className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-center hover:border-yellow-400 hover:bg-yellow-50 transition cursor-pointer flex flex-col items-center">
                      <Calendar className="w-5 h-5 text-amber-500 mb-1.5" />
                      <span className="text-[11px] font-bold text-slate-700">Add Admit Card</span>
                    </button>
                    <button onClick={() => setAdminPage("ticker")} className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-center hover:border-red-400 hover:bg-rose-50 transition cursor-pointer flex flex-col items-center">
                      <Terminal className="w-5 h-5 text-rose-500 mb-1.5" />
                      <span className="text-[11px] font-bold text-slate-700">Edit Scrolling notice</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* SUB ROUTER VIEW: B) MANAGE JOBS LIST */}
            {adminPage === "jobs" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-extrabold font-baloo text-[#003399]">
                      💼 All Government Job Postings ({totalJobs})
                    </h2>
                    <p className="text-xs text-slate-400 font-semibold">Active CRUD dashboard to modify or configure recruitment notices instantly.</p>
                  </div>
                  <button
                    onClick={triggerAddJob}
                    className="bg-[#FF6B00] hover:bg-orange-600 text-white text-xs px-4 py-2.5 rounded-xl font-bold uppercase tracking-wide cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-4.5 h-4.5" /> Publish New Notice
                  </button>
                </div>

                {/* Filter and quick bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                  <Search className="w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filter publications by title, authority boards or state locations..."
                    value={jobsSearch}
                    onChange={(e) => setJobsSearch(e.target.value)}
                    className="bg-transparent border-0 text-xs font-semibold placeholder-slate-400 outline-none w-full"
                  />
                </div>

                {/* Tables ledger */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md">
                  {filteredJobs.length === 0 ? (
                    <div className="p-10.5 text-center text-slate-400 text-xs font-bold">No matching job records index located in ledger databases.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-sans font-semibold">
                        <thead>
                          <tr className="bg-[#003399] text-white uppercase tracking-wider text-[9px]">
                            <th className="p-4">Recruitment Title</th>
                            <th className="p-4">Category Group</th>
                            <th className="p-4">Jurisdiction State</th>
                            <th className="p-4">Positions</th>
                            <th className="p-4">Timeline Close</th>
                            <th className="p-4">Publish status</th>
                            <th className="p-4 text-center">Operation Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredJobs.map((j) => (
                            <tr key={j.id} className="border-b border-light/75 last:border-0 hover:bg-slate-55 hover:bg-orange-50/15">
                              <td className="p-4 font-bold text-slate-800 tracking-tight max-w-sm">
                                <span className="block">{j.title}</span>
                                <div className="flex gap-1.5 mt-1 select-none">
                                  {j.isHot && <span className="bg-red-100 text-red-700 font-extrabold text-[8px] px-1 py-0.5 rounded">HOT</span>}
                                  {j.isNew && <span className="bg-orange-100 text-[#FF6B00] font-extrabold text-[8px] px-1 py-0.5 rounded">NEW</span>}
                                </div>
                              </td>
                              <td className="p-4 text-slate-500 font-bold">{j.category}</td>
                              <td className="p-4 text-slate-500 font-bold">{j.state}</td>
                              <td className="p-4 text-[#003399] font-extrabold font-baloo">{j.vacancy}</td>
                              <td className="p-4 text-[#e8192c] font-bold font-baloo">{j.lastDate}</td>
                              <td className="p-4">
                                <span className={`text-[8.5px] uppercase font-black px-2 py-0.5 rounded-full border ${j.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}>
                                  {j.status}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => triggerEditJob(j)}
                                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg cursor-pointer"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteJob(j.id)}
                                    className="bg-rose-100 hover:bg-rose-200 text-rose-700 p-2 rounded-lg cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* SUB ROUTER VIEW: C) PUBLISH OR EDIT JOB FORM */}
            {adminPage === "add-job" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAdminPage("jobs")}
                    className="border border-slate-200 bg-white p-2.5 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 text-slate-600" />
                  </button>
                  <div>
                    <h2 className="text-xl font-extrabold font-baloo text-[#003399]">
                      {editJobId ? "✏ Edit Stat recruitment notice" : "➕ Publish New Government Job Alert"}
                    </h2>
                    <p className="text-xs text-slate-400 font-semibold">Inputs are updated in real-time onto public listings pages upon saving.</p>
                  </div>
                </div>

                {/* Master input card */}
                <form onSubmit={handleSaveJob} className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-md space-y-6">
                  
                  {/* Two columns grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left text-xs font-bold text-slate-600 font-sans">
                    
                    <div>
                      <label className="block mb-1.5 uppercase tracking-wide">Recruitment Job Title *</label>
                      <input
                        type="text"
                        placeholder="e.g., SSC CGL Online Form 2025"
                        required
                        value={jobForm.title}
                        onChange={(e) => setJobForm((p) => ({ ...p, title: e.target.value }))}
                        className="w-full bg-[#F8F9FF] border border-slate-200 p-3 rounded-xl outline-none font-semibold focus:border-[#FF6B00] transition text-slate-800 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block mb-1.5 uppercase tracking-wide">Employing Authority / Board *</label>
                      <input
                        type="text"
                        placeholder="e.g., Staff Selection Commission (SSC)"
                        required
                        value={jobForm.org}
                        onChange={(e) => setJobForm((p) => ({ ...p, org: e.target.value }))}
                        className="w-full bg-[#F8F9FF] border border-slate-200 p-3 rounded-xl outline-none font-semibold focus:border-[#FF6B00] transition text-slate-800 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block mb-1.5 uppercase tracking-wide">Assoc. Job Category *</label>
                      <select
                        value={jobForm.category}
                        onChange={(e) => setJobForm((p) => ({ ...p, category: e.target.value }))}
                        className="w-full bg-[#F8F9FF] border border-slate-200 p-3 rounded-xl outline-none font-semibold focus:border-[#FF6B00] transition text-slate-800 text-xs"
                      >
                        {JOB_CATS.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1.5 uppercase tracking-wide">Jurisdiction State *</label>
                      <select
                        value={jobForm.state}
                        onChange={(e) => setJobForm((p) => ({ ...p, state: e.target.value }))}
                        className="w-full bg-[#F8F9FF] border border-slate-200 p-3 rounded-xl outline-none font-semibold focus:border-[#FF6B00] transition text-slate-800 text-xs"
                      >
                        <option value="All India">All India (National Target)</option>
                        {STATE_CARDS.map((st) => (
                          <option key={st.name} value={st.name}>{st.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1.5 uppercase tracking-wide">Total Vacated Positions Count *</label>
                      <input
                        type="text"
                        placeholder="e.g., 17,727"
                        required
                        value={jobForm.vacancy}
                        onChange={(e) => setJobForm((p) => ({ ...p, vacancy: e.target.value }))}
                        className="w-full bg-[#F8F9FF] border border-slate-200 p-3 rounded-xl outline-none font-semibold focus:border-[#FF6B00] transition text-slate-800 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block mb-1.5 uppercase tracking-wide">Registration timeline Closing Date *</label>
                      <input
                        type="date"
                        required
                        value={jobForm.lastDate}
                        onChange={(e) => setJobForm((p) => ({ ...p, lastDate: e.target.value }))}
                        className="w-full bg-[#F8F9FF] border border-slate-200 p-3 rounded-xl outline-none font-semibold focus:border-[#FF6B00] transition text-slate-800 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block mb-1.5 uppercase tracking-wide">Minimum credentials Required *</label>
                      <select
                        value={jobForm.qual}
                        onChange={(e) => setJobForm((p) => ({ ...p, qual: e.target.value }))}
                        className="w-full bg-[#F8F9FF] border border-slate-200 p-3 rounded-xl outline-none font-semibold focus:border-[#FF6B00] transition text-slate-800 text-xs"
                      >
                        {QUALS.map((q) => (
                          <option key={q} value={q}>{q}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1.5 uppercase tracking-wide">Remuneration Pay Scale / Salaries</label>
                      <input
                        type="text"
                        placeholder="e.g., ₹25,500 – ₹1,51,100"
                        value={jobForm.salary}
                        onChange={(e) => setJobForm((p) => ({ ...p, salary: e.target.value }))}
                        className="w-full bg-[#F8F9FF] border border-slate-200 p-3 rounded-xl outline-none font-semibold focus:border-[#FF6B00] transition text-slate-800 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block mb-1.5 uppercase tracking-wide">General / OBC Fee</label>
                      <input
                        type="text"
                        placeholder="e.g., ₹100"
                        value={jobForm.fee}
                        onChange={(e) => setJobForm((p) => ({ ...p, fee: e.target.value }))}
                        className="w-full bg-[#F8F9FF] border border-slate-200 p-3 rounded-xl outline-none font-semibold focus:border-[#FF6B00] transition text-slate-800 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block mb-1.5 uppercase tracking-wide">SC / ST Fee</label>
                      <input
                        type="text"
                        placeholder="e.g., Free"
                        value={jobForm.feeSC}
                        onChange={(e) => setJobForm((p) => ({ ...p, feeSC: e.target.value }))}
                        className="w-full bg-[#F8F9FF] border border-slate-200 p-3 rounded-xl outline-none font-semibold focus:border-[#FF6B00] transition text-slate-800 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block mb-1.5 uppercase tracking-wide">Female Fee</label>
                      <input
                        type="text"
                        placeholder="e.g., Free"
                        value={jobForm.feeFemale}
                        onChange={(e) => setJobForm((p) => ({ ...p, feeFemale: e.target.value }))}
                        className="w-full bg-[#F8F9FF] border border-slate-200 p-3 rounded-xl outline-none font-semibold focus:border-[#FF6B00] transition text-slate-800 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block mb-1.5 uppercase tracking-wide">Recruitment Status</label>
                      <select
                        value={jobForm.status}
                        onChange={(e) => setJobForm((p) => ({ ...p, status: e.target.value as any }))}
                        className="w-full bg-[#F8F9FF] border border-slate-200 p-3 rounded-xl outline-none font-semibold focus:border-[#FF6B00] transition text-slate-800 text-xs"
                      >
                        <option value="active">Active (Currently Open)</option>
                        <option value="draft">Draft (Invisible)</option>
                        <option value="upcoming">Upcoming Alert</option>
                        <option value="expired">Expired timeline</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1.5 uppercase tracking-wide">Official Online Apply link</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={jobForm.applyLink}
                        onChange={(e) => setJobForm((p) => ({ ...p, applyLink: e.target.value }))}
                        className="w-full bg-[#F8F9FF] border border-slate-200 p-3 rounded-xl outline-none font-semibold focus:border-[#FF6B00] transition text-slate-800 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block mb-1.5 uppercase tracking-wide">Prospectus handbook PDF Announcement link</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={jobForm.notifLink}
                        onChange={(e) => setJobForm((p) => ({ ...p, notifLink: e.target.value }))}
                        className="w-full bg-[#F8F9FF] border border-slate-200 p-3 rounded-xl outline-none font-semibold focus:border-[#FF6B00] transition text-slate-800 text-xs"
                      />
                    </div>

                  </div>

                  {/* Desc area and AI Auto-generator button */}
                  <div className="text-left select-none text-xs font-bold text-slate-600 font-sans">
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="uppercase tracking-wide">Recruitment Statutory Handbook Description</label>
                      <button
                        type="button"
                        onClick={handleAiGenerate}
                        disabled={aiLoading}
                        className="bg-[#003399] hover:bg-blue-800 text-yellow-350 text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-all duration-155"
                      >
                        {aiLoading ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5 text-yellow-350" />
                        )}
                        <span>AI Document Generator</span>
                      </button>
                    </div>
                    <textarea
                      rows={6}
                      placeholder="Enter operational rules, credentials checkpoints, dates index here..."
                      value={jobForm.desc}
                      onChange={(e) => setJobForm((p) => ({ ...p, desc: e.target.value }))}
                      className="w-full bg-[#F8F9FF] border border-slate-200 p-4 rounded-xl outline-none font-semibold focus:border-[#FF6B00] transition text-slate-800 text-xs font-mono"
                    />
                  </div>

                  {/* Hot / New Toggle Toggles */}
                  <div className="flex flex-col sm:flex-row gap-6 p-4 bg-slate-50 border border-slate-150 rounded-xl max-w-xl text-left select-none">
                    
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={jobForm.isHot}
                        onChange={(e) => setJobForm((p) => ({ ...p, isHot: e.target.checked }))}
                        className="w-4 h-4 text-[#FF6B00] focus:ring-orange-450 border-slate-350 rounded mt-0.5"
                      />
                      <div>
                        <span className="block text-xs font-extrabold text-slate-800">Assign Premium High priority 🔥</span>
                        <span className="text-[10px] text-slate-400 font-semibold">Will highlights inside Hot Naukri sidebar</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={jobForm.isNew}
                        onChange={(e) => setJobForm((p) => ({ ...p, isNew: e.target.checked }))}
                        className="w-4 h-4 text-[#FF6B00] focus:ring-orange-450 border-slate-350 rounded mt-0.5"
                      />
                      <div>
                        <span className="block text-xs font-extrabold text-slate-800">Tag as New Launch ✨</span>
                        <span className="text-[10px] text-slate-400 font-semibold">Blinks animated indicators for 5 days</span>
                      </div>
                    </label>

                  </div>

                  {/* --- NEW PREMIUM MODULE: FAQ & SEO RANK 1 SYSTEM --- */}
                  <div className="border border-indigo-150 rounded-2xl bg-indigo-50/25 p-5 text-left space-y-6">
                    <div className="flex items-center gap-2 pb-3 border-b border-indigo-100">
                      <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
                      <div>
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Rank 1 SEO & Google Schema Engine</h3>
                        <p className="text-[10px] text-slate-500 font-semibold">Tweak meta fields, structured JSON-LD schemas, and FAQ accordion arrays to reach Google Top Search lists.</p>
                      </div>
                    </div>

                    {/* Meta Fields Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-slate-700 text-xs">
                      
                      {/* Meta Title */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <label className="font-extrabold text-slate-700 uppercase tracking-wider">SEO Meta Title *</label>
                          <span className={`text-[10px] font-mono font-bold ${
                            (jobForm.seo?.metaTitle?.length || 0) >= 50 && (jobForm.seo?.metaTitle?.length || 0) <= 60 
                            ? "text-emerald-600" : "text-slate-400"
                          }`}>
                            {jobForm.seo?.metaTitle?.length || 0} / 60 chars (Target: 50-60)
                          </span>
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. SSC CGL Recruitment 2026 - Apply Online for 15000+ Vacancies"
                          value={jobForm.seo?.metaTitle || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setJobForm(p => ({
                              ...p,
                              seo: { ...(p.seo || { metaTitle: "", metaDesc: "", focusKeywords: "", structuredDataSchema: "" }), metaTitle: val }
                            }));
                          }}
                          className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none font-semibold focus:border-indigo-500 transition text-slate-800 text-xs"
                        />
                      </div>

                      {/* Focus SEO Keywords */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide">Focus Keywords (comma-separated)</label>
                        <input
                          type="text"
                          placeholder="naukri alerts, sarkari results 2026, SSC apply online, government job"
                          value={jobForm.seo?.focusKeywords || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setJobForm(p => ({
                              ...p,
                              seo: { ...(p.seo || { metaTitle: "", metaDesc: "", focusKeywords: "", structuredDataSchema: "" }), focusKeywords: val }
                            }));
                          }}
                          className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none font-semibold focus:border-indigo-500 transition text-slate-800 text-xs"
                        />
                      </div>

                      {/* Meta Description */}
                      <div className="md:col-span-2 space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <label className="font-extrabold text-slate-700 uppercase tracking-wide">SEO Meta Description *</label>
                          <span className={`text-[10px] font-mono font-bold ${
                            (jobForm.seo?.metaDesc?.length || 0) >= 120 && (jobForm.seo?.metaDesc?.length || 0) <= 160 
                            ? "text-emerald-600" : "text-slate-400"
                          }`}>
                            {jobForm.seo?.metaDesc?.length || 0} / 160 chars (Target: 120-160)
                          </span>
                        </div>
                        <textarea
                          rows={2}
                          placeholder="e.g. Official Sarkari notification for SSC CGL 2026 is published. Over 15,000 vacant operations announced. Check complete qualifications, application steps, and timeline dates here."
                          value={jobForm.seo?.metaDesc || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setJobForm(p => ({
                              ...p,
                              seo: { ...(p.seo || { metaTitle: "", metaDesc: "", focusKeywords: "", structuredDataSchema: "" }), metaDesc: val }
                            }));
                          }}
                          className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none font-semibold focus:border-indigo-500 transition text-slate-800 text-xs"
                        />
                      </div>

                    </div>

                    {/* Dynamic Auto SEO Helper button & structured schema generator */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 border border-indigo-100 rounded-xl space-y-4 text-xs">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                        <div>
                          <span className="block text-xs font-black text-indigo-950 uppercase tracking-wider">⚡ Direct One-Click AI Optimizer</span>
                          <span className="text-[10px] text-slate-500 font-medium">Instantly analyze standard inputs to populate optimized meta titles, descriptions, focus keywords, and dynamic FAQ arrays.</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (!jobForm.title || !jobForm.org) {
                              addToast("⚠ Insert Job Title and Authority Board first to use AI optimizer!", "warn");
                              return;
                            }
                            const keywords = `${jobForm.title.toLowerCase().split(' ').slice(0, 4).join(' ')}, ${jobForm.org.toLowerCase()}, sarkari naukri, free job status, live alerts 2026`;
                            const optTitle = `${jobForm.title.split('(')[0].trim().slice(0, 40)} Recruitment 2026 - Apply Online at ${jobForm.org}`;
                            const optDesc = `Latest Alert: ${jobForm.org} announces dynamic recruitment for ${jobForm.title} (${jobForm.vacancy || "various"} vacancies). Check syllabus details, fee threshold, age limits and submit online before ${jobForm.lastDate || "closing date"}.`;
                            
                            // Auto compile valid schema
                            const ldSchema = JSON.stringify({
                              "@context": "https://schema.org",
                              "@type": "JobPosting",
                              "title": jobForm.title,
                              "description": jobForm.desc || optDesc,
                              "identifier": {
                                "@type": "PropertyValue",
                                "name": jobForm.org,
                                "value": `SARKARI-${Date.now()}`
                              },
                              "hiringOrganization": {
                                "@type": "Organization",
                                "name": jobForm.org,
                                "sameAs": jobForm.applyLink || "https://sarkarialerts.com"
                              },
                              "industry": "Government Recruitment",
                              "workHours": "Full-time",
                              "employmentType": "FULL_TIME",
                              "datePosted": new Date().toISOString().split('T')[0],
                              "validThrough": jobForm.lastDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                              "baseSalary": {
                                "@type": "MonetaryAmount",
                                "currency": "INR",
                                "value": {
                                  "@type": "QuantitativeValue",
                                  "value": jobForm.salary || "As per central matrix indices",
                                  "unitText": "MONTH"
                                }
                              }
                            }, null, 2);

                            const generatedFaqs = [
                              {
                                question: `What is the last date to register online for ${jobForm.title}?`,
                                answer: `The final timeline to submit applications online is ${jobForm.lastDate || "as indicated in the core prospectus advertisement handbook"}.`
                              },
                              {
                                question: `How many vacancies are announced for ${jobForm.org} recruitment?`,
                                answer: `There are currently ${jobForm.vacancy || "specified operational role"} vacancies listed in the official announcement PDF.`
                              },
                              {
                                question: `What qualifications are required to apply for ${jobForm.title}?`,
                                answer: `Candidates must possess ${jobForm.qual || "necessary credentials required by the specific statutory authority code"} to register.`
                              }
                            ];

                            setJobForm(p => ({
                              ...p,
                              seo: {
                                metaTitle: optTitle.slice(0, 60),
                                metaDesc: optDesc.slice(0, 160),
                                focusKeywords: keywords,
                                structuredDataSchema: ldSchema
                              },
                              faq: generatedFaqs
                            }));

                            addToast("🚀 Live Google rank inputs generated correctly!", "success");
                          }}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-xl shadow-md cursor-pointer transition-all shrink-0"
                        >
                          Generate SEO & FAQ Schema
                        </button>
                      </div>

                      {/* Structured Schema display */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-extrabold text-[#581c87] uppercase tracking-wide text-left">Structured Google Rich JSON-LD Snippet (Automated Schema)</label>
                        <textarea
                          rows={4}
                          placeholder="{ ...JSON-LD Object... }"
                          value={jobForm.seo?.structuredDataSchema || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setJobForm(p => ({
                              ...p,
                              seo: { ...(p.seo || { metaTitle: "", metaDesc: "", focusKeywords: "", structuredDataSchema: "" }), structuredDataSchema: val }
                            }));
                          }}
                          className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none text-lime-400 text-[10px] font-mono leading-relaxed focus:border-purple-500 transition-all text-left"
                        />
                      </div>
                    </div>

                    {/* FAQ Builder Panel */}
                    <div className="space-y-4 text-xs">
                      <div className="flex justify-between items-center pb-2 border-b border-indigo-100">
                        <div>
                          <span className="block text-xs font-black text-slate-800 uppercase tracking-wide">📑 Dynamic FAQ Accorder List ({jobForm.faq?.length || 0})</span>
                          <span className="text-[10px] text-slate-400 font-semibold">Generates Google Rich Snippet FAQ Accordions directly on the Job display page.</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const currentFaqs = jobForm.faq || [];
                            setJobForm(p => ({
                              ...p,
                              faq: [...currentFaqs, { question: "", answer: "" }]
                            }));
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl shadow-sm cursor-pointer transition"
                        >
                          + Add New Query
                        </button>
                      </div>

                      {(!jobForm.faq || jobForm.faq.length === 0) ? (
                        <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-[11px] text-slate-400 font-medium">
                          No FAQs specified yet. Use the Generative tool or click "+ Add New Query" above to start.
                        </div>
                      ) : (
                        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                          {jobForm.faq.map((item, index) => (
                            <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5 relative">
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedFaqs = (jobForm.faq || []).filter((_, i) => i !== index);
                                  setJobForm(p => ({ ...p, faq: updatedFaqs }));
                                }}
                                className="absolute top-2 right-2 text-rose-500 hover:bg-rose-50 p-1 rounded-lg transition"
                                title="Remove FAQ"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Question #{index + 1}</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Can final year candidates register status?"
                                  value={item.question}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const updated = [...(jobForm.faq || [])];
                                    updated[index] = { ...updated[index], question: val };
                                    setJobForm(p => ({ ...p, faq: updated }));
                                  }}
                                  className="w-full bg-white border border-slate-200 p-2.5 rounded-lg outline-none font-semibold focus:border-indigo-500 text-slate-800 text-xs"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Answer #{index + 1}</label>
                                <textarea
                                  rows={1.5}
                                  placeholder="e.g. Yes, final year students are eligible provided they declare actual credentials status on document validation days."
                                  value={item.answer}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const updated = [...(jobForm.faq || [])];
                                    updated[index] = { ...updated[index], answer: val };
                                    setJobForm(p => ({ ...p, faq: updated }));
                                  }}
                                  className="w-full bg-white border border-slate-200 p-2.5 rounded-lg outline-none font-semibold focus:border-indigo-500 text-slate-800 text-xs"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Submission triggers */}
                  <div className="border-t border-light pt-5 flex justify-end gap-3.5 select-none">
                    <button
                      type="button"
                      onClick={() => setAdminPage("jobs")}
                      className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-extrabold py-2.5 px-6 rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#FF6B00] hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider py-2.5 px-7 rounded-xl shadow-md cursor-pointer"
                    >
                      {editJobId ? "Save Configured Job" : "Publish Job Alert"}
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* SUB ROUTER VIEW: D) RESULTS DIRECTORY */}
            {adminPage === "results" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-extrabold font-baloo text-[#003399]">
                      📋 Government Examinations results Directory
                    </h2>
                    <p className="text-xs text-slate-400 font-semibold">Manage, upload and declare candidate scores and intermediate selection indices.</p>
                  </div>
                  <button
                    onClick={triggerAddResult}
                    className="bg-[#FF6B00] hover:bg-orange-600 text-white text-xs px-4 py-2.5 rounded-xl font-bold uppercase tracking-wide cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-4.5 h-4.5" /> Publish Results Sheet
                  </button>
                </div>

                {/* Table representation */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md">
                  <table className="w-full text-left text-xs font-sans font-semibold">
                    <thead className="bg-[#003399] text-white uppercase tracking-wider text-[9px]">
                      <tr>
                        <th className="p-4">Results Title</th>
                        <th className="p-4">Authority Examination</th>
                        <th className="p-4">Declaration Date</th>
                        <th className="p-4">Publish status</th>
                        <th className="p-4 text-center">Operation Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((res) => (
                        <tr key={res.id} className="border-b border-light/75 last:border-0 hover:bg-orange-50/15">
                          <td className="p-4 font-bold text-slate-800">{res.title}</td>
                          <td className="p-4 text-slate-500 font-bold">{res.exam}</td>
                          <td className="p-4 text-[#003399] font-bold font-baloo">{res.date}</td>
                          <td className="p-4">
                            <span className={`text-[8px] uppercase font-black px-2 py-0.5 rounded-full border ${res.status === "published" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-500 border-slate-200"}`}>
                              {res.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => triggerEditResult(res)}
                                className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteResult(res.id)}
                                className="bg-rose-100 hover:bg-rose-200 text-rose-700 p-2 rounded-lg cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* SUB ROUTER VIEW: E) ADMIT DIRECTORY */}
            {adminPage === "admitcards" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-extrabold font-baloo text-[#003399]">
                      🪪 Exam Gate Passes & Admit Cards Directory
                    </h2>
                    <p className="text-xs text-slate-400 font-semibold">Post official links to fetch hall tickets, regional centers charts and schedules.</p>
                  </div>
                  <button
                    onClick={triggerAddAdmit}
                    className="bg-[#FF6B00] hover:bg-orange-600 text-white text-xs px-4 py-2.5 rounded-xl font-bold uppercase tracking-wide cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-4.5 h-4.5" /> Publish Admit Link
                  </button>
                </div>

                {/* Table representation */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md">
                  <table className="w-full text-left text-xs font-sans font-semibold">
                    <thead className="bg-[#003399] text-white uppercase tracking-wider text-[9px]">
                      <tr>
                        <th className="p-4">Document Title</th>
                        <th className="p-4">Associated Exam</th>
                        <th className="p-4">Exam Scheduled Date</th>
                        <th className="p-4">Publish status</th>
                        <th className="p-4 text-center">Operation Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {admits.map((adm) => (
                        <tr key={adm.id} className="border-b border-light/75 last:border-0 hover:bg-orange-50/15">
                          <td className="p-4 font-bold text-slate-800">{adm.title}</td>
                          <td className="p-4 text-slate-500 font-bold">{adm.exam}</td>
                          <td className="p-4 text-[#003399] font-bold font-baloo">{adm.examDate}</td>
                          <td className="p-4">
                            <span className={`text-[8px] uppercase font-black px-2 py-0.5 rounded-full border ${adm.status === "published" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-500 border-slate-200"}`}>
                              {adm.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => triggerEditAdmit(adm)}
                                className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteAdmit(adm.id)}
                                className="bg-rose-100 hover:bg-rose-200 text-rose-700 p-2 rounded-lg cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* SUB ROUTER VIEW: F) SCROLLING TICKER MARQUEE */}
            {adminPage === "ticker" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold font-baloo text-[#003399]">
                    📡 Portal Scrolling Marquee Broadcasts
                  </h2>
                  <p className="text-xs text-slate-400 font-semibold">This alert ticker flashes at the top of the public website under live banners.</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-6 text-left select-none text-xs font-bold text-slate-600">
                  
                  {/* Live preview */}
                  <div className="space-y-1.5">
                    <label>Live Banner Preview Stream</label>
                    <div className="bg-[#0a0f2e] text-yellow-350 p-3 rounded-xl overflow-hidden shadow-inner h-11 flex items-center">
                      <marquee scrollamount="5" className="text-xs tracking-wide uppercase font-semibold">
                        {tickerEdit}
                      </marquee>
                    </div>
                  </div>

                  {/* Textarea */}
                  <div className="space-y-1.5">
                    <label>Broadcast Notice Text stream</label>
                    <textarea
                      rows={4}
                      value={tickerEdit}
                      onChange={(e) => setTickerEdit(e.target.value)}
                      className="w-full bg-[#F8F9FF] border border-slate-200 p-4 rounded-xl outline-none font-semibold focus:border-[#FF6B00] text-slate-800 text-xs tracking-wide uppercase"
                    />
                    <span className="text-[10px] text-slate-400 font-semibold block leading-normal mt-1">
                      💡 Tip: Use a pipe operator | to beautifully separate distinct recruiting news bulletins.
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveTicker}
                      className="bg-[#FF6B00] hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider py-2.5 px-6 rounded-xl shadow-md cursor-pointer"
                    >
                      Save & Broadcast Live
                    </button>
                    <button
                      onClick={handleResetTicker}
                      className="border border-[#e8192c] bg-white text-[#e8192c] hover:bg-rose-50 text-xs font-bold py-2.5 px-6 rounded-xl cursor-pointer"
                    >
                      Reset Default
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* SUB ROUTER VIEW: G) CONFIGURATION CONTROLS SETTINGS */}
            {adminPage === "settings" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold font-baloo text-[#003399]">
                    ⚙ Portal Configurations & Adsense Codes
                  </h2>
                  <p className="text-xs text-slate-400 font-semibold">Tweak identity labels and secure advertisement parameters across columns.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left select-none text-xs font-bold text-slate-600">
                  
                  {/* Branding */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-4">
                    <h3 className="font-baloo text-[#003399] font-black text-sm uppercase tracking-wider border-b border-light pb-2">
                      Portal Identity Mappings
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-1">Public Site Title</label>
                        <input
                          type="text"
                          value={settingsForm.siteName}
                          onChange={(e) => setSettingsForm((p) => ({ ...p, siteName: e.target.value }))}
                          className="w-full bg-[#F8F9FF] border border-slate-200 p-3 rounded-xl outline-none font-semibold text-slate-800 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block mb-1">Branding Slogan Tagline</label>
                        <input
                          type="text"
                          value={settingsForm.tagline}
                          onChange={(e) => setSettingsForm((p) => ({ ...p, tagline: e.target.value }))}
                          className="w-full bg-[#F8F9FF] border border-slate-200 p-3 rounded-xl outline-none font-semibold text-slate-800 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block mb-1">Admin Query Mail List</label>
                        <input
                          type="email"
                          value={settingsForm.email}
                          onChange={(e) => setSettingsForm((p) => ({ ...p, email: e.target.value }))}
                          className="w-full bg-[#F8F9FF] border border-slate-200 p-3 rounded-xl outline-none font-semibold text-slate-800 text-xs"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSaveSettings}
                      className="bg-[#003399] hover:bg-blue-800 text-white text-xs font-black uppercase tracking-wider py-2.5 px-6 rounded-xl transition cursor-pointer mt-2"
                    >
                      Save Configurations
                    </button>

                  </div>

                  {/* Adsense codes */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-4">
                    <h3 className="font-baloo text-amber-600 font-black text-sm uppercase tracking-wider border-b border-light pb-2">
                      Google AdSense Unit Mappings
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-1">Google Publisher Account ID (ca-pub-X)</label>
                        <input
                          type="text"
                          value={settingsForm.pubId}
                          onChange={(e) => setSettingsForm((p) => ({ ...p, pubId: e.target.value }))}
                          className="w-full bg-[#F8F9FF] border border-slate-200 p-3 rounded-xl outline-none font-semibold text-slate-800 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block mb-1">Header Unit Slot ID Code</label>
                        <input
                          type="text"
                          value={settingsForm.headerSlot}
                          onChange={(e) => setSettingsForm((p) => ({ ...p, headerSlot: e.target.value }))}
                          className="w-full bg-[#F8F9FF] border border-slate-200 p-3 rounded-xl outline-none font-semibold text-slate-800 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block mb-1">Right sidebar unit Slot ID Code</label>
                        <input
                          type="text"
                          value={settingsForm.sidebarSlot}
                          onChange={(e) => setSettingsForm((p) => ({ ...p, sidebarSlot: e.target.value }))}
                          className="w-full bg-[#F8F9FF] border border-slate-200 p-3 rounded-xl outline-none font-semibold text-slate-800 text-xs"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSaveSettings}
                      className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-black uppercase tracking-wider py-2.5 px-6 rounded-xl transition cursor-pointer mt-2"
                    >
                      Save Ad Units Settings
                    </button>

                  </div>

                </div>
              </div>
            )}

            {/* SUB ROUTER VIEW: H) PUSH BROADCAST CONTROL CENTER */}
            {adminPage === "push" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold font-baloo text-[#003399]">
                    📢 Web Push Broadcast Control Center
                  </h2>
                  <p className="text-xs text-slate-401 font-semibold">Author and transmit real-time push alerts with instant Web Audio chime delivery.</p>
                </div>

                {/* Grid Panels */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-none text-left">
                  
                  {/* Left Col: Composer form (takes 2 cols) */}
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-5">
                    <div className="border-b border-light pb-2 flex items-center justify-between">
                      <h3 className="font-baloo text-[#003399] font-black text-sm uppercase tracking-wider">
                        Compose Push Broadcast Notification
                      </h3>
                      <span className="text-[9px] bg-sky-50 text-[#003399] border border-sky-100 uppercase font-bold px-2 py-0.5 rounded animate-pulse">
                        LIVE TRANSCEIVER IN SERVICE
                      </span>
                    </div>

                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (!pushForm.title.trim() || !pushForm.body.trim()) {
                        addToast("⚠ Please provide both a Title and Message for the broadcast!", "warn");
                        return;
                      }
                      
                      // Active trigger!
                      sendPushAlertToClient(pushForm.title, pushForm.body, pushForm.category, pushForm.url);
                      addToast("📢 Web Push notification successfully broadcasted to active subscribers!", "success");
                      
                      // Reset composer
                      setPushForm({
                        title: "",
                        body: "",
                        category: "Central Jobs",
                        url: ""
                      });
                    }} className="space-y-4 text-xs font-bold text-slate-600">
                      
                      {/* Title & Category Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block mb-1 text-slate-500 uppercase tracking-widest text-[9px]">Broadcast Category</label>
                          <select
                            value={pushForm.category}
                            onChange={(e) => setPushForm(p => ({ ...p, category: e.target.value }))}
                            className="w-full bg-[#F8F9FF] border-2 border-slate-200 hover:border-[#003399] p-3 rounded-xl outline-none text-xs font-bold font-sans cursor-pointer text-slate-700"
                          >
                            <option value="Central Jobs">Central Jobs</option>
                            <option value="State Jobs">State Jobs</option>
                            <option value="Admit Cards">Admit Cards</option>
                            <option value="Exam Results">Exam Results</option>
                          </select>
                        </div>

                        <div>
                          <label className="block mb-1 text-slate-500 uppercase tracking-widest text-[9px]">Target Redirect URL (Optional)</label>
                          <input
                            type="text"
                            placeholder="e.g., # or /jobs/12"
                            value={pushForm.url}
                            onChange={(e) => setPushForm(p => ({ ...p, url: e.target.value }))}
                            className="w-full bg-[#F8F9FF] border-2 border-slate-200 focus:border-[#003399] p-3 rounded-xl outline-none font-bold text-slate-800 text-xs font-sans"
                          />
                        </div>
                      </div>

                      {/* Title banner */}
                      <div>
                        <label className="block mb-1 text-slate-500 uppercase tracking-widest text-[9px]">Notification Headline / Title *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., UPSC Civil Services Prelims Exam Result Declared!"
                          value={pushForm.title}
                          onChange={(e) => setPushForm(p => ({ ...p, title: e.target.value }))}
                          className="w-full bg-[#F8F9FF] border-2 border-slate-200 focus:border-[#003399] p-3 rounded-xl outline-none font-bold text-slate-800 text-xs font-sans"
                        />
                      </div>

                      {/* Body Message */}
                      <div>
                        <label className="block mb-1 text-slate-500 uppercase tracking-widest text-[9px]">Detailed Message / description *</label>
                        <textarea
                          required
                          rows={4}
                          placeholder="e.g., Central Commission has declared the qualified roll numbers list for upcoming mains stages. Download details immediately."
                          value={pushForm.body}
                          onChange={(e) => setPushForm(p => ({ ...p, body: e.target.value }))}
                          className="w-full bg-[#F8F9FF] border-2 border-slate-200 focus:border-[#003399] p-3 rounded-xl outline-none font-bold text-slate-850 text-xs font-sans"
                        />
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          className="w-full sm:w-auto bg-[#003399] hover:bg-blue-800 border border-[#002f9c] text-white text-xs font-black uppercase tracking-wider py-3.5 px-8 rounded-xl transition cursor-pointer select-none active:scale-95 flex items-center justify-center gap-2 shadow-md hover:shadow-blue-900/40"
                        >
                          <span>📢 Transmit Push Alert Live</span>
                        </button>
                      </div>

                    </form>
                  </div>

                  {/* Right Col: Live Sandbox Stats (takes 1 col) */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-4">
                      <h3 className="font-baloo text-[#003399] font-black text-xs uppercase tracking-wider border-b border-light pb-2">
                        Receiver telemetry
                      </h3>

                      <div className="space-y-3 font-sans w-full">
                        <div className="bg-[#10b981]/5 border border-[#10b981]/15 rounded-xl p-3 flex justify-between items-center text-xs w-full">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 block uppercase">Push Status</span>
                            <span className="font-extrabold text-[#10b981]">SYSTEM ACTIVE 🟢</span>
                          </div>
                          <span className="w-2.5 h-2.5 bg-[#10b981] rounded-full animate-ping"></span>
                        </div>

                        <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 text-xs w-full">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">Subscribed Channels</span>
                          <span className="font-extrabold text-[#003399] text-[11px] mt-1 block">
                            Central, State, Admits, Results
                          </span>
                        </div>

                        <div className="border border-slate-150 rounded-xl p-3 text-xs flex justify-between items-center w-full">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 block uppercase">Client Devices Registered</span>
                            <span className="font-mono font-extrabold text-slate-800 text-[13px] mt-0.5 block">
                              1 Sandbox Instance
                            </span>
                          </div>
                        </div>

                        <div className="border border-slate-150 rounded-xl p-3 text-xs flex justify-between items-center bg-yellow-50/15 w-full">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 block uppercase">Approx. Total Subscribers</span>
                            <span className="font-mono font-extrabold text-amber-600 text-[13px] mt-0.5 block">
                              4,920 Tokens (Simulated)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-inner border border-slate-950 text-left font-mono text-[10px] leading-relaxed relative overflow-hidden h-40 w-full animate-pulse">
                      <div className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                      <span className="text-amber-400 font-bold uppercase tracking-widest text-[8px] block border-b border-white/10 pb-1 mb-2">📡 Receiver Console Stream</span>
                      <div className="space-y-1 text-slate-300 max-h-24 overflow-y-auto">
                        <p className="text-emerald-400 font-semibold">[04:04:10] Push server boot OK</p>
                        <p className="text-sky-300">[04:12:44] Awaiting candidate subscriber permission request...</p>
                        {pushAlerts.length > 0 && <p className="text-[#FF6B00]">[04:13:02] Client connection handshake granted</p>}
                        {pushAlerts.map((arg) => (
                          <p key={arg.id} className="text-slate-300 truncate font-mono">
                            &gt; Dispatched: {arg.title}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Broadcast logs history */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md text-left select-none shadow-md">
                  <div className="border-b border-light pb-2.5 flex items-center justify-between col-span-1">
                    <div>
                      <h3 className="font-baloo text-[#003399] font-black text-sm uppercase tracking-wider">
                        Broadcast Queue Logs
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">Logs of notifications received inside candidate device inbox folders</p>
                    </div>
                    {pushAlerts.length > 0 && (
                      <button 
                        onClick={() => {
                          setPushAlerts([]);
                          addToast("Cleared entire broadcast history logs!", "success");
                        }}
                        className="text-xs font-black text-[#ff0000] uppercase hover:underline cursor-pointer"
                      >
                        Clear All Logs &times;
                      </button>
                    )}
                  </div>

                  {pushAlerts.length === 0 ? (
                    <div className="py-12 text-center text-slate-400">
                      <p className="text-sm font-black font-sans">No alerts sent yet inside this workspace session</p>
                      <p className="text-xs text-slate-450 mt-1 uppercase font-semibold">Ready to route live broadcasts above</p>
                    </div>
                  ) : (
                    <div className="mt-4 border border-slate-150 rounded-xl overflow-hidden divide-y divide-dashed divide-slate-200">
                      {pushAlerts.map((alert) => (
                        <div key={alert.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="bg-[#003399]/10 text-[#003399] font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border border-[#003399]/10">
                                {alert.category}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono font-bold">
                                {new Date(alert.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <h4 className="font-extrabold text-sm text-slate-800">{alert.title}</h4>
                            <p className="text-xs text-slate-500 font-semibold leading-relaxed">{alert.body}</p>
                          </div>
                          <div className="flex items-center gap-2 self-end md:self-center">
                            <button
                              onClick={() => {
                                sendPushAlertToClient(alert.title, alert.body, alert.category, alert.url);
                                addToast("📢 Dispatched identical push broadcast chimes!", "success");
                              }}
                              className="text-[10px] font-black uppercase text-sky-800 bg-sky-50 border border-sky-100 px-3 py-1.5 rounded-lg hover:bg-sky-100 transition duration-150 cursor-pointer"
                            >
                              Re-broadcast
                            </button>
                            <button
                              onClick={() => {
                                setPushAlerts(prev => prev.filter(p => p.id !== alert.id));
                                addToast("Alert trace removed from subscriber lists", "success");
                              }}
                              className="text-[10px] font-black uppercase text-rose-700 bg-rose-55 border border-rose-100 px-3 py-1.5 rounded-lg hover:bg-rose-150 transition duration-150 cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* RENDER MODAL: DETACHED OVERLAY FORM FOR RESULTS */}
      {resultModalOpen && (
        <div className="fixed inset-0 z-[300] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md shadow-2xl animate-fade-up overflow-hidden text-slate-800 font-sans">
            <div className="bg-[#003399] text-white p-4 font-baloo flex justify-between items-center select-none">
              <h3 className="font-extrabold text-sm uppercase tracking-wide">
                {editResultId ? "✏ Edit Stat Result Record" : "➕ Publishes Exam Result Record"}
              </h3>
              <button onClick={() => setResultModalOpen(false)} className="text-white hover:opacity-85 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveResult} className="p-5 space-y-4 text-left select-none text-xs font-bold text-slate-600">
              
              <div>
                <label className="block mb-1">Stat Result Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., SSC CHSL Level XII Scoring Result"
                  value={resultForm.title}
                  onChange={(e) => setResultForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full bg-[#F8F9FF] border border-slate-200 p-2.5 rounded-xl outline-none text-slate-800"
                />
              </div>

              <div>
                <label className="block mb-1">Exam board Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Stafford Commission CGL"
                  value={resultForm.exam}
                  onChange={(e) => setResultForm((p) => ({ ...p, exam: e.target.value }))}
                  className="w-full bg-[#F8F9FF] border border-slate-200 p-2.5 rounded-xl outline-none text-slate-800"
                />
              </div>

              <div>
                <label className="block mb-1">Stat Declaration date</label>
                <input
                  type="date"
                  value={resultForm.date}
                  onChange={(e) => setResultForm((p) => ({ ...p, date: e.target.value }))}
                  className="w-full bg-[#F8F9FF] border border-slate-200 p-2.5 rounded-xl outline-none text-slate-800"
                />
              </div>

              <div>
                <label className="block mb-1">Official Result PDF / Portal link *</label>
                <input
                  type="url"
                  required
                  value={resultForm.link}
                  onChange={(e) => setResultForm((p) => ({ ...p, link: e.target.value }))}
                  className="w-full bg-[#F8F9FF] border border-slate-200 p-2.5 rounded-xl outline-none text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block mb-1">State Jurisdiction / Scope *</label>
                <select
                  value={resultForm.state}
                  onChange={(e) => setResultForm((p) => ({ ...p, state: e.target.value }))}
                  className="w-full bg-[#F8F9FF] border border-slate-200 p-2.5 rounded-xl outline-none text-slate-800"
                >
                  <option value="All India">All India (Central Government)</option>
                  {STATE_CARDS.map((st) => (
                    <option key={st.name} value={st.name}>{st.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1">Record Status</label>
                <select
                  value={resultForm.status}
                  onChange={(e) => setResultForm((p) => ({ ...p, status: e.target.value as any }))}
                  className="w-full bg-[#F8F9FF] border border-slate-200 p-2.5 rounded-xl outline-none text-slate-800"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft (Invisible)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3.5 pt-3.5 border-t border-light">
                <button
                  type="button"
                  onClick={() => setResultModalOpen(false)}
                  className="border border-slate-200 py-2 px-5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#FF6B00] hover:bg-orange-600 text-white py-2 px-5 rounded-xl shadow-md cursor-pointer"
                >
                  Save Result
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* RENDER MODAL: DETACHED OVERLAY FORM FOR ADMIT CARDS */}
      {admitModalOpen && (
        <div className="fixed inset-0 z-[300] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md shadow-2xl animate-fade-up overflow-hidden text-slate-800 font-sans">
            <div className="bg-[#003399] text-white p-4 font-baloo flex justify-between items-center select-none">
              <h3 className="font-extrabold text-sm uppercase tracking-wide">
                {editAdmitId ? "✏ Edit Hall Ticket Record" : "➕ Publishes Exam Admit card Link"}
              </h3>
              <button onClick={() => setAdmitModalOpen(false)} className="text-white hover:opacity-85 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveAdmit} className="p-5 space-y-4 text-left select-none text-xs font-bold text-slate-600">
              
              <div>
                <label className="block mb-1">Seat Pass Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., RRB ALP Stage-1 Admit cards"
                  value={admitForm.title}
                  onChange={(e) => setAdmitForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full bg-[#F8F9FF] border border-slate-200 p-2.5 rounded-xl outline-none text-slate-800"
                />
              </div>

              <div>
                <label className="block mb-1">Associated Examination board *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., RRB Railways recruit Board"
                  value={admitForm.exam}
                  onChange={(e) => setAdmitForm((p) => ({ ...p, exam: e.target.value }))}
                  className="w-full bg-[#F8F9FF] border border-slate-200 p-2.5 rounded-xl outline-none text-slate-800"
                />
              </div>

              <div>
                <label className="block mb-1">Exam Scheduled Date *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., June 22, 2025"
                  value={admitForm.examDate}
                  onChange={(e) => setAdmitForm((p) => ({ ...p, examDate: e.target.value }))}
                  className="w-full bg-[#F8F9FF] border border-slate-200 p-2.5 rounded-xl outline-none text-slate-800"
                />
              </div>

              <div>
                <label className="block mb-1">Download Server Portal link *</label>
                <input
                  type="url"
                  required
                  value={admitForm.link}
                  onChange={(e) => setAdmitForm((p) => ({ ...p, link: e.target.value }))}
                  className="w-full bg-[#F8F9FF] border border-slate-200 p-2.5 rounded-xl outline-none text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block mb-1">State Jurisdiction / Scope *</label>
                <select
                  value={admitForm.state}
                  onChange={(e) => setAdmitForm((p) => ({ ...p, state: e.target.value }))}
                  className="w-full bg-[#F8F9FF] border border-slate-200 p-2.5 rounded-xl outline-none text-slate-800"
                >
                  <option value="All India">All India (Central Government)</option>
                  {STATE_CARDS.map((st) => (
                    <option key={st.name} value={st.name}>{st.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1">Record Status</label>
                <select
                  value={admitForm.status}
                  onChange={(e) => setAdmitForm((p) => ({ ...p, status: e.target.value as any }))}
                  className="w-full bg-[#F8F9FF] border border-slate-200 p-2.5 rounded-xl outline-none text-slate-800"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft (Invisible)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3.5 pt-3.5 border-t border-light">
                <button
                  type="button"
                  onClick={() => setAdmitModalOpen(false)}
                  className="border border-slate-200 py-2 px-5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#FF6B00] hover:bg-orange-600 text-white py-2 px-5 rounded-xl shadow-md cursor-pointer"
                >
                  Save Entry
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// Reusable standard modal, close triggers, edit rows etc.
interface X {}
