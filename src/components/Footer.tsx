import React, { useState } from "react";
import { Send, MapPin, CheckCircle, Mail, HelpCircle, ShieldAlert, ChevronDown, ChevronUp } from "lucide-react";
import { statesData } from "../data";

interface FooterProps {
  onStateSelect: (stateName: string) => void;
  onFilterByCategory: (categoryId: string) => void;
  onAlertsSubscribe: () => void;
  selectedStateName?: string;
  onFooterPageSelect?: (pageId: string) => void;
}

export function Footer({ 
  onStateSelect, 
  onFilterByCategory, 
  onAlertsSubscribe,
  selectedStateName,
  onFooterPageSelect
}: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const faqs = [
    {
      q: "What essential documents are required for Sarkari Document Verification (DV)?",
      a: "For Document Verification (DV), candidates must bring original copy and self-attested photocopies of: 1) Matriculation (10th) Board Certificate as age proof, 2) Academic Marksheets and Degrees, 3) Valid Reservation Certificates (OBC-NCL/EWS/SC/ST) in central/state prescribed format, 4) Government Photo Identity Proof (Aadhaar/PAN/Voter ID), and 5) Five recent passport size photographs."
    },
    {
      q: "What is the standard CBT (Computer Based Test) exam pattern and negative marking?",
      a: "Standard Tier-1 Computer Based Tests typically consist of 100 Multiple Choice Questions (MCQs) totaling 200 marks, divided into four key sections: Reasoning Ability, Quantitative Aptitude, General English, and General Awareness/Current Affairs. Most central recruitment boards enforce a negative marking penalty (usually 0.25 to 0.33 of the marks assigned to that question) for each incorrect attempt."
    },
    {
      q: "How can I verify if my Caste, OBC-NCL, or EWS Category Certificate is valid?",
      a: "For Central Govt Jobs, category certificates must be issued in the official Central Government formats, signed by a competent local revenue officer (Tehsildar, Sub-Divisional Magistrate SDM, or District Collector). Non-Creamy Layer (OBC-NCL) and Income & Asset (EWS) certificates must be fresh, active, and issued within the specified financial year specified in the job notification prospectus."
    },
    {
      q: "How can candidates resolve spelling mistakes or mismatches in school records for DV?",
      a: "If there is an alternate spelling or discrepancy in candidate/parent names across school records and official ID cards, you should consult a licensed legal authority to draft a notarized self-declaration Affidavit explaining the typographical error. Presenting this official legal affidavit alongside matching certificates satisfies Document Verification councils in most sarkari boards."
    }
  ];

  const categories = [
    { name: "Banking & Finance", id: "cat-banking" },
    { name: "Railway Recruitment", id: "cat-railway" },
    { name: "Defence & Police", id: "cat-defence" },
    { name: "UPSC Civil Services", id: "cat-upsc" },
    { name: "SSC Staff Recruitment", id: "cat-ssc" },
    { name: "Teaching Bharti", id: "cat-teaching" },
    { name: "Medical & Nursing", id: "cat-medical" },
    { name: "IT & Tech Engineers", id: "cat-it-tech" },
    { name: "India Post GDS", id: "cat-post" },
    { name: "Judiciary Careers", id: "cat-judiciary" },
    { name: "Research & Science", id: "cat-research" },
    { name: "Maharatna PSU Jobs", id: "cat-psu" }
  ];

  return (
    <footer className="bg-[#f8fafc] text-slate-700 font-sans border-t-4 border-[#003399] select-none">
      
      {/* Footer Primary Column Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Col 1 — Hub Brand and Intro */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#cc0000] to-red-600 rounded-xl flex items-center justify-center font-baloo font-black text-white text-2xl rotate-3 shadow-md">
              S
            </div>
            <div>
              <span className="font-baloo font-black text-2xl text-[#002266] leading-none">
                SarkariResult<span className="text-[#cc0000]">.in</span>
              </span>
              <span className="block font-hind text-[10px] text-[#cc0000] font-extrabold tracking-wider">सरकारी नौकरी | Fast Gateway to Trust</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            SarkariResult.in is India's premium, next-generation, mobile-first government job updates directory. We provide instant, verified job listings, notifications, results trackers, and answer keys.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="w-2 rounded-full h-2 bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] text-emerald-750 font-black uppercase tracking-wider">ISO 9001:2015 AUDITED PORTAL</span>
          </div>
        </div>

        {/* Col 2 — Central Jobs Category */}
        <div>
          <h4 className="font-baloo text-sm text-[#002266] font-black uppercase tracking-wider mb-4 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-3 bg-[#cc0000] rounded-full"></span>
            <span>Central Sectors</span>
          </h4>
          <ul className="grid grid-cols-1 gap-1 text-xs font-semibold">
            {categories.slice(0, 8).map((cat, idx) => (
              <li key={idx}>
                <button
                  onClick={() => onFilterByCategory(cat.id)}
                  className="w-full text-left py-1 px-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-[#003399] transition-all flex items-center gap-1.5"
                >
                  <span className="text-blue-500 text-[10px]">■</span>
                  <span>{cat.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Top States Search */}
        <div>
          <h4 className="font-baloo text-sm text-[#002266] font-black uppercase tracking-wider mb-4 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-3 bg-emerald-600 rounded-full"></span>
            <span>State Portals</span>
          </h4>
          <ul className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs font-bold">
            {statesData.slice(0, 10).map((st, idx) => {
              const isSelected = selectedStateName && st.name.toLowerCase() === selectedStateName.toLowerCase();
              return (
                <li key={idx}>
                  <button
                    onClick={() => onStateSelect(st.name)}
                    className={`w-full transition-all text-left truncate flex items-center justify-between gap-1 p-1 rounded-lg border ${
                      isSelected 
                        ? "bg-amber-400/20 text-amber-950 border-amber-400/50 font-black px-2 shadow-sm" 
                        : "text-slate-600 hover:text-[#003399] border-transparent hover:bg-slate-100 hover:translate-x-0.5"
                    }`}
                  >
                    <span className="truncate">📍 {st.name.split(" ")[0]}</span>
                    {isSelected && <span className="text-[10px] text-amber-600 animate-pulse">●</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Col 4 — Subscription Newsletter */}
        <div className="space-y-4">
          <h4 className="font-baloo text-sm text-[#002266] font-black uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-3 bg-[#cc0000] rounded-full"></span>
            <span>Sarkari Alerts</span>
          </h4>
          <p className="text-xs text-slate-500 leading-normal font-semibold">
            Subscribe to our audited email newsletter list to receive weekly recruitment digests and syllabus directly into your inbox.
          </p>
          
          <form onSubmit={handleSubscribe} className="space-y-2">
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter valid email address..."
                className="w-full bg-white border-2 border-slate-200 focus:border-[#003399] focus:ring-4 focus:ring-blue-50/50 rounded-xl p-2.5 pl-3.5 pr-10 text-xs text-slate-800 outline-none placeholder-slate-400 transition-all font-sans font-medium"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bg-[#003399] hover:bg-blue-800 p-2 rounded-lg text-white transition-all duration-150 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            {subscribed && (
              <div className="p-2 border border-emerald-500/20 bg-emerald-50 rounded-lg flex items-center gap-1.5 animate-pulse">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-[10px] text-emerald-700 font-bold">Successfully Subscribed! Weekly digests activated.</span>
              </div>
            )}
          </form>
        </div>

      </div>

      {/* Frequently Asked Questions Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 border-t border-slate-200 pt-10">
        <div className="text-center md:text-left mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-[#cc0000] font-black uppercase tracking-wider bg-red-50 border border-red-100 px-3 py-1 rounded-lg inline-block">
              Frequently Asked Questions (एफएक्यू)
            </span>
            <h3 className="font-baloo font-black text-xl text-slate-900 mt-2.5 flex items-center gap-2 justify-center md:justify-start">
              <HelpCircle className="w-5 h-5 text-blue-600 shrink-0" />
              <span>Aspirant Helpdesk: Verification & Exam Patterns</span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 max-w-md md:text-right leading-relaxed font-semibold">
            Official updates compiled from central and state board databases (UPSC, SSC, Railway Recruitment Boards, and Bank clerical councils).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx}
                className="bg-white border border-slate-200/80 hover:border-blue-300 rounded-2xl transition-all duration-155 overflow-hidden shadow-sm hover:shadow-md"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full text-left p-4.5 px-5 flex items-center justify-between gap-4 font-sans text-xs sm:text-sm font-black text-[#002266] hover:bg-slate-50 transition-colors"
                >
                  <span className="flex-1 leading-snug">{faq.q}</span>
                  <div className="p-1 rounded bg-slate-50 border border-slate-150 text-slate-500 shrink-0">
                    {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-[#cc0000]" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="p-4.5 px-5 bg-slate-50/50 border-t border-slate-100 text-xs text-slate-600 leading-relaxed font-medium antialiased">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 2 — Comprehensive 37 States Horizontal Index Pipe separated */}
      <div className="bg-[#f1f5f9] border-t border-b border-slate-200 py-4.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-2 justify-center select-none">
            <MapPin className="w-3 h-3 text-[#cc0000] shrink-0 animate-bounce" />
            <span className="text-[10px] text-slate-600 font-extrabold uppercase tracking-wider">
              {selectedStateName 
                ? `⚡ Active Region Portal: ${selectedStateName} (Clear selection or switch below)`
                : "Browse Jobs Across All 37 Listed States & Union Territories"}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 text-slate-600 text-[11px] font-sans">
            {statesData.map((st, idx) => {
              const isSelected = selectedStateName && st.name.toLowerCase() === selectedStateName.toLowerCase();
              return (
                <React.Fragment key={st.code}>
                  <button
                    onClick={() => onStateSelect(st.name)}
                    className={`hover:text-[#003399] hover:underline cursor-pointer transition-colors font-bold truncate ${
                      isSelected 
                        ? "text-[#002266] font-black bg-white border border-slate-200 shadow-sm px-2 py-0.5 rounded-md scale-[1.05]" 
                        : "text-slate-500"
                    }`}
                  >
                    {st.name} <span className="text-[9px] text-[#cc0000] font-bold font-mono">({st.jobsCount})</span>
                  </button>
                  {idx < statesData.length - 1 && (
                    <span className="text-slate-300 text-[10px]" aria-hidden="true">|</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 3 — Legal bottom panels + Mandatory disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 text-slate-500 font-sans">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div>
            <p className="text-[11px] text-left leading-normal font-sans text-slate-600 font-semibold">
              © {new Date().getFullYear()} <span className="text-slate-800 font-extrabold">SarkariResult.in</span>. All rights reserved. Made in India with pure pride for federal and state job aspirants.
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 mt-2 select-all justify-start font-bold">
              <a href="#privacy" onClick={(e) => { e.preventDefault(); onFooterPageSelect ? onFooterPageSelect("privacy") : onAlertsSubscribe(); }} className="hover:text-[#003399] transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#terms" onClick={(e) => { e.preventDefault(); onFooterPageSelect ? onFooterPageSelect("terms") : onAlertsSubscribe(); }} className="hover:text-[#003399] transition-colors">Terms of Services</a>
              <span>•</span>
              <a href="#disclaimer" onClick={(e) => { e.preventDefault(); onFooterPageSelect ? onFooterPageSelect("disclaimer") : onAlertsSubscribe(); }} className="hover:text-[#003399] transition-colors">Registration Disclaimer</a>
              <span>•</span>
              <a href="#sitemap" onClick={(e) => { e.preventDefault(); onFooterPageSelect ? onFooterPageSelect("sitemap") : onAlertsSubscribe(); }} className="hover:text-[#003399] transition-colors">Sitemap XML</a>
              <span>•</span>
              <a href="#contact" onClick={(e) => { e.preventDefault(); onFooterPageSelect ? onFooterPageSelect("contact") : onAlertsSubscribe(); }} className="hover:text-[#003399] transition-colors">Contact Support Helpline</a>
            </div>
          </div>

          {/* Mandatory Disclaimer Box */}
          <div className="bg-amber-50/50 rounded-2xl p-4 border-2 border-amber-100 select-text flex items-start gap-3 shadow-inner">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="block text-[10px] text-amber-800 font-black uppercase tracking-wider">OFFICIAL GOVERNMENT DISCLAIMER STATEMENT</span>
              <p className="text-[10px] text-slate-600 leading-snug font-medium">
                SarkariResult.in is an independent, non-governmental informational archive. We do not represent any local, state, or federal government organization. All updates, descriptions, lists, and reference tables are compiled solely from public newspapers and standard gazette notifications. Applicants must authenticate notifications via official links before applying.
              </p>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}
