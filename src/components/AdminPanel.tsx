import React, { useState } from "react";
import { 
  Briefcase, Plus, Edit3, Trash2, Globe, Users, TrendingUp, DollarSign, 
  BarChart2, FileText, Bookmark, Database, Check, Sparkles, Send, Share2, 
  Settings, Radio, Layers, Image, ShieldCheck, HelpCircle, Code, Copy, 
  Upload, Search, ArrowLeft, ArrowRight, Eye, RefreshCw, Smartphone, Monitor
} from "lucide-react";
import { JobRow, StateItem } from "../types";

interface AdminPanelProps {
  jobs: JobRow[];
  setJobs: React.Dispatch<React.SetStateAction<JobRow[]>>;
  results: Array<{ title: string; tag?: "NEW" | "HOT" }>;
  setResults: React.Dispatch<React.SetStateAction<Array<{ title: string; tag?: "NEW" | "HOT" }>>>;
  admitCards: Array<{ title: string; tag?: "NEW" | "HOT" }>;
  setAdmitCards: React.Dispatch<React.SetStateAction<Array<{ title: string; tag?: "NEW" | "HOT" }>>>;
  states: StateItem[];
  setStates: React.Dispatch<React.SetStateAction<StateItem[]>>;
  onClose: () => void;
  onSignOut?: () => void;
  // Monetization States
  adSenseEnabled: boolean;
  setAdSenseEnabled: (val: boolean) => void;
  adSenseCode: string;
  setAdSenseCode: (val: string) => void;
  stickyAdText: string;
  setStickyAdText: (val: string) => void;
}

export default function AdminPanel({
  jobs,
  setJobs,
  results,
  setResults,
  admitCards,
  setAdmitCards,
  states,
  setStates,
  onClose,
  onSignOut,
  adSenseEnabled,
  setAdSenseEnabled,
  adSenseCode,
  setAdSenseCode,
  stickyAdText,
  setStickyAdText
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "jobs" | "states" | "content" | "tools" | "users" | "monetization">("dashboard");
  
  // Jobs Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Job Form State
  const [showJobForm, setShowJobForm] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingJobId, setEditingJobId] = useState("");
  
  // Form input fields
  const [formTitle, setFormTitle] = useState("");
  const [formOrg, setFormOrg] = useState("");
  const [formAdvNo, setFormAdvNo] = useState("");
  const [formPostDate, setFormPostDate] = useState("2026-05-29");
  const [formLastDate, setFormLastDate] = useState("2026-06-30");
  const [formVacancy, setFormVacancy] = useState("");
  const [formQual, setFormQual] = useState("Graduate");
  const [formAgeLimit, setFormAgeLimit] = useState("");
  const [formFeeGen, setFormFeeGen] = useState("");
  const [formFeeOBC, setFormFeeOBC] = useState("");
  const [formFeeSCST, setFormFeeSCST] = useState("Rs. 0/- (Exempted)");
  const [formFeeFemale, setFormFeeFemale] = useState("Rs. 0/- (Exempted)");
  const [formSelection, setFormSelection] = useState("Written Examination & Merit List");
  const [formSalary, setFormSalary] = useState("");
  const [formLocation, setFormLocation] = useState("All India");
  const [formApplyMode, setFormApplyMode] = useState("Online Mode");
  const [formOfficialWeb, setFormOfficialWeb] = useState("https://gov.in");
  const [formApplyLink, setFormApplyLink] = useState("https://gov.in/apply");
  const [formRequirements, setFormRequirements] = useState("");
  const [formType, setFormType] = useState("Central Government Jobs");
  const [formTag, setFormTag] = useState<"" | "HOT" | "NEW">("");

  // AI Generator tools
  const [aiJobTitle, setAiJobTitle] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);

  // XML sitemap generator
  const [sitemapGenerated, setSitemapGenerated] = useState("");
  const [sitemapLoading, setSitemapLoading] = useState(false);

  // Push notifications
  const [pushTitle, setPushTitle] = useState("");
  const [pushBody, setPushBody] = useState("");
  const [pushSuccess, setPushSuccess] = useState(false);

  // CSV/PDF simulation
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [bulkImportCount, setBulkImportCount] = useState<number | null>(null);

  // Social Auto-Poster
  const [telegramFormat, setTelegramFormat] = useState("");
  const [whatsappFormat, setWhatsappFormat] = useState("");

  // Manage Content sub-states
  const [newResultTitle, setNewResultTitle] = useState("");
  const [newResultTag, setNewResultTag] = useState<"NEW" | "HOT" | "">("");
  const [newAdmitTitle, setNewAdmitTitle] = useState("");
  const [newAdmitTag, setNewAdmitTag] = useState<"NEW" | "HOT" | "">("");

  // Users Configuration
  const [teamMembers, setTeamMembers] = useState([
    { id: "1", name: "Prakash Mal", email: "prokashmal799@gmail.com", role: "Super Admin", statePermission: "All India" },
    { id: "2", name: "Anand Sharma", email: "anand.sarkari@gmail.com", role: "Editor", statePermission: "Uttar Pradesh" },
    { id: "3", name: "Rajesh Kumar", email: "rajesh.bseb@gmail.com", role: "Content Writer", statePermission: "Bihar" },
    { id: "4", name: "Sunita Sen", email: "sunita.wb@gmail.com", role: "State Manager", statePermission: "West Bengal" },
  ]);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("Editor");
  const [newMemberState, setNewMemberState] = useState("All India");

  // State Management quota modifier
  const [editingStateCode, setEditingStateCode] = useState<string | null>(null);
  const [stateQuotaCount, setStateQuotaCount] = useState<number>(0);

  // Reset form helper
  const resetForm = () => {
    setFormTitle("");
    setFormOrg("");
    setFormAdvNo("Advt No: " + Math.floor(Math.random() * 90) + "/" + new Date().getFullYear());
    setFormPostDate("2026-05-29");
    setFormLastDate("2026-06-30");
    setFormVacancy("1,200");
    setFormQual("Graduate");
    setFormAgeLimit("18 to 27 Years. Age relaxation applicable as per rules.");
    setFormFeeGen("Rs. 100/-");
    setFormFeeOBC("Rs. 100/-");
    setFormFeeSCST("Rs. 0/- (Exempted)");
    setFormFeeFemale("Rs. 0/- (Exempted)");
    setFormSelection("Computer Based Test (CBT) & Document Verification");
    setFormSalary("Rs. 35,400 to Rs. 1,12,400 (Pay Level 6)");
    setFormLocation("All India (Anywhere in India)");
    setFormApplyMode("Online Mode");
    setFormOfficialWeb("https://gov.in");
    setFormApplyLink("https://gov.in/apply");
    setFormRequirements("Applicants must meet the specified standard eligibility matching the particular qualification. Medical examinations might be requested.");
    setFormType("Central Government Jobs");
    setFormTag("");
  };

  // Trigger Job Form
  const triggerAddJob = () => {
    resetForm();
    setFormMode("add");
    setShowJobForm(true);
  };

  const triggerEditJob = (job: JobRow) => {
    setFormMode("edit");
    setEditingJobId(job.id);
    setFormTitle(job.title);
    setFormOrg(job.department);
    setFormAdvNo("Advt No: EXAM/" + job.id.toUpperCase());
    setFormPostDate(job.startDate || "2026-05-29");
    setFormLastDate(job.lastDate);
    setFormVacancy(job.vacancy);
    setFormQual(job.qualification);
    setFormAgeLimit(job.ageLimit);
    setFormFeeGen(job.feeGen);
    setFormFeeOBC(job.feeOBC);
    setFormFeeSCST(job.feeSCST);
    setFormFeeFemale(job.feeFemale);
    setFormSelection(job.applyMode);
    setFormSalary(job.payScale);
    setFormLocation(job.jobLocation);
    setFormApplyMode(job.applyMode);
    setFormOfficialWeb(job.officialNotificationUrl);
    setFormApplyLink(job.applyOnlineUrl);
    setFormRequirements(job.fullRequirements || "");
    setFormType(job.jobType || "Central Government Jobs");
    setFormTag(job.tag || "");
    setShowJobForm(true);
  };

  // Submit Form Action
  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (formMode === "add") {
      const newId = formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString().slice(-4);
      const newJob: JobRow = {
        id: newId,
        title: formTitle,
        department: formOrg,
        vacancy: formVacancy,
        lastDate: formLastDate,
        qualification: formQual,
        tag: formTag || undefined,
        jobLocation: formLocation,
        applyMode: formApplyMode,
        ageLimit: formAgeLimit,
        payScale: formSalary,
        jobType: formType,
        feeGen: formFeeGen || "Rs. 100/-",
        feeOBC: formFeeOBC || "Rs. 100/-",
        feeSCST: formFeeSCST || "Rs. 0/-",
        feeFemale: formFeeFemale || "Rs. 0/-",
        startDate: formPostDate,
        officialNotificationUrl: formOfficialWeb,
        applyOnlineUrl: formApplyLink,
        fullRequirements: formRequirements
      };
      setJobs([newJob, ...jobs]);
    } else {
      setJobs(jobs.map(j => j.id === editingJobId ? {
        ...j,
        title: formTitle,
        department: formOrg,
        vacancy: formVacancy,
        lastDate: formLastDate,
        qualification: formQual,
        tag: formTag || undefined,
        jobLocation: formLocation,
        applyMode: formApplyMode,
        ageLimit: formAgeLimit,
        payScale: formSalary,
        jobType: formType,
        feeGen: formFeeGen || "Rs. 100/-",
        feeOBC: formFeeOBC || "Rs. 100/-",
        feeSCST: formFeeSCST || "Rs. 0/-",
        feeFemale: formFeeFemale || "Rs. 0/-",
        startDate: formPostDate,
        officialNotificationUrl: formOfficialWeb,
        applyOnlineUrl: formApplyLink,
        fullRequirements: formRequirements
      } : j));
    }
    setShowJobForm(false);
  };

  // Delete Job action
  const handleDeleteJob = (id: string) => {
    if (confirm("Are you sure you want to delete this job post permanently?")) {
      setJobs(jobs.filter(j => j.id !== id));
    }
  };

  // AI description generator
  const handleAIGenerate = () => {
    if (!aiJobTitle) return;
    setAiGenerating(true);
    setTimeout(() => {
      // Simulate highly robust government job generator matching all India formats
      const mockAge = "18 to 32 Years. Relaxations applicable: OBC - 3 Years, SC/ST - 5 Years, PwD - 10 Years as per rules.";
      const mockSalary = "Level 6: Rs. 35,400 - Rs. 1,12,400 per month with standard central DA and HRA bonuses.";
      const mockReq = `1. Candidates must possess a valid degree/diploma relative to the specific recruitment board requirements.\n2. Must have clean professional or academic character validation declarations.\n3. Selection will be based purely on performance scores secured in Tier-I & Tier-II Computer Based Examinations (CBT).`;
      const generatedAdvNo = `Sarkari/Advt/${new Date().getFullYear()}/${Math.floor(Math.random() * 500 + 100)}`;
      
      setFormTitle(aiJobTitle + " Recruitment 2026");
      setFormOrg(aiJobTitle.split(" ")[0] + " Board Department");
      setFormAdvNo(generatedAdvNo);
      setFormVacancy(Math.floor(Math.random() * 4500 + 150).toString());
      setFormAgeLimit(mockAge);
      setFormSalary(mockSalary);
      setFormRequirements(mockReq);
      setFormLocation("All India Anywhere in India");
      setFormFeeGen("Rs. 100/-");
      setFormFeeOBC("Rs. 100/-");
      setFormFeeSCST("Rs. 0/- (Exempted)");
      setFormFeeFemale("Rs. 0/- (Exempted)");
      
      setAiGenerating(false);
      setFormMode("add");
      setShowJobForm(true);
    }, 900);
  };

  // Social Autopost Generator
  const generateSocialPreviews = (job: JobRow) => {
    const tgMsg = `📣 *NEW SARKARI ALERT* 📣\n\n📌 *${job.title}*\n🏢 Dept: ${job.department}\n💼 Total Vacancy: ${job.vacancy} Positions\n🎓 Qualification: ${job.qualification}\n📅 Last Date: ${job.lastDate}\n\n👇 *Apply Online / Get Notification PDF* 👇\n📲 https://sarkariprecision.co/jobs/${job.id}\n\n#SarkariResult #GovernmentJobs #Careers`;
    const waMsg = `*🚀 SARKARI JOBS NOTIFICATION 2026 🚀*\n\n*${job.title}*\n----------------------------------------\n📍 *Organization:* ${job.department}\n⚡ *Vacancies:* ${job.vacancy}\n🎓 *Min Rank:* ${job.qualification}\n📅 *Last Apply Date:* ${job.lastDate}\n\n🌐 *Direct Apply Link & Official Notification Details:*\n👉 https://sarkariprecision.co/jobs/${job.id}\n\n_Share with your friends and family looking for active recruitments!_`;
    setTelegramFormat(tgMsg);
    setWhatsappFormat(waMsg);
  };

  // XML Sitemap preview
  const generateSitemap = () => {
    setSitemapLoading(true);
    setTimeout(() => {
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
      xml += `  <url>\n    <loc>https://sarkariprecision.co/</loc>\n    <priority>1.0</priority>\n    <changefreq>always</changefreq>\n  </url>\n`;
      jobs.forEach(job => {
        xml += `  <url>\n    <loc>https://sarkariprecision.co/jobs/${job.id}</loc>\n    <priority>0.8</priority>\n    <changefreq>daily</changefreq>\n  </url>\n`;
      });
      xml += `</urlset>`;
      setSitemapGenerated(xml);
      setSitemapLoading(false);
    }, 600);
  };

  // Bulk simulated CSV importer
  const handleBulkSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadedFileName(file.name);
    
    // Simulate parsing CSV with 15 mock Central/State operations
    setTimeout(() => {
      const dummyJobs: JobRow[] = [
        {
          id: "bulk-rtr-" + Math.random().toString().slice(-4),
          title: "Railway protection Police Sub Inspector",
          department: "Ministry of Railways",
          vacancy: "1,240",
          lastDate: "20-07-2026",
          qualification: "Graduate",
          tag: "HOT",
          jobLocation: "All India Zone Circles",
          applyMode: "Online Form",
          ageLimit: "20-25 Years",
          payScale: "Rs. 35,400 Level-6 Matrix",
          jobType: "Central Government Jobs",
          feeGen: "Rs. 500/-",
          feeOBC: "Rs. 500/-",
          feeSCST: "Rs. 250/-",
          feeFemale: "Rs. 250/-",
          startDate: "29-05-2026",
          officialNotificationUrl: "https://rpf.indianrailways.gov.in",
          applyOnlineUrl: "https://rpf.gov.in/apply"
        },
        {
          id: "bulk-nbb-" + Math.random().toString().slice(-4),
          title: "NABARD Officer Grade A Exam 2026",
          department: "National Bank for Agriculture",
          vacancy: "150",
          lastDate: "15-07-2026",
          qualification: "Graduate",
          tag: "NEW",
          jobLocation: "Headquarters & State Branches",
          applyMode: "Online Form",
          ageLimit: "21-30 Years",
          payScale: "Rs. 44,500 Base Grade",
          jobType: "Banking Jobs",
          feeGen: "Rs. 800/-",
          feeOBC: "Rs. 800/-",
          feeSCST: "Rs. 150/-",
          feeFemale: "Rs. 150/-",
          startDate: "29-05-2026",
          officialNotificationUrl: "https://nabard.org",
          applyOnlineUrl: "https://nabard.org/careers"
        }
      ];
      setJobs([...dummyJobs, ...jobs]);
      setBulkImportCount(2);
    }, 800);
  };

  // Add Admit Card
  const handleAddAdmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmitTitle) return;
    setAdmitCards([{ title: newAdmitTitle, tag: newAdmitTag || undefined }, ...admitCards]);
    setNewAdmitTitle("");
    setNewAdmitTag("");
  };

  // Add Result
  const handleAddResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResultTitle) return;
    setResults([{ title: newResultTitle, tag: newResultTag || undefined }, ...results]);
    setNewResultTitle("");
    setNewResultTag("");
  };

  const handleUpdateStateQuota = (code: string) => {
    setStates(states.map(s => s.code === code ? { ...s, jobsCount: stateQuotaCount } : s));
    setEditingStateCode(null);
  };

  const handlePushSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushTitle) return;
    setPushSuccess(true);
    setTimeout(() => setPushSuccess(false), 4000);
    setPushTitle("");
    setPushBody("");
  };

  const filteredJobsList = jobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        j.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        j.qualification.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedCategory === "all") return matchSearch;
    return matchSearch && j.jobType?.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col md:flex-row relative">
      
      {/* SIDEBAR NAVIGATION PANEL */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
        
        {/* LOGO HERO CONTAINER */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-rose-600 p-2 rounded-lg text-white font-black font-baloo tracking-tight shadow-md">
              SR
            </div>
            <div>
              <h2 className="font-extrabold font-baloo tracking-tight text-white leading-none text-base">SARKARI CONTROL</h2>
              <span className="text-[9px] text-[#22c55e] block font-bold mt-1 tracking-wider uppercase">● SUPERADMIN ONLINE</span>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="md:hidden p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* MENUS SCROLL GRID */}
        <nav className="p-3.5 space-y-1 select-none flex-1 overflow-y-auto custom-scroll">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
              activeTab === "dashboard" ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            Dashboard Analytics
          </button>
          
          <button 
            onClick={() => { setActiveTab("jobs"); setShowJobForm(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
              activeTab === "jobs" ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Job Listings Editor
          </button>

          <button 
            onClick={() => setActiveTab("states")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
              activeTab === "states" ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <Globe className="w-4 h-4" />
            All India State Quotas
          </button>

          <button 
            onClick={() => setActiveTab("content")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
              activeTab === "content" ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <Radio className="w-4 h-4" />
            Results & Admit Cards
          </button>

          <button 
            onClick={() => setActiveTab("tools")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
              activeTab === "tools" ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Advanced & AI Tools
          </button>

          <button 
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
              activeTab === "users" ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            Staff & Permissions
          </button>

          <button 
            onClick={() => setActiveTab("monetization")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
              activeTab === "monetization" ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Ad Placement Manager
          </button>
        </nav>

        {/* QUICK LINK BACK TO HOME PORTAL */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 select-none space-y-2">
          {onSignOut && (
            <button 
              onClick={onSignOut}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-750 text-rose-500 py-2.5 px-3 rounded-lg text-xs font-bold transition-all transform active:scale-95 border border-slate-700"
            >
              🔒 Security Sign Out
            </button>
          )}
          <button 
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 bg-[#cc0000] hover:bg-[#aa0000] text-white py-2.5 px-3 rounded-lg text-xs font-bold transition-all transform active:scale-95 shadow-md shadow-rose-900/30"
          >
            <ArrowLeft className="w-4 h-4" />
            View Public Website
          </button>
        </div>
      </aside>

      {/* STAGE AREA WINDOW WITH CORNER BACKGROUND */}
      <main className="flex-1 flex flex-col p-4 md:p-6 overflow-x-hidden min-h-0 bg-slate-900">
        
        {/* TOP META CONTROLS HEADER */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 shrink-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-baloo tracking-tight text-white uppercase flex items-center gap-2">
              Sarkari Result Admin Control Panel 
              <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full lowercase font-mono">v3.5.0-production</span>
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Add and maintain jobs, configure advertisement modules, publish instant results and admit cards dynamically.
            </p>
          </div>

          <div className="flex gap-2.5 self-stretch sm:self-auto select-none">
            <button 
              onClick={onClose} 
              className="flex-1 sm:flex-initial bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-xs font-semibold border border-slate-750 transition-all flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Live Preview Portal
            </button>
            <button 
              onClick={triggerAddJob}
              className="flex-1 sm:flex-initial bg-[#22c55e] hover:bg-[#1ca34d] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg shadow-emerald-950/20 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Post Sarkari Job
            </button>
          </div>
        </header>

        {/* CONTAINER SWITCH DECISION FRAME */}
        <div className="flex-1 py-6">

          {/* ==================== TAB 1: DASHBOARD METRICS ANALYTICS ==================== */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              
              {/* PRIMARY KPI ANALYTICS ROW */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center gap-3.5">
                  <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-bold uppercase tracking-wider">Total Active Jobs</span>
                    <span className="text-lg sm:text-xl font-extrabold text-white mt-1 block">{jobs.length} Posts</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center gap-3.5">
                  <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-bold uppercase tracking-wider">Admit Cards Live</span>
                    <span className="text-lg sm:text-xl font-extrabold text-white mt-1 block">{admitCards.length} Cards</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center gap-3.5">
                  <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-bold uppercase tracking-wider">Declared Results</span>
                    <span className="text-lg sm:text-xl font-extrabold text-white mt-1 block">{results.length} Releases</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center gap-3.5">
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-bold uppercase tracking-wider">Mock Ad Revenue</span>
                    <span className="text-lg sm:text-xl font-extrabold text-emerald-400 mt-1 block">Rs. 84,350 / mo</span>
                  </div>
                </div>
              </div>

              {/* SECONDARY ROW: WEBSITES TRAFFIC CHART & RECENT TRENDING ACTIVITY */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* REVENUE & TRAFFIC MOCK VISUALIZER CHART */}
                <div className="lg:col-span-2 bg-slate-950 p-5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-850">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider">Daily Visitors & Dynamic Metric Logs</h3>
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">Real-time stats</span>
                  </div>

                  <div className="py-6 flex flex-col justify-between">
                    <div className="flex items-end justify-between h-40 gap-1.5 pt-4 border-b border-slate-800">
                      {[15, 30, 45, 25, 60, 80, 50, 95, 75, 110, 85, 140, 100, 125, 160].map((val, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                          <div 
                            style={{ height: `${(val / 160) * 100}%` }} 
                            className="bg-gradient-to-t from-blue-600 via-indigo-500 to-indigo-400 hover:to-amber-500 transition-all rounded-t-sm w-full relative group cursor-pointer"
                          >
                            <span className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-800 text-[9px] text-white px-1.5 py-0.5 rounded whitespace-nowrap shadow transition-opacity border border-slate-700 z-10 font-mono">
                              {val * 50} Views
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* CHART TIMELINE */}
                    <div className="flex justify-between text-[9px] text-slate-500 pt-2.5 font-bold font-mono">
                      <span>May 15</span>
                      <span>May 18</span>
                      <span>May 21</span>
                      <span>May 24</span>
                      <span>May 27</span>
                      <span>Today (May 29)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center border-t border-slate-850 pt-4 mt-2">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Total Candidates</span>
                      <strong className="text-sm text-white mt-0.5 block font-mono">1,120,450</strong>
                    </div>
                    <div className="border-x border-slate-900">
                      <span className="text-[10px] text-slate-500 block">Server Uptime</span>
                      <strong className="text-sm text-[#22c55e] mt-0.5 block font-mono">99.98%</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Avg Session Time</span>
                      <strong className="text-sm text-white mt-0.5 block font-mono">4.2 min</strong>
                    </div>
                  </div>
                </div>

                {/* SARKARI LOGGING TERMINAL & QUICK NOTIFICATION BOX */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-850">
                    <Layers className="w-4 h-4 text-blue-400" />
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider">Live System Logs</h3>
                  </div>

                  <div className="flex-1 overflow-y-auto mt-4 space-y-3 font-mono text-[10px] text-slate-400">
                    <div className="flex items-start gap-1 p-1 bg-slate-900/50 rounded">
                      <span className="text-blue-400 font-bold">[INFO]</span>
                      <span>Published "UPSC prelims schedules" via Sub Admin Anand.</span>
                    </div>
                    <div className="flex items-start gap-1 p-1 bg-slate-900/50 rounded">
                      <span className="text-emerald-400 font-bold">[SEO]</span>
                      <span>Sitemap.xml crawled successfully by Google Searchbot.</span>
                    </div>
                    <div className="flex items-start gap-1 p-1 bg-slate-900/50 rounded">
                      <span className="text-amber-400 font-bold">[WARN]</span>
                      <span>Clipped "RRB NTPC apply link" auto-expiry detected.</span>
                    </div>
                    <div className="flex items-start gap-1 p-1 bg-slate-900/50 rounded">
                      <span className="text-[#22c55e] font-bold">[PING]</span>
                      <span>WhatsApp Share widget broadcasted 1,200 alert clicks.</span>
                    </div>
                    <div className="flex items-start gap-1 p-1 bg-slate-900/50 rounded">
                      <span className="text-teal-400 font-bold">[AD]</span>
                      <span>AdSense Header Slot rendering active. CTR: 2.14%</span>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 mt-4 select-none">
                    <h4 className="text-[10px] font-bold text-white uppercase mb-1">State Manager Assignment</h4>
                    <p className="text-[9px] text-[#94a3b8]">West Bengal recruitment cycles currently updated by Sunita Sen. Bihar STET controlled by Rajesh Kumar.</p>
                  </div>
                </div>

              </div>

              {/* SECTION: STATE WISE JOB TABULATION OVERVIEW */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 select-none">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400" />
                  State-wise Active Jobs Counter Matrix
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xs">
                  {states.slice(0, 18).map(st => (
                    <div key={st.code} className="bg-slate-900 p-2.5 rounded border border-slate-800 flex justify-between items-center hover:bg-slate-850 transition-colors">
                      <span className="font-semibold text-slate-300">{st.name}</span>
                      <span className="font-mono text-[10px] bg-indigo-950/40 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-900">{st.jobsCount}</span>
                    </div>
                  ))}
                  <div className="bg-slate-900 p-2.5 rounded border border-dashed border-slate-750 flex justify-center items-center">
                    <span onClick={() => setActiveTab("states")} className="text-[10px] text-slate-400 font-bold hover:text-white cursor-pointer hover:underline">View All 30+ States →</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ==================== TAB 2: JOB CRUD MANAGER LISTING ==================== */}
          {activeTab === "jobs" && (
            <div className="space-y-6">
              
              {/* SEARCH & ADD JOB FILTERS TOOLBAR */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex-1 flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Search jobs by keyword/title/dept..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-xs font-semibold focus:outline-none focus:border-blue-500 text-white"
                    />
                  </div>
                  
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-300"
                  >
                    <option value="all">All Category sectors</option>
                    <option value="central">Central Govt</option>
                    <option value="railway">Railways</option>
                    <option value="banking">Banking</option>
                    <option value="police">Police & Defence</option>
                    <option value="ssc">SSC</option>
                    <option value="upsc">UPSC</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={triggerAddJob}
                    className="flex-1 md:flex-initial bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add New Job
                  </button>
                </div>
              </div>

              {/* EXPANDABLE JOB FORM (CRITICAL ASKS) */}
              {showJobForm && (
                <form 
                  onSubmit={handleSaveJob}
                  className="bg-slate-950 p-6 rounded-xl border-2 border-blue-500/80 space-y-6 relative animate-scale-up"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-850">
                    <div className="flex items-center gap-2">
                      <Sparkles className="text-amber-400 w-4.5 h-4.5" />
                      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-400">
                        {formMode === "add" ? "Post Dynamic Government Job Details" : `Editing Job Target: [id: ${editingJobId}]`}
                      </h3>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setShowJobForm(false)} 
                      className="p-1 px-2.5 bg-slate-900 hover:bg-slate-800 text-xs rounded border border-slate-800 text-slate-400 hover:text-white"
                    >
                      Hide Form
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Job Post Title *</label>
                      <input 
                        type="text" required value={formTitle} onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="e.g. UPSC Combined Defence Services (CDS)"
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded p-2 text-white font-semibold outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Organization / Department *</label>
                      <input 
                        type="text" required value={formOrg} onChange={(e) => setFormOrg(e.target.value)}
                        placeholder="e.g. Union Public Service Commission"
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded p-2 text-white font-semibold outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Advertisement Details Number *</label>
                      <input 
                        type="text" required value={formAdvNo} onChange={(e) => setFormAdvNo(e.target.value)}
                        placeholder="e.g. Advt No: 08/2026/CDS-II"
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded p-2 text-white font-semibold outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Post Opening Date</label>
                      <input 
                        type="date" value={formPostDate} onChange={(e) => setFormPostDate(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded p-2 text-white outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Last Date to Submit *</label>
                      <input 
                        type="text" required value={formLastDate} onChange={(e) => setFormLastDate(e.target.value)}
                        placeholder="e.g. 30-06-2026"
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded p-2 text-white outline-none font-mono font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Total Vacancies *</label>
                      <input 
                        type="text" required value={formVacancy} onChange={(e) => setFormVacancy(e.target.value)}
                        placeholder="e.g. 17,727 or Expected Soon"
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded p-2 text-[#22c55e] font-extrabold outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Essential Qualification *</label>
                      <input 
                        type="text" required value={formQual} onChange={(e) => setFormQual(e.target.value)}
                        placeholder="e.g. 10th Pass / Graduate"
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded p-2 text-white font-semibold outline-none"
                      />
                    </div>
                  </div>

                  {/* AGE STRUCTURING & SALARY SCALES */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Age Limit Specifications</label>
                      <input 
                        type="text" value={formAgeLimit} onChange={(e) => setFormAgeLimit(e.target.value)}
                        placeholder="e.g. 18 to 27 Years. Age relaxations apply."
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded p-2 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Selection Process Description</label>
                      <input 
                        type="text" value={formSelection} onChange={(e) => setFormSelection(e.target.value)}
                        placeholder="e.g. Written CBT Tier-I & Physical test"
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded p-2 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Salary Details / Pay Scale</label>
                      <input 
                        type="text" value={formSalary} onChange={(e) => setFormSalary(e.target.value)}
                        placeholder="e.g. Rs. 21,700 - Rs. 69,100 (Pay Level-3)"
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded p-2 text-white outline-none"
                      />
                    </div>
                  </div>

                  {/* APPLICATION FEES SPLIT */}
                  <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                    <span className="block text-[10px] font-bold uppercase tracking-wider mb-3 text-indigo-400">Application Fees Details Panel</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-slate-500 mb-1 font-bold font-mono">General Fee</label>
                        <input 
                          type="text" value={formFeeGen} onChange={(e) => setFormFeeGen(e.target.value)} placeholder="Rs. 100/-"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded p-2 text-white font-semibold outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 mb-1 font-bold font-mono">OBC/EWS Fee</label>
                        <input 
                          type="text" value={formFeeOBC} onChange={(e) => setFormFeeOBC(e.target.value)} placeholder="Rs. 100/-"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded p-2 text-white font-semibold outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 mb-1 font-bold font-mono">SC/ST Fee</label>
                        <input 
                          type="text" value={formFeeSCST} onChange={(e) => setFormFeeSCST(e.target.value)} placeholder="Rs. 0/-"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded p-2 text-[#22c55e] font-semibold outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 mb-1 font-bold font-mono">Females Fee</label>
                        <input 
                          type="text" value={formFeeFemale} onChange={(e) => setFormFeeFemale(e.target.value)} placeholder="Rs. 0/- (Exempt)"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded p-2 text-[#22c55e] font-semibold outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* OFFICIAL WEBSITES AND CHANNELS (Asks links table) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Official Website URL *</label>
                      <input 
                        type="url" required value={formOfficialWeb} onChange={(e) => setFormOfficialWeb(e.target.value)}
                        placeholder="https://ssc.gov.in"
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded p-2 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Direct Online Apply Link *</label>
                      <input 
                        type="url" required value={formApplyLink} onChange={(e) => setFormApplyLink(e.target.value)}
                        placeholder="https://ssc.gov.in/apply"
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded p-2 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Applet Placement Sector Category</label>
                      <select 
                        value={formType} onChange={(e) => setFormType(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded p-2 text-slate-300 font-semibold outline-none"
                      >
                        <option>Central Government Jobs</option>
                        <option>State Government Jobs</option>
                        <option>Railway Jobs</option>
                        <option>Banking Jobs</option>
                        <option>SSC Jobs</option>
                        <option>UPSC Jobs</option>
                        <option>Defence Jobs</option>
                        <option>Teaching Jobs</option>
                        <option>Medical Jobs</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Brief Selection Criteria / Requirements (Full details View page)</label>
                      <textarea 
                        value={formRequirements} onChange={(e) => setFormRequirements(e.target.value)} rows={3}
                        placeholder="Detailed requirements for the candidate to review..."
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded p-2.5 text-white outline-none font-sans"
                      />
                    </div>
                    <div>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">Highlight Tag</label>
                          <select 
                            value={formTag} onChange={(e) => setFormTag(e.target.value as "" | "HOT" | "NEW")}
                            className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white font-semibold outline-none"
                          >
                            <option value="">No tag badge</option>
                            <option value="HOT">HOT (Blinking Red)</option>
                            <option value="NEW">NEW (Saffron Slogan)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">Recruitment Job Location</label>
                          <input 
                            type="text" value={formLocation} onChange={(e) => setFormLocation(e.target.value)}
                            placeholder="e.g. Uttar Pradesh"
                            className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white font-semibold outline-none"
                          />
                        </div>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-[10px] text-slate-500 flex justify-between items-center">
                        <span>💡 Pre-fill this whole form instantly using the AI Generator tool under "Advanced" tab!</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2.5 justify-end">
                    <button 
                      type="button" 
                      onClick={() => setShowJobForm(false)}
                      className="bg-slate-800 hover:bg-slate-750 text-slate-300 px-5 py-2 rounded text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded text-xs font-bold shadow-lg shadow-blue-950/20"
                    >
                      {formMode === "add" ? "Publish Job Advert ✔" : "Update Details ✔"}
                    </button>
                  </div>
                </form>
              )}

              {/* LIST READ TABLE OF ALL RETRIEVED SARKARI RECORDS */}
              <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-850 flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-rose-500 font-baloo">Sarkari Job Database Registry ({filteredJobsList.length} items found)</h3>
                  <span className="text-[10px] text-slate-400">Showing {filteredJobsList.length} entries matching filters</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 font-sans uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3.5 pl-5">Job Slogan & Department</th>
                        <th className="p-3.5">Category Sector</th>
                        <th className="p-3.5">Vacancies</th>
                        <th className="p-3.5">Closing Date</th>
                        <th className="p-3.5">Required Qualification</th>
                        <th className="p-3.5 text-right pr-5">Quick Operations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-slate-300 font-semibold">
                      {filteredJobsList.map(job => (
                        <tr key={job.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-3.5 pl-5">
                            <div className="flex items-center gap-1.5 font-bold text-white hover:text-blue-400 transition-colors cursor-pointer">
                              <span>{job.title}</span>
                              {job.tag && (
                                <span className={`text-[8px] font-extrabold px-1 rounded uppercase ${job.tag === 'HOT' ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-500 text-white'}`}>
                                  {job.tag}
                                </span>
                              )}
                            </div>
                            <span className="block text-[10px] text-slate-500 mt-0.5">🏢 Org: {job.department} | 📍 Code: {job.id}</span>
                          </td>
                          <td className="p-3.5 text-slate-400 font-mono text-[10px]">{job.jobType || "Central Government"}</td>
                          <td className="p-3.5">
                            <span className="text-emerald-400 font-extrabold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900">
                              {job.vacancy}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono text-rose-450">{job.lastDate}</td>
                          <td className="p-3.5 font-sans text-xs">🎓 {job.qualification}</td>
                          <td className="p-3.5 text-right pr-5">
                            <div className="inline-flex gap-1">
                              <button 
                                type="button"
                                onClick={() => generateSocialPreviews(job)}
                                className="p-1 px-2.5 bg-slate-900 hover:bg-slate-800 text-[10px] text-teal-400 border border-slate-800 rounded font-bold hover:text-white transition-all flex items-center gap-1"
                              >
                                <Share2 className="w-3.5 h-3.5" /> Share
                              </button>
                              <button 
                                type="button"
                                onClick={() => triggerEditJob(job)}
                                className="p-1 text-blue-400 hover:text-white hover:bg-blue-950 rounded transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                type="button"
                                onClick={() => handleDeleteJob(job.id)}
                                className="p-1 text-rose-500 hover:text-white hover:bg-rose-955 rounded transition-colors"
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

                {filteredJobsList.length === 0 && (
                  <div className="p-8 text-center text-slate-500">
                    No records found matching current search queries or selectors.
                  </div>
                )}
              </div>

              {/* TELEGRAM AND WHATSAPP PREVIEW SECTION GENERATED ON-CLICK */}
              {telegramFormat && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-5 rounded-xl border border-slate-800 animate-scale-up">
                  <div>
                    <h4 className="text-xs font-bold text-blue-400 flex items-center gap-2 uppercase mb-3">
                      <Send className="w-4 h-4 text-sky-400" /> Telegram Channel broadcast draft Autoformatted
                    </h4>
                    <pre className="bg-slate-900 p-4 rounded text-[11px] font-mono whitespace-pre-wrap text-[#94a3b8] max-h-48 overflow-y-auto border border-slate-800 select-all"></pre>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-[10px] text-slate-500">Includes auto sitemap links</span>
                      <button 
                        onClick={() => { navigator.clipboard.writeText(telegramFormat); alert("Telegram draft copied!"); }}
                        className="bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-bold px-3 py-1.5 rounded flex items-center gap-1 transition-all"
                      >
                        <Copy className="w-3.5 h-3.5" /> Copy Telegram Post
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-emerald-450 flex items-center gap-2 uppercase mb-3">
                      <Share2 className="w-4 h-4 text-emerald-400" /> WhatsApp Job Alerts Group Post draft
                    </h4>
                    <pre className="bg-slate-900 p-4 rounded text-[11px] font-mono whitespace-pre-wrap text-[#94a3b8] max-h-48 overflow-y-auto border border-slate-800 select-all"></pre>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-[10px] text-slate-500">Encouragement triggers</span>
                      <button 
                        onClick={() => { navigator.clipboard.writeText(whatsappFormat); alert("WhatsApp draft copied!"); }}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-3 py-1.5 rounded flex items-center gap-1 transition-all"
                      >
                        <Copy className="w-3.5 h-3.5" /> Copy WhatsApp Post
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ==================== TAB 3: ALL INDIA STATES/UTs MANAGEMENT ==================== */}
          {activeTab === "states" && (
            <div className="space-y-6 select-none">
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider mb-2 text-rose-500 font-baloo">Indian States & Union Territories database</h3>
                <p className="text-slate-400 text-xs mb-4">Set state-wise job vacancy counters. Users on the frontend will see this count update in real-time when browsing specific regional updates.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {states.map(state => (
                    <div 
                      key={state.code} 
                      className="bg-slate-900 p-4 rounded border border-slate-800 flex justify-between items-center gap-4 hover:border-slate-700 transition"
                    >
                      <div>
                        <strong className="text-white text-xs block font-bold">{state.name}</strong>
                        <span className="text-[10px] text-slate-500 block">Sarkari State Code: {state.code}</span>
                      </div>
                      
                      {editingStateCode === state.code ? (
                        <div className="flex items-center gap-1">
                          <input 
                            type="number" 
                            className="bg-slate-950 border border-slate-800 rounded p-1 w-16 text-center text-xs text-white"
                            value={stateQuotaCount} 
                            onChange={(e) => setStateQuotaCount(parseInt(e.target.value) || 0)}
                          />
                          <button 
                            onClick={() => handleUpdateStateQuota(state.code)}
                            className="bg-green-600 hover:bg-green-500 p-1 rounded text-white"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs font-extrabold text-blue-400 bg-blue-950/30 px-2 py-0.5 rounded">
                            {state.jobsCount} Posts
                          </span>
                          <button 
                            onClick={() => { setEditingStateCode(state.code); setStateQuotaCount(state.jobsCount); }}
                            className="text-slate-500 hover:text-white p-1 rounded hover:bg-slate-800 transition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 4: ADMIT CARDS & RESULTS MANAGERS ==================== */}
          {activeTab === "content" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* ADMIT SHEET MANAGERS */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 text-blue-400 font-baloo flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-400" /> Admit Cards Sheet Release
                  </h3>

                  <form onSubmit={handleAddAdmit} className="space-y-3 bg-slate-900 p-4 rounded border border-slate-850 text-xs mb-4">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Rapid Publish Admit Card</span>
                    <input 
                      type="text" required placeholder="e.g. Bihar Police Constable PET Exam Admit Code"
                      value={newAdmitTitle} onChange={(e) => setNewAdmitTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded p-2 text-white outline-none font-semibold"
                    />
                    <div className="flex gap-2">
                      <select 
                        value={newAdmitTag} onChange={(e) => setNewAdmitTag(e.target.value as "NEW" | "HOT" | "")}
                        className="bg-slate-950 border border-slate-800 rounded p-2 w-32 outline-none font-semibold"
                      >
                        <option value="">No tag</option>
                        <option value="HOT">HOT</option>
                        <option value="NEW">NEW</option>
                      </select>
                      <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold p-2 rounded">
                        Publish Admit Slip+
                      </button>
                    </div>
                  </form>

                  <div className="space-y-2.5 max-h-80 overflow-y-auto scroll-custom pr-1 text-xs">
                    {admitCards.map((card, idx) => (
                      <div key={idx} className="bg-slate-900 p-3 rounded flex items-center justify-between hover:bg-slate-850 transition">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                          <span>{card.title}</span>
                          {card.tag && (
                            <span className={`text-[8px] font-extrabold px-1 rounded uppercase ${card.tag === "HOT" ? "bg-rose-600" : "bg-amber-500"} text-white`}>
                              {card.tag}
                            </span>
                          )}
                        </div>
                        <button 
                          onClick={() => { if (confirm("Delete this?")) setAdmitCards(admitCards.filter((_, i) => i !== idx)); }}
                          className="text-slate-500 hover:text-rose-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* LATEST RESULTS MANAGER */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 text-[#ff5a00] font-baloo flex items-center gap-2">
                    <Radio className="w-4 h-4 text-orange-400" /> Declared Examination Results
                  </h3>

                  <form onSubmit={handleAddResult} className="space-y-3 bg-slate-900 p-4 rounded border border-slate-850 text-xs mb-4">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Rapid Publish Result Release</span>
                    <input 
                      type="text" required placeholder="e.g. UPSC Combined CSE (IAS) Mains qualifying merit list"
                      value={newResultTitle} onChange={(e) => setNewResultTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded p-2 text-white outline-none font-semibold"
                    />
                    <div className="flex gap-2">
                      <select 
                        value={newResultTag} onChange={(e) => setNewResultTag(e.target.value as "NEW" | "HOT" | "")}
                        className="bg-slate-950 border border-slate-800 rounded p-2 w-32 outline-none font-semibold"
                      >
                        <option value="">No tag</option>
                        <option value="HOT">HOT</option>
                        <option value="NEW">NEW</option>
                      </select>
                      <button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold p-2 rounded">
                        Publish Result Scorecard+
                      </button>
                    </div>
                  </form>

                  <div className="space-y-2.5 max-h-80 overflow-y-auto scroll-custom pr-1 text-xs">
                    {results.map((r, idx) => (
                      <div key={idx} className="bg-slate-900 p-3 rounded flex items-center justify-between hover:bg-slate-850 transition">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                          <span>{r.title}</span>
                          {r.tag && (
                            <span className={`text-[8px] font-extrabold px-1 rounded uppercase ${r.tag === "HOT" ? "bg-rose-600" : "bg-amber-500"} text-white`}>
                              {r.tag}
                            </span>
                          )}
                        </div>
                        <button 
                          onClick={() => { if (confirm("Delete this?")) setResults(results.filter((_, i) => i !== idx)); }}
                          className="text-slate-500 hover:text-rose-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ==================== TAB 5: ADVANCED AI & DIRECT INDEXING TOOLS ==================== */}
          {activeTab === "tools" && (
            <div className="space-y-6">
              
              {/* PRIMARY ROW: AI GENERATOR & BRACKET INTEGRATOR */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* AI AUTO JOB DESCRIPTION GENERATOR */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-indigo-400">AI Job Description Autogenerator</h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">Saves hours of formatting fees structures and recruitment age criteria</p>
                    </div>
                  </div>

                  <div className="space-y-3.5 text-xs pt-2">
                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">Broad Designation or Title Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Indian Navy Sailors Agniveer Entry, SSC GD Constable"
                        value={aiJobTitle} 
                        onChange={(e) => setAiJobTitle(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded p-2.5 text-white font-semibold outline-none"
                      />
                    </div>
                    
                    <button 
                      type="button" 
                      onClick={handleAIGenerate}
                      disabled={aiGenerating}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-950 text-white font-bold p-2.5 rounded transition shadow-md shadow-indigo-955 flex items-center justify-center gap-2"
                    >
                      {aiGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-white" />
                          AI model parameters synthesizing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-indigo-300" />
                          Draft Full Sarkari Job Details Structure 💫
                        </>
                      )}
                    </button>
                    <span className="block text-[9px] text-slate-500 text-center leading-normal">Utilizes optimized schema matching structure with standard pay level matrices</span>
                  </div>
                </div>

                {/* DIRECT PUSH NOTIFICATIONS BROADCASTER */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2">
                    <Radio className="w-5 h-5 text-rose-450 animate-pulse" />
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-rose-500">Instant Alert Push Notification Center</h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">Push real-time alert broadcasts to registered subscribers</p>
                    </div>
                  </div>

                  <form onSubmit={handlePushSubmit} className="space-y-3 pt-2 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Broadcaster Title</label>
                      <input 
                        type="text" required placeholder="e.g. UPSC Civil Services Prelims Exam Date Fixed!"
                        value={pushTitle} onChange={(e) => setPushTitle(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded p-2 text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Broadcaster Message Synopsis</label>
                      <textarea 
                        rows={2} required placeholder="Click details to read whole age limits schema table, select exam centers..."
                        value={pushBody} onChange={(e) => setPushBody(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded p-2 text-white outline-none"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#cc0000] hover:bg-rose-650 text-white font-bold p-2.5 rounded transition shadow"
                    >
                      Broadcast Dynamic Alerts Slips (Browser + Applet) ⚡
                    </button>

                    {pushSuccess && (
                      <div className="p-2 bg-emerald-950/60 border border-emerald-900 rounded text-emerald-400 text-center font-bold text-[10px]">
                        Success! Alerts broadcasted successfully to 124,350 Active App Candidates.
                      </div>
                    )}
                  </form>
                </div>

              </div>

              {/* SECOND ROW: GOOGLE INDEXING SITEMAP AND BULK CSV MULTIPLIER */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* SITEMAP XML GENERATOR */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-emerald-450" />
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-500">Google Indexing & sitemap.xml Builder</h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">Compliant to Google Search Console formats with priorities</p>
                    </div>
                  </div>

                  <div className="space-y-3.5 text-xs pt-2">
                    <button 
                      onClick={generateSitemap}
                      disabled={sitemapLoading}
                      className="w-full bg-slate-900 hover:bg-slate-850 text-slate-300 font-bold p-2 rounded border border-slate-800 transition flex items-center justify-center gap-2"
                    >
                      {sitemapLoading ? (
                        <>
                          <RefreshCw className="animate-spin text-slate-400" /> Building indices schema XML...
                        </>
                      ) : (
                        "Generate XML Sitemap Map 🌍"
                      )}
                    </button>

                    {sitemapGenerated && (
                      <div className="space-y-2">
                        <textarea 
                          readOnly 
                          value={sitemapGenerated} 
                          rows={6}
                          className="w-full bg-slate-900 p-2.5 rounded border border-slate-800 text-[9px] font-mono whitespace-pre text-slate-400 outline-none select-all"
                        />
                        <button 
                          onClick={() => { navigator.clipboard.writeText(sitemapGenerated); alert("Sitemap copied to clipboard!"); }}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1 px-3 text-[10px] rounded"
                        >
                          Copy XML Output
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* BULK JOBS DATA CSV SHEET LOADER */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-amber-500" />
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-500">Bulk Job Import CSV/XLS Simulator</h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">Publish hundreds of job categories at once using tables mapping</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs pt-2">
                    <div className="border-2 border-dashed border-slate-800 p-4 rounded-xl flex flex-col items-center justify-center text-center bg-slate-900/40 select-none">
                      <Upload className="w-8 h-8 text-slate-500 mb-2.5" />
                      <span className="text-slate-400 text-xs font-bold font-sans">Select or Drag CSV Sheet here</span>
                      <span className="text-[10px] text-slate-600 mt-1 block">Expected format: title, vacancy, lastDate, qualification, type</span>
                      
                      <input 
                        type="file" 
                        id="csvFile" 
                        accept=".csv"
                        className="hidden" 
                        onChange={handleBulkSimulate}
                      />
                      <label 
                        htmlFor="csvFile"
                        className="bg-slate-800 hover:bg-slate-700 text-slate-250 font-bold px-4 py-1.5 rounded mt-3.5 cursor-pointer leading-tight text-[11px]"
                      >
                        Browse Files
                      </label>
                    </div>

                    {uploadedFileName && (
                      <div className="p-2 border border-slate-800 rounded bg-slate-900/60 font-mono text-[10px] flex justify-between items-center text-slate-350">
                        <span>📄 File Selected: {uploadedFileName}</span>
                        <span className="text-emerald-400 font-bold">Parsed Ready</span>
                      </div>
                    )}

                    {bulkImportCount !== null && (
                      <div className="p-2.5 bg-emerald-950/60 border border-emerald-900 text-emerald-400 text-[10px] rounded font-semibold">
                        ✔ Bulk Simulator successfully injected {bulkImportCount} new premium central & banking vacancies direct into registry lists.
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ==================== TAB 6: STAFF MEMBERS & USER ROLES ==================== */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 text-[#ff5a00] font-baloo flex items-center gap-2">
                  <Users className="w-4 h-4 text-orange-400" /> Management Team & Permissions Panel
                </h3>

                {/* ADD NEW MEMBER CONTROL BOARD */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newMemberName || !newMemberEmail) return;
                    setTeamMembers([...teamMembers, {
                      id: (teamMembers.length + 1).toString(),
                      name: newMemberName,
                      email: newMemberEmail,
                      role: newMemberRole,
                      statePermission: newMemberState
                    }]);
                    setNewMemberName("");
                    setNewMemberEmail("");
                  }}
                  className="bg-slate-900 p-4 border border-slate-850 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-3 text-xs mb-6 select-none"
                >
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Staff Member Name</label>
                    <input 
                      type="text" required placeholder="Prakash Roy, etc"
                      value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-semibold outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Official Email Account</label>
                    <input 
                      type="email" required placeholder="prakash@sarkari.co"
                      value={newMemberEmail} onChange={(e) => setNewMemberEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-semibold outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">System Role Target</label>
                    <select 
                      value={newMemberRole} onChange={(e) => setNewMemberRole(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-semibold outline-none"
                    >
                      <option>Admin</option>
                      <option>Sub Admin</option>
                      <option>Editor</option>
                      <option>Content Writer</option>
                      <option>State Manager</option>
                    </select>
                  </div>
                  <div className="flex flex-col justify-end">
                    <button type="submit" className="bg-[#cc0000] hover:bg-rose-700 text-white font-bold p-2.5 rounded transition">
                      Invite Member+
                    </button>
                  </div>
                </form>

                {/* THE USERS LIST REGISTRY */}
                <div className="space-y-3 font-sans text-xs">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="bg-slate-900 p-4 rounded-xl border border-slate-850 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <strong className="text-white text-sm font-bold block">{member.name}</strong>
                        <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-start">
                        <span className="text-[10px] bg-indigo-950 border border-indigo-850 text-indigo-400 px-3 py-1 rounded-full font-bold">
                          ⚜ {member.role}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-500 font-bold">District Limit Scope:</span>
                          <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded font-bold border border-emerald-900">{member.statePermission}</span>
                        </div>
                        <button 
                          onClick={() => { if (confirm(`Remove ${member.name}?`)) setTeamMembers(teamMembers.filter(t => t.id !== member.id)); }}
                          className="text-slate-500 hover:text-rose-500 p-1 rounded"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}

          {/* ==================== TAB 7: GOOGLE ADSENSE & MONETIZATION MANAGER ==================== */}
          {activeTab === "monetization" && (
            <div className="space-y-6">
              
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-6">
                
                <div className="flex items-center gap-2.5 pb-4 border-b border-slate-850 justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-rose-500 font-baloo flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-emerald-450 animate-bounce" />
                      Google AdSense Placement & Ad Server Configurations
                    </h3>
                    <p className="text-[10.5px] text-slate-500 mt-1">Configure slot IDs, manage active monetization blocks across header, footer and details tables</p>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-lg border border-slate-800 select-none text-[10px]">
                    <span className="text-slate-400">Main Monetization status:</span>
                    <button 
                      type="button"
                      onClick={() => setAdSenseEnabled(!adSenseEnabled)}
                      className={`px-3 py-1 rounded font-bold transition-all ${
                        adSenseEnabled ? "bg-[#22c55e] text-white" : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {adSenseEnabled ? "ADSENSE LIVE STATUS" : "PAUSED ADSENSE"}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* ADSENSE INTEGRATION CARD */}
                  <div className="space-y-4 text-xs lg:col-span-2">
                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">Primary Pub ID Header Script Block (ca-pub-XXXXXXXXXXXXXXX)</label>
                      <textarea 
                        rows={6}
                        value={adSenseCode} 
                        onChange={(e) => setAdSenseCode(e.target.value)}
                        placeholder="<!--Paste Sarkari Result Google AdSense Custom Embed Header Slots scripts here-->"
                        className="w-full bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[10px] p-2.5 rounded outline-none cursor-text"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">Floating Sticky Footer Slogan Alert Banner Text</label>
                      <input 
                        type="text" 
                        value={stickyAdText} 
                        onChange={(e) => setStickyAdText(e.target.value)}
                        placeholder="🔥 SPECIAL SCRIPT: Subscribe now for instant Sarkari WhatsApp alerts!"
                        className="w-full bg-slate-900 border border-slate-800 p-2 rounded outline-none font-semibold text-amber-400 text-xs"
                      />
                      <span className="block text-[9px] text-slate-500 mt-1.5 leading-normal">This floating sticky notification drives 90% of WhatsApp list recruitment conversions</span>
                    </div>
                  </div>

                  {/* ESTIMATED EARNINGS REALTIME CALCULATIONS */}
                  <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4 select-none self-start">
                    <h4 className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-emerald-400" /> Daily Revenue Estimate Calculator
                    </h4>
                    
                    <div className="space-y-3.5 pt-2">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                        <span className="text-[10px] text-slate-400">Assumed CPM</span>
                        <strong className="text-xs text-white font-mono">Rs. 180 / 1000 Views</strong>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                        <span className="text-[10px] text-slate-400">Total Pageviews</span>
                        <strong className="text-xs text-xs text-white font-mono">245,350 Today</strong>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                        <span className="text-[10px] text-slate-400">Assumed Ad CTR</span>
                        <strong className="text-xs text-white font-mono">2.14%</strong>
                      </div>
                      <div className="flex justify-between items-center pt-1.5">
                        <span className="text-indigo-400 text-xs font-bold uppercase">Estimated Gross Today</span>
                        <strong className="text-base text-emerald-400 font-extrabold font-mono">Rs. 44,163.00</strong>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-slate-950 rounded-lg text-[9.5px] text-slate-500 leading-normal">
                      Note: Real earnings are tracked live securely within your personal Google Analytics & AdSense consoles as configured.
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

        </div>

      </main>

    </div>
  );
}
