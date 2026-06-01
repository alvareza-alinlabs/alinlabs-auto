import React, { useState } from 'react';
import TerminalSimulator from './TerminalSimulator';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy, Download, ZoomIn, ZoomOut, WrapText, Info } from 'lucide-react';
import CodeInfoModal from './CodeInfoModal';

interface CodeAreaProps {
  fileName: string;
  scriptContent: string;
  customCommit: string;
  scriptMode: 'MANUAL' | 'AUTO';
  scriptExtension: 'ps1' | 'sh';
  autoPath: string;
  autoUsername: string;
  autoToken: string;
  autoRepo: string;
  autoBranch: string;
  lfsExtensions: string;
  lfsSizeLimit: string;
  activeTab: 'CODE' | 'SIMULATOR';
  mobileView: 'KONFIGURASI' | 'WORKSPACE';
}

export default function CodeArea({ fileName, scriptContent, customCommit, scriptMode, scriptExtension, autoPath, autoUsername, autoToken, autoRepo, autoBranch, lfsExtensions, lfsSizeLimit, activeTab, mobileView }: CodeAreaProps) {
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isWrapText, setIsWrapText] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.2, 3));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.2, 0.5));

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([scriptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.${scriptExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section className={`flex-grow flex-col bg-[#030509]/60 backdrop-blur-xl relative min-h-[50vh] lg:min-h-0 overflow-hidden border-l border-white/5 ${mobileView === 'WORKSPACE' ? 'flex' : 'hidden'} lg:flex`}>
      {/* Subtle Background Grain / Grid effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]" 
           style={{ backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>
      
      <div className="flex-grow p-4 sm:p-6 overflow-hidden flex flex-col relative z-10 w-full">
        
        {activeTab === 'CODE' ? (
          <div className="flex-1 flex flex-col overflow-hidden bg-[#0a0f18]/80 border border-white/5 rounded-xl backdrop-blur-md shadow-2xl relative">
            <div className="bg-white/[0.02] border-b border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 sm:px-4 py-3 sm:py-0 sm:h-12 gap-3 sm:gap-0 relative">
              
              {/* Title & Bullets Area */}
              <div className="flex items-center justify-between sm:justify-start gap-3 font-mono text-sm w-full sm:w-auto">
                <div className="flex space-x-1.5 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                </div>
                
                <div className="flex items-center justify-center sm:justify-start space-x-2 text-xs font-medium text-white/50 overflow-hidden w-full sm:w-auto">
                  <span className="text-[#00f3ff]/70 text-[10px] shrink-0">{scriptExtension === 'ps1' ? 'PS' : 'SH'}</span>
                  <span className="truncate">{fileName}{scriptMode === 'AUTO' ? '-auto' : ''}.{scriptExtension}</span>
                </div>
                
                {/* Visual balance for mobile center alignment */}
                <div className="w-[30px] sm:hidden shrink-0"></div>
              </div>
              
              {/* Tools Area */}
              <div className="flex items-center justify-between sm:justify-end gap-1 sm:gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => setIsInfoModalOpen(true)}
                  title="Tata Cara Eksekusi"
                  className="flex-1 sm:flex-none p-1.5 flex justify-center rounded-md text-[#00f3ff]/70 hover:text-[#00f3ff] hover:bg-[#00f3ff]/10 transition-colors"
                >
                  <Info size={14} />
                </button>
                <button 
                  onClick={() => setIsWrapText(!isWrapText)}
                  title="Bungkus Teks"
                  className={`flex-1 sm:flex-none p-1.5 flex justify-center rounded-md transition-colors ${isWrapText ? 'text-[#00f3ff] bg-[#00f3ff]/10' : 'text-white/40 hover:text-white/90 hover:bg-white/10'}`}
                >
                  <WrapText size={14} />
                </button>
                <button 
                  onClick={handleZoomOut}
                  title="Perkecil"
                  className="flex-1 sm:flex-none p-1.5 flex justify-center rounded-md text-white/40 hover:text-white/90 hover:bg-white/10 transition-colors"
                >
                  <ZoomOut size={14} />
                </button>
                <button 
                  onClick={handleZoomIn}
                  title="Perbesar"
                  className="flex-1 sm:flex-none p-1.5 flex justify-center rounded-md text-white/40 hover:text-white/90 hover:bg-white/10 transition-colors"
                >
                  <ZoomIn size={14} />
                </button>
                <button 
                  onClick={handleCopy}
                  title="Salin Code"
                  className="flex-1 sm:flex-none p-1.5 flex justify-center rounded-md text-white/40 hover:text-white/90 hover:bg-white/10 transition-colors"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
                <button 
                  onClick={handleDownload}
                  title="Unduh File"
                  className="flex-1 sm:flex-none p-1.5 flex justify-center rounded-md text-[#00f3ff]/70 hover:text-[#00f3ff] hover:bg-[#00f3ff]/10 transition-colors"
                >
                  <Download size={14} />
                </button>
              </div>
            </div>

            <div className={`flex-1 custom-scrollbar ${isWrapText ? 'overflow-y-auto overflow-x-hidden' : 'overflow-auto'}`}>
              <SyntaxHighlighter 
                language={scriptExtension === 'ps1' ? "powershell" : "bash"} 
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: '24px',
                  background: 'transparent',
                  fontSize: `${Math.round(13 * zoom)}px`,
                  lineHeight: '1.5',
                  ...(isWrapText && {
                    overflowX: 'hidden',
                  })
                }}
                codeTagProps={{
                  style: isWrapText ? {
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word'
                  } : {}
                }}
                wrapLines={isWrapText}
                wrapLongLines={isWrapText}
              >
                {scriptContent}
              </SyntaxHighlighter>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden bg-[#05080f]/90 border border-white/5 rounded-xl backdrop-blur-md shadow-2xl relative">
            <div className="bg-[#05080f] border-b border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 sm:px-4 py-3 sm:py-0 sm:h-12 gap-3 sm:gap-0 relative z-20">
              
              {/* Title & Bullets Area */}
              <div className="flex items-center justify-between sm:justify-start gap-3 font-mono text-sm w-full sm:w-auto">
                <div className="flex space-x-1.5 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                </div>
                
                <div className="flex items-center justify-center sm:justify-start space-x-2 text-xs font-medium text-white/50 overflow-hidden w-full sm:w-auto">
                  <span className="text-[#00f3ff]/70 shrink-0">Admin</span>
                  <span className="truncate">~ / Terminal Eksekusi</span>
                </div>
                
                {/* Visual balance for mobile center alignment */}
                <div className="w-[30px] sm:hidden shrink-0"></div>
              </div>
              
              {/* Tools Area */}
              <div className="flex items-center justify-between sm:justify-end gap-1 sm:gap-2 w-full sm:w-auto">
                 <button 
                   onClick={handleZoomOut}
                   title="Perkecil"
                   className="flex-1 sm:flex-none p-1.5 flex justify-center rounded-md text-white/40 hover:text-white/90 hover:bg-white/10 transition-colors"
                 >
                   <ZoomOut size={14} />
                 </button>
                 <button 
                   onClick={handleZoomIn}
                   title="Perbesar"
                   className="flex-1 sm:flex-none p-1.5 flex justify-center rounded-md text-white/40 hover:text-white/90 hover:bg-white/10 transition-colors"
                 >
                   <ZoomIn size={14} />
                 </button>
              </div>
            </div>
            <TerminalSimulator 
              customCommit={customCommit} 
              scriptMode={scriptMode}
              autoPath={autoPath}
              autoUsername={autoUsername}
              autoToken={autoToken}
              autoRepo={autoRepo}
              autoBranch={autoBranch}
              lfsExtensions={lfsExtensions}
              lfsSizeLimit={lfsSizeLimit}
              zoom={zoom}
            />
          </div>
        )}
      </div>

      <CodeInfoModal 
        isOpen={isInfoModalOpen} 
        onClose={() => setIsInfoModalOpen(false)} 
        scriptExtension={scriptExtension} 
      />
    </section>
  );
}
