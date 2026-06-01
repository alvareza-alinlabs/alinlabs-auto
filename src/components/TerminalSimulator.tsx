import React, { useState, useEffect, useRef } from 'react';

const banner = `
   █████████   █████  █████ ███████████    ███████   
  ███▒▒▒▒▒███ ▒▒███  ▒▒███ ▒█▒▒▒███▒▒▒█  ███▒▒▒▒▒███ 
 ▒███    ▒███  ▒███   ▒███ ▒   ▒███  ▒  ███     ▒▒███
 ▒███████████  ▒███   ▒███     ▒███    ▒███      ▒███
 ▒███▒▒▒▒▒███  ▒███   ▒███     ▒███    ▒███      ▒███
 ▒███    ▒███  ▒███   ▒███     ▒███    ▒▒███     ███ 
 █████   █████ ▒▒████████      █████    ▒▒▒███████▒  
▒▒▒▒▒   ▒▒▒▒▒   ▒▒▒▒▒▒▒▒      ▒▒▒▒▒       ▒▒▒▒▒▒▒    

   --> Alinlabs Utility Technology Operations <--
`;

interface TerminalSimulatorProps {
  customCommit: string;
  scriptMode: 'MANUAL' | 'AUTO';
  autoPath: string;
  autoUsername: string;
  autoToken: string;
  autoRepo: string;
  autoBranch: string;
  lfsExtensions?: string;
  lfsSizeLimit?: string;
  zoom: number;
}

export default function TerminalSimulator({ customCommit, scriptMode, autoPath, autoUsername, autoToken, autoRepo, autoBranch, lfsExtensions = '', lfsSizeLimit = '', zoom }: TerminalSimulatorProps) {
  const [lines, setLines] = useState<React.ReactNode[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [step, setStep] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initRef = useRef(false);

  const [data, setData] = useState({
    path: '',
    useOld: '',
    username: 'CyberAdmin',
    repo: '',
    branch: 'main',
    customCommit: '',
    lfsExtensions: '',
    lfsSizeLimit: ''
  });

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [lines, step]);

  const addLine = (content: React.ReactNode) => {
    setLines(prev => [...prev, content]);
  };

  const CyberHeader = (text: string) => (
    <div className="my-2">
      <div className="text-[#008b8b] font-bold whitespace-pre">{" ======================================================="}</div>
      <div className="text-[#00f3ff] font-bold">{"  > " + text}</div>
      <div className="text-[#008b8b] font-bold whitespace-pre">{" ======================================================="}</div>
    </div>
  );

  const CyberInfo = (text: string) => <div className="text-[#008b8b] font-bold">{" [~] " + text}</div>;
  const CyberSuccess = (text: string) => <div className="text-[#00ff00] font-bold">{" [+] " + text}</div>;
  const CyberWarn = (text: string) => <div className="text-[#ffff00] font-bold">{" [!] " + text}</div>;
  const CyberError = (text: string) => <div className="text-[#ff0000] font-bold">{" [x] " + text}</div>;
  const CyberInputPrompt = (prompt: string) => <span className="text-[#00f3ff] font-bold">{" [>] " + prompt + " : "}</span>;

  const CyberLoadingNode = ({ text }: { text: string }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      let current = 0;
      const interval = setInterval(() => {
        current += 1;
        setProgress(current);
        if (current >= 40) clearInterval(interval);
      }, 25);
      return () => clearInterval(interval);
    }, []);

    if (progress >= 40) {
      return (
        <div className="font-bold flex items-center whitespace-pre">
          <span className="text-[#008b8b]">{` [~] ${text} `}</span>
          <span className="text-[#00ff00]">✓</span>
        </div>
      );
    }

    return (
      <div className="font-bold flex flex-col whitespace-pre">
        <span className="text-[#008b8b]">{` [~] ${text}`}</span>
        <span className="flex items-center text-[10px] mt-1 tracking-[-1px]">
          <span className="text-[#008b8b] tracking-normal font-bold">{" ["}</span>
          <span className="text-[#00f3ff] mx-1">{Array(progress).fill('■').join('')}</span>
          <span className="text-white/20">{Array(40 - progress).fill('■').join('')}</span>
          <span className="text-[#008b8b] tracking-normal ml-1 font-bold">{`] ${Math.round((progress/40)*100)}%`}</span>
        </span>
      </div>
    );
  };

  // Inisialisasi awal
  useEffect(() => {
    if (step === 0 && !initRef.current) {
      initRef.current = true;
      
      setLines([
        <pre key="banner" className="text-[#00f3ff] leading-tight font-bold">{banner}</pre>,
        <div key="hdr">{CyberHeader(`INISIALISASI SISTEM${scriptMode === 'AUTO' ? ' (AUTO MODE)' : ''}`)}</div>
      ]);
      
      const simulateGitCheck = async () => {
        addLine(<CyberLoadingNode text="Memeriksa modul Git..." />);
        await new Promise(r => setTimeout(r, 1100));
        setLines(prev => {
          const newLines = [...prev];
          newLines[newLines.length - 1] = <div key="gitOk">{CyberSuccess("Git terdeteksi: git version 2.40.1.windows.1")}</div>;
          return newLines;
        });

        if (scriptMode === 'AUTO') {
          setStep(100);
          simulateAutoExecution();
        } else {
          setStep(1);
        }
        initRef.current = false;
      };
      
      simulateGitCheck();
    }
  }, [step, scriptMode]);

  const simulateTree = async (isManual = false) => {
    const treeFiles = [
      "index.html", "src/main.tsx", "src/App.tsx", "src/index.css",
      "src/components/Sidebar.tsx", "src/components/Header.tsx", "src/components/CodeArea.tsx", "src/components/TerminalSimulator.tsx",
      "src/assets/code/auto.ps1", "src/assets/code/manual.ps1", "src/assets/code/linux.sh",
      "vite.config.ts", "tailwind.config.js", "tsconfig.json", "package.json", "README.md"
    ];
    const suffix = isManual ? "-manual" : "-auto";
    setLines(prev => [...prev, <div key={`tree-analyzing${suffix}`} className="text-[#008b8b] font-bold">   [~] Menganalisa struktur payload...</div>]);
    for (let i = 0; i < treeFiles.length; i++) {
      const f = treeFiles[i];
      await new Promise(r => setTimeout(r, 40));
      setLines(prev => [...prev, <div key={`tree-${f}${suffix}-${i}`} className="text-gray-500 font-bold">       |-- {f}</div>]);
    }
    await new Promise(r => setTimeout(r, 600));
    setLines(prev => prev.slice(0, prev.length - treeFiles.length - 1));
  };

  const simulateAutoExecution = async () => {
    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
    
    await sleep(600);
    addLine(CyberSuccess(`Akses ruang kerja diizinkan: ${autoPath || 'C:\\Project'}`));
    
    await sleep(600);
    addLine(<CyberLoadingNode text="Mengecek status repositori..." />);
    await sleep(1100);
    addLine(CyberSuccess("Remote URL (origin) diperbarui."));

    await sleep(600);
    addLine(<br/>);
    addLine(CyberHeader("MENGEKSEKUSI GIT PAYLOAD"));
    
    addLine(<CyberLoadingNode text="Mengecek integritas ruang kerja (Workspace)..." />);
    await sleep(1100);
    addLine(<CyberLoadingNode text="Memindai file sistem dan direktori..." />);
    await sleep(1100);

    addLine(<CyberLoadingNode text="Mengaktifkan protokol LFS (Large File Storage)..." />);
    await sleep(1100);
    
    if (lfsExtensions && lfsExtensions.trim() !== '') {
        addLine(<CyberLoadingNode text={`Mengekstrak aturan Git LFS untuk: ${lfsExtensions}`} />);
        await sleep(1100);
        if (lfsSizeLimit && lfsSizeLimit.trim() !== '') {
            addLine(<CyberLoadingNode text={`Menerapkan batas ukuran file LFS minimum: ${lfsSizeLimit}MB`} />);
            await sleep(1100);
        }
    }

    addLine(<CyberLoadingNode text="Membangun indeks modifikasi (Staging Area)..." />);
    await sleep(1100);
    addLine(<CyberLoadingNode text="Mengekstraksi metadata objek lokal..." />);
    await sleep(1100);

    await simulateTree();
    
    addLine(<br/>);
    addLine(<div className="text-[#00f3ff] font-bold">   === INFORMASI PAYLOAD ===</div>);
    addLine(<div><span className="text-[#008b8b] font-bold">   [-] Sumber Lokal : </span><span className="text-white">{autoPath || 'C:\\Project'}</span></div>);
    addLine(<div><span className="text-[#008b8b] font-bold">   [-] Target Repo  : </span><span className="text-white">{autoUsername && autoRepo ? `github.com/${autoUsername}/${autoRepo}` : 'github.com/user/repo'}</span></div>);
    addLine(<div><span className="text-[#008b8b] font-bold">   [-] Cabang       : </span><span className="text-white">{autoBranch || 'main'}</span></div>);
    addLine(<div><span className="text-[#008b8b] font-bold">   [-] Total File   : </span><span className="text-white">{Math.floor(Math.random() * 20 + 2)} file(s)</span></div>);
    addLine(<div><span className="text-[#008b8b] font-bold">   [-] Est. Ukuran  : </span><span className="text-white">{(Math.random() * 5 + 0.1).toFixed(2)} MB</span></div>);
    addLine(<br/>);

    addLine(<CyberLoadingNode text="Mengenkripsi metadata commit..." />);
    await sleep(1100);

    addLine(<CyberLoadingNode text="Melakukan commit data..." />);
    await sleep(1100);
    
    const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    addLine(CyberSuccess(`Commit berhasil diterapkan: [UPDATE-SISTEM] Auto-Push ${dateStr}`));
    
    await sleep(600);
    addLine(<CyberLoadingNode text="Mengkalibrasi uplink ke Node Utama (GitHub)..." />);
    await sleep(1100);
    addLine(<CyberLoadingNode text="Mensinkronisasi state dari server origin..." />);
    await sleep(1100);
    
    addLine(<CyberLoadingNode text="Membangun terowongan aman (Secure Tunnel)..." />);
    await sleep(1100);
    addLine(<CyberLoadingNode text="Mengompresi data untuk transmisi..." />);
    await sleep(1100);
    addLine(<CyberLoadingNode text="Mentransmisikan paket data (Push)..." />);
    await sleep(1100);
    
    if (autoToken === 'error403' || autoUsername === 'error403') {
        addLine(<br/>);
        addLine(CyberHeader("KEGAGALAN SISTEM !"));
        addLine(CyberError("Gagal mengautentikasi: Token GitHub atau Username tidak valid/kadaluarsa."));
        addLine(CyberError("Pastikan Personal Access Token memiliki izin 'repo'."));
        addLine(CyberError("Transmisi ditolak. Rincian Error:"));
        addLine(<div className="text-[#ff0000]">remote: Support for password authentication was removed. Please use a personal access token instead.</div>);
    } else if (autoRepo === 'error404') {
        addLine(<br/>);
        addLine(CyberHeader("KEGAGALAN SISTEM !"));
        addLine(CyberError("Repositori tidak ditemukan. Pastikan nama repositori dan username sudah benar."));
        addLine(CyberError("Transmisi ditolak. Rincian Error:"));
        addLine(<div className="text-[#ff0000]">remote: Repository not found.</div>);
    } else if (autoBranch === 'conflict') {
        addLine(<br/>);
        addLine(CyberHeader("KEGAGALAN SISTEM !"));
        addLine(CyberError("Terdeteksi pembaruan data di server. Mohon tarik data (pull) manual terlebih dahulu."));
        addLine(CyberError("Transmisi ditolak. Rincian Error:"));
        addLine(<div className="text-[#ff0000] whitespace-pre">{`To https://github.com/${autoUsername}/${autoRepo}.git\n ! [rejected]        ${autoBranch} -> ${autoBranch} (fetch first)\nerror: failed to push some refs`}</div>);
    } else {
        addLine(<br/>);
        addLine(CyberHeader("DEPLOYMENT BERHASIL"));
        addLine(CyberSuccess("Semua sistem berjalan normal."));
        addLine(<br/>);
        addLine(<div className="text-[#00f3ff] font-bold"> [🔗] Tautan Repositori: {autoUsername && autoRepo ? `https://github.com/${autoUsername}/${autoRepo}` : 'https://github.com/user/repo'}</div>);
    }
    
    setStep(10); // Menunggu reset
  };

  const handleInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = inputVal;
      setInputVal('');
      
      if (step === 1) {
        addLine(<div>{CyberInputPrompt("Path Direktori Target")}<span className="text-white">{val || 'C:\\Project'}</span></div>);
        setData(d => ({ ...d, path: val || 'C:\\Project' }));
        addLine(CyberInfo("Kredensial Tersimpan Ditemukan:"));
        addLine(CyberInfo("Pengguna: " + data.username));
        addLine(CyberInfo("Token   : ***************"));
        setStep(2);
      } 
      else if (step === 2) {
        addLine(<div>{CyberInputPrompt("Gunakan kredensial aktif ini? (Y/N)")}<span className="text-white">{val || 'Y'}</span></div>);
        setData(d => ({ ...d, useOld: val || 'Y' }));
        if (val.toLowerCase() !== 'y' && val !== '') {
            setStep(2.1);
        } else {
            setStep(3);
        }
      }
      else if (step === 2.1) {
        addLine(<div>{CyberInputPrompt("Masukkan Token GitHub Baru")}<span className="text-white">*************</span></div>);
        setStep(2.2);
      }
      else if (step === 2.2) {
        addLine(<div>{CyberInputPrompt("Masukkan Username GitHub Baru")}<span className="text-white">{val || 'NewUser'}</span></div>);
        setData(d => ({ ...d, username: val || 'NewUser' }));
        addLine(CyberSuccess("Kredensial Berhasil Diperbarui"));
        setStep(3);
      }
      else if (step === 3) {
        addLine(<div>{CyberInputPrompt("Nama Repositori")}<span className="text-white">{val || 'neo-vault'}</span></div>);
        setData(d => ({ ...d, repo: val || 'neo-vault' }));
        setStep(4);
      }
      else if (step === 4) {
        addLine(<div>{CyberInputPrompt("Cabang Target (Bawaan: main)")}<span className="text-white">{val || 'main'}</span></div>);
        const branch = val || 'main';
        setData(d => ({ ...d, branch: branch }));
        setStep(4.1);
      }
      else if (step === 4.1) {
        addLine(<div>{CyberInputPrompt("Ekstensi file Git LFS (pisahkan koma, atau kosongkan jika tidak ada)")}<span className="text-white">{val || '-'}</span></div>);
        setData(d => ({ ...d, lfsExtensions: val }));
        if (val.trim()) {
            setStep(4.2);
        } else {
            setStep(4.5);
        }
      }
      else if (step === 4.2) {
        addLine(<div>{CyberInputPrompt("Batas ukuran file spesifik dalam MB (kosongkan jika tidak ada)")}<span className="text-white">{val || 'Semua Ukuran'}</span></div>);
        setData(d => ({ ...d, lfsSizeLimit: val }));
        setStep(4.5);
      }
      else if (step === 4.5) {
        addLine(<div>{CyberInputPrompt("Pesan Commit (Biarkan kosong untuk Auto Timestamp)")}<span className="text-white">{val || '[Auto Timestamp]'}</span></div>);
        setData(d => ({ ...d, customCommit: val }));

        addLine(<br/>);
        addLine(<pre className="text-[#00f3ff] leading-tight font-bold">{banner}</pre>);
        addLine(CyberHeader("MANIFEST DEPLOYMENT"));
        addLine(<div><span className="text-[#008b8b] font-bold">  [-] Path Target : </span><span className="text-white">{data.path || 'C:\\Project'}</span></div>);
        addLine(<div><span className="text-[#008b8b] font-bold">  [-] Username    : </span><span className="text-white">{data.username}</span></div>);
        addLine(<div><span className="text-[#008b8b] font-bold">  [-] Repositori  : </span><span className="text-white">{data.repo || 'neo-vault'}</span></div>);
        addLine(<div><span className="text-[#008b8b] font-bold">  [-] URL Remote  : </span><span className="text-white">{`https://github.com/${data.username}/${data.repo || 'neo-vault'}.git`}</span></div>);
        addLine(<div><span className="text-[#008b8b] font-bold">  [-] Cabang      : </span><span className="text-white">{data.branch}</span></div>);
        if (data.lfsExtensions) {
          addLine(<div><span className="text-[#008b8b] font-bold">  [-] LFS Exts    : </span><span className="text-white">{data.lfsExtensions}</span></div>);
          addLine(<div><span className="text-[#008b8b] font-bold">  [-] LFS Size    : </span><span className="text-white">{data.lfsSizeLimit || 'Semua Ukuran'}</span></div>);
        }
        addLine(<div><span className="text-[#008b8b] font-bold">  [-] Commit MSG  : </span><span className="text-white">{val || '[Auto Timestamp]'}</span></div>);
        addLine(<br/>);
        
        setStep(5);
      }
      else if (step === 5) {
        addLine(<div>{CyberInputPrompt("Eksekusi Payload? (ENTER=YA / N=BATAL)")}<span className="text-white">{val || 'YA'}</span></div>);
        if (val.toLowerCase() === 'n') {
            addLine(<br/>);
            addLine(CyberError("Deployment Dibatalkan oleh Pengguna"));
            addLine(<br/>);
            setStep(10); // Selesai
        } else {
            addLine(<br/>);
            addLine(CyberHeader("MENGEKSEKUSI GIT PAYLOAD"));
            
            // Memulai simulasi
            setStep(100); 
            simulateExecution();
        }
      }
      else if (step === 10) {
        // Reset Terminal
        setLines([]);
        setStep(0);
      }
    }
  };

  const simulateExecution = async () => {
    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
    
    addLine(<CyberLoadingNode text="Mengecek integritas ruang kerja (Workspace)..." />);
    await sleep(1100);
    addLine(<CyberLoadingNode text="Memindai file sistem dan direktori..." />);
    await sleep(1100);
    addLine(<CyberLoadingNode text="Mengecek struktur Repositori..." />);
    await sleep(1100);

    addLine(<CyberLoadingNode text="Mengaktifkan protokol LFS (Large File Storage)..." />);
    await sleep(1100);
    
    if (data.lfsExtensions && data.lfsExtensions.trim() !== '') {
        addLine(<CyberLoadingNode text={`Mengekstrak aturan Git LFS untuk: ${data.lfsExtensions}`} />);
        await sleep(1100);
        if (data.lfsSizeLimit && data.lfsSizeLimit.trim() !== '') {
            addLine(<CyberLoadingNode text={`Menerapkan batas ukuran file LFS minimum: ${data.lfsSizeLimit}MB`} />);
            await sleep(1100);
        }
    }

    addLine(<CyberLoadingNode text="Membangun indeks modifikasi (Staging Area)..." />);
    await sleep(1100);
    addLine(<CyberLoadingNode text="Mengekstraksi metadata objek lokal..." />);
    await sleep(1100);

    await simulateTree(true);
    
    addLine(<br/>);
    addLine(<div className="text-[#00f3ff] font-bold">   === INFORMASI PAYLOAD ===</div>);
    addLine(<div><span className="text-[#008b8b] font-bold">   [-] Sumber Lokal : </span><span className="text-white">{data.path || 'C:\\Project'}</span></div>);
    addLine(<div><span className="text-[#008b8b] font-bold">   [-] Target Repo  : </span><span className="text-white">{data.username ? `github.com/${data.username}/${data.repo}` : 'github.com/user/repo'}</span></div>);
    addLine(<div><span className="text-[#008b8b] font-bold">   [-] Cabang       : </span><span className="text-white">{data.branch || 'main'}</span></div>);
    addLine(<div><span className="text-[#008b8b] font-bold">   [-] Total File   : </span><span className="text-white">{Math.floor(Math.random() * 20 + 2)} file(s)</span></div>);
    addLine(<div><span className="text-[#008b8b] font-bold">   [-] Est. Ukuran  : </span><span className="text-white">{(Math.random() * 5 + 0.1).toFixed(2)} MB</span></div>);
    addLine(<br/>);

    addLine(<CyberLoadingNode text="Mengenkripsi metadata commit..." />);
    await sleep(1100);

    addLine(<CyberLoadingNode text="Melakukan commit data..." />);
    await sleep(1100);
    
    const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const commitMsg = data.customCommit.trim() !== '' ? data.customCommit : `[UPDATE-SISTEM] Auto-Push ${dateStr}`;
    addLine(CyberSuccess(`Commit berhasil diterapkan: ${commitMsg}`));
    
    await sleep(600);
    addLine(<CyberLoadingNode text="Mengkalibrasi uplink ke Node Utama (GitHub)..." />);
    await sleep(1100);
    addLine(<CyberLoadingNode text="Mensinkronisasi dengan Node Utama (GitHub)..." />);
    await sleep(1100);
    addLine(<CyberLoadingNode text="Menggabungkan update dari remote..." />);
    await sleep(1100);

    addLine(<CyberLoadingNode text="Membangun terowongan aman (Secure Tunnel)..." />);
    await sleep(1100);
    addLine(<CyberLoadingNode text="Mengompresi data untuk transmisi..." />);
    await sleep(1100);
    addLine(<CyberLoadingNode text="Mentransmisikan file ke repositori (Push)..." />);
    await sleep(1100);
    
    if (data.username === 'error403') {
        addLine(<br/>);
        addLine(CyberHeader("KEGAGALAN SISTEM !"));
        addLine(CyberError("Gagal mengautentikasi: Token GitHub atau Username tidak valid/kadaluarsa."));
        addLine(CyberError("Pastikan Personal Access Token memiliki izin 'repo'."));
        addLine(CyberError("Transmisi ditolak. Rincian Error:"));
        addLine(<div className="text-[#ff0000]">remote: Support for password authentication was removed. Please use a personal access token instead.</div>);
    } else if (data.repo === 'error404') {
        addLine(<br/>);
        addLine(CyberHeader("KEGAGALAN SISTEM !"));
        addLine(CyberError("Repositori tidak ditemukan. Pastikan nama repositori dan username sudah benar."));
        addLine(CyberError("Transmisi ditolak. Rincian Error:"));
        addLine(<div className="text-[#ff0000]">remote: Repository not found.</div>);
    } else if (data.branch === 'conflict') {
        addLine(<br/>);
        addLine(CyberHeader("KEGAGALAN SISTEM !"));
        addLine(CyberError("Terdeteksi pembaruan data di server. Mohon tarik data (pull) manual terlebih dahulu."));
        addLine(CyberError("Transmisi ditolak. Rincian Error:"));
        addLine(<div className="text-[#ff0000] whitespace-pre">{`To https://github.com/${data.username}/${data.repo}.git\n ! [rejected]        ${data.branch} -> ${data.branch} (fetch first)\nerror: failed to push some refs`}</div>);
    } else {
        addLine(<br/>);
        addLine(CyberHeader("DEPLOYMENT BERHASIL"));
        addLine(CyberSuccess("Semua sistem berjalan normal."));
        addLine(<br/>);
        addLine(<div className="text-[#00f3ff] font-bold"> [🔗] Tautan Repositori: {data.username && data.repo ? `https://github.com/${data.username}/${data.repo}` : 'https://github.com/user/repo'}</div>);
    }
    
    setStep(10); // Menunggu reset
  };

  const getPromptText = () => {
    switch (step) {
      case 1: return "Path Direktori Target";
      case 2: return "Gunakan kredensial aktif ini? (Y/N)";
      case 2.1: return "Masukkan Token GitHub Baru";
      case 2.2: return "Masukkan Username GitHub Baru";
      case 3: return "Nama Repositori";
      case 4: return "Cabang Target (Bawaan: main)";
      case 4.1: return "Ekstensi file Git LFS (pisahkan koma) jika ada";
      case 4.2: return "Batas ukuran file spesifik dalam MB (kosongkan jika tidak ada)";
      case 4.5: return "Pesan Commit (Biarkan kosong untuk Auto Timestamp)";
      case 5: return "Eksekusi Payload? (ENTER=YA / N=BATAL)";
      case 10: return "Tekan [ENTER] untuk menutup terminal (akan mengulang simulasi)";
      default: return "";
    }
  };

  return (
    <div 
      className="flex-1 overflow-auto custom-scrollbar font-mono bg-transparent p-6 shadow-inner cursor-text relative"
      style={{ fontSize: `${Math.round(13 * zoom)}px` }}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="space-y-1">
        {lines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
        
        {step !== 100 && step !== 0 && (
          <div className="flex items-center min-w-full mt-2">
            {CyberInputPrompt(getPromptText())}
            <input
              ref={inputRef}
              type={step === 2.1 ? "password" : "text"}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={handleInput}
              className="flex-1 bg-transparent border-none outline-none text-white ml-2 caret-[#00f3ff] min-w-[20px]"
              autoFocus
            />
          </div>
        )}
      </div>
      <div ref={endRef} className="h-8" />
    </div>
  );
}
