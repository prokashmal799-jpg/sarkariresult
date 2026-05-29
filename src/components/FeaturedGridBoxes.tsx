import React from "react";
import { Sparkles, ArrowRight, Flame } from "lucide-react";

interface FeaturedGridBoxesProps {
  onJobSelect: (jobTitle: string) => void;
  selectedStateName?: string;
}

interface BoxItem {
  title: string;
  shortLabel: string;
  targetJob: string;
  badge?: "NEW" | "HOT" | "LIVE" | "MERIT";
  badgeBg: string;
  borderColor: string;
  textColor: string;
  bgGradient: string;
  hoverShadow: string;
}

const FEATURED_BOXES: BoxItem[] = [
  {
    title: "SSC CGL Online Application 2026",
    shortLabel: "SSC CGL Apply Online",
    targetJob: "SSC Combined Graduate Level (CGL)",
    badge: "HOT",
    badgeBg: "bg-rose-50 text-rose-600 border border-rose-200",
    borderColor: "border-slate-100/90",
    textColor: "text-slate-900",
    bgGradient: "from-white to-slate-50/20",
    hoverShadow: "hover:shadow-rose-500/5 hover:border-rose-400/40"
  },
  {
    title: "UP Police Constable Vacancy Online",
    shortLabel: "UP Police Constable",
    targetJob: "UP Police Constable Recruitment",
    badge: "LIVE",
    badgeBg: "bg-amber-50 text-amber-700 border border-amber-200 animate-pulse",
    borderColor: "border-slate-100/90",
    textColor: "text-slate-900",
    bgGradient: "from-white to-slate-50/20",
    hoverShadow: "hover:shadow-amber-500/5 hover:border-amber-400/40"
  },
  {
    title: "SBI Clerk Recruitment 2025 Form",
    shortLabel: "SBI Clerk 13K+ Posts",
    targetJob: "SBI Clerk Recuitment 2025",
    badge: "NEW",
    badgeBg: "bg-blue-50 text-blue-600 border border-blue-200",
    borderColor: "border-slate-100/90",
    textColor: "text-slate-900",
    bgGradient: "from-white to-slate-50/20",
    hoverShadow: "hover:shadow-blue-500/5 hover:border-blue-400/40"
  },
  {
    title: "UPSC Civil Services (IAS) Pre Online",
    shortLabel: "UPSC IAS 2025",
    targetJob: "UPSC Civil Services (IAS) 2025",
    badge: "HOT",
    badgeBg: "bg-indigo-50 text-indigo-600 border border-indigo-200",
    borderColor: "border-slate-100/90",
    textColor: "text-slate-900",
    bgGradient: "from-white to-slate-50/20",
    hoverShadow: "hover:shadow-indigo-500/5 hover:border-indigo-400/40"
  },
  {
    title: "Indian Army Agniveer Rally Apply",
    shortLabel: "Army Agniveer 25K Post",
    targetJob: "Indian Army Agniveer Rally 2025",
    badge: "NEW",
    badgeBg: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    borderColor: "border-slate-100/90",
    textColor: "text-slate-900",
    bgGradient: "from-white to-slate-50/20",
    hoverShadow: "hover:shadow-emerald-500/5 hover:border-emerald-400/40"
  },
  {
    title: "RRB NTPC Graduate Level Vacancy",
    shortLabel: "RRB NTPC Vacancies",
    targetJob: "RRB NTPC Graduate Level",
    badge: "HOT",
    badgeBg: "bg-teal-50 text-teal-700 border border-teal-200",
    borderColor: "border-slate-100/90",
    textColor: "text-slate-900",
    bgGradient: "from-white to-slate-50/20",
    hoverShadow: "hover:shadow-teal-500/5 hover:border-teal-400/40"
  },
  {
    title: "India Post GDS 44K Posts Form",
    shortLabel: "India Post GDS Recruitment",
    targetJob: "India Post GDS Recruitment 2025",
    badge: "MERIT",
    badgeBg: "bg-purple-50 text-purple-700 border border-purple-200",
    borderColor: "border-slate-100/90",
    textColor: "text-slate-900",
    bgGradient: "from-white to-slate-50/20",
    hoverShadow: "hover:shadow-purple-500/5 hover:border-purple-400/40"
  },
  {
    title: "Bihar STET Teacher Online Form",
    shortLabel: "Bihar STET Application",
    targetJob: "Bihar STET Application Form",
    badge: "NEW",
    badgeBg: "bg-pink-50 text-pink-600 border border-pink-200",
    borderColor: "border-slate-100/90",
    textColor: "text-slate-900",
    bgGradient: "from-white to-slate-50/20",
    hoverShadow: "hover:shadow-pink-500/5 hover:border-pink-400/40"
  }
];

export function FeaturedGridBoxes({ onJobSelect, selectedStateName }: FeaturedGridBoxesProps) {
  const activeBoxes = React.useMemo(() => {
    if (!selectedStateName) return FEATURED_BOXES;
    return FEATURED_BOXES.filter(box => {
      if (box.title.toLowerCase().includes("up police") && selectedStateName.toLowerCase() !== "uttar pradesh") {
        return false;
      }
      if (box.title.toLowerCase().includes("bihar stet") && selectedStateName.toLowerCase() !== "bihar") {
        return false;
      }
      return true;
    });
  }, [selectedStateName]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 select-none mb-8">
      {/* Premium Minimalistic Sub-Header */}
      <div className="flex items-center justify-between mb-4 border-b pb-3 border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="bg-amber-400/10 p-1.5 rounded-xl flex items-center justify-center">
            <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
          </div>
          <div>
            <h3 className="font-baloo font-bold text-sm uppercase tracking-widest text-slate-800 flex items-center gap-1.5 leading-none">
              <span>महत्वपूर्ण अधिसूचना (Feature Portal)</span>
              <span className="hidden md:inline text-[11px] text-slate-400 font-sans tracking-tight font-medium ml-1 lowercase">
                — direct portals to high-demand recruitment lines
              </span>
            </h3>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 text-[10.5px] text-slate-500 font-sans font-bold bg-slate-50 border border-slate-200/60 px-3 py-1 rounded-full">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span className="text-slate-700">Real-Time Audited Links</span>
        </div>
      </div>

      {/* Styled minimal card grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {activeBoxes.map((box, idx) => (
          <div
            key={idx}
            onClick={() => onJobSelect(box.targetJob)}
            className={`cursor-pointer bg-gradient-to-br ${box.bgGradient} rounded-2xl border ${box.borderColor} px-4 py-4.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between ${box.hoverShadow} relative overflow-hidden group`}
          >
            {/* Soft inner hover border lighting */}
            <div className="absolute inset-0 border border-transparent group-hover:border-slate-200/50 rounded-2xl pointer-events-none" />

            {/* Header row details */}
            <div className="flex items-center justify-between gap-2 mb-3 select-none">
              <span className={`text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-lg leading-none shrink-0 ${box.badgeBg}`}>
                {box.badge}
              </span>
              <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>

            {/* Descriptive texts */}
            <div>
              <p className="font-sans text-xs sm:text-[13px] font-black text-slate-800 leading-snug line-clamp-2 uppercase tracking-wide group-hover:text-slate-950 transition-colors">
                {box.title}
              </p>
              <span className="text-[10px] font-bold text-slate-400 font-sans block mt-2 tracking-wide">
                🔗 {box.shortLabel}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
