import React, { useState } from "react";
import { Search, Sparkles, Trophy, MapPin, Users, CalendarCheck, Zap } from "lucide-react";
import { CultureThemeId, getTheme, getTranslations } from "./CulturalThemer";

interface HeroSectionProps {
  onSearch: (query: string) => void;
  onTagSelected: (tag: string) => void;
  activeJobsCount: number;
  activeThemeId: CultureThemeId;
  selectedStateName?: string;
  onChangeState?: () => void;
}

export function HeroSection({ 
  onSearch, 
  onTagSelected, 
  activeJobsCount, 
  activeThemeId,
  selectedStateName,
  onChangeState
}: HeroSectionProps) {
  const [val, setVal] = useState("");

  const currentTheme = getTheme(activeThemeId);
  const translations = getTranslations(activeThemeId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(val);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <section className="relative bg-slate-950 text-white py-16 px-4 overflow-hidden border-b border-slate-800">
      {/* Premium Spotlights & Mesh Glow Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Soft radial atmospheric ambient lights representing Indian state colors safely */}
        <div className="absolute -top-32 left-[10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-20 right-[15%] w-[450px] h-[450px] bg-red-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[5%] w-[350px] h-[350px] bg-emerald-600/5 rounded-full blur-[100px]" />
        
        {/* Minimal Grid overlay with modern lines */}
        <div 
          className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "24px 24px"
          }}
        />
      </div>

      {/* Cultural Heritage Subtle Floating Watermark */}
      <div className="absolute right-4 top-4 md:right-12 md:top-8 z-0 pointer-events-none select-none opacity-[0.12] transition-opacity duration-300">
        {currentTheme.heritageMotif === "rotating-ashoka" && (
          <div className="w-[300px] h-[300px] border-[6px] border-white/20 rounded-full flex items-center justify-center animate-[spin_160s_linear_infinite]">
            <div className="w-[280px] h-[280px] border border-dashed border-white/30 flex items-center justify-center">
              {Array.from({ length: 12 }).map((_, i) => (
                <div 
                  key={i} 
                  className="absolute w-0.5 h-full bg-white/20" 
                  style={{ transform: `rotate(${i * 30}deg)` }}
                />
              ))}
            </div>
          </div>
        )}
        
        {currentTheme.heritageMotif === "alpana" && (
          <div className="w-[285px] h-[285px] border-4 border-double border-amber-300/30 rounded-full flex items-center justify-center animate-[spin_200s_linear_infinite] relative">
            {Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={i} 
                className="absolute w-5 h-10 border border-amber-300/20 rounded-full" 
                style={{ transform: `rotate(${i * 45}deg) translateY(-60px)` }}
              />
            ))}
            <div className="w-16 h-16 rounded-full border border-amber-300/30 flex items-center justify-center">
              <span className="text-xl">🌾</span>
            </div>
          </div>
        )}

        {currentTheme.heritageMotif === "kathakali" && (
          <div className="w-[280px] h-[280px] border-2 border-emerald-400/20 rounded-full flex items-center justify-center animate-[spin_100s_linear_infinite] relative">
            {Array.from({ length: 6 }).map((_, i) => (
              <div 
                key={i} 
                className="absolute w-6 h-6 bg-emerald-400/10 rounded-lg" 
                style={{ transform: `rotate(${i * 60}deg) translateY(-80px)` }}
              />
            ))}
            <span className="text-2xl">🌴</span>
          </div>
        )}

        {currentTheme.heritageMotif === "india-gate" && (
          <div className="w-[290px] h-[290px] border border-indigo-400/20 rounded-full flex items-center justify-center relative animate-[spin_180s_linear_infinite]">
            <div className="w-12 h-20 border border-orange-400/30 rounded-t-full absolute transform -translate-y-4" />
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Upper Level Badging and Switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6.5">
          <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/10 px-3.5 py-1.5 rounded-full select-none shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-sans text-[10.5px] font-extrabold uppercase tracking-[2px] text-slate-350">
              {currentTheme.bannerText}
            </span>
          </div>

          {onChangeState && (
            <button
              onClick={onChangeState}
              type="button"
              className="bg-white/5 hover:bg-red-600/90 border border-white/10 text-white font-sans text-[9.5px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-sm hover:border-red-650"
              title="Switch State / রাজ্য বদলান"
            >
              <Zap className="w-3 h-3 text-amber-300" />
              <span>Switch State Portal</span>
            </button>
          )}
        </div>

        {/* Brand Main Slogan Heading */}
        <h2 className="font-baloo font-black text-4xl sm:text-6xl text-white leading-[1.1] mb-5 tracking-tight">
          Explore Your <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 bg-clip-text text-transparent px-1 drop-shadow-sm font-extrabold">Sarkari Careers</span>
        </h2>

        {/* State Greetings subheader */}
        <div className="max-w-2xl mx-auto mb-8 text-center bg-white/[0.02] border border-white/[0.05] p-3 px-5 rounded-2xl backdrop-blur-md">
          <p className="font-sans text-xs text-amber-300 font-extrabold tracking-widest uppercase mb-1">
            ✨ {currentTheme.englishGreeting} • {currentTheme.nameHindi} ✨
          </p>
          <p className="font-sans text-xs sm:text-sm text-slate-300 font-semibold leading-relaxed">
            {currentTheme.culturalDescription}
          </p>
        </div>

        {/* Modern Minimalistic Premium Glassmorphic Search Bar */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-6 relative group">
          <div className="relative flex items-center justify-between bg-white/[0.03] border border-white/10 hover:border-amber-300/60 focus-within:border-amber-300 focus-within:ring-2 focus-within:ring-amber-300/25 rounded-2xl h-[58px] pl-4 pr-1.5 shadow-xl transition-all duration-300">
            <Search className="w-5 h-5 text-slate-450 shrink-0 group-focus-within:text-amber-300 transition-colors" />
            <input
              type="text"
              value={val}
              onChange={handleInputChange}
              className="w-full h-full bg-transparent border-none outline-none text-white placeholder-slate-450 font-sans text-sm sm:text-base px-3.5 focus:ring-0 focus:outline-none"
              placeholder={translations.searchPlaceholder}
            />
            <button
              type="submit"
              className="bg-amber-400 text-slate-950 h-11 px-6 rounded-xl font-black font-sans text-xs sm:text-sm hover:bg-amber-300 transition-all active:scale-95 shrink-0 flex items-center gap-2"
            >
              <Search className="w-4.5 h-4.5" />
              <span>{translations.searchButton}</span>
            </button>
          </div>
        </form>

        {/* Aesthetic Hot Keywords Tags */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10 max-w-xl mx-auto">
          <span className="text-slate-450 text-[10px] sm:text-[11px] font-black uppercase tracking-wider select-none pr-1">POPULAR FILTERS:</span>
          {["Banking", "Railway", "Police", "Teaching", "UPSC", "SSC"].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setVal(tag);
                onTagSelected(tag);
              }}
              type="button"
              className="bg-white/[0.04] border border-white/10 hover:bg-red-600 hover:text-white hover:border-red-650 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-200 tracking-wide cursor-pointer transition-all active:scale-95 shadow-sm"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Premium Bento Stats Strip (Only displayed on general view) */}
        {!selectedStateName && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            
            <div className="bg-white/[0.012] border border-white/[0.06] rounded-2xl p-4 backdrop-blur-md shadow-sm hover:bg-white/[0.03] hover:border-amber-300/40 transition-all duration-300 group/bento flex items-center gap-3.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-orange-600/15 flex items-center justify-center text-xl shrink-0 group-hover/bento:scale-110 transition-transform">
                📋
              </div>
              <div>
                <span className="block text-amber-300 font-baloo text-lg sm:text-xl font-bold leading-none">{activeJobsCount.toLocaleString()}+</span>
                <span className="block text-[9.5px] font-sans font-bold text-slate-400 uppercase tracking-wider mt-1.5">Active Jobs</span>
              </div>
            </div>

            <div className="bg-white/[0.012] border border-white/[0.06] rounded-2xl p-4 backdrop-blur-md shadow-sm hover:bg-white/[0.03] hover:border-amber-300/40 transition-all duration-300 group/bento flex items-center gap-3.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/15 flex items-center justify-center text-xl shrink-0 group-hover/bento:scale-110 transition-transform">
                🗺️
              </div>
              <div>
                <span className="block text-amber-300 font-baloo text-lg sm:text-xl font-bold leading-none">37 States</span>
                <span className="block text-[9.5px] font-sans font-bold text-slate-400 uppercase tracking-wider mt-1.5">Regions Map</span>
              </div>
            </div>

            <div className="bg-white/[0.012] border border-white/[0.06] rounded-2xl p-4 backdrop-blur-md shadow-sm hover:bg-white/[0.03] hover:border-amber-300/40 transition-all duration-300 group/bento flex items-center gap-3.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/15 flex items-center justify-center text-xl shrink-0 group-hover/bento:scale-110 transition-transform">
                👥
              </div>
              <div>
                <span className="block text-amber-300 font-baloo text-lg sm:text-xl font-bold leading-none">50 Lakh+</span>
                <span className="block text-[9.5px] font-sans font-bold text-slate-400 uppercase tracking-wider mt-1.5">Candidates</span>
              </div>
            </div>

            <div className="bg-white/[0.012] border border-white/[0.06] rounded-2xl p-4 backdrop-blur-md shadow-sm hover:bg-white/[0.03] hover:border-amber-300/40 transition-all duration-300 group/bento flex items-center gap-3.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-rose-600/15 flex items-center justify-center text-xl shrink-0 group-hover/bento:scale-110 transition-transform">
                🏆
              </div>
              <div>
                <span className="block text-amber-300 font-baloo text-lg sm:text-xl font-bold leading-none">10 Years</span>
                <span className="block text-[9.5px] font-sans font-bold text-slate-400 uppercase tracking-wider mt-1.5">Audited Trust</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
