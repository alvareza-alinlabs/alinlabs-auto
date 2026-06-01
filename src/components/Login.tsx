import React, { useState, useEffect } from 'react';
import { Mail, Lock, ShieldAlert, Loader2, KeyRound, Eye, EyeOff, Download } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface LoginProps {
  onLogin: (freeAccess?: boolean) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [authenticating, setAuthenticating] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallOverlay, setShowInstallOverlay] = useState(false);
  const [loginProfiles, setLoginProfiles] = useState<Array<{ email: string, p: string, label: string }>>([]);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('cyberLoginProfiles');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          setLoginProfiles(parsed);
          setShowForm(false);
        }
      } catch(e) {}
    }
    
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      window.deferredPrompt = e;
    };
    
    // Poll for the prompt in case it was caught by index.html before React mounted
    const interval = setInterval(() => {
      if (window.deferredPrompt && !deferredPrompt) {
        setDeferredPrompt(window.deferredPrompt);
      }
    }, 500);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [deferredPrompt]);

  const handleInstallApp = async () => {
    // Check if we're already running as a standalone PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        ('standalone' in window.navigator && (window.navigator as any).standalone);
                        
    if (isStandalone) {
      alert("Aplikasi PWA sudah terinstall dan sedang dibuka di mode aplikasi.");
      return;
    }

    // Try the component state first, or the global window state
    const promptToUse = deferredPrompt || window.deferredPrompt;
    
    if (promptToUse) {
      promptToUse.prompt();
      try {
        const { outcome } = await promptToUse.userChoice;
        if (outcome === 'accepted') {
          setDeferredPrompt(null);
          window.deferredPrompt = null;
        }
      } catch (e) {
         console.error('Install prompt error', e);
      }
    } else {
      // Show elegant fallback overlay instead of crude alert
      setShowInstallOverlay(true);
    }
  };

  const executeLogin = (testEmail: string, testPassword: string) => {
    setError('');
    setAuthenticating(true);

    setTimeout(() => {
      if (testEmail === 'halo.alvareza@gmail.com' && testPassword === 'halo.alvareza2026!') {
        // Save profile
        const existingIndex = loginProfiles.findIndex((p) => p.email === testEmail);
        const displayLabel = testEmail.split('@')[0] || testEmail;
        
        let newProfiles = [...loginProfiles];
        if (existingIndex >= 0) {
          newProfiles[existingIndex].p = testPassword;
        } else {
          newProfiles.push({ email: testEmail, p: testPassword, label: displayLabel });
        }
        
        localStorage.setItem('cyberLoginProfiles', JSON.stringify(newProfiles));
        setLoginProfiles(newProfiles);
        
        onLogin();
      } else {
        setError('ACCESS DENIED: Unauthorized credentials.');
        setAuthenticating(false);
      }
    }, 800);
  };

  const handleProfileLogin = (profEmail: string, profPassword: string) => {
    executeLogin(profEmail, profPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeLogin(email, password);
  };

  return (
    <div className="min-h-screen w-full bg-[#030509] flex flex-col md:flex-row font-sans text-slate-200 overflow-y-auto overflow-x-hidden md:overflow-hidden relative">
      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {/* Left panel for Lottie animation */}
      <div className="hidden md:flex md:w-1/2 bg-[#050914] border-r border-[#00f3ff]/20 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-[#00f3ff]/5 z-0" 
          style={{ backgroundImage: 'radial-gradient(circle at center, rgba(0,243,255,0.1) 0%, transparent 70%)'}}
        ></div>
        
        {/* Title Above Lottie */}
        <div className="z-10 text-center mb-8 w-full max-w-lg">
          <h1 className="text-3xl lg:text-4xl font-sans font-bold text-white tracking-wider mb-2 drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]">
            ALINLABS UTILITY
          </h1>
          <h2 className="text-base lg:text-lg font-mono text-[#00f3ff] tracking-widest opacity-90">
            TECHNOLOGY OPERATIONS
          </h2>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent mx-auto mt-6 opacity-50"></div>
        </div>

        <div className="z-10 w-full max-w-lg opacity-80 pointer-events-none">
          <DotLottieReact
            src="/indonesian-maps-white.lottie"
            loop
            autoplay
          />
        </div>

      </div>

      {/* Right panel for Login Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-start md:justify-center p-0 md:p-12 relative min-h-screen md:min-h-0">
        {/* Mobile Header & Lottie */}
        <div className="md:hidden flex flex-col items-center justify-center flex-grow py-8 px-6 w-full min-h-[40vh]">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-sans font-bold text-white tracking-widest drop-shadow-[0_0_10px_rgba(0,243,255,0.4)]">
              ALINLABS UTILITY
            </h1>
            <h2 className="text-sm font-mono text-[#00f3ff] tracking-widest mt-2">
              TECHNOLOGY OPERATIONS
            </h2>
          </div>
          <div className="w-48 opacity-80 pointer-events-none mb-6 relative z-10">
            <DotLottieReact
              src="/indonesian-maps-white.lottie"
              loop
              autoplay
            />
          </div>
        </div>

        <div className="w-full md:max-w-md bg-[#0a0f1a] border-t border-[#00f3ff]/20 md:border md:border-[#00f3ff]/20 p-6 md:p-8 rounded-t-3xl md:rounded-xl shadow-[0_-20px_40px_rgba(0,0,0,0.5)] md:shadow-[0_0_40px_rgba(0,0,0,0.5)] relative mt-auto md:mt-0 flex-shrink-0 z-10 scroll-mt-2 overflow-visible pb-12 md:pb-8">
          {/* Mobile Sheet Handle */}
          <div className="w-12 h-1.5 bg-slate-800 rounded-full mx-auto mb-6 md:hidden"></div>
          
          {/* Top Neon Accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent opacity-50"></div>

          <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 mb-8 text-center md:text-left">
            <div className="hidden md:block p-2 bg-[#00f3ff]/10 rounded border border-[#00f3ff]/30 text-[#00f3ff]">
              <KeyRound size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-widest text-white">AUTO SYSTEM</h1>
              <div className="text-xs font-mono text-[#00f3ff] mt-1 md:mt-0">SECURE LOGIN GATEWAY</div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded flex items-start gap-3">
              <ShieldAlert className="text-red-500 shrink-0 mt-0.5" size={18} />
              <p className="text-sm font-mono text-red-400">{error}</p>
            </div>
          )}

          {!showForm && loginProfiles.length > 0 ? (
            <div className="space-y-4" style={{ animation: 'slideUpFade 0.3s ease-out forwards' }}>
              <h3 className="text-sm font-mono text-slate-400 mb-4 border-b border-[#00f3ff]/20 pb-2">SAVED PROFILES</h3>
              <div className="space-y-3">
                {loginProfiles.map(profile => (
                  <button 
                    key={profile.email} 
                    onClick={() => handleProfileLogin(profile.email, profile.p)}
                    disabled={authenticating}
                    className="w-full bg-[#030509] hover:bg-[#00f3ff]/10 border border-slate-800 hover:border-[#00f3ff]/50 rounded-lg p-4 flex items-center gap-4 transition-all group text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="w-10 h-10 rounded-full shrink-0 bg-[#00f3ff]/10 text-[#00f3ff] flex items-center justify-center font-bold font-sans uppercase">
                      {profile.label.charAt(0)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="font-mono font-bold text-white group-hover:text-[#00f3ff] transition-colors truncate">{profile.label}</div>
                      <div className="text-xs font-mono text-slate-500 truncate">{profile.email}</div>
                    </div>
                    <div className="text-[#00f3ff]/0 group-hover:text-[#00f3ff] transition-colors">
                      {authenticating ? <Loader2 size={18} className="animate-spin text-[#00f3ff]" /> : <KeyRound size={18} />}
                    </div>
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => setShowForm(true)}
                className="w-full mt-4 py-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
              >
                + ADD DIFFERENT ACCOUNT
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" style={{ animation: 'slideUpFade 0.3s ease-out forwards' }}>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Operator ID (Email)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#030509] border border-slate-800 focus:border-[#00f3ff]/50 rounded py-2.5 pl-10 pr-4 text-sm outline-none transition-colors font-mono"
                    placeholder="Enter identity..."
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Passcode</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#030509] border border-slate-800 focus:border-[#00f3ff]/50 rounded py-2.5 pl-10 pr-12 text-sm outline-none transition-colors font-mono text-slate-200"
                    placeholder="••••••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#00f3ff] transition-colors focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={authenticating}
                className="w-full mt-6 bg-[#00f3ff]/10 hover:bg-[#00f3ff]/20 text-[#00f3ff] border border-[#00f3ff]/30 py-3 rounded font-mono font-bold tracking-widest transition-all uppercase flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {authenticating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    AUTHENTICATING...
                  </>
                ) : (
                  <>
                    INITIATE LOGIN
                    <Lock size={16} className="group-hover:hidden text-[#00f3ff]/70" />
                    <KeyRound size={16} className="hidden group-hover:block text-[#00f3ff]/70" />
                  </>
                )}
              </button>
              
              {loginProfiles.length > 0 && (
                <button 
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="w-full mt-2 py-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
                >
                  ← BACK TO SAVED PROFILES
                </button>
              )}
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-[#00f3ff]/10">
            <button
              onClick={() => onLogin(true)}
              className="w-full bg-[#00f3ff]/5 hover:bg-[#00f3ff]/15 text-[#00f3ff]/80 hover:text-[#00f3ff] border border-[#00f3ff]/20 py-2.5 rounded text-xs font-mono tracking-wider transition-all uppercase flex items-center justify-center gap-2 group"
            >
              FREE ACCESS MODE
            </button>

            <div className="mt-4 text-center">
              <button
                onClick={handleInstallApp}
                className="text-xs font-mono text-slate-500 hover:text-[#00f3ff] transition-colors underline underline-offset-4"
              >
                INSTALL APP PWA
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fallback Install Overlay */}
      {showInstallOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" style={{ animation: 'slideUpFade 0.3s ease-out forwards' }}>
          <div className="bg-[#0a0f1a] border border-[#00f3ff]/30 p-8 rounded-xl max-w-sm w-full shadow-[0_0_40px_rgba(0,243,255,0.15)] relative">
            <button 
              onClick={() => setShowInstallOverlay(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              ×
            </button>
            <div className="w-12 h-12 bg-[#00f3ff]/10 text-[#00f3ff] rounded-full flex items-center justify-center mb-6 mx-auto">
              <Download size={24} />
            </div>
            <h3 className="text-center font-bold text-white tracking-widest mb-2 font-sans">INSTALL ALINLABS AUTO</h3>
            <p className="text-center text-sm text-slate-400 font-mono mb-6 leading-relaxed">
              Instalasi otomatis tidak di izinkan oleh browser pada halaman ini.
            </p>
            
            <div className="bg-[#030509] p-4 rounded-lg border border-slate-800 space-y-4 font-mono text-sm">
              <div className="flex flex-col gap-2">
                <span className="text-[#00f3ff] font-bold">PENGGUNA ANDROID/CHROME:</span>
                <span className="text-slate-300">Ketuk ikon <span className="text-white bg-slate-800 px-1 rounded">⋮</span> di pojok kanan atas browser, lalu pilih "Add to Home screen" atau "Install app".</span>
              </div>
              <div className="h-px bg-slate-800/50 w-full" />
              <div className="flex flex-col gap-2">
                <span className="text-[#00f3ff] font-bold">PENGGUNA IOS/SAFARI:</span>
                <span className="text-slate-300">Ketuk ikon "Share" (kotak dengan panah ke atas) di bawah layar, lalu pilih "Add to Home Screen".</span>
              </div>
            </div>
            
            <button 
              onClick={() => setShowInstallOverlay(false)}
              className="w-full mt-6 bg-[#00f3ff]/20 hover:bg-[#00f3ff]/30 text-[#00f3ff] border border-[#00f3ff]/30 py-3 rounded font-mono font-bold tracking-widest transition-all uppercase"
            >
              MENGERTI
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
