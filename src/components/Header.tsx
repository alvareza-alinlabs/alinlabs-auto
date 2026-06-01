import React from 'react';
import { Play, Code, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  activeTab: 'CODE' | 'SIMULATOR';
  setActiveTab: (tab: 'CODE' | 'SIMULATOR') => void;
  mobileView: 'KONFIGURASI' | 'WORKSPACE';
  setMobileView: (view: 'KONFIGURASI' | 'WORKSPACE') => void;
}

export default function Header({ activeTab, setActiveTab, mobileView, setMobileView }: HeaderProps) {
  return (
    <header className="h-24 shrink-0 border-b border-white/5 bg-[#030509] flex items-center justify-between px-4 sm:px-10 z-20 relative">
      <div className="flex items-center gap-1.5 lg:gap-3">
        {mobileView === 'WORKSPACE' && (
          <button 
            onClick={() => setMobileView('KONFIGURASI')}
            className="lg:hidden p-2 -ml-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        <img src="/logo.png" alt="A Logo" className="w-10 h-10 rounded-md shrink-0 object-contain" />
        <div className="hidden lg:flex flex-col justify-center">
          <h1 className="text-sm sm:text-base font-bold tracking-widest text-[#00f3ff] leading-tight uppercase">Alinlabs Utility</h1>
          <h1 className="text-sm sm:text-base font-bold tracking-widest text-white leading-tight uppercase">Technology Operations</h1>
        </div>
        <div className="lg:hidden flex items-center h-10">
          <h1 className="text-[38px] font-black tracking-wider text-white leading-none uppercase flex items-center h-full pb-1">UTO</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Editor Tabs - Desktop */}
        <div className="hidden lg:flex items-center space-x-2 bg-[#0a0f18]/50 p-1.5 rounded-lg border border-white/5 backdrop-blur-md">
          <button 
            onClick={() => setActiveTab('CODE')}
            className={`flex items-center gap-2 text-[10px] sm:text-xs font-semibold tracking-wide transition-all px-3 sm:px-4 py-2 rounded-md ${activeTab === 'CODE' ? 'bg-[#00f3ff]/10 text-[#00f3ff] shadow-[0_0_10px_rgba(0,243,255,0.05)]' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}
          >
            <Code size={18} className="sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">Kode Sumber</span>
          </button>
          <button 
            onClick={() => setActiveTab('SIMULATOR')}
            className={`flex items-center gap-2 text-[10px] sm:text-xs font-semibold tracking-wide transition-all px-3 sm:px-4 py-2 rounded-md ${activeTab === 'SIMULATOR' ? 'bg-[#00f3ff]/10 text-[#00f3ff] shadow-[0_0_10px_rgba(0,243,255,0.05)]' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}
          >
            <Play size={18} className="sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">Terminal Simulator</span>
          </button>
        </div>

        {/* Editor Tabs - Mobile */}
        <div className="lg:hidden flex items-center space-x-2 bg-[#0a0f18]/50 p-1.5 rounded-lg border border-white/5 backdrop-blur-md">
          {(mobileView === 'KONFIGURASI' || activeTab === 'SIMULATOR') && (
            <button 
              onClick={() => {
                setActiveTab('CODE');
                setMobileView('WORKSPACE');
              }}
              className={`flex items-center gap-2 text-[10px] font-semibold tracking-wide transition-all px-3 py-2 rounded-md ${mobileView === 'WORKSPACE' && activeTab === 'CODE' ? 'bg-[#00f3ff]/10 text-[#00f3ff] shadow-[0_0_10px_rgba(0,243,255,0.05)]' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}
            >
              <Code size={18} />
            </button>
          )}
          {(mobileView === 'KONFIGURASI' || activeTab === 'CODE') && (
            <button 
              onClick={() => {
                setActiveTab('SIMULATOR');
                setMobileView('WORKSPACE');
              }}
              className={`flex items-center gap-2 text-[10px] font-semibold tracking-wide transition-all px-3 py-2 rounded-md ${mobileView === 'WORKSPACE' && activeTab === 'SIMULATOR' ? 'bg-[#00f3ff]/10 text-[#00f3ff] shadow-[0_0_10px_rgba(0,243,255,0.05)]' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}
            >
              <Play size={18} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

