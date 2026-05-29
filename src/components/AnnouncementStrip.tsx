import React, { useEffect, useState } from "react";

export function AnnouncementStrip() {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    // Show local time nicely updated
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      setCurrentTime(new Date().toLocaleString('en-IN', options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-navy-950 h-9 flex items-center justify-between px-4 text-[11px] text-slate-400 border-b border-white/5 shrink-0 select-none">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
        </span>
        <span className="font-medium tracking-wide">
          🔴 <span className="text-white font-bold">LIVE UPDATE:</span> 23 Premium Government Job Vacancies Added Today
        </span>
      </div>
      
      <div className="hidden sm:flex items-center gap-4 font-normal">
        <span className="flex items-center gap-1.5 text-slate-300">
          📅 <span>{currentTime || "Loading..."}</span>
        </span>
        <span className="text-slate-500">|</span>
        <span className="flex items-center gap-1">
          <span className="text-amber-500 font-bold">👁️ 2,45,678</span> Visual Hits Today
        </span>
      </div>
    </div>
  );
}
