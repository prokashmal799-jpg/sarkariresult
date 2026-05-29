import React, { useState } from "react";
import { Search, MapPin, Shield, Sparkles } from "lucide-react";
import { statesData } from "../data";

interface StateGatewayProps {
  onStateSelect: (stateName: string) => void;
}

const REGIONAL_GREETINGS = [
  { lang: "Hindi", text: "उत्तर प्रदेश, बिहार, दिल्ली और अन्य हिंदी राज्यों के सरकारी जॉब्स" },
  { lang: "Bengali", text: "পশ্চিমবঙ্গ ও উত্তর-পূর্বের সরকারি বিজ্ঞপ্তিসমূহ" },
  { lang: "Malayalam", text: "കേരള സർക്കാർ ജോലി അറിയിപ്പുകളും ഫലങ്ങളും" },
  { lang: "Tamil", text: "தமிழ்நாடு அரசுப் பணியாளர் வேலைவாய்ப்பு தகவல்கள்" },
  { lang: "Telugu", text: "ఆంధ్రప్రదేశ్ మరియు తెలంగాణ ప్రభుత్వ ఉద్యోగాలు" },
  { lang: "Kannada", text: "ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಉದ್ಯೋಗ ಮಾಹಿತಿ ಮತ್ತು ಫಲಿತಾಂಶಗಳು" },
  { lang: "Marathi", text: "महाराष्ट्र शासन नोकरी भरती आणि प्रवेशपत्रे" },
  { lang: "Gujarati", text: "ગુજરાત સરકારી ભરતી અને પરીક્ષા પરિણામો" },
  { lang: "Punjabi", text: "ਪੰਜਾਬ ਸਰਕਾਰੀ ਨੌਕਰੀਆਂ ਅਤੇ ਇਮਤਿਹਾਨ ਨਤੀਜੇ" },
  { lang: "Odia", text: "ଓଡ଼ିଶା ସରକାରୀ ଚାକିରି ଏବଂ ପରୀକ୍ଷା ଫଳାଫଳ" }
];

export function StateGateway({ onStateSelect }: StateGatewayProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedState, setDetectedState] = useState("");
  const [detectionError, setDetectionError] = useState("");

  const filteredStates = statesData.filter(st => 
    st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    st.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAutoDetect = () => {
    setIsDetecting(true);
    setDetectionError("");
    setDetectedState("");
    
    setTimeout(() => {
      // Pick a random state for geo simulation
      const mockStates = ["West Bengal", "Uttar Pradesh", "Bihar", "Delhi", "Maharashtra"];
      const randomStateName = mockStates[Math.floor(Math.random() * mockStates.length)];
      setDetectedState(randomStateName);
      setIsDetecting(false);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#031d44] to-[#04151f] flex flex-col justify-between py-10 px-4 select-none relative overflow-hidden text-white font-sans">
      
      {/* Decorative Rotating Mandala Pattern (Background) */}
      <div className="absolute right-[-10%] top-[-10%] w-[500px] h-[500px] rounded-full border border-white/[0.04] pointer-events-none flex items-center justify-center animate-[spin_120s_linear_infinite]">
        <div className="w-[440px] h-[440px] rounded-full border-2 border-dashed border-white/[0.02] flex items-center justify-center">
          <div className="w-40 h-40 rounded-full border border-double border-white/[0.03]" />
        </div>
      </div>
      <div className="absolute left-[-5%] bottom-[-5%] w-[380px] h-[380px] rounded-full bg-indigo-600/10 filter blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-5xl w-full mx-auto flex-1 flex flex-col justify-center items-center py-6 text-center z-13 relative">
        
        {/* Emblem Badge */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 font-sans text-[10px] font-black text-amber-300 uppercase tracking-[4px] bg-[#cc0000]/40 border-2 border-amber-400/40 px-4 py-1.5 rounded-full select-none shadow-xl">
            🇮🇳 Government Job Portal Gateway (Sarkari Index)
          </span>
        </div>

        {/* Big Displays Title */}
        <h1 className="font-baloo font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white leading-tight mb-2 drop-shadow-xl select-none">
          SarkariResult<span className="text-amber-400">.in</span>
        </h1>
        <p className="font-sans text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-medium mb-8 leading-relaxed">
          Select your local State or Union Territory below to enter your customized state portal. All notifications, exam results, and admit cards will be tailored instantly to your region's board.
        </p>

        {/* Sliding Regional Carousel Banner */}
        <div className="w-full max-w-xl bg-white/[0.03] border border-white/5 rounded-2xl p-3 px-5 mb-8 overflow-hidden relative shadow-inner">
          <div className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest text-center mb-1">
            ⚡ SUPPORTING REGIONAL LANGUAGES & SYSTEMS ⚡
          </div>
          <div className="h-6 overflow-hidden relative">
            <div className="animate-[vertical-scroll_30s_infinite_linear] space-y-2 text-center text-xs font-bold text-slate-200">
              {REGIONAL_GREETINGS.map((g, idx) => (
                <div key={idx} className="h-6 flex items-center justify-center gap-2">
                  <span className="bg-amber-400/20 text-amber-300 text-[9px] px-1.5 py-0.5 rounded uppercase">{g.lang}</span>
                  <span>{g.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search and Auto Detect Combined UI */}
        <div className="w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-800 border-t-4 border-[#cc0000] mb-8">
          
          <div className="flex flex-col sm:flex-row gap-4 items-center mb-5 border-b border-slate-100 pb-4">
            {/* Search inputs */}
            <div className="relative w-full flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search state name (e.g., West Bengal, Rajasthan...)"
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-[#003399] focus:ring-4 focus:ring-[#003399]/10 rounded-2xl p-3 pl-11 text-xs sm:text-sm text-slate-800 outline-none font-sans font-extrabold transition-all placeholder-slate-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold text-xs bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Simulated GeoIP detector */}
            <div className="shrink-0 w-full sm:w-auto">
              {!detectedState ? (
                <button
                  type="button"
                  onClick={handleAutoDetect}
                  disabled={isDetecting}
                  className="w-full bg-[#003399] hover:bg-[#002266] text-white text-xs font-black px-5 py-3.5 rounded-2xl transition-all shadow active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wide disabled:opacity-50 cursor-pointer h-[48px]"
                >
                  <MapPin className={`w-4 h-4 text-amber-400 ${isDetecting ? "animate-bounce" : ""}`} />
                  <span>{isDetecting ? "Detecting IP..." : "Auto-Detect My State"}</span>
                </button>
              ) : (
                <div className="p-1 px-3 bg-emerald-50 border-2 border-emerald-250 rounded-2xl flex items-center justify-between gap-2.5 h-[48px] animate-scale-up">
                  <div className="text-left leading-none">
                    <span className="text-[9px] text-emerald-600 block font-black uppercase tracking-wider">Detected Location</span>
                    <span className="text-xs text-slate-900 font-extrabold">{detectedState}</span>
                  </div>
                  <button
                    onClick={() => onStateSelect(detectedState)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Confirm & Enter
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Grid Selection Grid */}
          <div className="max-h-[340px] overflow-y-auto pr-1 select-none text-left custom-scroll">
            {filteredStates.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredStates.map((st) => (
                  <button
                    key={st.code}
                    onClick={() => onStateSelect(st.name)}
                    className="bg-slate-50 border-2 border-slate-200 hover:bg-[#cc0000] hover:border-amber-400 p-4 rounded-2xl text-left group transition-all duration-200 hover:scale-[1.03] hover:shadow-xl hover:shadow-[#cc0000]/10 flex flex-col justify-between cursor-pointer w-full h-[85px]"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-slate-400 font-sans text-[10px] font-black group-hover:text-amber-200 uppercase leading-none">
                        {st.code}
                      </span>
                      <span className="text-slate-300 group-hover:text-white shrink-0">➔</span>
                    </div>
                    <div className="mt-1 leading-tight">
                      <span className="text-slate-900 font-sans text-xs sm:text-xs font-black truncate group-hover:text-white block">
                        {st.name}
                      </span>
                      <span className="text-slate-400 text-[10px] font-bold mt-0.5 block group-hover:text-amber-300">
                        {st.jobsCount.toLocaleString()} Jobs Active
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <span className="text-3xl">🧩</span>
                <p className="text-xs text-slate-400 font-black uppercase tracking-widest mt-2 leading-none">State Not Verified</p>
                <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto">Please refine your keyword or search by major initials (e.g. DL, UP, WB)</p>
              </div>
            )}
          </div>

          {/* Federal Board Disclaimer Trust badge */}
          <div className="mt-5 border-t border-slate-100 pt-4 flex gap-2.5 items-center text-left text-[11px] text-slate-500 font-semibold leading-relaxed">
            <Shield className="w-5 h-5 text-[#cc0000] shrink-0" />
            <p>
              Your selection is saved securely in your local environment storage. You can change your state hub homepage at any time using the global header selection.
            </p>
          </div>

        </div>

        {/* Small quick popular links */}
        <div className="text-slate-400 text-xs font-bold space-y-2">
          <p>Frequently accessed divisions: {" "}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Uttar Pradesh", "Bihar", "Delhi", "West Bengal", "Rajasthan", "Maharashtra"].map(nm => (
              <button
                key={nm}
                onClick={() => onStateSelect(nm)}
                className="bg-white/5 hover:bg-[#cc0000] hover:text-white font-sans text-[11px] font-extrabold px-3 py-1.5 rounded-lg border border-white/10 hover:border-[#cc0000]/40 transition-colors cursor-pointer"
              >
                {nm}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Styled Footer for Compliance */}
      <footer className="w-full max-w-7xl mx-auto border-t border-white/5 pt-4 text-center text-[10px] text-slate-500 font-mono tracking-wider uppercase">
        © 2026 SarkariResult, Official Regional Distribution System. Under Article-309 state legislative notification protocols.
      </footer>
      
    </div>
  );
}
