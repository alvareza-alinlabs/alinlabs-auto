import React, { useState } from 'react';
import { Terminal, Settings, ChevronDown, ChevronRight, Copy, Check, Save, Sliders, LogOut, Info } from 'lucide-react';
import InfoModal from './InfoModal';

interface SidebarProps {
  folderPath: string;
  setFolderPath: (val: string) => void;
  fileName: string;
  setFileName: (val: string) => void;
  customCommit: string;
  setCustomCommit: (val: string) => void;
  scriptMode: 'MANUAL' | 'AUTO';
  setScriptMode: (val: 'MANUAL' | 'AUTO') => void;
  scriptExtension: 'ps1' | 'sh';
  setScriptExtension: (val: 'ps1' | 'sh') => void;
  autoPath: string;
  setAutoPath: (val: string) => void;
  autoUsername: string;
  setAutoUsername: (val: string) => void;
  autoToken: string;
  setAutoToken: (val: string) => void;
  autoRepo: string;
  setAutoRepo: (val: string) => void;
  autoBranch: string;
  setAutoBranch: (val: string) => void;
  lfsExtensions: string;
  setLfsExtensions: (val: string) => void;
  lfsSizeLimit: string;
  setLfsSizeLimit: (val: string) => void;
  mobileView: 'KONFIGURASI' | 'WORKSPACE';
  isFreeAccess?: boolean;
  onLogout?: () => void;
}

export default function Sidebar({ 
  folderPath, setFolderPath,
  fileName, setFileName, customCommit, setCustomCommit, 
  scriptMode, setScriptMode, 
  scriptExtension, setScriptExtension,
  autoPath, setAutoPath, autoUsername, setAutoUsername, 
  autoToken, setAutoToken, autoRepo, setAutoRepo, autoBranch, setAutoBranch,
  lfsExtensions, setLfsExtensions, lfsSizeLimit, setLfsSizeLimit,
  mobileView, isFreeAccess, onLogout
}: SidebarProps) {
  const [sections, setSections] = useState({
    simpan: true,
    auto: true,
    eksekusi: true,
  });
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const command = scriptExtension === 'ps1' 
    ? `powershell -ExecutionPolicy Bypass -File "${folderPath ? `${folderPath.replace(/\\$/, '')}\\${fileName}.ps1` : `.\\${fileName}.ps1`}"`
    : `bash "${folderPath ? `${folderPath.replace(/\/$/, '')}/${fileName}.sh` : `./${fileName}.sh`}"`;
  const [copied, setCopied] = useState(false);
  const [cacheSizeStr, setCacheSizeStr] = useState<string>('Menghitung...');
  const [lfsInputToken, setLfsInputToken] = useState('');

  React.useEffect(() => {
    async function calculateCacheSize() {
      try {
        let total = 0;
        const cacheNames = await caches.keys();
        for (const name of cacheNames) {
          const cache = await caches.open(name);
          const requests = await cache.keys();
          for (const request of requests) {
            const response = await cache.match(request);
            if (response) {
              const blob = await response.blob();
              total += blob.size;
            }
          }
        }
        
        if (total === 0) {
          if ('storage' in navigator && 'estimate' in navigator.storage) {
            const estimate = await navigator.storage.estimate();
            if (estimate.usage) {
               total = estimate.usage;
            }
          }
        }
        
        if (total === 0) {
          setCacheSizeStr('0 B');
          return;
        }
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(total) / Math.log(k));
        setCacheSizeStr(parseFloat((total / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]);
      } catch (e) {
        setCacheSizeStr('-');
      }
    }
    calculateCacheSize();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const suggestedExtensions = ['.mp4', '.mp3', '.zip', '.psd', '.exe', '.dll', '.tar.gz', '.iso', '.rar', '.7z'];
  const activeExts = lfsExtensions.split(',').map(e => e.trim()).filter(e => e);
  const inactiveExtensions = suggestedExtensions.filter(ext => !activeExts.includes(ext));

  const removeLfsExtension = (extToRemove: string) => {
    setLfsExtensions(activeExts.filter(e => e !== extToRemove).join(', '));
  };

  const addLfsExtension = (extToAdd: string) => {
    let cleanExt = extToAdd.trim().replace(/\s+/g, '');
    if (cleanExt) {
       if (!cleanExt.startsWith('.')) {
          cleanExt = '.' + cleanExt;
       }
       if (!activeExts.includes(cleanExt)) {
          setLfsExtensions([...activeExts, cleanExt].join(', '));
       }
    }
  };

  const handleLfsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.includes(',')) {
      const tokens = val.split(',');
      let newExts = [...activeExts];
      tokens.forEach(token => {
        let cleanToken = token.trim().replace(/\s+/g, '');
        if (cleanToken) {
           if (!cleanToken.startsWith('.')) {
             cleanToken = '.' + cleanToken;
           }
           if (!newExts.includes(cleanToken)) {
             newExts.push(cleanToken);
           }
        }
      });
      setLfsExtensions(newExts.join(', '));
      setLfsInputToken('');
    } else {
      setLfsInputToken(val);
    }
  };

  const handleLfsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (lfsInputToken.trim()) {
         addLfsExtension(lfsInputToken);
         setLfsInputToken('');
      }
    } else if (e.key === 'Backspace' && !lfsInputToken && activeExts.length > 0) {
      removeLfsExtension(activeExts[activeExts.length - 1]);
    }
  };

  return (
    <aside className={`w-full lg:w-96 flex-1 lg:flex-none border-b lg:border-b-0 lg:border-r border-white/5 bg-[#030509]/80 backdrop-blur-xl p-3 md:p-6 lg:p-8 flex-col overflow-y-auto ${mobileView === 'KONFIGURASI' ? 'flex' : 'hidden'} lg:flex`}>
      <div className="w-full max-w-[600px] mx-auto flex flex-col space-y-4 md:space-y-6 pb-6 lg:pb-8">
        {!isFreeAccess && (
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <label className="flex flex-col gap-2">
              <span className="text-[11px] text-white/70 font-medium tracking-widest uppercase mb-1">Mode Sistem</span>
              <div className="flex bg-white/5 p-1 rounded-lg">
                <button 
                  onClick={() => setScriptMode('MANUAL')}
                  className={`flex-1 py-1.5 text-[11px] font-semibold rounded-md transition-all ${scriptMode === 'MANUAL' ? 'bg-[#00f3ff]/20 text-[#00f3ff] shadow-[0_0_10px_rgba(0,243,255,0.1)]' : 'text-white/40 hover:text-white/80'}`}
                >
                  Manual
                </button>
                <button 
                  onClick={() => setScriptMode('AUTO')}
                  className={`flex-1 py-1.5 text-[11px] font-semibold rounded-md transition-all ${scriptMode === 'AUTO' ? 'bg-[#00f3ff]/20 text-[#00f3ff] shadow-[0_0_10px_rgba(0,243,255,0.1)]' : 'text-white/40 hover:text-white/80'}`}
                >
                  Auto
                </button>
              </div>
            </label>

            <label className="flex flex-col gap-2 relative">
              <span className="text-[11px] text-white/70 font-medium tracking-widest uppercase mb-1">Sistem Operasi</span>
              <div className="flex gap-2 items-center">
                <div className="flex flex-1 bg-white/5 p-1 rounded-lg">
                  <button 
                    onClick={() => setScriptExtension('ps1')}
                    className={`flex-1 py-1.5 text-[11px] font-semibold rounded-md transition-all ${scriptExtension === 'ps1' ? 'bg-[#00f3ff]/20 text-[#00f3ff] shadow-[0_0_10px_rgba(0,243,255,0.1)]' : 'text-white/40 hover:text-white/80'}`}
                  >
                    Win
                  </button>
                  <button 
                    onClick={() => setScriptExtension('sh')}
                    className={`flex-1 py-1.5 text-[11px] font-semibold rounded-md transition-all ${scriptExtension === 'sh' ? 'bg-[#00f3ff]/20 text-[#00f3ff] shadow-[0_0_10px_rgba(0,243,255,0.1)]' : 'text-white/40 hover:text-white/80'}`}
                  >
                    Mac/Lin
                  </button>
                </div>
                <button 
                  onClick={() => setIsInfoModalOpen(true)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#00f3ff]/10 flex items-center justify-center text-white/50 hover:text-[#00f3ff] transition-all border border-transparent hover:border-[#00f3ff]/30 shrink-0"
                  title="Informasi Sistem"
                >
                  <Info size={14} />
                </button>
              </div>
            </label>
          </div>
        )}

      <div className="border border-[#00f3ff]/20 bg-[#00f3ff]/[0.02] rounded-xl overflow-hidden shrink-0 shadow-[0_0_15px_rgba(0,243,255,0.05)]">
        <button 
          onClick={() => toggleSection('simpan')}
          className="w-full flex items-center justify-between p-3 md:p-4 hover:bg-[#00f3ff]/5 transition-colors"
        >
          <div className="flex items-center gap-2 text-[11px] md:text-sm lg:text-xs font-semibold text-[#00f3ff] uppercase tracking-widest">
            <Save size={14} />
            Simpan File
          </div>
          {sections.simpan ? <ChevronDown size={14} className="text-[#00f3ff]/50" /> : <ChevronRight size={14} className="text-[#00f3ff]/50" />}
        </button>
        
        {sections.simpan && (
          <div className="p-3 md:p-4 pt-1 md:pt-2 border-t border-[#00f3ff]/10 space-y-3 md:space-y-4">
            <label className="flex flex-col gap-1.5 md:gap-2">
              <span className="text-[11px] text-white/70 font-medium">Folder Path</span>
              <div className="flex items-stretch rounded-lg overflow-hidden border border-white/10 focus-within:border-[#00f3ff]/50 transition-colors">
                <input 
                  type="text" 
                  value={folderPath}
                  onChange={(e) => setFolderPath(e.target.value)}
                  className="bg-white/5 px-2.5 py-1.5 md:px-3 md:py-2 text-white placeholder-white/50 font-mono outline-none flex-grow min-w-0 text-[11px] md:text-sm lg:text-xs w-full"
                  placeholder="C:\Users\melam\Downloads\"
                />
              </div>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-[11px] text-white/70 font-medium">Nama File</span>
              <div className="flex items-stretch rounded-lg overflow-hidden border border-white/10 focus-within:border-[#00f3ff]/50 transition-colors">
                <input 
                  type="text" 
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                  className="bg-white/5 px-2.5 py-1.5 md:px-3 md:py-2 text-white placeholder-white/50 font-mono outline-none flex-grow min-w-0 text-[11px] md:text-sm lg:text-xs w-full"
                  placeholder="nama-file"
                />
                <span className="bg-white/10 px-2.5 py-1.5 md:px-3 md:py-2 text-white/50 text-[11px] md:text-sm lg:text-xs flex items-center border-l border-white/5">.{scriptExtension}</span>
              </div>
            </label>
          </div>
        )}
      </div>

      {scriptMode === 'AUTO' && (
        <div className="border border-[#00f3ff]/20 bg-[#00f3ff]/[0.02] rounded-xl overflow-hidden shrink-0 shadow-[0_0_15px_rgba(0,243,255,0.05)]">
          <button 
            onClick={() => toggleSection('auto')}
            className="w-full flex items-center justify-between p-3 md:p-4 hover:bg-[#00f3ff]/5 transition-colors"
          >
            <div className="flex items-center gap-2 text-[11px] md:text-sm lg:text-xs font-semibold text-[#00f3ff] uppercase tracking-widest">
              <Sliders size={14} />
              Konfigurasi Otomatis
            </div>
            {sections.auto ? <ChevronDown size={14} className="text-[#00f3ff]/50" /> : <ChevronRight size={14} className="text-[#00f3ff]/50" />}
          </button>
          
          {sections.auto && (
            <div className="p-3 md:p-4 pt-1 md:pt-2 border-t border-[#00f3ff]/10 space-y-3 md:space-y-4">
              <label className="flex flex-col gap-1.5 md:gap-2">
                <span className="text-[11px] text-white/70 font-medium">Path Direktori Target</span>
                <input 
                  type="text" 
                  value={autoPath}
                  onChange={(e) => setAutoPath(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 md:px-3 md:py-2 text-white placeholder-white/30 font-mono outline-none text-[11px] md:text-sm lg:text-xs focus:border-[#00f3ff]/50 transition-colors"
                  placeholder="C:\Project atau /path/to/project"
                />
              </label>

              <label className="flex flex-col gap-1.5 md:gap-2">
                <span className="text-[11px] text-white/70 font-medium">Username GitHub</span>
                <input 
                  type="text" 
                  value={autoUsername}
                  onChange={(e) => setAutoUsername(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 md:px-3 md:py-2 text-white placeholder-white/50 font-mono outline-none text-[11px] md:text-sm lg:text-xs focus:border-[#00f3ff]/50 transition-colors"
                  placeholder="Username"
                />
              </label>

              <label className="flex flex-col gap-1.5 md:gap-2">
                <span className="text-[11px] text-white/70 font-medium">Token GitHub</span>
                <input 
                  type="text" 
                  value={autoToken}
                  onChange={(e) => setAutoToken(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 md:px-3 md:py-2 text-white placeholder-white/50 font-mono outline-none text-[11px] md:text-sm lg:text-xs focus:border-[#00f3ff]/50 transition-colors"
                  placeholder="ghp_xxx"
                />
              </label>

              <div className="grid grid-cols-2 gap-2 md:gap-3">
                <label className="flex flex-col gap-1.5 md:gap-2">
                  <span className="text-[11px] text-white/70 font-medium">Repositori</span>
                  <input 
                    type="text" 
                    value={autoRepo}
                    onChange={(e) => setAutoRepo(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 md:px-3 md:py-2 text-white placeholder-white/50 font-mono outline-none text-[11px] md:text-sm lg:text-xs focus:border-[#00f3ff]/50 transition-colors"
                    placeholder="repo-name"
                  />
                </label>

                <label className="flex flex-col gap-1.5 md:gap-2">
                  <span className="text-[11px] text-white/70 font-medium">Cabang Target</span>
                  <input 
                    type="text" 
                    value={autoBranch}
                    onChange={(e) => setAutoBranch(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 md:px-3 md:py-2 text-white placeholder-white/50 font-mono outline-none text-[11px] md:text-sm lg:text-xs focus:border-[#00f3ff]/50 transition-colors"
                    placeholder="main"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1.5 md:gap-2">
                <span className="text-[11px] text-white/70 font-medium">Pesan Commit</span>
                <input 
                  type="text" 
                  value={customCommit}
                  onChange={(e) => setCustomCommit(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 md:px-3 md:py-2 text-white placeholder-white/50 font-mono outline-none text-[11px] md:text-sm lg:text-xs focus:border-[#00f3ff]/50 transition-colors"
                  placeholder="Auto Commit"
                />
              </label>

              <div className="pt-2 border-t border-white/5 space-y-3 md:space-y-4">
                <label className="flex flex-col gap-1.5 md:gap-2">
                  <span className="text-[11px] text-white/70 font-medium">Ekstensi Git LFS (pisahkan koma)</span>
                  <div className="flex flex-wrap items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg p-1.5 focus-within:border-[#00f3ff]/50 transition-colors bg-[linear-gradient(90deg,transparent_0%,rgba(0,243,255,0.05)_50%,transparent_100%)] focus-within:bg-[#00f3ff]/5 shadow-inner">
                    {activeExts.map(ext => (
                      <span
                        key={ext}
                        onClick={() => removeLfsExtension(ext)}
                        className="flex items-center gap-1 px-2 py-1 bg-[#00f3ff]/20 text-[#00f3ff] border border-[#00f3ff]/50 rounded text-[10px] font-mono cursor-pointer hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 transition-all group"
                        title="Hapus"
                      >
                        {ext}
                        <span className="opacity-50 group-hover:opacity-100 transition-opacity">×</span>
                      </span>
                    ))}
                    <input 
                      type="text" 
                      value={lfsInputToken}
                      onChange={handleLfsInputChange}
                      onKeyDown={handleLfsKeyDown}
                      className="flex-1 min-w-[60px] bg-transparent text-[#00f3ff] placeholder-white/30 font-mono outline-none text-[11px] md:text-sm lg:text-xs px-1 py-1"
                      placeholder={activeExts.length === 0 ? "Contoh: .mp4, zip" : ""}
                    />
                  </div>
                  {inactiveExtensions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {inactiveExtensions.map(ext => (
                        <button
                          key={ext}
                          onClick={() => addLfsExtension(ext)}
                          className="px-2 py-0.5 text-[10px] font-mono rounded border transition-colors bg-white/5 text-white/50 border-white/10 hover:border-white/30 hover:text-white/80 hover:bg-white/10 active:scale-95"
                        >
                          + {ext}
                        </button>
                      ))}
                    </div>
                  )}
                </label>

                <label className={`flex flex-col gap-1.5 md:gap-2 transition-opacity duration-300 ${lfsExtensions.trim() ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                  <span className="text-[11px] text-white/70 font-medium whitespace-nowrap">Batas Ukuran LFS (Opsional)</span>
                  <div className="flex items-stretch rounded-lg overflow-hidden border border-white/10 focus-within:border-[#00f3ff]/50 transition-colors">
                    <input 
                      type="number" 
                      value={lfsSizeLimit}
                      onChange={(e) => setLfsSizeLimit(e.target.value)}
                      className="bg-white/5 px-2.5 py-1.5 md:px-3 md:py-2 text-[#00f3ff] placeholder-white/40 font-mono outline-none flex-grow min-w-0 text-[11px] md:text-sm lg:text-xs w-full"
                      placeholder="Contoh: 10"
                      disabled={!lfsExtensions.trim()}
                    />
                    <span className="bg-white/10 px-2.5 py-1.5 md:px-3 md:py-2 text-white/70 text-[11px] md:text-sm lg:text-xs flex items-center border-l border-white/5 font-bold">MB</span>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="border border-[#00f3ff]/20 bg-[#00f3ff]/[0.02] rounded-xl overflow-hidden shrink-0 shadow-[0_0_15px_rgba(0,243,255,0.05)]">
        <button 
          onClick={() => toggleSection('eksekusi')}
          className="w-full flex items-center justify-between p-3 md:p-4 hover:bg-[#00f3ff]/5 transition-colors"
        >
          <div className="flex items-center gap-2 text-[11px] md:text-sm lg:text-xs font-semibold text-[#00f3ff] uppercase tracking-widest">
            <Terminal size={14} />
            Protokol Eksekusi
          </div>
          {sections.eksekusi ? <ChevronDown size={14} className="text-[#00f3ff]/50" /> : <ChevronRight size={14} className="text-[#00f3ff]/50" />}
        </button>
        
        {sections.eksekusi && (
          <div className="p-3 md:p-4 pt-1 md:pt-2 border-t border-[#00f3ff]/10 space-y-3 md:space-y-4">
            <div className="flex flex-col gap-2 md:gap-3 w-full">
              <span className="text-[11px] text-white/70 font-medium">Eksekusi di PowerShell:</span>
              <div className="relative group">
                <div className="bg-black/80 border border-white/10 rounded-lg p-3 pr-10 text-white/90 font-mono text-[10px] break-all selection:bg-[#00f3ff]/30 leading-relaxed shadow-inner">
                  {command}
                </div>
                <button 
                  onClick={handleCopy}
                  className="absolute right-2 top-2 p-1.5 rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                  title="Salin Perintah"
                >
                  {copied ? <Check size={14} className="text-[#00f3ff]" /> : <Copy size={14} />}
                </button>
              </div>
              <span className="text-[10px] text-white/50 leading-relaxed mt-1">
                Jalankan perintah ini di dalam PowerShell Anda setelah file berhasil disimpan atau diunduh.
              </span>
            </div>
          </div>
        )}
      </div>

      {onLogout && (
        <div className="mt-6 pt-4 border-t border-white/5 flex flex-col gap-2 lg:hidden">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-1.5 p-2 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors tracking-widest uppercase text-[10px] font-bold"
          >
            <LogOut size={12} />
            Logout System
          </button>
          
          <button 
            onClick={() => {
              caches.keys().then((names) => {
                for (let name of names) {
                  caches.delete(name);
                }
              }).finally(() => {
                window.location.reload();
              });
            }}
            className="w-full flex items-center justify-center gap-1.5 p-2 rounded-lg border border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10 text-orange-400 hover:text-orange-300 transition-colors tracking-widest uppercase text-[10px] font-bold"
          >
            <div className="flex flex-col items-center gap-0.5">
              <span>Reset Cache</span>
              <span className="text-[9px] text-orange-400/60 font-mono lowercase tracking-normal">({cacheSizeStr})</span>
            </div>
          </button>
        </div>
      )}
      </div>
      <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
    </aside>
  );
}
