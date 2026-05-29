import React, { useState } from "react";
import * as Icons from "lucide-react";
import { centralCategories, stateCategories } from "../data";
import { CultureThemeId, getTranslations } from "./CulturalThemer";

interface CentralCategoriesProps {
  onCategorySelect: (categoryId: string) => void;
  onJobSelect: (jobTitle: string) => void;
  activeThemeId: CultureThemeId;
  selectedStateName?: string;
}

const STATE_MAP_LOCAL: Record<string, string[]> = {
  "Uttar Pradesh": ["up police", "nhm up", "sgpgi lucknow", "uttar pradesh", "uppsc", "upsssc"],
  "Bihar": ["bihar", "bpsc", "bssc", "bseb", "stet"]
};

const isOtherStateJob = (title: string, selectedState?: string): boolean => {
  if (!selectedState) return false;
  const titleLower = title.toLowerCase();
  const selectedStateLower = selectedState.toLowerCase();
  
  for (const [stateName, keywords] of Object.entries(STATE_MAP_LOCAL)) {
    if (stateName.toLowerCase() === selectedStateLower) {
      continue;
    }
    const matchedKeyword = keywords.find(kw => titleLower.includes(kw));
    if (matchedKeyword) {
      return true;
    }
  }
  return false;
};

export function CentralCategories({ onCategorySelect, onJobSelect, activeThemeId, selectedStateName }: CentralCategoriesProps) {
  const translations = getTranslations(activeThemeId);
  const [activeTab, setActiveTab] = useState<"central" | "state">("central");

  const categoriesToRender = activeTab === "central" ? centralCategories : stateCategories;

  return (
    <div className="select-none mb-8">
      {/* Sector Header */}
      <div className="flex justify-between items-end mb-4 animate-fade-in pb-1 border-b border-slate-100">
        <div>
          <h2 className="font-baloo text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span className="w-1 h-6 bg-red-650 rounded-full"></span>
            <span>{activeTab === "central" ? "Central Govt Sectors" : "State Govt Sectors"}</span>
          </h2>
          <p className="font-sans text-xs text-slate-500 font-bold tracking-wide mt-1">
            {activeTab === "central" ? "Explore crucial categories of central civil, technical, and defense recruitments" : "Explore key recruitments of provincial utilities and state department commissions"}
          </p>
        </div>
        <button
          onClick={() => onCategorySelect("all")}
          className="text-red-650 hover:text-slate-900 text-xs font-black font-sans tracking-wider hover:underline uppercase shrink-0"
        >
          View All Sectors
        </button>
      </div>

      {/* Tab Switcher Grid Layout */}
      <div className="grid grid-cols-2 gap-3.5 mb-6">
        <button
          onClick={() => setActiveTab("central")}
          className={`flex items-center gap-3.5 p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
            activeTab === "central"
              ? "bg-slate-900 border-slate-950 text-white shadow-md scale-[1.01]"
              : "bg-white hover:bg-slate-50 border-slate-200 text-slate-755"
          }`}
        >
          <div className={`p-2.5 rounded-xl flex items-center justify-center shrink-0 ${
            activeTab === "central" ? "bg-white/10 text-white" : "bg-slate-50 text-slate-700 border border-slate-100"
          }`}>
            <Icons.Landmark className="w-4.5 h-4.5" />
          </div>
          <div className="text-left leading-tight">
            <span className="text-xs sm:text-sm font-black uppercase tracking-widest block">Union Level</span>
            <span className="text-[10px] opacity-80 block font-bold mt-0.5">Central Ministries & PSUs</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("state")}
          className={`flex items-center gap-3.5 p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
            activeTab === "state"
              ? "bg-slate-900 border-slate-950 text-white shadow-md scale-[1.01]"
              : "bg-white hover:bg-slate-50 border-slate-200 text-slate-755"
          }`}
        >
          <div className={`p-2.5 rounded-xl flex items-center justify-center shrink-0 ${
            activeTab === "state" ? "bg-white/10 text-white" : "bg-slate-50 text-slate-700 border border-slate-100"
          }`}>
            <Icons.MapPin className="w-4.5 h-4.5" />
          </div>
          <div className="text-left leading-tight">
            <span className="text-xs sm:text-sm font-black uppercase tracking-widest block">State Level</span>
            <span className="text-[10px] opacity-80 block font-bold mt-0.5">State Board Commissions</span>
          </div>
        </button>
      </div>

      {/* 2-Column Masonry-Style Grid of sector cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categoriesToRender.map((cat) => {
          // Dynamic Lucide Icon Resolution
          const IconComp = (Icons as any)[cat.iconName] || Icons.HelpCircle;
          const filteredJobs = cat.jobs.filter(job => !isOtherStateJob(job.title, selectedStateName));

          return (
            <div
              key={cat.id}
              className="bg-white rounded-3xl border border-slate-150/80 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Card Body content */}
              <div className="p-5 flex-1">
                {/* Header Row: Icon + Name */}
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2.5 rounded-xl flex items-center justify-center shrink-0 text-white shadow-sm"
                      style={{ backgroundColor: cat.accentColor }}
                    >
                      <IconComp className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="font-baloo font-black text-sm sm:text-base text-slate-900 leading-tight">
                        {cat.name}
                      </h3>
                      <span className="block text-[9.5px] text-slate-400 font-sans tracking-wider uppercase mt-1.5 font-bold">
                        📂 {cat.totalPosts}
                      </span>
                    </div>
                  </div>

                  {/* Hot/New Badge */}
                  {cat.badge && (
                    <span 
                      className={`text-[8px] font-extrabold px-2 py-0.5 rounded-md select-none animate-pulse shrink-0 ${
                        cat.badge === "HOT" 
                          ? "bg-rose-50 text-rose-600 border border-rose-150" 
                          : "bg-sky-50 text-sky-600 border border-sky-150"
                      }`}
                    >
                      {cat.badge}
                    </span>
                  )}
                </div>

                {/* Sub Jobs List items */}
                <div className="space-y-2">
                  {filteredJobs.map((job, idx) => (
                    <div
                      key={idx}
                      onClick={() => onJobSelect(job.title)}
                      className="group/item flex items-center justify-between py-1.5 border-b border-dashed border-slate-100 last:border-none cursor-pointer hover:bg-slate-50/65 rounded-xl px-2 transition-colors duration-150"
                    >
                      <div className="flex items-center gap-2 max-w-[78%]">
                        <span className="text-[10px] text-slate-300 group-hover/item:text-red-650 transition-colors">
                          →
                        </span>
                        <span className="text-slate-800 font-sans text-xs font-black truncate group-hover/item:text-red-650 transition-colors">
                          {job.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {job.hot && (
                          <span className="bg-red-50 text-red-650 text-[8px] font-extrabold px-1.5 py-0.5 rounded border border-red-200 scale-90 animate-pulse">
                            HOT
                          </span>
                        )}
                        {job.new && (
                          <span className="bg-amber-50 text-amber-700 text-[8px] font-extrabold px-1.5 py-0.5 rounded border border-amber-200 scale-90">
                            NEW
                          </span>
                        )}
                        <span className="text-slate-450 group-hover/item:text-red-650 text-[10.5px] font-extrabold font-sans">
                          {job.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

              {/* Footer row linking */}
              <div className="bg-slate-50/55 border-t border-slate-100 p-3 px-5 text-right shrink-0">
                <button
                  onClick={() => onCategorySelect(cat.id)}
                  className="text-[9.5px] uppercase tracking-widest font-black text-slate-600 hover:text-red-650 flex items-center justify-end gap-1.5 ml-auto transition-colors"
                >
                  <span>Explore Sector vacancies</span>
                  <Icons.ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
