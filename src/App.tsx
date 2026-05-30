import React, { useState, useEffect } from "react";
import { AppContext } from "./components/Website";
import { Website } from "./components/Website";
import { AdminPanel } from "./components/AdminPanel";
import { ToastContainer, ToastMessage } from "./components/Toast";
import { Job, ExamResult, AdmitCard, SiteSettings } from "./types";
import { 
  INIT_JOBS, INIT_RESULTS, INIT_ADMITS, DEFAULT_TICKER, DEFAULT_SETTINGS 
} from "./data";

// Dual-layer storage persistence functions
async function saveData(key: string, value: any) {
  try {
    const win = window as any;
    if (win.storage && typeof win.storage.set === "function") {
      await win.storage.set(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch(e) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch(err) {}
  }
}

async function loadData(key: string, fallback: any) {
  try {
    const win = window as any;
    if (win.storage && typeof win.storage.get === "function") {
      const r = await win.storage.get(key);
      if (r) {
        const val = typeof r === "object" && r !== null && "value" in r ? r.value : r;
        return JSON.parse(val);
      }
    }
    const local = localStorage.getItem(key);
    return local ? JSON.parse(local) : fallback;
  } catch(e) {
    try {
      const local = localStorage.getItem(key);
      return local ? JSON.parse(local) : fallback;
    } catch(err) {
      return fallback;
    }
  }
}

export default function App() {
  // Views navigation switcher
  const [view, setView] = useState<"site" | "admin">("site");
  const [isLoading, setIsLoading] = useState(true);

  // States
  const [jobs, setJobs] = useState<Job[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [admits, setAdmitCards] = useState<AdmitCard[]>([]);
  const [ticker, setTicker] = useState("");
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  // Notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (msg: string, type: "success" | "warn" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load persistence registers at startup
  useEffect(() => {
    async function loadAll() {
      setIsLoading(true);
      const loadedJobs = await loadData("jobs", INIT_JOBS);
      const loadedResults = await loadData("results", INIT_RESULTS);
      const loadedAdmits = await loadData("admits", INIT_ADMITS);
      const loadedTicker = await loadData("ticker", DEFAULT_TICKER);
      const loadedSettings = await loadData("siteSettings", DEFAULT_SETTINGS);

      setJobs(loadedJobs);
      setResults(loadedResults);
      setAdmitCards(loadedAdmits);
      setTicker(loadedTicker);
      setSiteSettings(loadedSettings);
      
      setIsLoading(false);
    }
    loadAll();
  }, []);

  // Save changes block alerts
  useEffect(() => {
    if (!isLoading) {
      saveData("jobs", jobs);
    }
  }, [jobs, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      saveData("results", results);
    }
  }, [results, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      saveData("admits", admits);
    }
  }, [admits, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      saveData("ticker", ticker);
    }
  }, [ticker, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      saveData("siteSettings", siteSettings);
    }
  }, [siteSettings, isLoading]);

  // Provide state context
  const contextValue = {
    jobs,
    results,
    admits,
    ticker,
    siteSettings,
    setJobs,
    setResults,
    setAdmitCards,
    setTicker,
    setSiteSettings,
    addToast,
    setView,
    isLoading
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-[#F0F4FF] overflow-x-hidden relative">
        
        {/* Loading overlay Screen */}
        {isLoading ? (
          <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0f2e] text-white">
            <style>{`
              @keyframes spinner {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              .custom-loader {
                width: 48px;
                height: 48px;
                border: 4px solid rgba(255,107,0,0.15);
                border-top: 4px solid #FF6B00;
                border-radius: 50%;
                animation: spinner 0.82s linear infinite;
              }
            `}</style>
            <div className="custom-loader mb-4"></div>
            <h1 className="font-baloo font-black text-lg tracking-wider text-[#FFB800] uppercase">
              BHARATJOBS DIRECTORY ENGINE
            </h1>
            <p className="text-xs text-slate-400 font-semibold tracking-wide mt-1.5 uppercase font-sans">
              Establishing Secure Statutory State Mappings...
            </p>
          </div>
        ) : (
          /* View Router switcher (Site vs Admin Panel) */
          <div>
            {view === "site" ? <Website /> : <AdminPanel />}
          </div>
        )}

        {/* Unified Toasts */}
        <ToastContainer toasts={toasts} onClose={removeToast} />
        
      </div>
    </AppContext.Provider>
  );
}
