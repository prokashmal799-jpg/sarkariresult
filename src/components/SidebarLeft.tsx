import React from "react";
import { 
  Award, Calendar, Heart, GraduationCap, ExternalLink, 
  ChevronRight, Library, FileText, CheckCircle, Scale, Milestone
} from "lucide-react";
import { examCalendarData, importantGovtSites } from "../data";

interface SidebarLeftProps {
  onQuickLinkClick: (linkType: string) => void;
  onQualificationClick: (qual: string) => void;
}

export function SidebarLeft({ onQuickLinkClick, onQualificationClick }: SidebarLeftProps) {
  
  const quickLinksList = [
    { name: "Latest Sarkari Jobs", icon: "🔖", type: "jobs" },
    { name: "Exam Results Hub", icon: "📊", type: "results" },
    { name: "Admit Cards Sheet", icon: "🪪", type: "admit" },
    { name: "Exam Answer Key", icon: "📝", type: "answer" },
    { name: "Syllabus Details", icon: "📚", type: "syllabus" },
    { name: "Previous Exam Papers", icon: "🗂️", type: "previous" },
    { name: "Admissions Entry", icon: "🎓", type: "admission" },
    { name: "Age Relaxation Rules", icon: "📐", type: "age" }
  ];

  const qualificationsList = [
    { name: "10th Pass Jobs", label: "Secondary Level" },
    { name: "12th Pass Jobs", label: "Senior Secondary" },
    { name: "Graduate Jobs", label: "Any Degree Level" },
    { name: "Post Graduate Jobs", label: "Masters/Specialist" },
    { name: "Engineering Jobs", label: "B.Tech/B.E/Dip" },
    { name: "Medical / Nursing", label: "GNM/BSc/Doctor" },
    { name: "Diploma Holder", label: "Technical Polytechnic" },
    { name: "ITI Certified", label: "Trade Trainee" }
  ];

  return (
    <aside className="space-y-4 select-none">
      
      {/* Widget 1 — Quick Links */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-150/80 overflow-hidden">
        <div className="bg-slate-50 p-4 px-5 text-slate-800 font-baloo text-xs sm:text-sm font-black uppercase tracking-widest flex items-center gap-2 border-b border-slate-100">
          <Milestone className="w-4 h-4 text-slate-500 shrink-0" />
          <span>🔖 Direct Links (त्वरित लिंक)</span>
        </div>
        <div className="flex flex-col text-xs font-bold divide-y divide-slate-100">
          {quickLinksList.map((link, idx) => (
            <button
              key={idx}
              onClick={() => onQuickLinkClick(link.type)}
              className="w-full text-left p-3 px-5 flex items-center justify-between hover:bg-slate-55 hover:text-red-650 group transition-all duration-150"
            >
              <div className="flex items-center gap-3">
                <span className="text-base filter drop-shadow-sm">{link.icon}</span>
                <span className="text-slate-800 font-sans group-hover:translate-x-1.5 transition-transform duration-150">
                  {link.name}
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-red-650 group-hover:translate-x-0.5 transition-all" />
            </button>
          ))}
        </div>
      </div>

      {/* Widget 2 — Exam Calendar */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-150/80 overflow-hidden">
        <div className="bg-slate-50 p-4 px-5 text-slate-800 font-baloo text-xs sm:text-sm font-black uppercase tracking-widest flex items-center gap-2 border-b border-slate-100">
          <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
          <span>📅 Exam Calendar 2026</span>
        </div>
        <div className="flex flex-col p-4 gap-2.5 px-5 bg-white">
          {examCalendarData.map((exam, idx) => (
            <div 
              key={idx} 
              className="flex justify-between items-center py-2 border-b border-slate-100 last:border-none last:pb-0"
            >
              <span className="text-slate-800 font-sans text-xs font-bold leading-snug w-[62%] truncate">
                {exam.name}
              </span>
              <span className="bg-red-50 border border-red-150 text-red-650 text-[9px] font-black px-2.5 py-0.5 rounded-full select-all shadow-sm">
                {exam.dateStr}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Widget 3 — By Qualification level */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-150/80 overflow-hidden">
        <div className="bg-slate-50 p-4 px-5 text-slate-800 font-baloo text-xs sm:text-sm font-black uppercase tracking-widest flex items-center gap-2 border-b border-slate-100">
          <GraduationCap className="w-4 h-4 text-slate-500 shrink-0" />
          <span>🎓 Jobs by Eligibility</span>
        </div>
        <div className="flex flex-col text-xs font-bold bg-white p-2.5 gap-1.5 px-4 animate-fade-in">
          {qualificationsList.map((qual, idx) => (
            <button
              key={idx}
              onClick={() => onQualificationClick(qual.name)}
              className="w-full text-left p-2 hover:bg-slate-50 rounded-xl border border-transparent hover:border-slate-150 px-3 flex justify-between items-center group transition-all duration-155"
            >
              <span className="text-slate-800 font-sans font-black group-hover:text-red-650 truncate">{qual.name}</span>
              <span className="text-[10px] bg-slate-100 text-slate-600 font-bold group-hover:bg-slate-900 group-hover:text-amber-300 px-2.5 py-0.5 rounded-md transition-all shrink-0">
                {qual.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Widget 4 — Important Govt Directories */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-150/80 overflow-hidden">
        <div className="bg-slate-50 p-4 px-5 text-slate-800 font-baloo text-xs sm:text-sm font-black uppercase tracking-widest flex items-center gap-2 border-b border-slate-100">
          <Scale className="w-4 h-4 text-slate-500 shrink-0" />
          <span>🏛️ Government Portals</span>
        </div>
        <div className="flex flex-col text-xs font-bold divide-y divide-slate-100">
          {importantGovtSites.map((site, idx) => (
            <a
              key={idx}
              href={site.url}
              target="_blank"
              rel="noreferrer referrer"
              className="p-3 px-5 flex items-center justify-between hover:bg-slate-50/70 hover:text-red-650 group last:border-none transition-all duration-150"
            >
              <span className="text-slate-800 font-sans group-hover:translate-x-1.5 transition-transform duration-150 truncate max-w-[85%]">
                {site.name}
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-350 group-hover:text-red-650 transition-colors shrink-0" />
            </a>
          ))}
        </div>
      </div>

    </aside>
  );
}
