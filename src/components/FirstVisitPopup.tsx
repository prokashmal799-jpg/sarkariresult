import React, { useState, useEffect } from "react";
import { MapPin, Check, Globe, HelpCircle, Sparkles, Navigation2 } from "lucide-react";
import { statesData } from "../data";

interface FirstVisitPopupProps {
  onSelectState: (stateName: string, langId: string) => void;
  isOpen: boolean;
}

const POPULAR_STATES = [
  { name: "West Bengal", lang: "bn", langName: "বাংলা (Bengali)", flag: "📍", nativeName: "পশ্চিমবঙ্গ" },
  { name: "Bihar", lang: "hi", langName: "हिन्दी (Hindi)", flag: "📍", nativeName: "बिहार" },
  { name: "Uttar Pradesh", lang: "hi", langName: "हिन्दी (Hindi)", flag: "📍", nativeName: "उत्तर प्रदेश" },
  { name: "Maharashtra", lang: "mr", langName: "मराठी (Marathi)", flag: "📍", nativeName: "महाराष्ट्र" },
  { name: "Tamil Nadu", lang: "ta", langName: "தமிழ் (Tamil)", flag: "📍", nativeName: "தமிழ்நாடு" },
  { name: "Delhi", lang: "hi", langName: "हिन्दी (Hindi)", flag: "📍", nativeName: "दिल्ली" },
  { name: "Kerala", lang: "kl", langName: "മലയാളം (Malayalam)", flag: "📍", nativeName: "കേരളം" },
  { name: "Andhra Pradesh", lang: "te", langName: "తెలుగు (Telugu)", flag: "📍", nativeName: "ఆంధ్రప్రదేశ్" },
  { name: "Karnataka", lang: "ka", langName: "ಕನ್ನಡ (Kannada)", flag: "📍", nativeName: "ಕರ್ನಾಟಕ" },
  { name: "Punjab", lang: "pb", langName: "ਪੰਜਾਬੀ (Punjabi)", flag: "📍", nativeName: "ਪੰਜਾਬ" },
  { name: "Rajasthan", lang: "hi", langName: "हिन्दी (Hindi)", flag: "📍", nativeName: "राजस्थान" }
];

export function FirstVisitPopup({ onSelectState, isOpen }: FirstVisitPopupProps) {
  const [selectedState, setSelectedState] = useState("West Bengal");
  const [selectedLanguage, setSelectedLanguage] = useState("bn");
  const [detectedLanguageName, setDetectedLanguageName] = useState("English (US)");
  const [showAllStates, setShowAllStates] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Detect browser language and pair with state and manual layout trigger
    const browserLang = (navigator.language || "").toLowerCase();
    let autoLang = "en";
    let autoLangText = "English (Global)";
    let autoState = "West Bengal";

    if (browserLang.startsWith("bn")) {
      autoLang = "bn";
      autoLangText = "বাংলা (Bengali)";
      autoState = "West Bengal";
    } else if (browserLang.startsWith("hi")) {
      autoLang = "hi";
      autoLangText = "हिन्दी (Hindi)";
      autoState = "Uttar Pradesh";
    } else if (browserLang.startsWith("ta")) {
      autoLang = "ta";
      autoLangText = "தமிழ் (Tamil)";
      autoState = "Tamil Nadu";
    } else if (browserLang.startsWith("te")) {
      autoLang = "te";
      autoLangText = "తెలుగు (Telugu)";
      autoState = "Andhra Pradesh";
    } else if (browserLang.startsWith("mr")) {
      autoLang = "mr";
      autoLangText = "मराठी (Marathi)";
      autoState = "Maharashtra";
    }

    setDetectedLanguageName(autoLangText);
    setSelectedLanguage(autoLang);
    setSelectedState(autoState);
  }, []);

  if (!isOpen) return null;

  // Sync Language when state selection changes automatically
  const handleStateChoice = (stateName: string, stateLang: string) => {
    setSelectedState(stateName);
    setSelectedLanguage(stateLang);
  };

  const handleContinue = () => {
    onSelectState(selectedState, selectedLanguage);
  };

  const handleAllIndiaSelection = () => {
    onSelectState("Central Govt (All-India)", "en");
  };

  // List of states that aren't in popular states list but are inside datastructure
  const filteredAllStates = statesData.filter(st => {
    const isPopular = POPULAR_STATES.some(p => p.name === st.name);
    const matchesSearch = st.name.toLowerCase().includes(searchTerm.toLowerCase());
    return !isPopular && matchesSearch;
  });

  return (
    <div id="first-visit-popup-modal" className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 select-none overflow-y-auto">
      
      {/* Container Card */}
      <div className="bg-white rounded-3xl max-w-2xl w-full border-t-8 border-saffron shadow-2xl p-6 sm:p-8 space-y-6 flex flex-col justify-between max-h-[90vh] overflow-y-auto animate-scale-up">
        
        {/* Flag Icon Header */}
        <div className="text-center space-y-2 border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-1 bg-[#cc0000]/10 border border-[#cc0000]/25 rounded-full px-4 py-1.5 text-xs text-[#cc0000] font-black tracking-widest uppercase">
            <span>🇮🇳</span>
            <span>Sarkari Result National Index</span>
            <span>🇮🇳</span>
          </div>
          <h2 className="font-baloo font-extrabold text-2xl sm:text-3.5xl text-slate-900 tracking-tight flex items-center justify-center gap-2">
            <span>Select Your State / রাজ্য নির্বাচন করুন</span>
          </h2>
          <p className="text-xs text-slate-500 font-semibold max-w-md mx-auto leading-relaxed">
            Personalize your notification dashboard instantly! We will display real-time state exams, scholarship timelines, apprenticeships, and localized schemes in your selected native language.
          </p>
        </div>

        {/* Language auto-detect banner */}
        <div className="bg-blue-50/55 border border-blue-200/50 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600 animate-spin-slow" />
            <div className="text-left">
              <span className="text-slate-400 font-bold block uppercase text-[9.5px]">Auto Detection Matched</span>
              <span className="text-slate-800 font-extrabold text-xs">System language matched to: <span className="text-blue-700">{detectedLanguageName}</span></span>
            </div>
          </div>
          
          {/* Manual language toggle override */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {[
              { id: "bn", name: "বাংলা" },
              { id: "hi", name: "हिन्दी" },
              { id: "ta", name: "தமிழ்" },
              { id: "te", name: "తెలుగు" },
              { id: "mr", name: "मराठी" },
              { id: "en", name: "English" }
            ].map(lang => (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id)}
                className={`text-[10px] font-black px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedLanguage === lang.id 
                    ? "bg-blue-600 text-white shadow-sm" 
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* States Selection Grid */}
        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest text-left block">Popular Job Hub Circles</span>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {POPULAR_STATES.map((pState) => {
              const isSelected = selectedState === pState.name;
              return (
                <button
                  key={pState.name}
                  type="button"
                  onClick={() => handleStateChoice(pState.name, pState.lang)}
                  className={`relative p-3.5 rounded-2xl border-2 text-left flex flex-col justify-between transition-all active:scale-95 cursor-pointer h-[75px] ${
                    isSelected 
                      ? "bg-rose-50/20 border-red-650 ring-2 ring-red-650/10 text-slate-950 font-black" 
                      : "bg-slate-50/50 border-slate-200 hover:bg-white hover:border-slate-350 text-slate-700 font-bold"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs truncate">{pState.name}</span>
                    <span className="text-sm shrink-0">{pState.flag}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[10px] leading-none">
                    <span className="text-slate-405 font-medium">{pState.nativeName}</span>
                    <span className={`text-[8.5px] px-1 rounded uppercase font-black tracking-wide ${isSelected ? "text-red-700 bg-red-50" : "text-slate-400 hidden sm:inline"}`}>{pState.lang === "bn" ? "বাংলা" : pState.lang === "ta" ? "தமிழ்" : "REGIONAL"}</span>
                  </div>
                  {isSelected && (
                    <div className="absolute right-2.5 top-2.5 w-4 h-4 rounded-full bg-red-650 flex items-center justify-center text-white scale-90">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </button>
              );
            })}
            
            {/* All India Portal Custom Reset selection box */}
            <button
              onClick={handleAllIndiaSelection}
              className="p-3.5 bg-slate-900 border-2 border-amber-400 hover:border-amber-300 rounded-2xl text-left flex flex-col justify-between cursor-pointer w-full text-white h-[75px] hover:scale-103 transition-transform"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-black text-amber-300 truncate">All India Careers</span>
                <span className="text-sm shrink-0">🇮🇳</span>
              </div>
              <span className="text-[9px] text-slate-300 uppercase leading-none font-bold">Central / National Portal</span>
            </button>
          </div>

          <div className="pt-2">
            {!showAllStates ? (
              <button
                type="button"
                onClick={() => setShowAllStates(true)}
                className="text-xs text-[#cc0000] hover:text-[#990000] font-black underline"
              >
                Show all 37 States & UTs options...
              </button>
            ) : (
              <div className="space-y-3 pt-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Search UTs & Secondary States</span>
                  <button onClick={() => setShowAllStates(false)} className="text-[10px] text-slate-400 font-bold hover:text-slate-600">Hide list ✕</button>
                </div>
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Type state name... (e.g., Rajasthan, Assam)"
                  className="w-full bg-white border border-slate-200 focus:border-[#cc0000] p-2 px-3 rounded-xl text-xs sm:text-xs font-semibold outline-none"
                />
                
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {filteredAllStates.map(st => (
                    <button
                      key={st.code}
                      onClick={() => handleStateChoice(st.name, "hi")}
                      className={`text-left p-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-between transition-all ${
                        selectedState === st.name 
                          ? "bg-[#cc0000] text-white border-transparent" 
                          : "bg-white border-slate-200 hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <span>{st.name}</span>
                      <span className="text-[9px] text-slate-400">{st.code}</span>
                    </button>
                  ))}
                  {filteredAllStates.length === 0 && searchTerm && (
                    <span className="col-span-2 text-slate-400 text-[10px] text-center font-bold">No secondary state matched your search</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Foot Buttons and Proceed Actions */}
        <div className="border-t border-slate-100 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left font-sans text-[10.5px] text-slate-500 font-bold flex items-center gap-1.5 leading-snug">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Selection saves instantly into local storage and configures appropriate URL headers for simulated routing.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleContinue}
              className="flex-1 sm:flex-initial bg-[#cc0000] hover:bg-[#a30000] text-white font-sans text-xs font-black py-3 px-8 rounded-2xl hover:shadow-lg transition-all active:scale-95 uppercase tracking-wide cursor-pointer flex items-center justify-center gap-2"
            >
              <Navigation2 className="w-3.5 h-3.5 rotate-90" />
              <span>Continue</span>
            </button>
          </div>
        </div>

      </div>
      
    </div>
  );
}
