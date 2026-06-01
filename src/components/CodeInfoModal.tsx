import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Info, ChevronRight, Terminal } from 'lucide-react';

interface CodeInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  scriptExtension: 'ps1' | 'sh';
}

export default function CodeInfoModal({ isOpen, onClose, scriptExtension }: CodeInfoModalProps) {
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

  const renderWindowsInfo = () => (
    <div className="space-y-4">
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <h3 className="text-[13px] font-bold text-white/90 mb-3 flex items-center gap-2 uppercase tracking-widest text-[#00f3ff]">
          <Terminal size={14} />
          Windows PowerShell (.ps1)
        </h3>
        <p className="text-xs text-white/70 leading-relaxed mb-4 text-justify">
          Skrip PowerShell ini membantu Anda mengeksekusi operasi otomatisasi pada lingkungan Windows. Ikuti langkah berikut untuk menjalankannya:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-xs text-white/80">
          <li>Pastikan Anda telah menginstal <strong>Git untuk Windows</strong>.</li>
          <li>Buka <strong>PowerShell</strong> (Tekan <kbd className="bg-white/10 px-1 rounded">Win + X</kbd>, lalu pilih Windows PowerShell).</li>
          <li>Gunakan perintah <kbd className="bg-white/10 px-1 rounded text-[#00f3ff]">cd</kbd> untuk berpindah ke direktori tempat file skrip disimpan.</li>
          <li>Jalankan skrip dengan mengetik: <kbd className="bg-white/10 px-1 rounded text-[#00f3ff]">.\namafile.ps1</kbd></li>
        </ol>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
        <h4 className="text-xs font-bold text-amber-400 mb-2">Troubleshooting Execution Policy</h4>
        <p className="text-xs text-amber-200/70 leading-relaxed mb-2">
          Jika Anda mendapatkan error "cannot be loaded because running scripts is disabled on this system", jalankan perintah berikut sekali di PowerShell:
        </p>
        <code className="block w-full bg-black/40 border border-amber-500/10 rounded p-2 text-[#00f3ff] text-[10px] break-all">
          Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
        </code>
      </div>
    </div>
  );

  const renderUnixInfo = () => (
    <div className="space-y-4">
      {/* Mac/Linux */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <h3 className="text-[13px] font-bold text-white/90 mb-3 flex items-center gap-2 uppercase tracking-widest text-[#00f3ff]">
          <Terminal size={14} />
          Mac / Linux (.sh)
        </h3>
        <p className="text-xs text-white/70 leading-relaxed mb-3 text-justify">
          Untuk menggunakan skrip bash ini di macOS atau Linux:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-xs text-white/80 mb-3">
          <li>Buka aplikasi <strong>Terminal</strong> bawaan os.</li>
          <li>Beri izin eksekusi skrip: <kbd className="bg-white/10 px-1 rounded text-[#00f3ff]">chmod +x namafile.sh</kbd></li>
          <li>Jalankan skrip: <kbd className="bg-white/10 px-1 rounded text-[#00f3ff]">./namafile.sh</kbd> atau <kbd className="bg-white/10 px-1 rounded text-[#00f3ff]">bash namafile.sh</kbd></li>
        </ol>
      </div>

      {/* Android Termux */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
        <h3 className="text-[13px] font-bold text-emerald-400 mb-3 flex items-center gap-2 uppercase tracking-widest">
          <Terminal size={14} />
          Android (Termux)
        </h3>
        <p className="text-xs text-emerald-200/70 leading-relaxed mb-3 text-justify">
          Anda juga dapat melakukan Git push melalui perangkat Android menggunakan Termux:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-xs text-emerald-100">
          <li>Instal <strong>Termux</strong> melalui F-Droid atau PlayStore.</li>
          <li>Berikan izin penyimpanan: <kbd className="bg-black/40 px-1 rounded text-[#00f3ff]">termux-setup-storage</kbd></li>
          <li>Instal git: <kbd className="bg-black/40 px-1 rounded text-[#00f3ff]">pkg install git</kbd></li>
          <li>Arahkan ke folder: <kbd className="bg-black/40 px-1 rounded text-[#00f3ff]">cd storage/shared/FolderAnda</kbd></li>
          <li>Jalankan skrip: <kbd className="bg-black/40 px-1 rounded text-[#00f3ff]">bash namafile.sh</kbd></li>
        </ol>
      </div>

      {/* iOS iSH */}
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
        <h3 className="text-[13px] font-bold text-purple-400 mb-3 flex items-center gap-2 uppercase tracking-widest">
          <Terminal size={14} />
          iOS (iSH)
        </h3>
        <p className="text-xs text-purple-200/70 leading-relaxed mb-3 text-justify">
          Untuk pengguna iPhone/iPad, Anda dapat menggunakan aplikasi iSH:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-xs text-purple-100">
          <li>Instal aplikasi <strong>iSH Shell</strong> dari App Store.</li>
          <li>Instal modul git: <kbd className="bg-black/40 px-1 rounded text-[#00f3ff]">apk add git</kbd></li>
          <li>Mount folder penyimpanan untuk mengakses file sistem.</li>
          <li>Arahkan dan jalankan skrip: <kbd className="bg-black/40 px-1 rounded text-[#00f3ff]">sh namafile.sh</kbd></li>
        </ol>
      </div>
    </div>
  );

  const content = (
    <>
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-[#00f3ff]/10">
        <h2 className="text-lg font-semibold text-[#00f3ff] flex items-center gap-2">
          <Info size={20} />
          Tata Cara Eksekusi Skrip
        </h2>
        <button 
          onClick={onClose}
          className="text-white/50 hover:text-white transition-colors p-1"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="p-4 md:p-6 overflow-y-auto" style={{ maxHeight: isMobile ? '70vh' : '80vh' }}>
        {scriptExtension === 'ps1' ? renderWindowsInfo() : renderUnixInfo()}
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
