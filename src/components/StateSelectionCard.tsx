import React, { useState } from "react";
import { Search, MapPin, Grid, Layers } from "lucide-react";
import { statesData } from "../data";
import { CultureThemeId, getTranslations } from "./CulturalThemer";

interface StateSelectionCardProps {
  onStateSelect: (stateName: string) => void;
  activeThemeId: CultureThemeId;
  selectedStateName?: string;
}

export function StateSelectionCard({ onStateSelect, activeThemeId, selectedStateName }: StateSelectionCardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const translations = getTranslations(activeThemeId);

  const baseStates = selectedStateName 
    ? statesData.filter(st => st.name.toLowerCase() === selectedStateName.toLowerCase())
    : statesData;

  const filteredStates = baseStates.filter(st => 
    st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    st.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-md overflow-hidden mb-8 select-none">
      
      {/* Header Container */}
      <div className="bg-slate-50/50 p-4.5 px-6 flex justify-between items-center border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="bg-amber-400/10 p-1.5 rounded-xl text-amber-600">
            <MapPin className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="text-slate-800 font-baloo font-bold text-sm sm:text-base tracking-wide uppercase leading-none">
            {selectedStateName ? `🔒 Locked Portal: ${selectedStateName}` : "Explore States Jobs (राज्य चुनें)"}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-full text-slate-500 font-sans text-[10.5px] font-bold">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <span>{filteredStates.length} Regions Grouped</span>
        </div>
      </div>

      {/* Modern Filter Input */}
      <div className="p-4 bg-white border-b border-slate-100">
        <div className="relative">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search state or region (e.g. West Bengal, Uttar Pradesh, Bihar...)"
            className="w-full bg-slate-50 border border-slate-200/90 focus:border-slate-400 focus:bg-white rounded-xl p-2.5 pl-10.5 text-xs text-slate-800 outline-none transition-all placeholder-slate-400 font-sans font-bold"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-[10px] font-black uppercase tracking-wider p-1 px-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Grid of States (Scrollable area) */}
      <div className="p-5 bg-white max-h-[300px] overflow-y-auto custom-scroll">
        {filteredStates.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {filteredStates.map((st) => (
              <div
                key={st.code}
                onClick={() => onStateSelect(st.name)}
                className="bg-slate-50 border border-slate-150/70 hover:border-slate-300 hover:bg-slate-900 text-center group cursor-pointer p-3 px-4.5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/40 relative overflow-hidden"
              >
                {/* Visual state code token */}
                <div className="text-red-650 font-baloo text-xs font-black group-hover:text-amber-300 leading-none uppercase mb-1">
                  {st.code}
                </div>
                <div className="text-slate-800 font-sans text-xs font-black truncate group-hover:text-white mb-1.5 leading-tight">
                  {st.name}
                </div>
                <div className="text-slate-450 font-sans text-[10px] group-hover:text-slate-300 font-bold leading-none">
                  {st.jobsCount.toLocaleString()} Jobs Available
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <span className="text-2xl filter drop-shadow">🔍</span>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">No matching state portals found</p>
            <p className="text-[10px] text-slate-400 mt-1 font-semibold">Verify search spelling or try searching generic keywords.</p>
          </div>
        )}
      </div>

    </div>
  );
}
