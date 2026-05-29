import React, { useState } from "react";
import { Filter, Bell, RotateCcw, AlertTriangle, ArrowUpRight, Search, Clock, Briefcase, Award, Flame } from "lucide-react";
import { latestJobsList } from "../data";
import { JobRow } from "../types";
import { CultureThemeId, getTranslations } from "./CulturalThemer";

interface LatestJobsTableProps {
  onJobSelect: (jobId: string) => void;
  onAlertsSubscribe: () => void;
  filteredJobs: JobRow[];
  activeFilterLabel?: string;
  onResetFilters: () => void;
  activeThemeId: CultureThemeId;
}

export function LatestJobsTable({ 
  onJobSelect, 
  onAlertsSubscribe, 
  filteredJobs, 
  activeFilterLabel, 
  onResetFilters,
  activeThemeId
}: LatestJobsTableProps) {
  
  const translations = getTranslations(activeThemeId);

  return (
    <div className="select-none mb-8">
      {/* Premium Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="font-baloo text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            <span>{translations.latestJobs}</span>
          </h2>
          <p className="font-sans text-xs text-slate-505 font-bold tracking-wide mt-1">
            {translations.latestJobsSub}
          </p>
        </div>

        <button
          onClick={onAlertsSubscribe}
          className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-350 px-4 py-2 rounded-xl text-xs font-black font-sans tracking-widest transition-all active:scale-95 shrink-0 flex items-center justify-center gap-2 shadow-sm uppercase"
        >
          <Bell className="w-4 h-4 text-amber-500 animate-bounce" />
          <span>{translations.freeAlerts}</span>
        </button>
      </div>

      {/* Styled Active Filter Status banner if present */}
      {activeFilterLabel && (
        <div className="bg-slate-50 border border-slate-200 text-slate-800 p-3.5 px-4 rounded-2xl flex items-center justify-between mb-5 animate-fade-in text-xs font-bold shadow-sm">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 shrink-0 text-slate-500" />
            <span>Active Sector Filter: <strong className="text-slate-950 underline">{activeFilterLabel}</strong> ({filteredJobs.length} listingsfound)</span>
          </div>
          <button 
            onClick={onResetFilters}
            className="text-red-600 hover:text-[#003399] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        </div>
      )}

      {/* Modern Card List Grid Component (Replaces flat native table for extreme premium styling) */}
      <div className="bg-white rounded-3xl border border-slate-100/90 shadow-md divide-y divide-slate-100 overflow-hidden">
        {filteredJobs.length > 0 ? (
          <div>
            {/* Desktop / Tablet Large Screen Feed Layout */}
            <div className="hidden md:block">
              {filteredJobs.map((job) => (
                <div 
                  key={job.id}
                  onClick={() => onJobSelect(job.id)}
                  className="p-5.5 px-6 hover:bg-slate-50/40 cursor-pointer transition-all duration-200 border-l-4 border-transparent hover:border-l-red-600 flex items-center justify-between group"
                >
                  {/* Left Column Profile & Designation Infos */}
                  <div className="flex items-start gap-4 max-w-[60%]">
                    <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 shrink-0 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-950 transition-all duration-300">
                      {job.tag === "HOT" ? (
                        <Flame className="w-5 h-5 text-red-600 group-hover:text-white group-hover:fill-red-500 transition-colors" />
                      ) : (
                        <Briefcase className="w-5 h-5 text-slate-450 group-hover:text-white transition-colors" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-sans font-black text-slate-850 group-hover:text-red-600 text-[14px] leading-snug tracking-wide group-hover:underline transition-colors block">
                          {job.title}
                        </span>
                        
                        {job.tag && (
                          <span 
                            className={`text-[8.5px] font-black px-2 py-0.5 rounded-md uppercase leading-none ${
                              job.tag === "HOT"
                                ? "bg-red-50 text-red-600 border border-red-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {job.tag}
                          </span>
                        )}
                      </div>

                      {/* Sub descriptions horizontal row */}
                      <div className="flex items-center gap-3.5 text-[10.5px] text-slate-450 font-bold font-sans">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Award className="w-3.5 h-3.5" />
                          {job.department}
                        </span>
                        <span>•</span>
                        <span>📍 Location: {job.jobLocation}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column Vacancy Counter Details */}
                  <div className="flex items-center gap-6 text-right">
                    <div className="text-center font-sans">
                      <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 border border-emerald-150 px-3 py-1 rounded-full block select-none">
                        {job.vacancy} POSITIONS
                      </span>
                    </div>

                    {/* Deadline Details Counter */}
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-bold font-sans uppercase">Apply Before</span>
                      <span className="text-red-650 font-black font-sans text-xs select-all block mt-0.5">
                        ⏳ {job.lastDate}
                      </span>
                    </div>

                    {/* Minimum requirements label */}
                    <div className="pl-4 border-l border-slate-100 hidden lg:block text-left">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Eligibility</span>
                      <span className="bg-slate-50 text-slate-800 font-sans font-bold text-[10.5px] px-2.5 py-0.5 rounded-lg border border-slate-150 block mt-0.5">
                        🎓 {job.qualification.split("(")[0]}
                      </span>
                    </div>

                    {/* Direct action Arrow Right button */}
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-950 transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Mobile Adaptive Feed List Layout */}
            <div className="block md:hidden divide-y divide-slate-100">
              {filteredJobs.map((job) => (
                <div 
                  key={job.id}
                  onClick={() => onJobSelect(job.id)}
                  className="p-5 py-5.5 hover:bg-slate-50/30 active:bg-slate-50/50 cursor-pointer space-y-3.5 transition-colors border-l-4 border-transparent hover:border-l-red-600"
                >
                  {/* Top line details */}
                  <div className="flex items-center justify-between gap-2 text-[10px]">
                    <span className="bg-slate-50 text-slate-850 font-sans font-bold px-2.5 py-1 rounded-lg border border-slate-200">
                      🎓 {job.qualification.split("(")[0]}
                    </span>
                    <div className="flex items-center gap-1.5 font-bold">
                      {job.tag && (
                        <span 
                          className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase leading-none ${
                            job.tag === "HOT"
                              ? "bg-red-50 text-red-600 border border-red-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {job.tag}
                        </span>
                      )}
                      <span className="text-emerald-700 font-black bg-emerald-50 border border-emerald-150 px-2.5 py-0.5 rounded-full">
                        {job.vacancy} jobs
                      </span>
                    </div>
                  </div>

                  {/* Post Title */}
                  <h3 className="font-sans font-black text-slate-850 text-sm leading-snug group-hover:text-red-600">
                    {job.title}
                  </h3>

                  {/* Meta strip info layout */}
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[10px] text-slate-500 font-bold font-sans">
                    <span className="text-slate-700">🏢 {job.department}</span>
                    <span className="text-slate-300 select-none">•</span>
                    <span className="text-red-650 font-black bg-red-50 px-2 py-0.5 rounded border border-red-150">
                      📅 Last Date: {job.lastDate}
                    </span>
                    <span className="text-slate-300 select-none">•</span>
                    <span className="text-slate-600">📍 {job.jobLocation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-14 p-6 bg-slate-50/20">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
            <span className="text-sm font-baloo font-black text-slate-800 uppercase block">No active vacancies match selections</span>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto mb-5 font-semibold">
              Update selection filters, alter regional state choices, or restart browsing options.
            </p>
            <button
              onClick={onResetFilters}
              className="bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] tracking-widest uppercase px-6 py-2.5 rounded-xl transition-all shadow-md active:scale-95 inline-block cursor-pointer"
            >
              Reset Selected Sectors
            </button>
          </div>
        )}

        {/* View All Central notifications database */}
        <div className="p-4 py-5 text-center bg-slate-50 border-t border-slate-100 select-none">
          <button
            onClick={onResetFilters}
            className="w-full text-slate-800 hover:text-red-600 font-baloo font-black text-xs uppercase tracking-widest py-1 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View All {latestJobsList.length} Central Notifications Database</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

    </div>
  );
}
