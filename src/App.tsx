import React, { useState, useEffect } from "react";
import { AppContext } from "./components/Website";
import { Website } from "./components/Website";
import { AdminPanel } from "./components/AdminPanel";
import { ToastContainer, ToastMessage } from "./components/Toast";
import { Job, ExamResult, AdmitCard, SiteSettings, PushNotificationSetting, PushNotificationAlert, StateSocialMap } from "./types";
import { 
  INIT_JOBS, INIT_RESULTS, INIT_ADMITS, DEFAULT_TICKER, DEFAULT_SETTINGS, DEFAULT_STATE_SOCIALS 
} from "./data";
import { db, auth, OperationType, handleFirestoreError } from "./firebase";
import { 
  collection, doc, setDoc, deleteDoc, onSnapshot, getDocs, getDoc, getDocFromServer
} from "firebase/firestore";
import { 
  onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, User 
} from "firebase/auth";

// Initial push alerts for the user's Inbox
const INIT_PUSH_ALERTS: PushNotificationAlert[] = [
  {
    id: 1,
    title: "SSC CGL 2026 Notification",
    body: "Administrative staff registration starts today. 15,005+ posts declared under central board.",
    category: "Central Jobs",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
  },
  {
    id: 2,
    title: "UP Police Constable Admit Card",
    body: "Download link is now active. Verify city center and exam credentials immediately.",
    category: "Admit Cards",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
  }
];

const DEFAULT_PUSH_SUB: PushNotificationSetting = {
  subscribed: false,
  channels: ["Central Jobs", "State Jobs", "Admit Cards", "Exam Results"]
};

// Play warm dual-tone bell chime on push actions
function playNotificationSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(880, now); // A5 note
    osc1.frequency.exponentialRampToValueAtTime(1100, now + 0.12);
    
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(440, now); // A4 note
    
    gainNode.gain.setValueAtTime(0.12, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc1.start(now);
    osc2.start(now);
    
    osc1.stop(now + 0.6);
    osc2.stop(now + 0.6);
  } catch (e) {
    console.warn("Audio Context blocked or not allowed", e);
  }
}

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
  const [stateSocials, setStateSocials] = useState<StateSocialMap>(DEFAULT_STATE_SOCIALS);

  // Auth States
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Web Push Notifications State
  const [pushSubscription, setPushSubscription] = useState<PushNotificationSetting>(DEFAULT_PUSH_SUB);
  const [pushAlerts, setPushAlerts] = useState<PushNotificationAlert[]>([]);

  // Notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (msg: string, type: "success" | "warn" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Google Provider flow initialization
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      addToast(`Super Admin active session in control: ${res.user.email}`, "success");
    } catch (e: any) {
      addToast(`Authentication failed: ${e.message}`, "error");
    }
  };

  const logoutAdmin = async () => {
    try {
      await signOut(auth);
      addToast("Successfully logged out from administrative sessions.", "success");
    } catch (e: any) {
      addToast("Failed logging out.", "error");
    }
  };

  // Track auth changes
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (usr) => {
      setCurrentUser(usr);
    });
    return () => unsubAuth();
  }, []);

  // Load and bootstrap databases at startup
  useEffect(() => {
    async function loadAllAndBootstrap() {
      setIsLoading(true);
      
      // Connection validation check for compliance
      try {
        await getDocFromServer(doc(db, "siteSettings", "config"));
        console.log("Firestore connection test passed successfully.");
      } catch (error) {
        console.warn("Testing online connection finished. Let's try parsing documents:", error);
      }

      // A) Load site settings
      let loadedSettings = DEFAULT_SETTINGS;
      try {
        const settingsSnap = await getDoc(doc(db, "siteSettings", "config"));
        if (settingsSnap.exists()) {
          loadedSettings = settingsSnap.data() as SiteSettings;
        } else {
          try {
            await setDoc(doc(db, "siteSettings", "config"), DEFAULT_SETTINGS);
          } catch(e) {
            console.warn("Unable to seed default settings (possibly not signed in yet):", e);
          }
        }
      } catch (err) {
        console.warn("Failed retrieving siteSettings from Firestore, using local defaults:", err);
      }
      setSiteSettings(loadedSettings);

      // A2) Load state-specific social networks configuration
      let loadedSocials = DEFAULT_STATE_SOCIALS;
      try {
        const socialsSnap = await getDoc(doc(db, "siteSettings", "socials"));
        if (socialsSnap.exists()) {
          loadedSocials = { ...DEFAULT_STATE_SOCIALS, ...(socialsSnap.data() as StateSocialMap) };
        } else {
          try {
            await setDoc(doc(db, "siteSettings", "socials"), DEFAULT_STATE_SOCIALS);
          } catch (e) {
            console.warn("Unable to seed default state socials: ", e);
          }
        }
      } catch (err) {
        console.warn("Failed retrieving state socials from Firestore, using local defaults:", err);
      }
      setStateSocials(loadedSocials);

      // B) Load ticker marquee banner
      let loadedTicker = DEFAULT_TICKER;
      try {
        const tickerSnap = await getDoc(doc(db, "ticker", "live"));
        if (tickerSnap.exists()) {
          loadedTicker = (tickerSnap.data() as any).text;
        } else {
          try {
            await setDoc(doc(db, "ticker", "live"), { text: DEFAULT_TICKER });
          } catch (e) {
            console.warn("Unable to seed default ticker on database:", e);
          }
        }
      } catch (err) {
        console.warn("Failed retrieving ticker, using local default:", err);
      }
      setTicker(loadedTicker);

      // C) Load & Seed Jobs list
      let initialJobsList: Job[] = [];
      try {
        const jobsSnap = await getDocs(collection(db, "jobs"));
        if (jobsSnap.empty) {
          try {
            // Seed defaults
            for (const j of INIT_JOBS) {
              await setDoc(doc(db, "jobs", String(j.id)), j);
            }
            initialJobsList = INIT_JOBS;
          } catch(err) {
            console.warn("Perms restriction seeding, setting mock defaults locally:", err);
            initialJobsList = INIT_JOBS;
          }
        } else {
          initialJobsList = jobsSnap.docs.map(doc => doc.data() as Job);
        }
      } catch (e) {
        console.warn("Failed fetching live Firestore jobs:", e);
        initialJobsList = await loadData("jobs", INIT_JOBS);
      }
      initialJobsList.sort((a,b) => b.id - a.id);
      setJobs(initialJobsList);

      // D) Load & Seed Exam results
      let initialResultsList: ExamResult[] = [];
      try {
        const resultsSnap = await getDocs(collection(db, "results"));
        if (resultsSnap.empty) {
          try {
            for (const r of INIT_RESULTS) {
              await setDoc(doc(db, "results", String(r.id)), r);
            }
            initialResultsList = INIT_RESULTS;
          } catch (err) {
            initialResultsList = INIT_RESULTS;
          }
        } else {
          initialResultsList = resultsSnap.docs.map(doc => doc.data() as ExamResult);
        }
      } catch (e) {
        initialResultsList = await loadData("results", INIT_RESULTS);
      }
      initialResultsList.sort((a,b) => b.id - a.id);
      setResults(initialResultsList);

      // E) Load & Seed Admit Cards
      let initialAdmitsList: AdmitCard[] = [];
      try {
        const admitsSnap = await getDocs(collection(db, "admits"));
        if (admitsSnap.empty) {
          try {
            for (const a of INIT_ADMITS) {
              await setDoc(doc(db, "admits", String(a.id)), a);
            }
            initialAdmitsList = INIT_ADMITS;
          } catch(err) {
            initialAdmitsList = INIT_ADMITS;
          }
        } else {
          initialAdmitsList = admitsSnap.docs.map(doc => doc.data() as AdmitCard);
        }
      } catch (e) {
        initialAdmitsList = await loadData("admits", INIT_ADMITS);
      }
      initialAdmitsList.sort((a,b) => b.id - a.id);
      setAdmitCards(initialAdmitsList);

      // F) Load & Seed Push Alerts
      let initialAlertsList: PushNotificationAlert[] = [];
      try {
        const alertsSnap = await getDocs(collection(db, "pushAlerts"));
        if (alertsSnap.empty) {
          try {
            for (const pa of INIT_PUSH_ALERTS) {
              await setDoc(doc(db, "pushAlerts", String(pa.id)), pa);
            }
            initialAlertsList = INIT_PUSH_ALERTS;
          } catch (err) {
            initialAlertsList = INIT_PUSH_ALERTS;
          }
        } else {
          initialAlertsList = alertsSnap.docs.map(doc => doc.data() as PushNotificationAlert);
        }
      } catch(e) {
        initialAlertsList = await loadData("pushAlerts", INIT_PUSH_ALERTS);
      }
      initialAlertsList.sort((a,b) => b.id - a.id);
      setPushAlerts(initialAlertsList);

      // G) Local subscription preferences
      const loadedPushSub = await loadData("pushSubscription", DEFAULT_PUSH_SUB);
      setPushSubscription(loadedPushSub);

      // Check URL query parameters or hash to toggle admin mode easily
      const params = new URLSearchParams(window.location.search);
      if (params.get("admin") === "true" || params.get("view") === "admin" || window.location.hash === "#admin") {
        setView("admin");
      }
      
      setIsLoading(false);
    }
    loadAllAndBootstrap();
  }, []);

  // Real-time dynamic listeners (onSnapshot double-binding for instant reactivity)
  useEffect(() => {
    if (isLoading) return;

    const unsubJobs = onSnapshot(collection(db, "jobs"), (snap) => {
      const items = snap.docs.map(doc => doc.data() as Job);
      items.sort((a,b) => b.id - a.id);
      setJobs(items);
    }, (err) => {
      console.warn("Snapshot dynamic sync failed for jobs: ", err);
    });

    const unsubResults = onSnapshot(collection(db, "results"), (snap) => {
      const items = snap.docs.map(doc => doc.data() as ExamResult);
      items.sort((a,b) => b.id - a.id);
      setResults(items);
    }, (err) => {
      console.warn("Snapshot dynamic sync failed for results: ", err);
    });

    const unsubAdmits = onSnapshot(collection(db, "admits"), (snap) => {
      const items = snap.docs.map(doc => doc.data() as AdmitCard);
      items.sort((a,b) => b.id - a.id);
      setAdmitCards(items);
    }, (err) => {
      console.warn("Snapshot dynamic sync failed for admits: ", err);
    });

    const unsubSettings = onSnapshot(doc(db, "siteSettings", "config"), (snap) => {
      if (snap.exists()) {
        setSiteSettings(snap.data() as SiteSettings);
      }
    }, (err) => {
      console.warn("Snapshot dynamic sync failed for settings: ", err);
    });

    const unsubTicker = onSnapshot(doc(db, "ticker", "live"), (snap) => {
      if (snap.exists()) {
        setTicker((snap.data() as any).text || "");
      }
    }, (err) => {
      console.warn("Snapshot dynamic sync failed for ticker: ", err);
    });

    const unsubAlerts = onSnapshot(collection(db, "pushAlerts"), (snap) => {
      const items = snap.docs.map(doc => doc.data() as PushNotificationAlert);
      items.sort((a,b) => b.id - a.id);
      setPushAlerts(items);
    }, (err) => {
      console.warn("Snapshot dynamic sync failed for pushAlerts: ", err);
    });

    return () => {
      unsubJobs();
      unsubResults();
      unsubAdmits();
      unsubSettings();
      unsubTicker();
      unsubAlerts();
    };
  }, [isLoading]);

  // Firestore update dispatchers
  const editJobs = async (updatedVal: Job[] | ((prev: Job[]) => Job[])) => {
    const nextJobs = typeof updatedVal === "function" ? updatedVal(jobs) : updatedVal;
    setJobs(nextJobs);
    try {
      // Find deleted entries to purge
      const deleted = jobs.filter(ex => !nextJobs.some(n => n.id === ex.id));
      for (const dj of deleted) {
        await deleteDoc(doc(db, "jobs", String(dj.id)));
      }
      // Upsert created or modified entries
      for (const nj of nextJobs) {
        await setDoc(doc(db, "jobs", String(nj.id)), nj);
      }
      // Also cache to localStorage
      saveData("jobs", nextJobs);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "jobs");
    }
  };

  const editResults = async (updatedVal: ExamResult[] | ((prev: ExamResult[]) => ExamResult[])) => {
    const nextResults = typeof updatedVal === "function" ? updatedVal(results) : updatedVal;
    setResults(nextResults);
    try {
      const deleted = results.filter(ex => !nextResults.some(n => n.id === ex.id));
      for (const dr of deleted) {
        await deleteDoc(doc(db, "results", String(dr.id)));
      }
      for (const nr of nextResults) {
        await setDoc(doc(db, "results", String(nr.id)), nr);
      }
      saveData("results", nextResults);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "results");
    }
  };

  const editAdmits = async (updatedVal: AdmitCard[] | ((prev: AdmitCard[]) => AdmitCard[])) => {
    const nextAdmits = typeof updatedVal === "function" ? updatedVal(admits) : updatedVal;
    setAdmitCards(nextAdmits);
    try {
      const deleted = admits.filter(ex => !nextAdmits.some(n => n.id === ex.id));
      for (const da of deleted) {
        await deleteDoc(doc(db, "admits", String(da.id)));
      }
      for (const na of nextAdmits) {
        await setDoc(doc(db, "admits", String(na.id)), na);
      }
      saveData("admits", nextAdmits);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "admits");
    }
  };

  const editTickerText = async (updatedVal: string | ((prev: string) => string)) => {
    const nextTicker = typeof updatedVal === "function" ? updatedVal(ticker) : updatedVal;
    setTicker(nextTicker);
    try {
      await setDoc(doc(db, "ticker", "live"), { text: nextTicker });
      saveData("ticker", nextTicker);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "ticker/live");
    }
  };

  const editSettings = async (updatedVal: SiteSettings | ((prev: SiteSettings) => SiteSettings)) => {
    const nextSettings = typeof updatedVal === "function" ? updatedVal(siteSettings) : updatedVal;
    setSiteSettings(nextSettings);
    try {
      await setDoc(doc(db, "siteSettings", "config"), nextSettings);
      saveData("siteSettings", nextSettings);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "siteSettings/config");
    }
  };

  const editStateSocials = async (updatedVal: StateSocialMap | ((prev: StateSocialMap) => StateSocialMap)) => {
    const nextSocials = typeof updatedVal === "function" ? updatedVal(stateSocials) : updatedVal;
    setStateSocials(nextSocials);
    try {
      await setDoc(doc(db, "siteSettings", "socials"), nextSocials);
      saveData("stateSocials", nextSocials);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "siteSettings/socials");
    }
  };

  // Register simulated or real Service Worker for background operations on mount
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const registerSW = () => {
        navigator.serviceWorker.register("/sw.js")
          .then((reg) => {
            console.log("[App] Service Worker Registered successfully under scope: ", reg.scope);
            
            // Listen to messages from the service worker (e.g., custom navigation events)
            navigator.serviceWorker.addEventListener("message", (event) => {
              if (event.data && event.data.type === "NAVIGATE_ROUTE") {
                console.log("[App] ServiceWorker requested navigation redirect:", event.data.url);
                addToast(`Redirecting you to match: ${event.data.url}`, "success");
              }
            });
          })
          .catch((err) => {
            console.error("[App] Service Worker registration failed: ", err);
          });
      };

      if (document.readyState === "complete") {
        registerSW();
      } else {
        window.addEventListener("load", registerSW);
      }
    }
  }, []);

  // Save push notification configurations
  useEffect(() => {
    if (!isLoading) {
      saveData("pushSubscription", pushSubscription);
    }
  }, [pushSubscription, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      saveData("pushAlerts", pushAlerts);
    }
  }, [pushAlerts, isLoading]);

  // Master Push Alert Dispatch service
  const sendPushAlertToClient = async (title: string, body: string, category: string, url?: string) => {
    // 1. Play local audio chime (Aesthetic sound effect)
    playNotificationSound();

    // 2. Dispatch to Active Service Worker if available for premium native triggers, else fallback
    let swDispatched = false;
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      if (pushSubscription.subscribed) {
        try {
          navigator.serviceWorker.controller.postMessage({
            type: "SEND_NOTIFICATION",
            payload: { title, body, category, url: url || "/" }
          });
          swDispatched = true;
          console.log("[App] Dispatched push broadcast payload to Service Worker controller.");
        } catch (e) {
          console.warn("[App] Service Worker message routing failed, using fallback:", e);
        }
      }
    }

    if (!swDispatched && "Notification" in window) {
      if (Notification.permission === "granted" && pushSubscription.subscribed) {
        try {
          new Notification(title, {
            body: body,
            icon: "/favicon.ico"
          });
        } catch (e) {
          console.warn("Could not fire standard fallback HTML5 push notification: ", e);
        }
      }
    }

    // 3. Append to lists
    const newAlert: PushNotificationAlert = {
      id: Date.now(),
      title,
      body,
      category,
      createdAt: new Date().toISOString(),
      url
    };
    
    setPushAlerts(prev => [newAlert, ...prev]);
    
    // Save new broadcast alert to database
    try {
      await setDoc(doc(db, "pushAlerts", String(newAlert.id)), newAlert);
    } catch (e) {
      console.warn("Failed saving broadcast alert to Firestore: ", e);
    }

    // 4. Send toast notification
    addToast(`🔔 [${category}] ${title}`, "success");
  };


  // Provide state context with live Firestore mutations and authentication hooks
  const contextValue = {
    jobs,
    results,
    admits,
    ticker,
    siteSettings,
    stateSocials,
    setJobs: editJobs,
    setResults: editResults,
    setAdmitCards: editAdmits,
    setTicker: editTickerText,
    setSiteSettings: editSettings,
    setStateSocials: editStateSocials,
    addToast,
    setView,
    isLoading,
    pushSubscription,
    setPushSubscription,
    pushAlerts,
    setPushAlerts,
    sendPushAlertToClient,
    currentUser,
    loginWithGoogle,
    logoutAdmin
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
