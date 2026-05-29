import React, { useState } from "react";
import { Menu, X, ChevronDown, Landmark, Train, ShieldAlert, Scale, FileCheck, BookOpen, HeartPulse, Cpu, Mail, Award, Atom, Briefcase } from "lucide-react";
import { statesData } from "../data";

interface NavbarProps {
  onNavigateHome: () => void;
  onStateSelect: (stateName: string) => void;
  onFilterByCategory: (categoryId: string) => void;
  onAdmitCardsClick: () => void;
  onResultsClick: () => void;
  selectedStateName?: string;
}

export function Navbar({ 
  onNavigateHome, 
  onStateSelect, 
  onFilterByCategory, 
  onAdmitCardsClick, 
  onResultsClick,
  selectedStateName
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");

  const activeStatesList = selectedStateName
    ? statesData.filter(st => st.name.toLowerCase() === selectedStateName.toLowerCase())
    : statesData;

  const categoriesDropdown = [
    { name: "🏦 Banking & Finance", id: "cat-banking" },
    { name: "🚂 Railway Jobs", id: "cat-railway" },
    { name: "🛡️ Defence & Police", id: "cat-defence" },
    { name: "🏛️ UPSC Civil Services", id: "cat-upsc" },
    { name: "📋 SSC Jobs", id: "cat-ssc" },
    { name: "📚 Teaching Bharti", id: "cat-teaching" },
    { name: "🏥 Medical & Health", id: "cat-medical" },
    { name: "💻 IT & Technical", id: "cat-it-tech" },
    { name: "📮 India Post Office", id: "cat-post" },
    { name: "⚖️ Judiciary Services", id: "cat-judiciary" },
    { name: "🔬 Research & Science", id: "cat-research" },
    { name: "🏭 PSU Recruitment", id: "cat-psu" }
  ];

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    if (tabName === "Home") {
      onNavigateHome();
    }
  };

  return (
    <nav className="bg-saffron h-11 shrink-0 sticky top-20 z-40 border-t border-saffron-600 flex items-center justify-between px-4 sm:px-6 shadow-md shadow-black/10">
      {/* Desktop Links Grid */}
      <div className="hidden md:flex items-center gap-1 h-full select-none">
        {/* Home */}
        <button
          onClick={() => handleTabClick("Home")}
          className={`px-4 h-full flex items-center gap-1.5 text-xs tracking-wider font-bold uppercase transition-colors ${
            activeTab === "Home" 
              ? "bg-navy-950 text-white border-b-2 border-white" 
              : "text-white hover:bg-white/10"
          }`}
        >
          <span>🏠</span> Home
        </button>

        {/* Central Jobs Dropdown */}
        <div className="relative group h-full">
          <button
            onClick={() => setActiveTab("Central")}
            className={`px-4 h-full flex items-center gap-1 text-xs tracking-wider font-bold uppercase transition-colors text-white hover:bg-white/10 ${
              activeTab === "Central" ? "border-b-2 border-white bg-navy-950" : ""
            }`}
          >
            📋 Central Jobs <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
          </button>
          <div className="absolute left-0 top-11 hidden group-hover:flex flex-col bg-navy-950 text-slate-200 border-t-4 border-saffron rounded-b-xl shadow-2xl min-w-[260px] max-h-[460px] overflow-y-auto py-2 z-50">
            {categoriesDropdown.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onFilterByCategory(cat.id);
                  setActiveTab("Central");
                }}
                className="w-full text-left px-5 py-2.5 text-xs font-semibold hover:bg-saffron/15 hover:text-saffron transition-all border-b border-white/5 last:border-0"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* State Jobs Dropdown */}
        <div className={`relative h-full ${selectedStateName ? "" : "group"}`}>
          <button
            onClick={() => {
              if (!selectedStateName) setActiveTab("State");
            }}
            disabled={!!selectedStateName}
            className={`px-4 h-full flex items-center gap-1 text-xs tracking-wider font-bold uppercase transition-colors text-white ${
              selectedStateName ? "opacity-90 cursor-default" : "hover:bg-white/10"
            } ${
              activeTab === "State" ? "border-b-2 border-white bg-navy-950" : ""
            }`}
          >
            {selectedStateName ? `🗺️ Portal: ${selectedStateName} 🔒` : "🗺️ State Jobs"}
            {!selectedStateName && <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />}
          </button>
          {!selectedStateName && (
            <div className="absolute left-0 top-11 hidden group-hover:grid grid-cols-3 bg-navy-950 text-slate-200 border-t-4 border-saffron rounded-b-xl shadow-2xl w-[640px] p-4 gap-1 z-50">
              <h4 className="col-span-3 text-[10px] tracking-widest text-[#cc0000] font-black border-b border-white/10 pb-1.5 uppercase mb-2 flex items-center gap-1.5">
                <span>Select State to Explore Local Vacancies</span>
              </h4>
              {activeStatesList.slice(0, 36).map((st) => (
                <button
                  key={st.code}
                  onClick={() => {
                    onStateSelect(st.name);
                    setActiveTab("State");
                  }}
                  className="text-left px-2 py-1.5 text-xs font-semibold hover:bg-saffron/15 hover:text-saffron rounded transition-colors text-slate-300 flex justify-between items-center"
                >
                  <span className="truncate">{st.name}</span>
                  <span className="text-[9px] bg-white/5 text-slate-400 px-1 py-0.5 rounded text-right">{st.jobsCount}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        <button
          onClick={() => {
            handleTabClick("Results");
            onResultsClick();
          }}
          className={`px-4 h-full flex items-center gap-1.5 text-xs tracking-wider font-bold uppercase transition-colors ${
            activeTab === "Results" 
              ? "bg-navy-950 text-white border-b-2 border-white" 
              : "text-white hover:bg-white/10"
          }`}
        >
          📊 Results
        </button>

        {/* Admit Card */}
        <button
          onClick={() => {
            handleTabClick("AdmitCard");
            onAdmitCardsClick();
          }}
          className={`px-4 h-full flex items-center gap-1.5 text-xs tracking-wider font-bold uppercase transition-colors ${
            activeTab === "AdmitCard" 
              ? "bg-navy-950 text-white border-b-2 border-white" 
              : "text-white hover:bg-white/10"
          }`}
        >
          🪪 Admit Card
        </button>

        {/* Extra Links */}
        <button 
          onClick={() => handleTabClick("Home")}
          className="px-4 h-full flex items-center gap-1 text-xs tracking-wider font-bold uppercase text-white hover:bg-white/10"
        >
          📝 Answer Key
        </button>
        <button 
          onClick={() => handleTabClick("Home")}
          className="px-4 h-full flex items-center gap-1 text-xs tracking-wider font-bold uppercase text-white hover:bg-white/10"
        >
          📚 Syllabus
        </button>
        <button 
          onClick={() => handleTabClick("Home")}
          className="px-4 h-full flex items-center gap-1 text-xs tracking-wider font-bold uppercase text-white hover:bg-white/10"
        >
          ✂️ Cut Off
        </button>
        <button 
          onClick={() => handleTabClick("Home")}
          className="px-4 h-full flex items-center gap-1 text-xs tracking-wider font-bold uppercase text-white hover:bg-white/10"
        >
          🏆 Toppers
        </button>
      </div>

      {/* Info strip badge right aligned on desktop */}
      <div className="hidden lg:flex items-center text-[10px] bg-white/10 text-white px-2.5 py-1 rounded-md font-hind font-semibold tracking-wide gap-1">
        <span>⭐ India's Premium Govt job database</span>
      </div>

      {/* Hamburger Menu Toggle on Mobile */}
      <div className="md:hidden flex items-center justify-between w-full">
        <span className="font-baloo text-sm text-white font-bold ml-1.5">MAIN NAVIGATION</span>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white hover:bg-white/10 p-2 rounded-lg"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-11 left-0 w-full bg-navy-950 border-b border-slate-800 flex flex-col z-50 shadow-2xl py-2 max-h-[85vh] overflow-y-auto">
          <button
            onClick={() => {
              onNavigateHome();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-5 py-3 text-xs text-white uppercase font-bold tracking-wide hover:bg-saffron border-b border-white/5 flex items-center gap-3"
          >
            <span>🏠</span> Home
          </button>
          
          <div className="bg-slate-900 border-y border-white/5 px-5 py-2 text-[10px] text-slate-400 font-bold uppercase">
            📋 CENTRAL JOB CATEGORIES
          </div>
          <div className="grid grid-cols-2 gap-1 p-2">
            {categoriesDropdown.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onFilterByCategory(cat.id);
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-xs text-slate-300 hover:bg-saffron hover:text-white rounded"
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="bg-slate-900 border-y border-white/5 px-5 py-2 text-[10px] text-slate-400 font-bold uppercase flex justify-between items-center">
            <span>🗺️ STATES INDEX</span>
            {selectedStateName && <span className="text-[9px] text-amber-400">🔒 REGION LOCKED</span>}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 p-2 max-h-[160px] overflow-y-auto">
            {activeStatesList.slice(0, 36).map((st) => (
              <button
                key={st.code}
                onClick={() => {
                  onStateSelect(st.name);
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-saffron hover:text-white rounded truncate"
              >
                📍 {st.name}
              </button>
            ))}
          </div>

          <div className="border-t border-white/10 mt-2 px-3 pt-2 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onResultsClick();
                setMobileMenuOpen(false);
              }}
              className="bg-navy-800 text-slate-200 px-4 py-2.5 rounded text-xs font-bold text-center border border-white/5"
            >
              📊 Results
            </button>
            <button
              onClick={() => {
                onAdmitCardsClick();
                setMobileMenuOpen(false);
              }}
              className="bg-navy-800 text-slate-200 px-4 py-2.5 rounded text-xs font-bold text-center border border-white/5"
            >
              🪪 Admit Cards
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
