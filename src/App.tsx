import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CodeArea from './components/CodeArea';
import Footer from './components/Footer';
import Login from './components/Login';

import rawScriptContent from './assets/code/manual.ps1?raw';
import rawAutoScriptContent from './assets/code/auto.ps1?raw';
import rawManualSh from './assets/code/manual.sh?raw';
import rawAutoSh from './assets/code/auto.sh?raw';

export default function App() {
  const [folderPath, setFolderPath] = useState(() => {
    return localStorage.getItem('cyberFolderPath') || '';
  });

  const [fileName, setFileName] = useState(() => {
    return localStorage.getItem('cyberFileName') || 'auto';
  });

  const [customCommit, setCustomCommit] = useState(() => {
    return localStorage.getItem('cyberCustomCommit') || '';
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('cyberIsAuthenticated') === 'true';
  });

  const [isFreeAccess, setIsFreeAccess] = useState(() => {
    return localStorage.getItem('cyberIsFreeAccess') === 'true';
  });

  const [scriptMode, setScriptMode] = useState<'MANUAL' | 'AUTO'>(() => {
    return (localStorage.getItem('cyberScriptMode') as 'MANUAL' | 'AUTO') || 'MANUAL';
  });
  const [scriptExtension, setScriptExtension] = useState<'ps1' | 'sh'>(() => {
    return (localStorage.getItem('cyberScriptExtension') as 'ps1' | 'sh') || 'ps1';
  });
  
  const [autoPath, setAutoPath] = useState(() => localStorage.getItem('cyberAutoPath') || '');
  const [autoUsername, setAutoUsername] = useState(() => localStorage.getItem('cyberAutoUsername') || '');
  const [autoToken, setAutoToken] = useState(() => localStorage.getItem('cyberAutoToken') || '');
  const [autoRepo, setAutoRepo] = useState(() => localStorage.getItem('cyberAutoRepo') || '');
  const [autoBranch, setAutoBranch] = useState(() => localStorage.getItem('cyberAutoBranch') || '');
  const [lfsExtensions, setLfsExtensions] = useState(() => localStorage.getItem('cyberLfsExtensions') || '');
  const [lfsSizeLimit, setLfsSizeLimit] = useState(() => localStorage.getItem('cyberLfsSizeLimit') || '');
  const [activeTab, setActiveTab] = useState<'CODE' | 'SIMULATOR'>('CODE');
  const [mobileView, setMobileView] = useState<'KONFIGURASI' | 'WORKSPACE'>('KONFIGURASI');

  const handleScriptModeChange = (mode: 'MANUAL' | 'AUTO') => {
    setScriptMode(mode);
    setActiveTab('CODE');
  };

  // Smart Cache: Debounced saving to localStorage to optimize performance and reduce heavy writes
  useEffect(() => {
    const cacheTimer = setTimeout(() => {
      localStorage.setItem('cyberFolderPath', folderPath);
      localStorage.setItem('cyberFileName', fileName);
      localStorage.setItem('cyberCustomCommit', customCommit);
      localStorage.setItem('cyberScriptMode', scriptMode);
      localStorage.setItem('cyberScriptExtension', scriptExtension);
      localStorage.setItem('cyberAutoPath', autoPath);
      localStorage.setItem('cyberAutoUsername', autoUsername);
      localStorage.setItem('cyberAutoToken', autoToken);
      localStorage.setItem('cyberAutoRepo', autoRepo);
      localStorage.setItem('cyberAutoBranch', autoBranch);
      localStorage.setItem('cyberLfsExtensions', lfsExtensions);
      localStorage.setItem('cyberLfsSizeLimit', lfsSizeLimit);
    }, 800); // 800ms debounce
    return () => clearTimeout(cacheTimer);
  }, [folderPath, fileName, customCommit, scriptMode, scriptExtension, autoPath, autoUsername, autoToken, autoRepo, autoBranch, lfsExtensions, lfsSizeLimit]);

  const processedScript = useMemo(() => {
    if (scriptMode === 'MANUAL') {
      return scriptExtension === 'ps1' ? rawScriptContent : rawManualSh;
    } else {
      let s = scriptExtension === 'ps1' ? rawAutoScriptContent : rawAutoSh;
      s = s.replace('__PARAM_PATH__', autoPath);
      s = s.replace('__PARAM_USERNAME__', autoUsername);
      s = s.replace('__PARAM_TOKEN__', autoToken);
      s = s.replace('__PARAM_REPO__', autoRepo);
      s = s.replace('__PARAM_BRANCH__', autoBranch);
      s = s.replace('__PARAM_LFS_EXTS__', lfsExtensions);
      s = s.replace('__PARAM_LFS_SIZE__', lfsSizeLimit);

      if (customCommit.trim() !== '') {
        s = s.replace(
          '$commitMessage = "[UPDATE-SISTEM] Auto-Push $timestamp"',
          `$commitMessage = "${customCommit.replace(/"/g, '`"')}"`
        );
      }
      return s;
    }
  }, [scriptMode, autoPath, autoUsername, autoToken, autoRepo, autoBranch, customCommit, lfsExtensions, lfsSizeLimit]);

  if (!isAuthenticated && !isFreeAccess) {
    return (
      <Login 
        onLogin={(freeAccess) => {
          if (freeAccess) {
            setIsFreeAccess(true);
            localStorage.setItem('cyberIsFreeAccess', 'true');
            setScriptMode('MANUAL');
            localStorage.setItem('cyberScriptMode', 'MANUAL');
          } else {
            setIsAuthenticated(true);
            localStorage.setItem('cyberIsAuthenticated', 'true');
          }
        }} 
      />
    );
  }

  return (
    <div className="h-screen bg-[#030509] text-[#e2e8f0] font-sans flex flex-col overflow-hidden selection:bg-[#00f3ff]/30">
      
      <Header activeTab={activeTab} setActiveTab={setActiveTab} mobileView={mobileView} setMobileView={setMobileView} />

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col lg:flex-row overflow-hidden relative z-10 min-h-0 bg-[#030509]">
        
        <Sidebar 
          folderPath={folderPath} setFolderPath={setFolderPath}
          fileName={fileName} 
          setFileName={setFileName} 
          customCommit={customCommit} 
          setCustomCommit={setCustomCommit}
          scriptMode={scriptMode}
          setScriptMode={handleScriptModeChange}
          scriptExtension={scriptExtension}
          setScriptExtension={setScriptExtension}
          autoPath={autoPath} setAutoPath={setAutoPath}
          autoUsername={autoUsername} setAutoUsername={setAutoUsername}
          autoToken={autoToken} setAutoToken={setAutoToken}
          autoRepo={autoRepo} setAutoRepo={setAutoRepo}
          autoBranch={autoBranch} setAutoBranch={setAutoBranch}
          lfsExtensions={lfsExtensions} setLfsExtensions={setLfsExtensions}
          lfsSizeLimit={lfsSizeLimit} setLfsSizeLimit={setLfsSizeLimit}
          mobileView={mobileView}
          isFreeAccess={isFreeAccess}
          onLogout={() => {
            setIsAuthenticated(false);
            setIsFreeAccess(false);
            localStorage.setItem('cyberIsAuthenticated', 'false');
            localStorage.setItem('cyberIsFreeAccess', 'false');
          }}
        />

        <CodeArea 
          fileName={fileName} 
          scriptContent={processedScript} 
          customCommit={customCommit} 
          scriptMode={scriptMode}
          scriptExtension={scriptExtension}
          autoPath={autoPath}
          autoUsername={autoUsername}
          autoToken={autoToken}
          autoRepo={autoRepo}
          autoBranch={autoBranch}
          lfsExtensions={lfsExtensions}
          lfsSizeLimit={lfsSizeLimit}
          activeTab={activeTab}
          mobileView={mobileView}
        />

      </main>

      <Footer activeTab={activeTab} scriptContent={processedScript} onLogout={() => {
        setIsAuthenticated(false);
        setIsFreeAccess(false);
        localStorage.setItem('cyberIsAuthenticated', 'false');
        localStorage.setItem('cyberIsFreeAccess', 'false');
      }} />
    </div>
  );
}
