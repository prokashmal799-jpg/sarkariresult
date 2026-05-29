import React from "react";
import { resultsLinks, admitCardsLinks } from "../data";
import { CultureThemeId, getTranslations } from "./CulturalThemer";
import { ArrowUpRight, BarChart3, FileBadge } from "lucide-react";

interface ResultsAdmitGridsProps {
  onResultsClick: () => void;
  onAdmitCardsClick: () => void;
  results?: Array<{ title: string; tag?: "NEW" | "HOT" }>;
  admitCards?: Array<{ title: string; tag?: "NEW" | "HOT" }>;
  activeThemeId: CultureThemeId;
}

export function ResultsAdmitGrids({ 
  onResultsClick, 
  onAdmitCardsClick, 
  results = resultsLinks, 
  admitCards = admitCardsLinks,
  activeThemeId
}: ResultsAdmitGridsProps) {
  
  const translations = getTranslations(activeThemeId);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 select-none mb-8">
      
      {/* 1. Results Panel */}
      <div className="bg-white rounded-3xl border border-slate-150/80 shadow-md overflow-hidden flex flex-col justify-between">
        <div>
          {/* Header Container */}
          <div className="bg-slate-50 p-4 px-5 flex justify-between items-center border-b border-slate-100">
            <h3 className="text-slate-800 font-baloo font-bold text-xs sm:text-sm tracking-wide uppercase flex items-center gap-2">
              <BarChart3 className="w-4.5 h-4.5 text-slate-500" />
              <span>{translations.results}</span>
            </h3>
            <button 
              onClick={onResultsClick}
              className="text-slate-500 hover:text-red-650 font-sans text-[10px] font-black uppercase tracking-widest flex items-center gap-0.5"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          {/* Links Body list */}
          <div className="p-4 bg-white space-y-1">
            {results.slice(0, 10).map((lnk, idx) => (
              <div
                key={idx}
                onClick={onResultsClick}
                className="group flex items-center justify-between py-2 border-b border-dashed border-slate-100 last:border-none hover:bg-slate-50/50 px-2.5 rounded-xl cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2 w-[85%] truncate">
                  <span className="text-slate-350 text-[10px]/none group-hover:text-red-650 group-hover:translate-x-1 transition-all">→</span>
                  <span className="text-slate-700 font-sans text-xs font-black truncate group-hover:text-red-650">
                    {lnk.title}
                  </span>
                </div>
                {lnk.tag && (
                  <span 
                    className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded leading-none shrink-0 ${
                      lnk.tag === "HOT"
                        ? "bg-rose-50 text-rose-600 border border-rose-150 animate-pulse"
                        : "bg-sky-50 text-sky-600 border border-sky-150"
                    }`}
                  >
                    {lnk.tag}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer info banner */}
        <div className="bg-slate-50/60 border-t border-slate-100 p-2.5 text-center text-[10px] text-slate-400 font-sans font-bold">
          Updated 10 mins ago • Direct PDF commission results validated
        </div>
      </div>

      {/* 2. Admit Card Panel */}
      <div className="bg-white rounded-3xl border border-slate-150/80 shadow-md overflow-hidden flex flex-col justify-between">
        <div>
          {/* Header Container */}
          <div className="bg-slate-50 p-4 px-5 flex justify-between items-center border-b border-slate-100">
            <h3 className="text-slate-800 font-baloo font-bold text-xs sm:text-sm tracking-wide uppercase flex items-center gap-2">
              <FileBadge className="w-4.5 h-4.5 text-slate-500" />
              <span>{translations.admitCards}</span>
            </h3>
            <button 
              onClick={onAdmitCardsClick}
              className="text-slate-500 hover:text-red-650 font-sans text-[10px] font-black uppercase tracking-widest flex items-center gap-0.5"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          {/* Links Body list */}
          <div className="p-4 bg-white space-y-1">
            {admitCards.slice(0, 10).map((lnk, idx) => (
              <div
                key={idx}
                onClick={onAdmitCardsClick}
                className="group flex items-center justify-between py-2 border-b border-dashed border-slate-100 last:border-none hover:bg-slate-50/50 px-2.5 rounded-xl cursor-pointer transition-colors"
                id={`admit-card-row-${idx}`}
              >
                <div className="flex items-center gap-2 w-[85%] truncate">
                  <span className="text-slate-350 text-[10px]/none group-hover:text-red-650 group-hover:translate-x-1 transition-all">→</span>
                  <span className="text-slate-700 font-sans text-xs font-black truncate group-hover:text-red-650">
                    {lnk.title}
                  </span>
                </div>
                {lnk.tag && (
                  <span 
                    className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded leading-none shrink-0 ${
                      lnk.tag === "HOT"
                        ? "bg-rose-50 text-rose-600 border border-rose-150 animate-pulse"
                        : "bg-sky-50 text-sky-600 border border-sky-150"
                    }`}
                  >
                    {lnk.tag}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer info banner */}
        <div className="bg-slate-50/60 border-t border-slate-100 p-2.5 text-center text-[10px] text-slate-400 font-sans font-bold">
          Online hall-ticket access portals synchronized directly
        </div>
      </div>

    </div>
  );
}
