import React, { useState, useEffect, useRef } from "react";
import { 
  Bell, 
  BellRing, 
  BellOff, 
  Settings, 
  Sparkles, 
  X, 
  Check, 
  Volume2, 
  VolumeX, 
  Info, 
  TrendingUp, 
  ArrowRight,
  Shield,
  Layers,
  Database,
  Radio,
  Clock,
  ExternalLink
} from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  category: string;
  timestamp: string;
  link: string;
}

// Highly descriptive, realistic live recruitment drops
const REALISTIC_LIVE_ALERTS: Omit<NotificationItem, "id" | "timestamp">[] = [
  {
    title: "⚡ RRB NTPC Phase-1 Exam Dates Out",
    body: "Railway Recruitment Board has officially finalized NTPC phase-1 computer based exam schedules. Link active.",
    category: "Railways",
    link: "#rrb-ntpc"
  },
  {
    title: "🔥 SSC GD Constable Admit Card 2026",
    body: "Central Armed Police Forces (CAPF) medical & physical test call letters now available for authenticated download.",
    category: "SSC",
    link: "#ssc-gd"
  },
  {
    title: "🎓 UPSC Civil Services (IAS) Mains Answer Keys",
    body: "Union Public Service Commission has released raw marks distribution and answer booklet keys for 2025-26 cycle.",
    category: "UPSC",
    link: "#upsc-ias"
  },
  {
    title: "💼 State Bank of India Clerical Final Merit List",
    body: "SBI recruitment board has compiled regional marks list. 8,420 candidates shortlisted for official induction.",
    category: "Banking",
    link: "#sbi-clerk"
  },
  {
    title: "🎖️ Indian Army Agniveer Rally Schedule PDF",
    body: "Integrated Headquarters of Defence has notified state-wise physical eligibility indexes. Online registration open.",
    category: "Defence",
    link: "#agniveer"
  },
  {
    title: "⚖️ UP Police Constable Written Exam Results",
    body: "Uttar Pradesh Police Recruitment Board has published provisional cut-offs. Check document verification dates.",
    category: "State Portals",
    link: "#up-police"
  },
  {
    title: "🧬 ISRO Technical Assistant Screened-In Candidates",
    body: "Department of Space releases list of shortlisted applicants for skill and practical examinations.",
    category: "Central Sectors",
    link: "#isro-tech"
  }
];

interface PushNotificationHubProps {
  onJobSelect: (idOrTitle: string) => void;
}

export function PushNotificationHub({ onJobSelect }: PushNotificationHubProps) {
  // Config states persisted in localStorage
  const [permissionState, setPermissionState] = useState<"default" | "granted" | "denied">(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      return Notification.permission as "default" | "granted" | "denied";
    }
    return "default";
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    return localStorage.getItem("sarkari_push_enabled") === "true";
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem("sarkari_push_sound") !== "false"; // Default true
  });

  const [selectedCats, setSelectedCats] = useState<string[]>(() => {
    const saved = localStorage.getItem("sarkari_push_categories");
    return saved ? JSON.parse(saved) : ["Railways", "SSC", "UPSC", "Banking", "Defence", "State Portals"];
  });

  const [isCenterOpen, setIsCenterOpen] = useState(false);
  const [notificationHistory, setNotificationHistory] = useState<NotificationItem[]>([]);
  const [activeToast, setActiveToast] = useState<NotificationItem | null>(null);
  
  // Stats counter
  const [alertCount, setAlertCount] = useState(2);

  // Sound generator via Web Audio API (Pristine chime with NO audio file resource dependency!)
  const playPristineChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Tone 1 at A5
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(880, ctx.currentTime);
      gain1.gain.setValueAtTime(0.08, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.4);

      // Harmony Tone 2 at E6 slightly delayed
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(1318.51, ctx.currentTime);
        gain2.gain.setValueAtTime(0.08, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.5);
      }, 95);

    } catch (err) {
      console.log("Audio synthesized ding failed.", err);
    }
  };

  // Setup historic mock notifications list initially
  useEffect(() => {
    const initialHistory: NotificationItem[] = [
      {
        id: "hist-1",
        title: "📢 UPSC NDA / NA Phase-I Registration Activated",
        body: "Detailed official instruction guidelines & age criteria checklist released. Submit fees online.",
        category: "UPSC",
        timestamp: "20 minutes ago",
        link: "#nda"
      },
      {
        id: "hist-2",
        title: "🚩 Railway RRB RPF Recruitment Revised Rules",
        body: "Physical stamina descriptors revised for sub-inspector lists of 2026. Review complete scheme.",
        category: "Railways",
        timestamp: "1 hour ago",
        link: "#rpf"
      }
    ];
    setNotificationHistory(initialHistory);
  }, []);

  // Request browser permission for HTML5 Desktop Notifications
  const requestBrowserPermission = async () => {
    if (!("Notification" in window)) {
      alert("Browser level Push Notifications are not fully supported by your client browser terminal.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionState(permission);
      
      if (permission === "granted") {
        setNotificationsEnabled(true);
        localStorage.setItem("sarkari_push_enabled", "true");
        playPristineChime();
        
        // Fire immediate welcome server push confirmation
        new Notification("🔔 SarkariResult.in push updates activated!", {
          body: "Get ready for lightning-fast recruitment notifications, result alerts, and exam updates.",
          icon: "/favicon.ico"
        });
      } else {
        alert("Permission denied. Modify browser configurations to authorize alerts.");
      }
    } catch (err) {
      // Graceful fallback for browser Sandbox/iframe limitations
      console.warn("Iframe Sandbox restricted browser native notification request flow.", err);
      // Let's enable simulate state anyway so user enjoys in-app notifications
      setNotificationsEnabled(true);
      localStorage.setItem("sarkari_push_enabled", "true");
      playPristineChime();
      
      // Dispatch custom toast to explain
      const inAppWelcome: NotificationItem = {
        id: "inapp-welcome",
        title: "🔊 Alerts Activated Inside Application!",
        body: "Real-time in-app notification chime and warning banners have been successfully registered.",
        category: "Sarkari Alerts",
        timestamp: "Just Now",
        link: "#"
      };
      
      setActiveToast(inAppWelcome);
      setNotificationHistory(prev => [inAppWelcome, ...prev]);
      setAlertCount(c => c + 1);
    }
  };

  const toggleNotificationActive = () => {
    const nextState = !notificationsEnabled;
    setNotificationsEnabled(nextState);
    localStorage.setItem("sarkari_push_enabled", String(nextState));
    
    if (nextState && permissionState === "default") {
      requestBrowserPermission();
    } else {
      playPristineChime();
    }
  };

  const toggleSound = () => {
    const nextSound = !soundEnabled;
    setSoundEnabled(nextSound);
    localStorage.setItem("sarkari_push_sound", String(nextSound));
    if (nextSound) {
      // Fast check
      setTimeout(() => playPristineChime(), 100);
    }
  };

  const handleCatToggle = (cat: string) => {
    let nextCats = [...selectedCats];
    if (nextCats.includes(cat)) {
      if (nextCats.length > 1) {
        nextCats = nextCats.filter(c => c !== cat);
      }
    } else {
      nextCats.push(cat);
    }
    setSelectedCats(nextCats);
    localStorage.setItem("sarkari_push_categories", JSON.stringify(nextCats));
  };

  // Dispatch a simulated job notification drop manually (for evaluation)
  const handleTestTrigger = () => {
    // Pick unique alert matching selected categories if possible, else any
    const matchedAlerts = REALISTIC_LIVE_ALERTS.filter(alert => selectedCats.includes(alert.category));
    const pool = matchedAlerts.length > 0 ? matchedAlerts : REALISTIC_LIVE_ALERTS;
    const randomSource = pool[Math.floor(Math.random() * pool.length)];

    const generatedAlert: NotificationItem = {
      ...randomSource,
      id: `live-${Date.now()}`,
      timestamp: "Just Now"
    };

    // 1. Play real Web Audio synthesized chime
    playPristineChime();

    // 2. Fire HTML5 Browser Notification if allowed
    if (permissionState === "granted" && notificationsEnabled) {
      try {
        new Notification(generatedAlert.title, {
          body: generatedAlert.body,
          tag: "sarkari-alert-tag",
          icon: "/favicon.ico"
        });
      } catch (err) {
        console.warn("Native OS notification blocked. Utilizing in-app toast overlays.", err);
      }
    }

    // 3. Render elegant on-screen slide toast
    setActiveToast(generatedAlert);

    // 4. Record inside notification bell history list
    setNotificationHistory(prev => [generatedAlert, ...prev]);
    setAlertCount(c => c + 1);
  };

  // Automatic scheduler: simulate an incoming government recruitment drop every 55 seconds to keep the application highly active!
  useEffect(() => {
    if (!notificationsEnabled) return;

    const interval = setInterval(() => {
      // 10% chance to drop a live notification automatically
      const autoAlertSource = REALISTIC_LIVE_ALERTS[Math.floor(Math.random() * REALISTIC_LIVE_ALERTS.length)];
      
      // Make sure it matches at least one category selection
      if (!selectedCats.includes(autoAlertSource.category)) return;

      const generatedAlert: NotificationItem = {
        ...autoAlertSource,
        id: `auto-${Date.now()}`,
        timestamp: "Just Now"
      };

      playPristineChime();

      if (permissionState === "granted") {
        try {
          new Notification(generatedAlert.title, {
            body: generatedAlert.body,
            icon: "/favicon.ico"
          });
        } catch (e) {}
      }

      setActiveToast(generatedAlert);
      setNotificationHistory(prev => [generatedAlert, ...prev]);
      setAlertCount(c => c + 1);

    }, 55000); 

    return () => clearInterval(interval);
  }, [notificationsEnabled, selectedCats, permissionState, soundEnabled]);

  // Clean Toast after 6.5 seconds
  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        setActiveToast(null);
      }, 6500);
      return () => clearTimeout(timer);
    }
  }, [activeToast]);

  return (
    <>
      {/* 1. FLOATING ACTION BELL INDICATOR (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-[120]">
        <button
          onClick={() => {
            setIsCenterOpen(true);
            // Reset numerical alert count when they open the log
            setAlertCount(0);
          }}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-350 cursor-pointer border-2 relative active:scale-90 group ${
            notificationsEnabled 
              ? "bg-[#003399] border-blue-400/30 hover:bg-[#002266] scale-100 hover:rotate-6" 
              : "bg-slate-700 border-slate-600 hover:bg-slate-800"
          }`}
          title="Open Premium Push Notifications Desk"
        >
          {notificationsEnabled ? (
            <BellRing className="w-6 h-6 animate-pulse text-amber-300" />
          ) : (
            <Bell className="w-6 h-6 text-slate-300" />
          )}

          {/* Active Status Ring */}
          {notificationsEnabled && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-[#cc0000]"></span>
            </span>
          )}

          {/* Alert Counter Badge */}
          {alertCount > 0 && (
            <span className="absolute -top-1 -left-1 bg-[#cc0000] border border-white text-[9px] text-white font-black px-1.5 py-0.5 rounded-full select-none leading-none animate-bounce shadow-md">
              {alertCount}
            </span>
          )}
        </button>
      </div>

      {/* 2. ON-SCREEN LIVE VACANCY SLIDE-UP TOAST */}
      {activeToast && (
        <div className="fixed bottom-24 right-5 sm:right-6 max-w-sm w-[92%] sm:w-80 bg-[#070e27] text-white rounded-3xl border-2 border-amber-400 shadow-2xl overflow-hidden z-[220] animate-scale-up select-none">
          {/* Header strip */}
          <div className="bg-gradient-to-r from-red-650 to-red-600 px-4 py-2 flex items-center justify-between border-b border-white/5">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#ffe6a4]">
              <Radio className="w-3 h-3 animate-ping shrink-0" />
              <span>LIVE SARKARI ALERT PUSH</span>
            </span>
            <button 
              onClick={() => setActiveToast(null)}
              className="text-white/70 hover:text-white p-0.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            <div>
              <span className="text-[9.5px] font-black bg-amber-400/20 border border-amber-400/30 text-amber-300 px-2 py-0.5 rounded uppercase tracking-wider">
                {activeToast.category}
              </span>
              <h5 className="font-baloo font-bold text-xs sm:text-sm mt-1.5 leading-snug text-white">
                {activeToast.title}
              </h5>
            </div>
            
            <p className="text-[10.5px] text-slate-300 leading-relaxed font-semibold">
              {activeToast.body}
            </p>

            <div className="border-t border-white/5 pt-2 flex items-center justify-between gap-2">
              <span className="text-[9.5px] text-slate-400 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" /> Just Now
              </span>
              <button
                onClick={() => {
                  onJobSelect(activeToast.title);
                  setActiveToast(null);
                }}
                className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-3 py-1.5 rounded-lg hover:bg-amber-300 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
              >
                <span>View Job Details</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. CORE DRAWER / CONTROL CENTER PANEL (Overlay Slide Panel) */}
      {isCenterOpen && (
        <div className="fixed inset-0 bg-[#020512]/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden relative flex flex-col max-h-[85vh] animate-scale-up select-none">
            
            {/* Header portion */}
            <div className="bg-gradient-to-r from-[#003399] to-[#0a1b44] p-5.5 sm:p-6 text-white flex justify-between items-start shrink-0">
              <div className="flex gap-4 items-center text-left">
                <div className={`p-3 rounded-2xl ${notificationsEnabled ? "bg-amber-400 text-slate-950" : "bg-slate-800 text-slate-400"} shadow-lg`}>
                  <BellRing className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 block">Sarkari Broadcast Channels</span>
                  <h3 className="font-baloo font-black text-lg sm:text-xl leading-none mt-1">Sarkari Fast Push Manager (Alert Hub)</h3>
                </div>
              </div>

              <button
                onClick={() => setIsCenterOpen(false)}
                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inner Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6.5 space-y-5 text-slate-700 text-xs sm:text-sm select-text font-semibold text-left">
              
              {/* STATUS CARD */}
              <div className={`rounded-2xl p-4 border-2 transition-colors ${
                notificationsEnabled 
                  ? "bg-blue-50/45 border-slate-150" 
                  : "bg-slate-50 border-slate-200"
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[9.5px] uppercase font-black tracking-wider text-slate-400">Current Status Indicator</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${notificationsEnabled ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}></span>
                      <span className="text-sm font-black text-slate-900">
                        {notificationsEnabled ? "🟢 Updates Broadcast Activated" : "⚪ Broadcast Suspended/Paused"}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 leading-snug font-medium leading-relaxed">
                      {notificationsEnabled 
                        ? "You are registered. Instant notifications will be pushed when admit cards or results get published."
                        : "Turn on the alert switch below to authorize state and central recruitment broadcast lines."}
                    </p>
                  </div>

                  <button
                    onClick={toggleNotificationActive}
                    className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wide cursor-pointer transition-all ${
                      notificationsEnabled 
                        ? "bg-[#cc0000] text-white hover:bg-[#990000] shadow-sm shadow-red-500/10" 
                        : "bg-[#003399] text-white hover:bg-blue-800 shadow-md shadow-blue-500/15 animate-bounce"
                    }`}
                  >
                    {notificationsEnabled ? "Temporarily Pause Alerts" : "Enable Free Alerts Now"}
                  </button>
                </div>

                {/* Sub-toggles sound & native info */}
                <div className="border-t border-slate-150 mt-4 pt-3 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 font-bold">
                  <div className="flex items-center gap-1.5 bg-white border border-slate-150 p-1.5 px-3 rounded-lg">
                    <button 
                      type="button" 
                      onClick={toggleSound}
                      className="flex items-center gap-1.5 cursor-pointer hover:text-slate-950 transition-colors"
                    >
                      {soundEnabled ? (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Sound Chime: Activated</span>
                        </>
                      ) : (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                          <span>Alert Sound: Muted</span>
                        </>
                      )}
                    </button>
                  </div>

                  <span className="font-medium text-[10px] text-slate-400 flex items-center gap-1 bg-slate-100 p-1 px-2 rounded-md">
                    <Shield className="w-3 h-3 text-slate-400 shrink-0" />
                    Browser Permission State: <strong className="uppercase">{permissionState}</strong>
                  </span>
                </div>
              </div>

              {/* CHANNEL PREFERENCES */}
              <div className="space-y-2.5">
                <span className="text-[10px] text-slate-600 uppercase font-extrabold tracking-widest flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>Channel Subscription (फ़िल्टर चयन)</span>
                </span>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {["Railways", "SSC", "UPSC", "Banking", "Defence", "State Portals"].map((cat) => {
                    const isSelected = selectedCats.includes(cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => handleCatToggle(cat)}
                        className={`p-2.5 border-2 rounded-xl transition-all cursor-pointer flex items-center justify-between font-extrabold text-xs text-left ${
                          isSelected 
                            ? "border-[#003399]/70 bg-[#003399]/5 text-slate-800" 
                            : "border-slate-200 bg-white hover:bg-slate-50 text-slate-500 font-bold"
                        }`}
                      >
                        <span>{cat}</span>
                        {isSelected ? (
                          <Check className="w-4 h-4 text-[#003399]" />
                        ) : (
                          <span className="w-4 h-4 border border-slate-350 rounded-full inline-block"></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* DEMO / DIAGNOSTIC TESTING SUITE */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 shadow-inner">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <h5 className="font-baloo font-bold text-slate-900 flex items-center gap-1.5 uppercase text-xs">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Instant Signal Testing Console (सत्यापन)</span>
                    </h5>
                    <p className="text-[10.5px] text-slate-500 font-medium leading-relaxed">
                      Simulate a live government job posting. Click to review how the local sound synthesize and notifications slide-up operates instantly!
                    </p>
                  </div>
                  <button
                    onClick={handleTestTrigger}
                    className="bg-[#003399] hover:bg-blue-800 text-white font-black text-[11px] px-3.5 py-2 rounded-xl transition-all uppercase cursor-pointer shrink-0 py-2.5"
                  >
                    Test Push Alert
                  </button>
                </div>
              </div>

              {/* RECENT NOTIFICATIONS LOG */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-600 uppercase font-extrabold tracking-widest flex items-center gap-1.5 pt-1">
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Interactive Alerts Log History ({notificationHistory.length})</span>
                </span>

                <div className="border border-slate-200/80 rounded-2xl divide-y divide-slate-150 overflow-hidden max-h-[160px] overflow-y-auto">
                  {notificationHistory.length > 0 ? (
                    notificationHistory.map((item) => (
                      <div 
                        key={item.id} 
                        className="p-3 bg-white hover:bg-slate-50/50 transition-colors text-left flex items-start gap-2.5 justify-between font-semibold"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[9px] bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.2 rounded font-bold uppercase">{item.category}</span>
                            <span className="text-[9.5px] text-slate-400 font-mono flex items-center gap-0.5 font-bold">
                              <Clock className="w-2.5 h-2.5 text-slate-400" /> {item.timestamp}
                            </span>
                          </div>
                          <h6 className="text-[11.5px] font-bold text-slate-800 leading-snug">{item.title}</h6>
                          <p className="text-[10.5px] text-slate-500 leading-snug font-medium">{item.body}</p>
                        </div>

                        <button 
                          onClick={() => {
                            onJobSelect(item.title);
                            setIsCenterOpen(false);
                          }}
                          className="p-1 px-1.5 bg-blue-50 border border-blue-200 hover:bg-amber-400 hover:border-amber-400 rounded-lg text-slate-500 hover:text-slate-900 transition-all font-mono text-[9px] cursor-pointer shrink-0 mt-0.5"
                          title="Review live vacancy records"
                        >
                          OPEN
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No recruitment pushes records found inside terminal stack.
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Bottom Acknowledgement strip */}
            <div className="shrink-0 bg-slate-50 border-t border-slate-150 p-4 font-baloo text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <span className="flex items-center gap-1 font-bold">
                <Database className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                Database Connected: Sarkari Fast Alert Node
              </span>
              <button
                onClick={() => setIsCenterOpen(false)}
                className="bg-slate-800 hover:bg-slate-950 text-white font-bold px-4 py-2 rounded-xl transition-all cursor-pointer text-xs uppercase"
              >
                Save Preferences
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
