import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Info, Terminal, Command, Monitor } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const content = (
    <>
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-[#00f3ff]/10">
        <h2 className="text-lg font-semibold text-[#00f3ff] flex items-center gap-2">
          <Info size={20} />
          Informasi Sistem
        </h2>
        <button 
          onClick={onClose}
          className="text-white/50 hover:text-white transition-colors p-1"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="p-4 md:p-6 overflow-y-auto" style={{ maxHeight: isMobile ? '70vh' : '80vh' }}>
        <div className="space-y-6">
          
          {/* Skrip Info */}
          <section>
            <h3 className="text-[13px] font-bold text-white/90 mb-3 flex items-center gap-2 uppercase tracking-widest">
              <Terminal size={14} className="text-[#00f3ff]" />
              Tentang Skrip Automasi
            </h3>
            <p className="text-xs text-white/70 leading-relaxed mb-4 text-justify">
              Skrip automasi (.ps1 untuk Windows PowerShell dan .sh untuk macOS/Linux Bash) adalah file eksekusi yang berisi instruksi otomatisasi. Alinlabs Auto memanfaatkan skrip ini untuk mengeksekusi perintah sinkronisasi Git secara otomatis ke repositori Anda.
            </p>
            
            <div className="bg-black/40 border border-white/5 rounded-lg p-3">
              <h4 className="text-[11px] text-white/50 mb-2 font-mono">Shortcut Penting (Terminal Windows/Mac/Lin):</h4>
              <ul className="space-y-2 text-xs font-mono">
                <li className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-white/80">Buka Terminal/PS</span>
                  <span className="bg-white/10 px-2 py-0.5 rounded text-[#00f3ff]">Ctrl+Alt+T / Win+X, i</span>
                </li>
                <li className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-white/80">Buka Directory</span>
                  <span className="bg-white/10 px-2 py-0.5 rounded text-[#00f3ff]">cd [path]</span>
                </li>
                <li className="flex justify-between items-center bg-white/5 p-2 rounded">
                  <span className="text-white/80">Jalankan Skrip</span>
                  <span className="bg-white/10 px-2 py-0.5 rounded text-[#00f3ff]">.\nama.ps1 / bash nama.sh</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Git Install Info */}
          <section>
            <h3 className="text-[13px] font-bold text-white/90 mb-3 flex items-center gap-2 uppercase tracking-widest mt-2">
              <Command size={14} className="text-[#00f3ff]" />
              Instalasi Git
            </h3>
            <p className="text-xs text-white/70 leading-relaxed mb-4">
              Sistem ini membutuhkan Git untuk melakukan sinkronisasi data. Jika perangkat Anda belum terinstall Git, silakan unduh melalui tautan resmi berikut sesuai Sistem Operasi Anda:
            </p>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <a 
                href="https://git-scm.com/install/windows" 
                target="_blank" 
                rel="noreferrer"
                className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white/5 hover:bg-[#00f3ff]/10 border border-white/10 hover:border-[#00f3ff]/50 rounded-xl transition-all group"
              >
                <div className="text-white/40 group-hover:text-[#00f3ff] transition-colors scale-75 sm:scale-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l16-4v24l-16-4z"/><path d="M4 12h16"/><path d="M12 2v20"/></svg>
                </div>
                <span className="text-[9px] sm:text-[11px] font-bold tracking-wider text-white/80 uppercase">Windows</span>
              </a>
              
              <a 
                href="https://git-scm.com/install/mac" 
                target="_blank" 
                rel="noreferrer"
                className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white/5 hover:bg-[#00f3ff]/10 border border-white/10 hover:border-[#00f3ff]/50 rounded-xl transition-all group"
              >
                <div className="text-white/40 group-hover:text-[#00f3ff] transition-colors scale-75 sm:scale-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 1.44-1.22 0-3-1.44-5-1.44-2.89 0-5 2.11-5 4.78 0 4.22 3 12.22 6 12.22.56 0 1.94-.56 2.5-.56s2 .56 2.5.56z"/><path d="M12 5.06c0-2.8 2.2-5 5-5 .5 0 1.25.17 1.5.25.17 2.44-1.83 5-4.5 5A4.34 4.34 0 0 1 12 5.06z"/></svg>
                </div>
                <span className="text-[9px] sm:text-[11px] font-bold tracking-wider text-white/80 uppercase">macOS</span>
              </a>
              
              <a 
                href="https://git-scm.com/install/linux" 
                target="_blank" 
                rel="noreferrer"
                className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white/5 hover:bg-[#00f3ff]/10 border border-white/10 hover:border-[#00f3ff]/50 rounded-xl transition-all group"
              >
                <div className="text-white/40 group-hover:text-[#00f3ff] transition-colors scale-75 sm:scale-100 flex items-center justify-center">
                  <Monitor size={28} />
                </div>
                <span className="text-[9px] sm:text-[11px] font-bold tracking-wider text-white/80 uppercase">Linux</span>
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-end lg:items-center justify-center p-0 lg:p-4 bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div 
        className="w-full lg:w-[500px] bg-[#0a0f1a] bg-gradient-to-b from-[#0a0f1a] to-[#05070a] lg:border border-[#00f3ff]/20 lg:rounded-2xl rounded-t-2xl shadow-[0_-10px_40px_rgba(0,243,255,0.1)] lg:shadow-[0_0_40px_rgba(0,243,255,0.15)] flex flex-col overflow-hidden animate-slideUpFade"
        onClick={(e) => e.stopPropagation()}
      >
        {isMobile && (
          <div className="w-full flex justify-center pt-3 pb-1" onClick={onClose}>
            <div className="w-12 h-1.5 bg-white/20 rounded-full" />
          </div>
        )}
        {content}
      </div>
    </div>,
    document.body
  );
}
