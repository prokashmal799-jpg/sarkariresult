import React, { useState } from "react";
import { ArrowLeft, ChevronRight, Award, ShieldAlert, BookOpen, HeartPulse, FileSpreadsheet, Wrench, Sprout, Trees, Users, Building2, Zap, Car, HelpCircle } from "lucide-react";
import * as Icons from "lucide-react";
import { stateCategories, centralCategories } from "../data";

interface StateJobViewProps {
  stateName: string;
  onBack: () => void;
  onJobSelect: (jobTitle: string) => void;
}

export function StateJobView({ stateName, onBack, onJobSelect }: StateJobViewProps) {
  const [activeTab, setActiveTab] = useState<"central" | "state">("state");

  return (
    <div className="select-none animate-fade-in p-1">
      {/* 1. Breadcrumbs */}
      <div className="bg-[#fff7ed] rounded-xl p-3 px-4 flex flex-wrap items-center justify-between border border-orange-100 mb-6 gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span className="cursor-pointer hover:text-saffron" onClick={onBack}>Home</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-saffron">{stateName} Sarkari Naukri 2026</span>
        </div>

        <button
          onClick={onBack}
          className="bg-navy-950 hover:bg-navy-900 text-white font-sans text-xs font-bold px-3.5 py-1.5 rounded-lg transition-transform active:scale-95 flex items-center gap-1.5 shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* 2. State Hero Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-800 to-navy-950 rounded-2xl p-6 mb-6 text-white text-left relative overflow-hidden shadow-xl shadow-navy-950/20">
        <div className="absolute right-[-40px] top-[-40px] opacity-10 pointer-events-none">
          <Icons.Map className="w-48 h-48 text-white rotate-12" />
        </div>
        
        <div className="relative z-10 space-y-1.5">
          <span className="text-xs text-saffron font-bold uppercase tracking-widest leading-none">
            State Recruitment Board UPDATES
          </span>
          <h2 className="font-baloo font-extrabold text-2xl sm:text-3xl tracking-tight leading-none">
            {stateName} <span className="text-gold">Sarkari Naukri 2026</span>
          </h2>
          <p className="font-sans text-slate-300 text-xs sm:text-sm max-w-lg leading-relaxed pt-1 font-normal">
            Browse verified localized announcements issued under the legislative authority of the Governor and local public service boards of <strong className="text-white">{stateName}</strong>.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <span className="bg-saffron text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
              🕒 Updated hourly
            </span>
            <span className="bg-white/10 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
              📂 12 Verified Boards
            </span>
          </div>
        </div>
      </div>

      {/* 3. TWIN TABS SELECTORS */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => setActiveTab("state")}
          className={`py-3 px-4 text-center text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 border rounded-xl flex items-center justify-center gap-2 ${
            activeTab === "state"
              ? "bg-saffron text-white border-saffron shadow-lg shadow-saffron/20"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <span>🗺️</span> {stateName} Govt Jobs
        </button>
        <button
          onClick={() => setActiveTab("central")}
          className={`py-3 px-4 text-center text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 border rounded-xl flex items-center justify-center gap-2 ${
            activeTab === "central"
              ? "bg-saffron text-white border-saffron shadow-lg shadow-saffron/20"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <span>🏛️</span> Central Govt Jobs in {stateName}
        </button>
      </div>

      {/* 4. CATEGORY LAYOUT GRIDS */}
      {activeTab === "state" ? (
        <div>
          <div className="mb-4">
            <h3 className="font-baloo text-base sm:text-lg font-bold text-navy-950 uppercase flex items-center gap-2">
              <span className="w-1.5 h-4 bg-saffron rounded-full"></span>
              <span>12 State-specific Departments vacancies</span>
            </h3>
            <p className="font-sans text-[11px] text-slate-400 font-medium">
              Click any notification to examine the eligibility criteria and key closing dates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stateCategories.map((cat) => {
              const IconComp = (Icons as any)[cat.iconName] || HelpCircle;
              return (
                <div key={cat.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-lg transition-all duration-200">
                  <div className="h-1 w-full" style={{ backgroundColor: cat.accentColor }} />
                  <div className="p-4">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="p-1.5 rounded-lg text-white" style={{ backgroundColor: cat.accentColor }}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-baloo font-bold text-sm text-navy-950 leading-tight">
                          {cat.name.replace("State", stateName)}
                        </h4>
                        <span className="text-[9px] text-slate-400 block mt-0.5 uppercase tracking-wider">{cat.totalPosts}</span>
                      </div>
                    </div>
                    {/* Nested links */}
                    <div className="space-y-1.5">
                      {cat.jobs.map((job, idx) => {
                        // Prepend state prefix organically
                        const localizedTitle = job.title.includes("State") 
                          ? job.title.replace("State", stateName) 
                          : `${stateName} ${job.title}`;

                        return (
                          <div
                            key={idx}
                            onClick={() => onJobSelect(localizedTitle)}
                            className="flex items-center justify-between py-1.5 border-b border-dashed border-slate-100 last:border-none cursor-pointer hover:bg-slate-50/50 rounded-lg px-1.5 transition-colors"
                          >
                            <span className="text-slate-700 font-sans text-xs font-semibold truncate hover:text-saffron">
                              ➤ {localizedTitle}
                            </span>
                            <span className="text-saffron text-[10px] bg-orange-50 px-2 py-0.5 rounded-full font-bold ml-1 shrink-0">
                              {job.count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <h3 className="font-baloo text-base sm:text-lg font-bold text-navy-950 uppercase flex items-center gap-2">
              <span className="w-1.5 h-4 bg-saffron rounded-full"></span>
              <span>Central Vacancies Active in {stateName}</span>
            </h3>
            <p className="font-sans text-[11px] text-slate-400 font-medium">
              National recruitment directories with active local zone operations
            </p>
          </div>

          {/* Central categories grid scaled */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {centralCategories.map((cat) => {
              const IconComp = (Icons as any)[cat.iconName] || HelpCircle;
              return (
                <div key={cat.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-lg transition-all duration-200">
                  <div className="h-1 w-full" style={{ backgroundColor: cat.accentColor }} />
                  <div className="p-4">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="p-1.5 rounded-lg text-white" style={{ backgroundColor: cat.accentColor }}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-baloo font-bold text-sm text-navy-950 leading-tight">
                          {cat.name} ({stateName} Region)
                        </h4>
                        <span className="text-[9px] text-slate-400 block mt-0.5 uppercase tracking-wider">Active Regional Panels</span>
                      </div>
                    </div>
                    {/* Nested links */}
                    <div className="space-y-1.5">
                      {cat.jobs.map((job, idx) => (
                        <div
                          key={idx}
                          onClick={() => onJobSelect(job.title)}
                          className="flex items-center justify-between py-1.5 border-b border-dashed border-slate-100 last:border-none cursor-pointer hover:bg-slate-50/50 rounded-lg px-1.5 transition-colors"
                        >
                          <span className="text-slate-700 font-sans text-xs font-semibold truncate hover:text-saffron">
                            ➤ {job.title}
                          </span>
                          <span className="text-saffron text-[10px] bg-orange-50 px-2 py-0.5 rounded-full font-bold ml-1 shrink-0 font-mono">
                            {job.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
