import React, { useState, useEffect } from "react";
import { Search, Bell, Shield, Landmark, Map, Zap, Check, MapPin, Globe, Sparkles } from "lucide-react";
import { CultureThemeId, CULTURE_THEMES, getTheme } from "./CulturalThemer";

interface HeaderProps {
  onSearchFocus: () => void;
  onAlertsSubscribe: () => void;
  onNavigateHome: () => void;
  isAdminMode: boolean;
  onToggleAdmin: () => void;
  activeThemeId: CultureThemeId;
  onChangeTheme: (theme: CultureThemeId) => void;
  selectedStateName?: string;
  onStateSelect?: (stateName: string) => void;
  selectedLanguage?: string;
  onChangeLanguage?: (langId: string) => void;
}

export function Header({ 
  onSearchFocus, 
  onAlertsSubscribe, 
  onNavigateHome, 
  isAdminMode, 
  onToggleAdmin,
  activeThemeId,
  onChangeTheme,
  selectedStateName,
  onStateSelect,
  selectedLanguage = "en",
  onChangeLanguage
}: HeaderProps) {
  const [activeJobs, setActiveJobs] = useState(0);
  const [categories, setCategories] = useState(0);
  const [states, setStates] = useState(0);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionMessage, setDetectionMessage] = useState("");

  const currentTheme = getTheme(activeThemeId);

  useEffect(() => {
    // Elegant incremental counter animation on load
    const countTo = (target: number, setter: React.Dispatch<React.SetStateAction<number>>, duration = 1200) => {
      const start = 0;
      const stepTime = Math.max(Math.floor(duration / target), 10);
      let current = start;
      const timer = setInterval(() => {
        const increment = Math.ceil((target - current) / 10);
        current += increment;
        if (current >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(current);
        }
      }, stepTime);
    };

    countTo(1240, setActiveJobs);
    countTo(44, setCategories);
    countTo(37, setStates);
  }, []);

  // Simulate an absolute state detection with cultural warmth
  const handleAutoDetect = () => {
    setIsDetecting(true);
    setDetectionMessage("Detecting digital node routing...");
    
    // Staggered status messages
    setTimeout(() => {
      setDetectionMessage("Reading candidate timezone context...");
    }, 600);

    const demoStates = [
      { id: "WB", name: "West Bengal" },
      { id: "KL", name: "Kerala" },
      { id: "DL", name: "Delhi" },
      { id: "MH", name: "Maharashtra" },
      { id: "UP", name: "Uttar Pradesh" },
      { id: "RJ", name: "Rajasthan" },
      { id: "TN", name: "Tamil Nadu" }
    ];
    const picked = demoStates[Math.floor(Math.random() * demoStates.length)];

    setTimeout(() => {
      setDetectionMessage(`Geo-IP localized! Gateway matches ${picked.name} circle.`);
    }, 1200);

    setTimeout(() => {
      if (onStateSelect) {
        onStateSelect(picked.name);
      } else {
        onChangeTheme(picked.id as CultureThemeId);
      }
      setIsDetecting(false);
      setDetectionMessage("");
      setShowThemeDropdown(false);
      setShowStateDropdown(false);
    }, 2000);
  };

  return (
    <header className={`${currentTheme.bgGradient} border-b-4 ${currentTheme.accentBorder} h-20 shrink-0 sticky top-0 z-50 shadow-xl flex items-center justify-between px-4 sm:px-6 transition-all duration-300`}>
      {/* Brand Identity */}
      <div 
        className="flex items-center gap-3 cursor-pointer group select-none" 
        onClick={onNavigateHome}
      >
        <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-lg font-baloo font-black text-[#cc0000] text-3xl rotate-3 group-hover:rotate-6 transition-transform duration-200">
          {currentTheme.icon}
        </div>
        <div>
          <h1 className="font-baloo font-bold text-[24px] sm:text-[28px] text-white leading-none tracking-tight flex items-center">
            SarkariResult<span className="text-amber-300">.in</span>
          </h1>
          <p className="font-sans text-[10px] sm:text-[11px] text-white/95 tracking-wider font-bold">
            {currentTheme.localGreeting}
          </p>
        </div>
      </div>

      {/* Cultural Theme / State Dropdown Activator Custom Selector */}
      <div className="relative select-none flex items-center gap-2">
        {selectedStateName ? (
          <>
            <button
              onClick={() => {
                setShowStateDropdown(!showStateDropdown);
                setShowThemeDropdown(false);
              }}
              className="bg-amber-400 hover:bg-amber-300 border-2 border-amber-300 hover:border-amber-400 text-slate-900 rounded-2xl px-3.5 py-1.5 flex items-center gap-1.5 text-xs font-black tracking-wide shadow-md cursor-pointer h-10 transition-all duration-200"
            >
              <span>{currentTheme.icon}</span>
              <span>Current State: {selectedStateName} ▼</span>
            </button>

            {showStateDropdown && (
              <div className="absolute top-12 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:right-0 sm:left-auto mt-2 w-72 bg-white rounded-3xl border-2 border-slate-200 shadow-2xl p-4.5 space-y-3 z-[60] text-slate-800 animate-fade-in animate-duration-150">
                <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">Quick State Switcher</span>
                  <button 
                    onClick={() => {
                      if (onStateSelect) onStateSelect("Central Govt (All-India)");
                      setShowStateDropdown(false);
                    }}
                    className="text-[10px] bg-[#cc0000] text-white px-2 py-0.5 rounded font-black uppercase hover:bg-rose-750"
                  >
                    Reset (All India)
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-left">
                  {[
                    { name: "West Bengal", id: "WB" },
                    { name: "Bihar", id: "BR" },
                    { name: "Uttar Pradesh", id: "UP" },
                    { name: "Maharashtra", id: "MH" },
                    { name: "Tamil Nadu", id: "TN" },
                    { name: "Kerala", id: "KL" },
                    { name: "Punjab", id: "PB" },
                    { name: "Rajasthan", id: "RJ" }
                  ].map((st) => {
                    const isSelected = selectedStateName === st.name;
                    return (
                      <button
                        key={st.name}
                        onClick={() => {
                          if (onStateSelect) onStateSelect(st.name);
                          setShowStateDropdown(false);
                        }}
                        className={`p-2 px-2.5 text-[11px] font-bold rounded-xl border transition-all text-left truncate flex items-center justify-between ${
                          isSelected 
                            ? "bg-slate-50 border-red-650 text-slate-900 font-extrabold" 
                            : "bg-white border-slate-200 hover:bg-amber-100/35 text-slate-750"
                        }`}
                      >
                        <span>{st.name}</span>
                        {isSelected && <Check className="w-3 h-3 text-red-650 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Manual Language Selector Integration */}
                <div className="border-t border-slate-100 pt-3">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-1.5">Change Language</span>
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    {[
                      { id: "bn", name: "বাংলা" },
                      { id: "hi", name: "हिन्दी" },
                      { id: "ta", name: "தமிழ்" },
                      { id: "te", name: "తెలుగు" },
                      { id: "mr", name: "मराठी" },
                      { id: "en", name: "English" }
                    ].map((lg) => {
                      const isCurrentLang = selectedLanguage === lg.id;
                      return (
                        <button
                          key={lg.id}
                          onClick={() => {
                            if (onChangeLanguage) onChangeLanguage(lg.id);
                          }}
                          className={`p-1.5 rounded-lg text-[10.5px] font-black transition-all cursor-pointer ${
                            isCurrentLang 
                              ? "bg-rose-600 text-white border border-[#cc0000]" 
                              : "bg-slate-50 hover:bg-slate-100 text-slate-650 border border-slate-150"
                          }`}
                        >
                          {lg.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* IP Auto Detect fallback option */}
                <div className="border-t border-slate-100 pt-2 text-center">
                  {isDetecting ? (
                    <span className="text-[10px] font-mono text-slate-400 block animate-pulse">
                      {detectionMessage}
                    </span>
                  ) : (
                    <button 
                      onClick={handleAutoDetect}
                      className="w-full text-[9.5px] font-black uppercase tracking-wider text-blue-600 hover:text-blue-800"
                    >
                      ⚡ Recalculate geo-IP coordinates
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <button
              onClick={() => setShowThemeDropdown(!showThemeDropdown)}
              className="bg-white/10 hover:bg-white/15 border-2 border-white/20 hover:border-white/40 text-white rounded-2xl px-3 py-1.5 flex items-center gap-2 text-xs font-black tracking-wide transition-all shadow-md cursor-pointer h-10"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
              <span className="hidden sm:inline">Theme:</span>
              <span>{currentTheme.icon} {currentTheme.name.split(" ")[0]}</span>
              <span className="text-[9px] bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded-md leading-none font-bold uppercase shrink-0">Live</span>
            </button>

            {showThemeDropdown && (
              <div className="absolute top-12 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:right-0 sm:left-auto mt-2 w-72 bg-white rounded-3xl border-2 border-slate-200 shadow-2xl p-4.5 space-y-3 z-[60] text-slate-800 animate-fade-in animate-duration-150">
                <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block font-sans">Choose State Culture (37+ Regions/UTs)</span>
                  <button 
                    onClick={() => setShowThemeDropdown(false)}
                    className="text-slate-400 hover:text-slate-600 font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex flex-col gap-1.5 overflow-y-auto max-h-60 pr-1 select-none">
                  {(Object.keys(CULTURE_THEMES) as CultureThemeId[]).map((themeId) => {
                    const item = CULTURE_THEMES[themeId];
                    const isSelected = activeThemeId === themeId;
                    return (
                      <button
                        key={themeId}
                        onClick={() => {
                          onChangeTheme(themeId);
                          setShowThemeDropdown(false);
                        }}
                        className={`text-left p-2 px-3 rounded-2xl flex items-center justify-between border-2 transition-all cursor-pointer ${
                          isSelected 
                            ? "bg-slate-50 border-red-650 text-slate-900 font-extrabold" 
                            : "bg-white border-transparent hover:bg-rose-50/35 hover:border-slate-100 text-slate-600 font-bold"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{item.icon}</span>
                          <div className="flex flex-col leading-none">
                            <span className="text-xs">{item.name}</span>
                            <span className="text-[9.5px] text-slate-400 mt-0.5 leading-none">{item.nameHindi}</span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-red-650 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Simulated Geo-IP Auto Detection Trigger */}
                <div className="border-t border-slate-100 pt-3 text-center">
                  {isDetecting ? (
                    <div className="p-3 bg-rose-50/50 border-2 border-dashed border-rose-200 rounded-2xl space-y-2">
                      <div className="w-4.5 h-4.5 border-2 border-[#cc0000] border-t-transparent rounded-full animate-spin mx-auto" />
                      <span className="text-[10.5px] text-slate-500 font-mono tracking-tight block leading-snug animate-pulse">
                        {detectionMessage}
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={handleAutoDetect}
                      className="w-full bg-[#cc0000] hover:bg-rose-750 text-white font-sans text-xs font-black py-2.5 px-3 rounded-2xl hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 uppercase tracking-wide cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 animate-bounce" />
                      <span>Auto-Detect My State IP</span>
                    </button>
                  )}
                  <p className="text-[9.5px] text-slate-405 mt-2 font-medium leading-tight">
                    Instantly localizes colors, language greetings, and unique digital heritage of your region!
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Counters Indicators */}
      <div className="hidden lg:flex items-center gap-4">
        <div className="bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-center flex items-center gap-2.5">
          <Landmark className="w-4 h-4 text-amber-300" />
          <div className="text-left">
            <span className="block text-amber-300 font-baloo text-base font-bold leading-none">
              {activeJobs.toLocaleString()}+
            </span>
            <span className="block text-[9px] text-white/80 uppercase tracking-widest leading-none mt-0.5">Active Jobs</span>
          </div>
        </div>

        <div className="bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-center flex items-center gap-2.5">
          <Zap className="w-4 h-4 text-amber-300" />
          <div className="text-left">
            <span className="block text-amber-300 font-baloo text-base font-bold leading-none">
              {categories}+
            </span>
            <span className="block text-[9px] text-white/80 uppercase tracking-widest leading-none mt-0.5">Sectors</span>
          </div>
        </div>

        <div className="bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-center flex items-center gap-2.5">
          <Map className="w-4 h-4 text-amber-300" />
          <div className="text-left">
            <span className="block text-amber-300 font-baloo text-base font-bold leading-none">
              {states}
            </span>
            <span className="block text-[9px] text-white/80 uppercase tracking-widest leading-none mt-0.5">Indian States</span>
          </div>
        </div>
      </div>

      {/* Primary Action Suite */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Toggle to Admin Panel Switch — Hidden from standard public view, only visible when URL parameters activate Admin Mode */}
        {isAdminMode && (
          <button 
            onClick={onToggleAdmin}
            className="flex items-center gap-1.5 bg-[#003399] border hover:bg-white hover:text-[#003399] border-white/25 text-white px-3 sm:px-4 py-1.5 rounded-lg text-xs font-black tracking-wide transition-all duration-200 active:scale-95 shadow-md"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Exit Admin Mode</span>
          </button>
        )}

        {/* Search */}
        <button 
          onClick={onSearchFocus}
          className="text-white hover:text-amber-300 p-2 hover:bg-white/5 rounded-lg transition-colors duration-150"
          title="Search Portal"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Alerts Subscription */}
        <button 
          onClick={onAlertsSubscribe}
          className="group flex items-center gap-1.5 border border-white/40 text-white hover:bg-white hover:text-[#cc0000] px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 active:scale-95"
        >
          <Bell className="w-3.5 h-3.5 group-hover:animate-bounce" />
          <span>Get Alerts</span>
        </button>

      </div>
    </header>
  );
}
