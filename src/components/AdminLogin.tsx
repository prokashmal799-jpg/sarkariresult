import React, { useState } from "react";
import { ShieldAlert, Lock, User, ArrowLeft, Eye, EyeOff, KeyRound, CheckCircle2 } from "lucide-react";

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export function AdminLogin({ onLoginSuccess, onCancel }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Constants for sandbox login
  const ACTUAL_USER = "admin";
  const ACTUAL_PASS = "sarkari321";

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate standard server loading delay
    setTimeout(() => {
      if (username === ACTUAL_USER && password === ACTUAL_PASS) {
        // Save in sessionStorage to keep authorization alive on manual browser updates
        sessionStorage.setItem("sarkari_admin_authorized", "true");
        onLoginSuccess();
      } else {
        setError("Invalid Admin ID or Access Code. Please review security credentials.");
        setLoading(false);
      }
    }, 800);
  };

  const handleAutofill = () => {
    setUsername(ACTUAL_USER);
    setPassword(ACTUAL_PASS);
    setError("");
  };

  const secureAdminUrl = `${window.location.origin}${window.location.pathname}?admin=true`;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 select-none">
      <div className="w-full max-w-md bg-white rounded-3xl border-2 border-slate-200 shadow-2xl overflow-hidden relative">
        
        {/* Navy Premium Heading banner */}
        <div className="bg-gradient-to-r from-[#003399] to-[#0c1445] p-6 text-white border-b-4 border-amber-400">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-white/10 border border-white/20 text-amber-300 rounded-2xl shadow-lg ring-4 ring-white/5">
              <KeyRound className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="font-baloo font-black text-lg sm:text-xl tracking-wide uppercase leading-none">
                Sarkari Admin Suite
              </h2>
              <p className="font-sans text-[11px] text-slate-300 mt-1 uppercase tracking-widest leading-none font-bold">
                🔒 Bureau of Central Recruitment Control
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Informational Warning Alert */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 flex gap-3 text-slate-700">
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-amber-955 mb-0.5 uppercase tracking-wide">Authorized Personnel Only</p>
              <p className="font-sans font-semibold text-slate-650 leading-relaxed">
                Unauthorized access to state or central listings databases is fully audited. Use Sandbox guidelines below to test authorization.
              </p>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 font-bold text-xs">
            {/* User ID field */}
            <div>
              <label className="block text-slate-500 mb-1.5 font-sans">Admin Username / ID</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input 
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter authorized User ID"
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:bg-white focus:border-[#003399] rounded-xl p-2.5 pl-10 outline-none font-sans font-bold text-slate-800 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-slate-500 mb-1.5 font-sans">Security Access Code</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:bg-white focus:border-[#003399] rounded-xl p-2.5 pl-10 pr-10 outline-none font-sans font-bold text-slate-800 transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-[#cc0000] text-xs font-semibold font-sans bg-rose-50 border border-rose-150 p-2.5 rounded-xl flex items-center gap-2">
                <span className="shrink-0 font-extrabold">✕</span>
                <span>{error}</span>
              </div>
            )}

            {/* Central action buttons */}
            <div className="pt-2 gap-3 flex flex-col sm:flex-row">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 border-2 border-slate-200 font-sans text-slate-500 hover:text-slate-700 hover:bg-slate-50 h-11 rounded-xl font-black transition-all flex items-center justify-center gap-1.5 uppercase active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Home Portal</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-[2] bg-[#cc0000] text-white hover:bg-red-750 font-sans h-11 rounded-xl font-black transition-all shadow-lg shadow-red-550/20 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Authenticate Key</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Sandbox Credentials Assistant Toggle Card */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#003399] font-black uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-150">
                Sandbox Test Mode (डेमो क्रेडेंशियल)
              </span>
              <button 
                type="button" 
                onClick={handleAutofill}
                className="text-xs text-[#cc0000] hover:underline font-black cursor-pointer uppercase tracking-wider"
              >
                Auto-Fill
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono leading-none">
              <div className="bg-white border border-slate-150 p-2 rounded-lg">
                <span className="text-slate-400 block mb-1">USER ID (आईडी):</span>
                <strong className="text-slate-800 text-xs block font-bold select-all">admin</strong>
              </div>
              <div className="bg-white border border-slate-150 p-2 rounded-lg">
                <span className="text-slate-400 block mb-1">PASSWORD (पासवर्ड):</span>
                <strong className="text-[#cc0000] text-xs block font-bold select-all">sarkari321</strong>
              </div>
            </div>

            <div className="text-[11px] pt-1.5 border-t border-slate-200">
              <span className="text-slate-500 block leading-tight">
                🔗 <strong className="text-[#003399]">Alternate Direct URL:</strong> You can load the Admin environment instantly at any time by loading this dedicated address query:
              </span>
              <code className="block mt-1.5 bg-white border border-slate-150 rounded-lg p-2 text-[9px] text-[#cc0000] select-all break-all text-center">
                {secureAdminUrl}
              </code>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
