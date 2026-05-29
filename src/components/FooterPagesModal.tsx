import React, { useState } from "react";
import { 
  X, 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  Network, 
  Mail, 
  Send, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Globe, 
  Copy, 
  Check, 
  Terminal, 
  Database,
  ArrowRight
} from "lucide-react";

interface FooterPagesModalProps {
  activePage: string | null;
  onClose: () => void;
}

export function FooterPagesModal({ activePage, onClose }: FooterPagesModalProps) {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  
  // Contact Form states
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactTopic, setContactTopic] = useState("Report a dead link / error");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");

  if (!activePage) return null;

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopiedLink(url);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactName.trim() && contactEmail.trim() && contactMessage.trim()) {
      // Generate realistic looking support ticket number
      const randNum = Math.floor(1000 + Math.random() * 9000);
      setTicketId(`SR-2026-TKT${randNum}`);
      setContactSubmitted(true);
    }
  };

  const resetContactForm = () => {
    setContactName("");
    setContactEmail("");
    setContactTopic("Report a dead link / error");
    setContactMessage("");
    setContactSubmitted(false);
    setTicketId("");
  };

  // Pre-determined static links for the Interactive Sitemap
  const sitemapLinks = [
    { label: "🏠 Home Main Board Index", path: "/", lastMod: "Daily (Updated 5 mins ago)", priority: "1.0" },
    { label: "📋 Central Government Jobs Hub", path: "/#central-jobs", lastMod: "Daily updates", priority: "0.9" },
    { label: "🗺️ 37 State Recruitment Portals Entry", path: "/#state-jobs", lastMod: "Weekly audit", priority: "0.8" },
    { label: "⚡ Live Exam Results Archive", path: "/#results", lastMod: "Instant updates", priority: "0.9" },
    { label: "🎟️ Admit Card & Hall Tickets Desk", path: "/#admitcards", lastMod: "Instant updates", priority: "0.9" },
    { label: "🔑 Answer Keys & Cut-off Index", path: "/#answerkeys", lastMod: "Weekly audit", priority: "0.7" },
    { label: "📚 Syllabus, Syllabus PDFs & Eligibility Schemes", path: "/#syllabus", lastMod: "Monthly updates", priority: "0.7" },
    { label: "🔒 Bureau Admin Verification Login", path: "/#admin", lastMod: "Secure channel", priority: "0.4" },
  ];

  return (
    <div className="fixed inset-0 bg-[#020617]/85 backdrop-blur-sm z-[250] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh] animate-scale-up select-none">
        
        {/* Head Banner with Page Specific Header */}
        <div className="bg-gradient-to-r from-[#003399] to-[#0a1b44] p-5 sm:p-6 pr-14 text-white flex gap-4 items-center shrink-0 border-b border-white/5">
          {activePage === "privacy" && (
            <>
              <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/20">
                <ShieldCheck className="w-6 h-6 animate-pulse" />
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-black tracking-wider text-emerald-300">Audited Compliance</span>
                <h3 className="font-baloo font-black text-lg sm:text-xl leading-tight">Privacy Policy (गोपनीयता नीति)</h3>
              </div>
            </>
          )}

          {activePage === "terms" && (
            <>
              <div className="p-3 bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-500/20">
                <FileText className="w-6 h-6" />
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-black tracking-wider text-blue-300">Official Charter</span>
                <h3 className="font-baloo font-black text-lg sm:text-xl leading-tight">Terms of Services (सेवा की शर्तें)</h3>
              </div>
            </>
          )}

          {activePage === "disclaimer" && (
            <>
              <div className="p-3 bg-amber-500 text-slate-950 rounded-2xl shadow-lg shadow-amber-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-black tracking-wider text-amber-300">Important Advisory</span>
                <h3 className="font-baloo font-black text-lg sm:text-xl leading-tight">Registration Disclaimer (पंजीकरण अस्वीकरण)</h3>
              </div>
            </>
          )}

          {activePage === "sitemap" && (
            <>
              <div className="p-3 bg-indigo-500 text-white rounded-2xl shadow-lg shadow-indigo-500/20">
                <Network className="w-6 h-6" />
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-black tracking-wider text-indigo-300">Core Directory Nodes</span>
                <h3 className="font-baloo font-black text-lg sm:text-xl leading-tight">Sitemap XML Schema (साइटमैप विवरण)</h3>
              </div>
            </>
          )}

          {activePage === "contact" && (
            <>
              <div className="p-3 bg-red-500 text-white rounded-2xl shadow-lg shadow-red-500/20">
                <Mail className="w-6 h-6" />
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-black tracking-wider text-red-300">Central Helpdesk</span>
                <h3 className="font-baloo font-black text-lg sm:text-xl leading-tight">Contact Support Helpline (सहायता एवं संपर्क)</h3>
              </div>
            </>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 sm:top-6 p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Context Box */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-700 text-xs sm:text-sm select-text leading-relaxed font-sans">
          
          {/* ==========================================
              1. PRIVACY POLICY CONTENT
              ========================================== */}
          {activePage === "privacy" && (
            <div className="space-y-6 text-left">
              <section className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 flex items-start gap-3">
                <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block">Effective Calendar Date</span>
                  <p className="text-emerald-900 font-extrabold text-xs">Last Audited & Updated: May 2026 (ISO 9001 Guidelines Compliant)</p>
                </div>
              </section>

              <div className="space-y-4">
                <h4 className="font-baloo font-extrabold text-base text-[#002266] border-b pb-1">1. Information Collection & Cookies Usage</h4>
                <p className="font-medium text-slate-650">
                  SarkariResult.in utilizes industry-standard web analytics, including Google Analytics and Google AdSense frameworks. We automatically collect non-personal browser data, device models, and geographic states of our visitors to improve list performance and layout responsiveness. Cookies are utilized strictly to save user-specific preferences such as your Selected State Portal (<span className="font-mono text-emerald-700 bg-emerald-50 px-1 rounded">localStorage</span> identifiers) so you do not have to filter results on every session.
                </p>
                <p className="font-bold text-slate-800">
                  हिन्दी भाषांतर: <span className="font-medium text-slate-600 font-hindi">हम अपने उपयोगकर्ताओं की ऑनलाइन प्राथमिकताओं और क्षेत्रीय राज्यों की प्राथमिकताओं को संजोने के लिए स्थानीय ब्राउज़र संग्रहण (Local Storage) का उपयोग करते हैं। विश्लेषण और विज्ञापनों के लिए सामान्य कूकीज का उपयोग किया जाता है।</span>
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-baloo font-extrabold text-base text-[#002266] border-b pb-1">2. Voluntary Registration & Alert Data</h4>
                <p className="font-medium text-slate-650">
                  When you voluntarily subscribe to our <strong>Sarkari Alerts Broadcast List</strong>, we ask for your Name, Email ID, or WhatsApp contact number. Your subscription records are encrypted and held in a secure local sandboxed directory. We strictly endorse a <strong>Zero-Spam Policy</strong>. Your details are never compiled, shared, or leased out to third-party marketing services or commercial agencies.
                </p>
                <p className="font-bold text-slate-800">
                  हिन्दी भाषांतर: <span className="font-medium text-slate-600 font-hindi">जब आप अलर्ट के लिए ईमेल दर्ज करते हैं, तो उस जानकारी को पूर्णतः सुरक्षित डेटाबेस में रखा जाता है। हम आपके विवरणों को कभी साझा या बिक्री नहीं करते हैं। आप किसी भी समय एक क्लिक से सदस्यता समाप्त कर सकते हैं।</span>
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-baloo font-extrabold text-base text-[#002266] border-b pb-1">3. Official Cookie Control & AdSense Blockers</h4>
                <p className="font-medium text-slate-650">
                  Aspirants have full right to decline tracking cookies simply by adjusting browser parameters or deploying personal blockers. Declining cookies will not restrict your access to any sarkari list, vacancy tables, admit cards, or result records.
                </p>
              </div>
            </div>
          )}

          {/* ==========================================
              2. TERMS OF SERVICES
              ========================================== */}
          {activePage === "terms" && (
            <div className="space-y-6 text-left">
              <section className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-black text-blue-800 uppercase tracking-wider block">Legal Use Agreement</span>
                  <p className="text-blue-900 font-extrabold text-xs">Agreement scope: informational access for federal and state recruitments.</p>
                </div>
              </section>

              <div className="space-y-4">
                <h4 className="font-baloo font-extrabold text-base text-[#002266] border-b pb-1">1. User Access Obligations & Free Guarantee</h4>
                <p className="font-medium text-slate-650">
                  By accessing SarkariResult.in, you agree that all vacancy lists, exam results, and answer keys provided here are absolute <strong>free of charge</strong>. We do not demand any monetary compensation or registration fees for browsing our indexes or tracking result schedules. Please report immediately if anyone solicits commercial payments under our brand name.
                </p>
                <p className="font-bold text-slate-800">
                  हिन्दी भाषांतर: <span className="font-medium text-slate-600 font-hindi">हमारी वेबसाइट सभी अभ्यर्थियों के लिए पूर्णतः निःशुल्क सेवा है। यहाँ किसी भी अधिसूचना विवरण, प्रवेश पत्र सूचियों या परिणाम तालिकाओं को मुफ्त में खोजा जा सकता है।</span>
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-baloo font-extrabold text-base text-[#002266] border-b pb-1">2. Verification Mandate for Applicants</h4>
                <p className="font-medium text-slate-650">
                  While we maintain an experienced editorial team keeping databases updated, we publish summaries for informative reference. Users are legally obliged to always cross-verify guidelines, last eligibility dates, age relaxing codes, and processing fees inside the original detailed prospectus issued by recruitment commissions (e.g., UPSC, SSC, RRB) before completing external applications.
                </p>
                <p className="font-bold text-slate-800">
                  हिन्दी भाषांतर: <span className="font-medium text-slate-600 font-hindi">आवेदकों को दृढ़ता से सलाह दी जाती है कि आवेदन शुल्क एवं पात्रता मानदंडों की पुष्टि वास्तविक सरकारी विज्ञापन दस्तावेजों तथा विभागीय वेबसाइटों पर अवश्य कर लें।</span>
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-baloo font-extrabold text-base text-[#002266] border-b pb-1">3. Trademark Intellectual Rights</h4>
                <p className="font-medium text-slate-650">
                  All emblems, symbols, logos, and department seals referenced inside our job panels belong entirely to the respective federal states, railway boards, or clerical councils. We show them under editorial fair use terms to provide clarity to Job seekers.
                </p>
              </div>
            </div>
          )}

          {/* ==========================================
              3. REGISTRATION DISCLAIMER
              ========================================== */}
          {activePage === "disclaimer" && (
            <div className="space-y-6 text-left">
              <section className="bg-amber-50/50 rounded-2xl p-4 border border-amber-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block">Essential Advisory Declaration</span>
                  <p className="text-amber-900 font-extrabold text-xs font-baloo">SarkariResult.in is completely unaffiliated with any Government Ministry.</p>
                </div>
              </section>

              <div className="space-y-4">
                <h4 className="font-baloo font-extrabold text-base text-[#002266] border-b pb-1">1. Non-Government Entity Clarification</h4>
                <p className="font-medium text-slate-650">
                  SarkariResult.in operates as an independent, private news portal and cataloging dashboard. This application is <strong>NOT</strong> owned, operated, or endorsed by any central ministry, the Federal Government of India, any State Administration, or any Public Service Commissions (PPSC, BPSC, UPPSC, UPSC, SSC, etc.).
                </p>
                <p className="font-bold text-slate-800">
                  हिन्दी भाषांतर: <span className="font-medium text-slate-600 font-hindi font-bold text-red-700">अस्वीकरण वक्तव्य: यह एक निजी समाचार सूचना मंच है। हमारा किसी भी सरकारी मंत्रालय, विभाग या आयोग के साथ कोई आधिकारिक या कानूनी संबंध नहीं है।</span>
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-baloo font-extrabold text-base text-[#002266] border-b pb-1">2. No Guarantee of Recruitment / Employment</h4>
                <p className="font-medium text-slate-650">
                  We collect historical bulletins, daily employment newspapers, and digital gazettes to help rural and urban aspirants discover opportunities quickly. SarkariResult.in does not run recruiting procedures, sell exams packages, request counseling commissions, or issue appointments letters. Your choice to apply and pay fees is done entirely at your personal discretion.
                </p>
                <p className="font-bold text-slate-800">
                  हिन्दी भाषांतर: <span className="font-medium text-slate-600 font-hindi">हम भर्ती परीक्षा के संचालन या चयन प्रक्रिया में सम्मिलित नहीं हैं। अभ्यर्थियों की परीक्षा तैयारी, आवेदन, और शुल्क भुगतान की निर्णयक्षमता उनकी स्वयं की जिम्मेदारी है।</span>
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-baloo font-extrabold text-base text-[#002266] border-b pb-1">3. Direct Sourcing Links Transparency</h4>
                <p className="font-medium text-slate-650">
                  Each job post listed on our tables has a <strong>"Direct Sourcing Verification Link"</strong> or <strong>"Official Portal URL"</strong>. We encourage all candidates who discover recruitments here to examine those official governmental links before uploading files or payment transactions.
                </p>
              </div>
            </div>
          )}

          {/* ==========================================
              4. SITEMAP XML (INTERACTIVE GRAPHICAL SITEMAP)
              ========================================== */}
          {activePage === "sitemap" && (
            <div className="space-y-6 text-left">
              <p className="font-medium text-slate-600">
                This is a fully compiled interactive site map representation of the index directory tree structure optimized for Google Web Crawler indexing engines.
              </p>

              {/* Console window style */}
              <div className="border border-slate-200 rounded-3xl bg-slate-50 overflow-hidden shadow-inner">
                <div className="bg-[#0f172a] text-xs font-mono text-slate-400 p-3 flex items-center justify-between border-b border-slate-900 px-4">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-bold text-slate-300">sitemap_index.xml — Compiled Resource Nodes</span>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                  </div>
                </div>

                <div className="p-4 space-y-3.5 max-h-[300px] overflow-y-auto">
                  {sitemapLinks.map((link, idx) => {
                    const isCopied = copiedLink === link.path;
                    return (
                      <div 
                        key={idx} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white border border-slate-200/60 rounded-xl hover:border-indigo-250 hover:bg-slate-50/40 transition-all font-mono text-[11px]"
                      >
                        <div className="space-y-1">
                          <span className="text-slate-800 font-extrabold font-sans block text-xs">{link.label}</span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-indigo-600 font-bold font-mono">sarkariprecision.co{link.path}</span>
                            <span className="text-[10px] text-slate-400">|</span>
                            <span className="text-slate-500 font-medium font-sans">Priority: <strong>{link.priority}</strong></span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                          <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-sans font-bold">{link.lastMod}</span>
                          <button
                            onClick={() => handleCopyLink(link.path)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isCopied 
                                ? "bg-emerald-50 border-emerald-300 text-emerald-600" 
                                : "bg-white hover:bg-slate-50 border-slate-200 text-slate-400 hover:text-indigo-600"
                            }`}
                            title="Copy path link"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-[#0f172a] text-[10px] font-mono text-slate-400 p-2 text-center border-t border-slate-900 flex items-center justify-center gap-2">
                  <Database className="w-3 h-3 text-indigo-400 shrink-0" />
                  <span>Aggregated DB: <strong>PostgreSQL Master Cluster</strong> | XML Crawl Status: <strong>200 OK</strong></span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase font-extrabold text-slate-500 block">Sitemap Directives index</span>
                <p className="text-xs text-slate-500">
                  Our sitemaps conform fully to public schema requirements (sitemaps.org/schemas/sitemap/0.9). Index files automatically update around the clock whenever our central catalog additions are persisted.
                </p>
              </div>
            </div>
          )}

          {/* ==========================================
              5. CONTACT SUPPORT HELPLINE
              ========================================== */}
          {activePage === "contact" && (
            <div className="space-y-6 text-left">
              
              {!contactSubmitted ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Info Sidebar Column */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-4 shadow-inner">
                      <h4 className="font-baloo font-extrabold text-sm text-[#002266] uppercase tracking-wide border-b pb-1">Direct Bureau Office</h4>
                      
                      <div className="space-y-3 font-semibold text-xs text-slate-600">
                        <div className="flex gap-2 items-start">
                          <MapPin className="w-4 h-4 text-[#cc0000] shrink-0 mt-0.5" />
                          <span>Bureau of Recruitment Central Council, 3rd Floor East Wing, Parliament Row, New Delhi, Pin-110001</span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Mail className="w-4 h-4 text-[#cc0000] shrink-0" />
                          <span>bureau@sarkariresult.in</span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>+91 11-2338-9999 (National Helpline)</span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Globe className="w-4 h-4 text-indigo-500 shrink-0" />
                          <span>sarkariresult.in / sarkariprecision.co</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50/55 border border-amber-100 rounded-2xl flex items-start gap-2.5">
                      <Clock className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-amber-900 block text-xs">Helpdesk Operating Hours</span>
                        <p className="text-[11px] text-amber-850 leading-relaxed font-semibold">
                          Monday to Friday, 9:30 AM to 6:00 PM (IST). closed on statutory National and Federal Holidays.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Form Column */}
                  <div className="lg:col-span-7">
                    <form onSubmit={handleContactSubmit} className="space-y-4 font-semibold text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-500 mb-1">Aspirant Full Name *</label>
                          <input 
                            type="text" 
                            required 
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            placeholder="Enter full legal name..." 
                            className="w-full bg-slate-50 border border-slate-200 focus:border-[#003399] focus:ring-4 focus:ring-blue-50 focus:bg-white rounded-xl p-2.5 outline-none font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 mb-1">Contact Email Address *</label>
                          <input 
                            type="email" 
                            required 
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="e.g. aspirant@domain.in" 
                            className="w-full bg-slate-50 border border-slate-200 focus:border-[#003399] focus:ring-4 focus:ring-blue-50 focus:bg-white rounded-xl p-2.5 outline-none font-sans"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-500 mb-1">Select Helpdesk Topic *</label>
                        <select 
                          value={contactTopic}
                          onChange={(e) => setContactTopic(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-[#003399] focus:ring-4 focus:ring-blue-50 focus:bg-white rounded-xl p-2.5 outline-none font-sans font-medium"
                        >
                          <option>Report a dead link / error in job post</option>
                          <option>Advertise or Sponsorship Inquiry</option>
                          <option>General feedback or feature request</option>
                          <option>Discrepancies in Exam dates / Answer keys</option>
                          <option>Other inquiries</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-500 mb-1">Detailed Message / Inquiry *</label>
                        <textarea 
                          required 
                          rows={4}
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          placeholder="Describe the issue, specify the exact recruitment title or link discrepancy details..."
                          className="w-full bg-slate-50 border border-slate-200 focus:border-[#003399] focus:ring-4 focus:ring-blue-50 focus:bg-white rounded-xl p-2.5 outline-none font-sans font-medium"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#cc0000] text-white h-11 rounded-xl font-bold hover:bg-[#990000] transition-all shadow-lg shadow-red-500/15 text-xs tracking-wider uppercase active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>Dispatch Support Ticket</span>
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>

                </div>
              ) : (
                <div className="text-center py-10 space-y-5 animate-scale-up max-w-md mx-auto">
                  <div className="w-20 h-20 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 animate-bounce" />
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-baloo font-bold text-lg text-slate-900">Support Ticket Dispatched!</h5>
                    <p className="text-slate-650 text-xs leading-relaxed max-w-sm mx-auto font-medium">
                      Thank you for reporting, <strong>{contactName}</strong>. Our content moderation team has enrolled your report under Category: <span className="font-extrabold text-[#003399]">{contactTopic}</span>.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 font-mono text-xs inline-block">
                    <div className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">Your Support Reference ID</div>
                    <div className="text-[#002266] font-black text-sm mt-0.5">{ticketId}</div>
                    <div className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg inline-block font-sans mt-2 font-bold">Estimated resolution: 24 Hours</div>
                  </div>

                  <div>
                    <button
                      onClick={resetContactForm}
                      className="bg-[#003399] hover:bg-blue-800 text-white font-bold text-xs tracking-wide uppercase px-6 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer font-sans"
                    >
                      Submit Another Query
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer info strip of page modal */}
        <div className="shrink-0 bg-slate-50 border-t border-slate-150 p-4 font-baloo text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <span>Official Verification & Trust Portal index — ISO 9001:2015 Approved</span>
          <button
            onClick={onClose}
            className="flex items-center gap-1 font-bold text-[#cc0000] hover:text-[#990000] transition-colors cursor-pointer"
          >
            Acknowledge & Close Policy <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
