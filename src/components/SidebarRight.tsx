import React from "react";
import { 
  Flame, Send, MessageCircle, Youtube, Facebook, 
  Twitter, Instagram, Award, Sparkles, MapPin, Layers, Heart
} from "lucide-react";
import { statesData, latestJobsList, resultsLinks, admitCardsLinks } from "../data";

interface SidebarRightProps {
  onStateClick: (stateName: string) => void;
  onJobSelect: (jobId: string) => void;
  onAlertsSubscribe: () => void;
  selectedStateName?: string;
}

export function SidebarRight({ 
  onStateClick, 
  onJobSelect, 
  onAlertsSubscribe,
  selectedStateName 
}: SidebarRightProps) {
  
  const activeStatesList = selectedStateName
    ? statesData.filter(st => st.name.toLowerCase() === selectedStateName.toLowerCase())
    : statesData;

  const socialMedias = [
    { name: "Telegram", icon: <Send className="w-4 h-4 text-white shrink-0" />, color: "bg-sky-500 hover:bg-sky-600 shadow-sky-500/10", tag: "FREE" },
    { name: "WhatsApp", icon: <MessageCircle className="w-4 h-4 text-white shrink-0" />, color: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/10", tag: "JOIN" },
    { name: "YouTube", icon: <Youtube className="w-4 h-4 text-white shrink-0" />, color: "bg-red-500 hover:bg-red-600 shadow-red-500/10", tag: "TIPS" },
    { name: "Facebook", icon: <Facebook className="w-4 h-4 text-white shrink-0" />, color: "bg-blue-600 hover:bg-blue-700 shadow-blue-500/10" },
    { name: "Twitter/X", icon: <Twitter className="w-4 h-4 text-white shrink-0" />, color: "bg-slate-900 hover:bg-slate-950 shadow-slate-900/10" },
    { name: "Instagram", icon: <Instagram className="w-4 h-4 text-white shrink-0" />, color: "bg-pink-600 hover:bg-pink-700 shadow-pink-500/10" }
  ];

  return (
    <aside className="space-y-4 select-none">
      
      {/* Widget 1 — Telegram & WhatsApp Subscriptions */}
      <div className="bg-slate-900 rounded-3xl border border-slate-950 p-5.5 text-center text-white relative overflow-hidden shadow-md">
        <div className="absolute top-3 right-3">
          <Sparkles className="w-4.5 h-4.5 text-amber-300 animate-pulse" />
        </div>
        <div className="relative z-10 text-left">
          <span className="text-[9px] text-amber-300 font-extrabold uppercase tracking-widest block mb-1">Instant Notifications</span>
          <h4 className="font-baloo text-[15px] font-black leading-snug text-white mb-3.5">Join Community Channels For Daily Candidates Updates</h4>
          
          <div className="grid grid-cols-2 gap-2.5 mb-3.5">
            {socialMedias.slice(0, 2).map((sci, idx) => (
              <a
                key={idx}
                href="https://t.me/"
                target="_blank"
                rel="noreferrer noopener"
                className={`flex flex-col items-center justify-center p-3 rounded-2xl ${sci.color} cursor-pointer transition-all hover:scale-[1.02] active:scale-95 shadow-sm`}
              >
                {sci.icon}
                <span className="text-[10.5px] font-black text-white mt-1.5">{sci.name}</span>
                {sci.tag && (
                  <span className="text-[8px] bg-white/20 text-white font-extrabold px-2 py-0.5 rounded-full scale-90 leading-none mt-1">
                    {sci.tag}
                  </span>
                )}
              </a>
            ))}
          </div>

          <p className="text-[10px] text-slate-400 mt-1 leading-normal">
            Direct real-time notification alerts, official PDF downloads & help topics. Join 10 Lakh+ youth.
          </p>
        </div>
      </div>

      {/* Widget 3 — Quick State Indices */}
      {!selectedStateName && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-150/80 overflow-hidden">
          <div className="bg-slate-50 p-4 px-5 text-slate-800 font-baloo text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 border-b border-slate-100">
            <Layers className="w-4 h-4 text-slate-500 shrink-0" />
            <span>State-Wise Jobs</span>
          </div>
          <div className="p-3.5 bg-white font-bold">
            <div className="grid grid-cols-2 gap-1.5 max-h-[200px] overflow-y-auto custom-scroll">
              {activeStatesList.slice(0, 24).map((st) => (
                <button
                  key={st.code}
                  onClick={() => {
                    if (!selectedStateName) onStateClick(st.name);
                  }}
                  disabled={!!selectedStateName}
                  className="text-left py-1.5 px-2.5 text-[11px] font-black rounded-xl border border-transparent transition-all truncate flex items-center gap-1.5 group text-slate-600 hover:bg-slate-50 hover:border-slate-200"
                >
                  <span className="text-[8px] shrink-0 text-red-650">⬤</span>
                  <span className="truncate">{st.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Widget 4 — Social Media Follow Guild Grid */}
      <div className="bg-white rounded-3xl border border-slate-150/85 p-4 text-center">
        <h4 className="text-[10px] font-black text-slate-400 mb-2.5 uppercase tracking-widest leading-none">Connect & Support</h4>
        <div className="grid grid-cols-3 gap-2 p-1 font-bold">
          {socialMedias.map((sci, idx) => (
            <a
              key={idx}
              href="/"
              onClick={(e) => { e.preventDefault(); onAlertsSubscribe(); }}
              className="bg-slate-50 border border-slate-200 hover:bg-slate-900 group p-2.5 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer hover:scale-[1.02]"
            >
              <div className="scale-75 text-slate-605 group-hover:scale-95 group-hover:text-amber-300 transition-all">
                {React.cloneElement(sci.icon, { className: "w-5 h-5 text-slate-500 group-hover:text-white" })}
              </div>
              <span className="text-[9px] font-black text-slate-400 group-hover:text-white mt-1">{sci.name.split("/")[0]}</span>
            </a>
          ))}
        </div>
      </div>

    </aside>
  );
}
