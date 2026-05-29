import React from "react";
import { nationalAlerts } from "../data";

interface TickerBarProps {
  customAlertText?: string;
}

export function TickerBar({ customAlertText }: TickerBarProps) {
  const mergedAlerts = customAlertText || nationalAlerts.join("   |   ");

  return (
    <div className="bg-navy-800 border-t border-saffron/30 h-8 flex items-center overflow-hidden shrink-0 select-none z-10 shadow-inner">
      {/* Saffron Pill Badge */}
      <div className="bg-saffron px-3 sm:px-4 h-full flex items-center text-white text-[10px] sm:text-xs font-bold leading-none shrink-0 tracking-wider font-sans z-30 shadow-md">
        📡 LIVE UPDATES
      </div>

      {/* Ticker scrolling text container */}
      <div className="flex-1 overflow-hidden relative flex items-center h-full">
        <div className="animate-ticker whitespace-nowrap text-slate-300 font-hind text-xs font-medium cursor-pointer flex gap-12 select-none">
          <span>{mergedAlerts}</span>
          {/* Double up to ensure smooth endless loops */}
          <span>{mergedAlerts}</span>
        </div>
      </div>
    </div>
  );
}
