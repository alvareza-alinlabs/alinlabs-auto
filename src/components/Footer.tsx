import React, { useState, useEffect } from 'react';
import { LogOut, Trash2 } from 'lucide-react';

interface FooterProps {
  activeTab: 'CODE' | 'SIMULATOR';
  scriptContent: string;
  onLogout?: () => void;
}

export default function Footer({ activeTab, scriptContent, onLogout }: FooterProps) {
  const [cacheSizeStr, setCacheSizeStr] = useState<string>('Menghitung...');

  useEffect(() => {
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

  return (
    <footer className="h-14 border-t border-white/5 bg-[#0a0f18] px-6 flex flex-row items-center justify-between text-[11px] shrink-0 relative z-20 hidden lg:flex">
      <div className="flex space-x-6 items-center">
        <span className="text-emerald-400 font-semibold shadow-[0_0_10px_rgba(52,211,153,0.3)] flex flex-row items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className={(activeTab === 'CODE' ? "bg-amber-400" : "bg-emerald-400 animate-ping") + " absolute inline-flex h-full w-full rounded-full opacity-75"}></span>
            <span className={(activeTab === 'CODE' ? "bg-amber-500" : "bg-emerald-500") + " relative inline-flex rounded-full h-2 w-2"}></span>
          </span>
          {activeTab === 'CODE' ? 'Menunggu Eksekusi' : 'Simulasi Aktif'}
        </span>
        <span className="text-white/40">Baris: {scriptContent.split('\n').length}</span>
        <span className="text-white/40">Ukuran: {(new Blob([scriptContent]).size / 1024).toFixed(2)}KB</span>
      </div>
      <div className="flex items-center gap-4">
        {onLogout && (
          <>
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-orange-500/5 hover:bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:text-orange-300 transition-colors tracking-widest uppercase font-bold"
            >
              <Trash2 size={12} />
              Reset Cache <span className="text-[9px] text-orange-400/60 font-mono pl-1 lowercase tracking-normal">({cacheSizeStr})</span>
            </button>
            <button 
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 text-red-400 hover:text-red-300 transition-colors tracking-widest uppercase font-bold"
            >
              <LogOut size={12} />
              Logout
            </button>
          </>
        )}
      </div>
    </footer>
  );
}
