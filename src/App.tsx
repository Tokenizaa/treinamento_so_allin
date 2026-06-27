import { useState, useEffect, useRef } from 'react';
import { 
  Factory, Layout, Layers, Cpu, Hammer, Users, Boxes, Wrench, 
  Truck, Settings, ClipboardList, CheckSquare, TrendingUp, 
  Coins, MessageSquare, Award, Search, Lock, Unlock, Play, 
  CheckCircle2, AlertCircle, Calendar, DollarSign, Gauge, 
  Send, ChevronRight, ChevronLeft, ArrowRight, 
  BookOpen, Puzzle, FileText, Check, RotateCcw, User, Printer, Clock,
  Presentation, PlayCircle, Volume2, VolumeX, Maximize2, Minimize2, Sparkles, Menu, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { modulesData } from './data/modulesData';
import { UserProgress, ModuleData } from './types';

// Import our gorgeous modular sub-components
import InteractiveExerciseRenderer from './components/InteractiveExerciseRenderer';
import CopilotChat from './components/CopilotChat';
import VirtualFactoryFloor from './components/VirtualFactoryFloor';

export default function App() {
  // --- User Progress State (Always Unlocked) ---
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('industrial_os_training_progress');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return {
      currentModuleId: 1,
      completedModules: [],
      quizScores: {},
      exerciseCompleted: {},
      userName: "Equipe de Engenharia"
    };
  });

  // Save progress changes
  useEffect(() => {
    localStorage.setItem('industrial_os_training_progress', JSON.stringify(progress));
  }, [progress]);

  // --- Core Presentation States ---
  const [activeModuleId, setActiveModuleId] = useState<number>(1);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [revealedCount, setRevealedCount] = useState<number>(1);
  
  // Slide controls and settings
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const [timerProgress, setTimerProgress] = useState<number>(0);
  const [presentationMode, setPresentationMode] = useState<boolean>(false);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  // Layout Sidebars/Panels Toggles
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // User name editor
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(progress.userName);

  // --- Active Module Data ---
  const currentModule = modulesData.find(m => m.id === activeModuleId) || modulesData[0];

  // --- Reset slide states on module shift ---
  useEffect(() => {
    setCurrentSlideIndex(0);
    setRevealedCount(1);
  }, [activeModuleId]);

  // Reset revealed topic count on changing active slide index
  useEffect(() => {
    setRevealedCount(1);
    setTimerProgress(0);
  }, [currentSlideIndex]);

  // Low-latency Synthesized Sound Effects
  const playSound = (type: 'reveal' | 'slide' | 'success' | 'error') => {
    if (!soundOn || typeof window === 'undefined') return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'reveal') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'slide') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(350, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      } else if (type === 'success') {
        const now = ctx.currentTime;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6
        osc.start();
        osc.stop(now + 0.5);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      }
    } catch (e) {
      /* Audio context blocked */
    }
  };

  // --- Dynamic slide navigation and topic reveals (exactly 5 slides) ---
  const getMaxRevealsForSlide = (slideIndex: number): number => {
    switch (slideIndex) {
      case 1: return currentModule.concepts.length;
      case 2: return currentModule.flowchartSteps.length;
      case 3: return 2; // Real vs Virtual panels
      case 4: return 2; // Common mistakes vs summary takeaways
      default: return 1;
    }
  };

  const handleNextAction = () => {
    const maxReveals = getMaxRevealsForSlide(currentSlideIndex);
    if (revealedCount < maxReveals) {
      setRevealedCount(prev => prev + 1);
      playSound('reveal');
    } else {
      // Fully revealed, change slide
      if (currentSlideIndex < 4) {
        setCurrentSlideIndex(prev => prev + 1);
        playSound('slide');
      } else {
        // Complete current module
        setProgress(prev => {
          const updatedCompleted = prev.completedModules.includes(activeModuleId)
            ? prev.completedModules
            : [...prev.completedModules, activeModuleId];

          const isAllCompleted = updatedCompleted.length === 22;
          const certificateCode = isAllCompleted ? `IND-OS-${Math.random().toString(36).substring(2, 8).toUpperCase()}` : prev.certificateCode;
          const completionDate = isAllCompleted ? new Date().toLocaleDateString() : prev.completionDate;

          return {
            ...prev,
            completedModules: updatedCompleted,
            certificateCode,
            completionDate
          };
        });

        playSound('success');

        // Advance module or wrap up
        if (activeModuleId < 22) {
          setActiveModuleId(activeModuleId + 1);
        } else {
          alert("Parabéns! Apresentação concluída. Todos os 22 módulos de Fundamentos do Chão de Fábrica foram navegados com sucesso!");
        }
      }
    }
  };

  const handlePrevAction = () => {
    if (currentSlideIndex > 0) {
      const prevSlide = currentSlideIndex - 1;
      setCurrentSlideIndex(prevSlide);
      setRevealedCount(getMaxRevealsForSlide(prevSlide));
      playSound('slide');
    } else if (activeModuleId > 1) {
      // Go to previous module's last slide
      setActiveModuleId(activeModuleId - 1);
      setTimeout(() => {
        setCurrentSlideIndex(4);
        setRevealedCount(getMaxRevealsForSlide(4));
      }, 50);
      playSound('slide');
    }
  };

  const handleResetProgress = () => {
    if (confirm("Tem certeza de que deseja redefinir os módulos que foram marcados como apresentados?")) {
      const resetState = {
        currentModuleId: 1,
        completedModules: [],
        quizScores: {},
        exerciseCompleted: {},
        userName: progress.userName
      };
      setProgress(resetState);
      setActiveModuleId(1);
      localStorage.setItem('industrial_os_training_progress', JSON.stringify(resetState));
    }
  };

  // --- Keyboard arrows and Spacebar listeners ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' || 
        document.activeElement?.tagName === 'TEXTAREA' || 
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        handleNextAction();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrevAction();
      } else if (e.key === ' ') {
        e.preventDefault();
        handleNextAction();
      } else if (e.key === 'Escape') {
        setPresentationMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, revealedCount, activeModuleId, progress, soundOn]);

  // --- Auto-play slide presentation ticker ---
  useEffect(() => {
    if (!autoPlay) {
      setTimerProgress(0);
      return;
    }

    const intervalTime = 100; 
    const totalDuration = 7000; 
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += intervalTime;
      setTimerProgress((elapsed / totalDuration) * 100);

      if (elapsed >= totalDuration) {
        handleNextAction();
        elapsed = 0;
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [autoPlay, currentSlideIndex, revealedCount]);

  // Filter list of chapters based on search query
  const filteredModules = modulesData.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.objective.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const overallProgressPercent = Math.round((progress.completedModules.length / 22) * 100);

  // Return icons representing each industrial chapter
  const getModuleIcon = (id: number) => {
    switch(id) {
      case 1: return <Factory className="w-4 h-4 text-amber-500" />;
      case 2: return <Layout className="w-4 h-4 text-indigo-500" />;
      case 3: return <Layers className="w-4 h-4 text-emerald-500" />;
      case 4: return <Cpu className="w-4 h-4 text-rose-500" />;
      case 5: return <Wrench className="w-4 h-4 text-orange-500" />;
      case 6: return <Settings className="w-4 h-4 text-blue-500" />;
      case 7: return <Hammer className="w-4 h-4 text-teal-500" />;
      case 8: return <Users className="w-4 h-4 text-purple-500" />;
      case 9: return <Boxes className="w-4 h-4 text-yellow-500" />;
      case 10: return <Layers className="w-4 h-4 text-sky-500" />;
      case 11: return <Boxes className="w-4 h-4 text-pink-500" />;
      case 12: return <Cpu className="w-4 h-4 text-cyan-500" />;
      case 13: return <Layout className="w-4 h-4 text-violet-500" />;
      case 14: return <ClipboardList className="w-4 h-4 text-amber-600" />;
      case 15: return <CheckSquare className="w-4 h-4 text-emerald-600" />;
      case 16: return <Boxes className="w-4 h-4 text-indigo-600" />;
      case 17: return <CheckCircle2 className="w-4 h-4 text-teal-600" />;
      case 18: return <Wrench className="w-4 h-4 text-red-500" />;
      case 19: return <ClipboardList className="w-4 h-4 text-sky-600" />;
      case 20: return <Coins className="w-4 h-4 text-yellow-600" />;
      case 21: return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      default: return <MessageSquare className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div id="app_root" className="h-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* 1. TOP HEADER BAR */}
      <header id="header" className="bg-slate-900 border-b border-slate-800 px-6 py-2 flex flex-wrap items-center justify-between sticky top-0 z-40 gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500 rounded-lg text-slate-950 shadow-md">
            <Presentation className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white font-mono flex items-center gap-2">
              INDUSTRIAL OS <span className="text-amber-500 text-[10px] px-1.5 py-0.5 bg-amber-500/10 rounded border border-amber-500/30">SLIDES INTERATIVOS</span>
            </h1>
            <p className="text-[10px] text-slate-400">Capacitação e Treinamento do Chão de Fábrica</p>
          </div>
        </div>

        {/* CLEAR, HIGHLY-VISIBLE TOGGLE BUTTONS - SOLVES FIRST SCREEN CONFUSION */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? "Ocultar Menu Lateral com 22 Módulos" : "Exibir Menu Lateral com 22 Módulos"}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              sidebarOpen 
                ? 'bg-amber-500 text-slate-950 font-black shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Menu className="w-4 h-4" />
            <span className="hidden sm:inline">☰ Ver Módulos (22)</span>
            <span className="inline sm:hidden">Módulos (22)</span>
            <span className={`w-1.5 h-1.5 rounded-full ${sidebarOpen ? 'bg-slate-950' : 'bg-amber-400 animate-pulse'}`} />
          </button>
          
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            title={drawerOpen ? "Ocultar Painel de Apoio" : "Exibir Painel de Apoio (Fábrica + Copiloto)"}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              drawerOpen 
                ? 'bg-amber-500 text-slate-950 font-black shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Factory className="w-4 h-4" />
            <span className="hidden sm:inline">🔧 Planta & Copiloto</span>
            <span className="inline sm:hidden">Planta & Copiloto</span>
            <span className={`w-1.5 h-1.5 rounded-full ${drawerOpen ? 'bg-slate-950' : 'bg-emerald-400 animate-pulse'}`} />
          </button>
        </div>

        {/* STUDY CONTROLS AND GENERAL METERS */}
        <div className="flex items-center gap-5">
          {/* Sounds and Playback Toggles */}
          <div className="flex items-center bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 gap-3">
            <button 
              onClick={() => setSoundOn(!soundOn)}
              title={soundOn ? "Desativar efeitos sonoros" : "Ativar efeitos sonoros"}
              className={`p-1 rounded transition-colors ${soundOn ? 'text-amber-500 hover:text-amber-400' : 'text-slate-600 hover:text-slate-400'}`}
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <span className="w-px h-3 bg-slate-800" />
            <button 
              onClick={() => {
                const state = !presentationMode;
                setPresentationMode(state);
                if (state) {
                  setSidebarOpen(false);
                  setDrawerOpen(false);
                } else {
                  setSidebarOpen(true);
                  setDrawerOpen(true);
                }
              }}
              title={presentationMode ? "Sair da Tela Cheia" : "Modo Apresentação (Projeção)"}
              className={`p-1 rounded transition-colors flex items-center gap-1 text-xs font-mono font-bold ${presentationMode ? 'text-amber-500' : 'text-slate-400 hover:text-white'}`}
            >
              {presentationMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span className="hidden sm:inline">Modo Projeção</span>
            </button>
          </div>

          <div className="text-right hidden md:block">
            <div className="text-[9px] text-slate-500 font-mono">CURRÍCULO DE ENGENHARIA</div>
            <div className="text-sm font-bold font-mono text-amber-500">{overallProgressPercent}% <span className="text-xs text-slate-500">({progress.completedModules.length}/22)</span></div>
          </div>
          <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700 hidden sm:block">
            <div className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full transition-all duration-300" style={{ width: `${overallProgressPercent}%` }}></div>
          </div>

          {/* USER PROFILE BOX */}
          <div className="bg-slate-850 px-3 py-1 rounded-lg border border-slate-700 flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-slate-400" />
            {editingName ? (
              <div className="flex items-center gap-1">
                <input 
                  type="text" 
                  value={tempName} 
                  onChange={(e) => setTempName(e.target.value)}
                  className="bg-slate-900 border border-amber-500/50 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none focus:border-amber-500 w-24"
                  maxLength={30}
                />
                <button 
                  onClick={() => {
                    setProgress(p => ({ ...p, userName: tempName }));
                    setEditingName(false);
                  }}
                  className="p-1 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 rounded"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-mono font-bold text-slate-300 max-w-[100px] truncate">{progress.userName}</span>
                <button onClick={() => { setTempName(progress.userName); setEditingName(true); }} className="text-slate-500 hover:text-amber-500 text-[9px] underline">Editar</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. MAIN LAYOUT CONTAINER */}
      <div id="workspace" className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* COLLAPSIBLE CHAPTERS SIDEBAR (Left) */}
        <aside id="sidebar" className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col z-20 ${sidebarOpen ? 'w-full md:w-80' : 'w-0 overflow-hidden'}`}>
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 font-mono tracking-wider">CRONOGRAMA DE SLIDE DECKS</span>
            <span className="text-[10px] font-mono text-slate-500">22 MÓDULOS</span>
          </div>
          <div className="p-3 border-b border-slate-850">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input 
                type="text" 
                placeholder="Pesquisar capítulos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredModules.map((m) => {
              const isCompleted = progress.completedModules.includes(m.id);
              const isActive = activeModuleId === m.id;

              return (
                <button
                  key={m.id}
                  onClick={() => setActiveModuleId(m.id)}
                  className={`w-full flex items-center gap-2 p-2.5 rounded-lg text-left transition-all ${
                    isActive 
                      ? 'bg-amber-500 text-slate-950 border-amber-400 border shadow-md font-bold' 
                      : 'bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-800'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {getModuleIcon(m.id)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-[8px] font-mono font-bold tracking-widest mb-0.5">
                      <span className={isActive ? 'text-slate-900' : 'text-amber-500'}>DECK {m.id.toString().padStart(2, '0')}</span>
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-slate-950' : 'bg-slate-600'}`} />
                      )}
                    </div>
                    <p className={`text-xs font-semibold truncate ${isActive ? 'text-slate-950' : 'text-slate-150'}`}>{m.title}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3 border-t border-slate-800 bg-slate-950/50 flex justify-between items-center text-[10px] font-mono">
            <button onClick={handleResetProgress} className="text-slate-500 hover:text-red-400 flex items-center gap-1">
              <RotateCcw className="w-3 h-3" /> Limpar Apresentados
            </button>
            <span className="text-slate-600 font-bold uppercase tracking-wider">Livre Acesso</span>
          </div>
        </aside>

        {/* SIDEBARS COLLAPSE HANDLERS */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-30 bg-slate-800 hover:bg-amber-500 text-white hover:text-slate-950 p-1.5 rounded-r-md border border-slate-700 hidden md:flex items-center justify-center transition-colors"
          title={sidebarOpen ? "Ocultar Módulos" : "Expandir Módulos"}
        >
          {sidebarOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        {/* 3. CENTER PRESENTATION CONSOLE STAGE */}
        <main id="main_content" className="flex-1 h-full flex flex-col justify-between gap-3.5 p-2 sm:p-4 overflow-y-auto relative box-border w-full max-w-full overflow-x-hidden">
          
          {/* STUDY STAGE HEADER BLOCK */}
          <div className={`flex flex-wrap items-center justify-between gap-4 ${presentationMode ? 'hidden' : ''}`}>
            <div>
              <span className="text-[10px] font-mono text-amber-500 font-bold tracking-widest uppercase">Apresentação Estratégica Industrial</span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                Módulo {currentModule.id}: {currentModule.title}
              </h2>
            </div>
            
            {/* Slide Selection Buttons Segmented Bar */}
            <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex gap-0.5 overflow-x-auto whitespace-nowrap scrollbar-none">
              {["Capa", "Conceitos", "Fluxograma", "Prática", "Erros"].map((slideName, idx) => {
                const isActive = currentSlideIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => { setCurrentSlideIndex(idx); playSound('slide'); }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
                      isActive 
                        ? 'bg-amber-500 text-slate-950 shadow' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-850'
                    }`}
                  >
                    {idx + 1}. {slideName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CELEBRATION AWARD CARD (Completed and certified banner) */}
          {progress.completedModules.length > 0 && !presentationMode && (
            <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 rounded-xl p-3 flex flex-col md:flex-row items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3 text-center md:text-left flex-col md:flex-row">
                <div className="p-2 bg-emerald-500 text-slate-950 rounded-full shrink-0">
                  <Award className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">Treinamento Corporativo em Andamento</h3>
                  <p className="text-[11px] text-slate-300">Você já apresentou <strong>{progress.completedModules.length} de 22 módulos</strong> de Fundamentos do Chão de Fábrica para a equipe.</p>
                  {progress.completedModules.length === 22 ? (
                    <span className="text-[9px] text-amber-500 font-mono block">Currículo Geral Concluído com Sucesso! Chave: {progress.certificateCode || 'CURSO-COMPLETO-100'}</span>
                  ) : (
                    <span className="text-[9px] text-slate-400 font-mono block">Finalize os decks pendentes para homologação da equipe.</span>
                  )}
                </div>
              </div>
              <button 
                onClick={() => setShowCertificateModal(true)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-[10px] font-mono transition-all shrink-0 hover:scale-[1.02] active:scale-95 shadow-md"
              >
                Emitir Diploma
              </button>
            </div>
          )}

          {/* 16:9 INDUSTRIAL SLIDE PROJECTOR SCREEN CANVAS */}
          <div className="w-full max-w-[96%] xl:max-w-[1360px] mx-auto flex flex-col flex-1 min-h-0">
            <div className="bg-slate-900 border-4 border-slate-800 rounded-3xl overflow-hidden relative shadow-2xl flex flex-col min-h-[380px] max-h-[calc(100vh-140px)] h-auto w-full flex-1">
              
              {/* Slide Background Visual Matrix Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415515_1px,transparent_1px),linear-gradient(to_bottom,#33415515_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
              <div className="absolute top-0 left-0 w-72 h-72 bg-amber-500/[0.03] rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-500/[0.03] rounded-full blur-3xl pointer-events-none"></div>

              {/* SLIDE UPPER METADATA HEADER */}
              <div className="bg-slate-950/90 backdrop-blur-sm px-6 py-3.5 border-b border-slate-800 flex items-center justify-between text-xs sm:text-sm font-mono text-slate-400 z-10 relative">
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 font-extrabold tracking-wider bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">DECK {currentModule.id.toString().padStart(2, '0')}</span>
                  <span className="text-slate-600 font-bold">•</span>
                  <span className="text-slate-200 font-bold">SLIDE {currentSlideIndex + 1} de 5</span>
                  <span className="hidden sm:inline text-slate-600 font-bold">•</span>
                  <span className="hidden sm:inline font-bold text-slate-300">{currentModule.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] sm:text-xs bg-slate-900 border border-slate-800 text-amber-400 font-black uppercase tracking-widest px-3 py-1 rounded-md">
                    Chão de Fábrica Inteligente
                  </span>
                </div>
              </div>

              {/* SLIDE CONTENT INTERIOR VIEW WITH TRANSITION */}
              <div className="flex-1 flex flex-col relative z-10 justify-center overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeModuleId}-${currentSlideIndex}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="flex-1 flex flex-col justify-between p-5 sm:p-8 md:p-10"
                  >
                    
                    {/* SLIDE CONTENT SWITCH ENGINE */}
                    {(() => {
                      switch (currentSlideIndex) {
                        
                        // Slide 0: Cover/Capa
                        case 0: return (
                          <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 items-center justify-center text-center lg:text-left h-full py-2 gap-6">
                            
                            {/* Left Column: Icon + Title + Objective + Button */}
                            <div className="lg:col-span-7 flex flex-col items-center lg:items-start justify-center space-y-4">
                              <div className="p-3 bg-amber-500/15 border border-amber-500/40 text-amber-500 rounded-full animate-pulse shadow-md">
                                {getModuleIcon(currentModule.id)}
                              </div>
                              <div className="space-y-1.5 text-center lg:text-left">
                                <span className="text-[10px] font-mono font-black tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full uppercase inline-block">
                                  Abertura de Módulo Industrial
                                </span>
                                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-wide leading-tight mt-1">
                                  {currentModule.title}
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic border-l-4 border-amber-500 pl-4 py-1 font-medium text-left">
                                  &ldquo;{currentModule.objective}&rdquo;
                                </p>
                              </div>
                              
                              <button
                                onClick={handleNextAction}
                                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs sm:text-sm font-mono shadow-xl flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
                              >
                                Iniciar Módulo <PlayCircle className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Right Column: User Guide Instructions */}
                            <div className="lg:col-span-5 w-full flex items-center">
                              <div className="w-full bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-left space-y-3 shadow-xl backdrop-blur-md">
                                <h4 className="text-[9px] sm:text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                                  <Sparkles className="w-3 h-3 text-amber-500" /> COMO UTILIZAR ESTA APRESENTAÇÃO:
                                </h4>
                                <div className="flex flex-col gap-2.5 text-xs">
                                  <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-850">
                                    <span className="font-mono text-amber-500 font-extrabold block mb-0.5 text-xs">1. Avançar</span>
                                    <p className="text-slate-300 leading-relaxed text-[11px]">Use o botão amarelo ou as setas do teclado <strong className="text-white">[→]</strong> para revelar tópicos.</p>
                                  </div>
                                  <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-850">
                                    <span className="font-mono text-amber-500 font-extrabold block mb-0.5 text-xs">2. Navegar</span>
                                    <p className="text-slate-300 leading-relaxed text-[11px]">Use <strong className="text-white">Ver Módulos (22)</strong> no topo para saltar entre os 22 temas.</p>
                                  </div>
                                  <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-850">
                                    <span className="font-mono text-amber-500 font-extrabold block mb-0.5 text-xs">3. Planta & Copiloto</span>
                                    <p className="text-slate-300 leading-relaxed text-[11px]">Visualize a planta fabril e tire dúvidas com o assistente inteligente.</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                          </div>
                        );

                        // Slide 1: Core Concepts (Click to reveal)
                        case 1: return (
                          <div className="space-y-3.5 my-auto h-full flex flex-col justify-between py-1">
                            <div>
                              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white flex items-center gap-2 font-mono tracking-wide">
                                <BookOpen className="w-5 h-5 text-amber-500" /> CONCEITOS FUNDAMENTAIS DE ENGENHARIA
                              </h3>
                              <p className="text-[11px] sm:text-xs text-slate-400 font-medium leading-relaxed mt-0.5">
                                Pressione a tecla <strong className="text-amber-500 font-black bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/15">ESPAÇO</strong> ou clique diretamente nos tópicos abaixo para revelar as definições industriais.
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 py-2">
                              {currentModule.concepts.map((concept, idx) => {
                                const isRevealed = idx < revealedCount;
                                return (
                                  <div 
                                    key={idx}
                                    onClick={() => {
                                      if (idx === revealedCount) {
                                        setRevealedCount(idx + 1);
                                        playSound('reveal');
                                      }
                                    }}
                                    className={`p-4 sm:p-5 rounded-xl border relative transition-all duration-300 overflow-hidden min-h-[110px] flex flex-col justify-center ${
                                      isRevealed 
                                        ? 'bg-slate-950 border-slate-750 text-slate-100 shadow-lg scale-[1.01]' 
                                        : 'bg-slate-900/30 border border-dashed border-slate-800/80 text-slate-400 cursor-pointer hover:bg-slate-900/50 hover:border-slate-700 hover:scale-[1.01]'
                                    }`}
                                  >
                                    <div className={`absolute top-0 left-0 w-1.5 h-full ${isRevealed ? 'bg-amber-500' : 'bg-slate-800'}`}></div>
                                    
                                    {isRevealed ? (
                                      <>
                                        <h4 className="font-extrabold text-xs sm:text-sm text-white flex items-center justify-between tracking-wide">
                                          <span>{concept.title}</span>
                                          <span className="text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono uppercase font-black">REVELADO</span>
                                        </h4>
                                        <motion.p 
                                          initial={{ opacity: 0, y: 3 }} 
                                          animate={{ opacity: 1, y: 0 }} 
                                          className="text-[11px] sm:text-xs text-slate-200 mt-1.5 leading-normal font-semibold"
                                        >
                                          {concept.description}
                                        </motion.p>
                                      </>
                                    ) : (
                                      <div className="flex flex-col items-center justify-center text-center py-1 space-y-1">
                                        <Unlock className="w-4 h-4 text-amber-500/80 mb-0.5 animate-bounce" />
                                        <h4 className="font-bold text-[11px] sm:text-xs text-slate-300 tracking-wide uppercase">
                                          Tópico {idx + 1}: [Clique para Revelar]
                                        </h4>
                                        <p className="text-[10px] sm:text-[11px] text-amber-500/90 font-mono font-bold">
                                          {concept.title}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            <div className="text-right text-[10px] sm:text-xs font-mono text-slate-400 font-extrabold uppercase tracking-widest bg-slate-950/60 p-2 rounded-lg border border-slate-850/50">
                              Métricas de Revelação: {revealedCount} de {currentModule.concepts.length} Tópicos
                            </div>
                          </div>
                        );

                        // Slide 2: Flowchart Operational Step
                        case 2: return (
                          <div className="space-y-3.5 my-auto h-full flex flex-col justify-between py-1">
                            <div>
                              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white flex items-center gap-2 font-mono tracking-wide">
                                <Layout className="w-5 h-5 text-amber-500" /> FLUXO OPERACIONAL SEQUENCIAL DE VALOR
                              </h3>
                              <p className="text-[11px] sm:text-xs text-slate-400 font-medium leading-relaxed mt-0.5">
                                Acompanhe o caminho físico, logístico e de dados de ponta a ponta clicando em <strong className="text-amber-500 font-bold bg-amber-500/10 px-1 rounded">Avançar</strong>.
                              </p>
                            </div>

                            {/* Flowchart items render with glowing indicators */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 py-2">
                              {currentModule.flowchartSteps.map((step, idx) => {
                                const isRevealed = idx < revealedCount;
                                return (
                                  <div 
                                    key={idx}
                                    className={`p-3 sm:p-3.5 rounded-xl border transition-all duration-300 text-left flex flex-col justify-between min-h-[110px] ${
                                      isRevealed 
                                        ? 'bg-slate-950 border-amber-500 shadow-lg scale-[1.01] z-10' 
                                        : 'bg-slate-900/20 border border-dashed border-slate-800/85 opacity-50'
                                    }`}
                                  >
                                    <div>
                                      <div className="flex items-center justify-between mb-1">
                                        <span className={`text-[9px] font-mono font-extrabold tracking-widest block uppercase ${isRevealed ? 'text-amber-500' : 'text-slate-600'}`}>PASSO {idx + 1}</span>
                                        {isRevealed && <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />}
                                      </div>
                                      <h5 className={`text-xs font-bold leading-tight ${isRevealed ? 'text-white' : 'text-slate-500 italic'}`}>{step.label}</h5>
                                    </div>
                                    <p className={`text-[10px] sm:text-[11px] mt-1.5 leading-normal font-semibold ${isRevealed ? 'text-slate-200' : 'text-slate-600'}`}>
                                      {step.description}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>

                            <div className="text-[11px] sm:text-xs font-medium text-slate-200 bg-slate-950 p-2.5 sm:p-3 border border-slate-800 rounded-xl leading-relaxed shadow-inner">
                              <span className="text-[10px] font-mono text-amber-500 font-black block uppercase tracking-wider mb-0.5">💡 Representação Física no Galpão:</span>
                              {currentModule.illustratedExplanation}
                            </div>
                          </div>
                        );

                        // Slide 3: Case study (side by side comparison)
                        case 3: return (
                          <div className="space-y-3.5 my-auto h-full flex flex-col justify-between py-1">
                            <div>
                              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white flex items-center gap-2 font-mono tracking-wide">
                                <Layers className="w-5 h-5 text-amber-500" /> CASO PRÁTICO vs MODELAGEM DIGITAL
                              </h3>
                              <p className="text-[11px] sm:text-xs text-slate-400 font-medium leading-relaxed mt-0.5">
                                Compreenda como conectamos os fatos do chão de fábrica físico ao ecossistema Industrial OS.
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                              {/* Left Panel: Real Factory case */}
                              {revealedCount >= 1 ? (
                                <div className="p-4 rounded-xl border border-amber-500 bg-slate-950 shadow-lg transition-all">
                                  <h4 className="text-[10px] sm:text-xs font-black font-mono text-amber-500 mb-2 tracking-widest flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> MUNDO REAL: CHÃO DE FÁBRICA FÍSICO
                                  </h4>
                                  <p className="text-[11px] sm:text-xs text-slate-100 leading-normal bg-slate-900/80 p-2.5 sm:p-3 rounded-lg border border-slate-800 font-semibold shadow-inner">
                                    {currentModule.practicalExample}
                                  </p>
                                </div>
                              ) : (
                                <div className="p-4 rounded-xl border border-dashed border-slate-800 bg-slate-900/10 flex flex-col items-center justify-center text-center py-6 sm:py-8">
                                  <Lock className="w-5 h-5 text-slate-600 mb-1.5" />
                                  <span className="text-slate-500 text-[10px] sm:text-xs font-black font-mono tracking-widest">
                                    🔒 AVANCE PARA REVELAR O CASO REAL
                                  </span>
                                </div>
                              )}

                              {/* Right Panel: Industrial OS System Application */}
                              {revealedCount >= 2 ? (
                                <div className="p-4 rounded-xl border border-emerald-500 bg-slate-950 shadow-lg transition-all">
                                  <h4 className="text-[10px] sm:text-xs font-black font-mono text-emerald-400 mb-2 tracking-widest flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> MUNDO DIGITAL: INDUSTRIAL OS
                                  </h4>
                                  <p className="text-[11px] sm:text-xs text-slate-100 leading-normal bg-slate-900/80 p-2.5 sm:p-3 rounded-lg border border-slate-800 font-semibold shadow-inner">
                                    {currentModule.systemApplication}
                                  </p>
                                </div>
                              ) : (
                                <div 
                                  onClick={() => { if (revealedCount === 1) { setRevealedCount(2); playSound('reveal'); } }}
                                  className="p-4 rounded-xl border border-dashed border-slate-800 bg-slate-900/10 flex flex-col items-center justify-center text-center py-6 sm:py-8 cursor-pointer hover:bg-slate-900/30 hover:border-slate-700 transition-all group"
                                >
                                  <Unlock className="w-5 h-5 text-amber-500 mb-1.5 animate-bounce group-hover:scale-110" />
                                  <span className="text-amber-500 text-[10px] sm:text-xs font-black font-mono tracking-widest">
                                    🔓 CLIQUE OU AVANCE PARA REVELAR SISTEMA
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="text-right text-[10px] sm:text-xs font-mono text-slate-400 font-extrabold uppercase tracking-widest bg-slate-950/60 p-2 rounded-lg border border-slate-850/50">
                              Etapas Demonstradas: {revealedCount} de 2
                            </div>
                          </div>
                        );

                        // Slide 4: Errors vs Key Takeaways
                        case 4: return (
                          <div className="space-y-3.5 my-auto h-full flex flex-col justify-between py-1">
                            <div>
                              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white flex items-center gap-2 font-mono tracking-wide">
                                <AlertCircle className="w-5 h-5 text-amber-500" /> EVITAR ERROS DE PROCESSO vs PRÁTICAS RECOMENDADAS
                              </h3>
                              <p className="text-[11px] sm:text-xs text-slate-400 font-medium leading-relaxed mt-0.5">
                                Garanta a integridade operacional e evite retrabalho na implantação da equipe.
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                              {/* Left column: Common Errors */}
                              {revealedCount >= 1 ? (
                                <div className="p-4 rounded-xl border border-red-500 bg-slate-950 shadow-lg transition-all">
                                  <h4 className="text-[10px] sm:text-xs font-black font-mono text-red-400 mb-2 tracking-widest flex items-center gap-1.5">
                                    ❌ EVITE ESTES ERROS DE CONFIGURAÇÃO
                                  </h4>
                                  <ul className="space-y-2">
                                    {currentModule.commonErrors.map((err, i) => (
                                      <li key={i} className="text-[11px] sm:text-xs text-slate-100 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 leading-normal font-semibold shadow-inner">
                                        {err}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : (
                                <div className="p-4 rounded-xl border border-dashed border-slate-800 bg-slate-900/10 flex flex-col items-center justify-center text-center py-6 sm:py-8">
                                  <Lock className="w-5 h-5 text-slate-600 mb-1.5" />
                                  <span className="text-slate-500 text-[10px] sm:text-xs font-black font-mono tracking-widest">
                                    🔒 AVANCE PARA REVELAR OS ERROS OPERACIONAIS
                                  </span>
                                </div>
                              )}

                              {/* Right column: Summary learnings */}
                              {revealedCount >= 2 ? (
                                <div className="p-4 rounded-xl border border-emerald-500 bg-slate-950 shadow-lg transition-all">
                                  <h4 className="text-[10px] sm:text-xs font-black font-mono text-emerald-400 mb-2 tracking-widest flex items-center gap-1.5">
                                    ✓ DIRETRIZES DE SUCESSO DO OPERADOR
                                  </h4>
                                  <ul className="space-y-2">
                                    {currentModule.summary.map((sum, i) => (
                                      <li key={i} className="text-[11px] sm:text-xs text-slate-100 bg-slate-900/90 p-2.5 rounded-lg border border-slate-850 leading-normal font-semibold shadow-inner">
                                        {sum}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : (
                                <div 
                                  onClick={() => { if (revealedCount === 1) { setRevealedCount(2); playSound('reveal'); } }}
                                  className="p-4 rounded-xl border border-dashed border-slate-800 bg-slate-900/10 flex flex-col items-center justify-center text-center py-6 sm:py-8 cursor-pointer hover:bg-slate-900/30 hover:border-slate-700 transition-all group"
                                >
                                  <Unlock className="w-5 h-5 text-amber-500 mb-1.5 animate-bounce group-hover:scale-110" />
                                  <span className="text-amber-500 text-[10px] sm:text-xs font-black font-mono tracking-widest">
                                    🔓 CLIQUE OU AVANCE PARA REVELAR DIRETRIZES
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="text-right text-[10px] sm:text-xs font-mono text-slate-400 font-extrabold uppercase tracking-widest bg-slate-950/60 p-2 rounded-lg border border-slate-850/50">
                              Quadros Revelados: {revealedCount} de 2
                            </div>
                          </div>
                        );

                        default: return <div className="text-center text-xs py-10 text-slate-500">Erro de carregamento do slide</div>;
                      }
                    })()}

                  </motion.div>
                </AnimatePresence>
              </div>

              {/* AUTOMATIC TIMED COUNTDOWN BAR */}
              {autoPlay && (
                <div className="w-full bg-slate-950 h-1">
                  <div className="bg-amber-500 h-full transition-all duration-100" style={{ width: `${timerProgress}%` }}></div>
                </div>
              )}

              {/* SLIDE LOWER PRESENTER CONTROL BAR */}
              <div className="bg-slate-950 px-5 sm:px-6 py-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 z-10 relative">
                
                {/* Previous / Next Actions */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handlePrevAction}
                    disabled={currentSlideIndex === 0}
                    className="bg-slate-900 border border-slate-800 hover:bg-slate-850 disabled:opacity-30 disabled:hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold flex items-center gap-1.5 shrink-0 transition-all active:scale-95"
                  >
                    <ChevronLeft className="w-4 h-4" /> Anterior
                  </button>
                  <button 
                    onClick={handleNextAction}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2 rounded-xl text-xs sm:text-sm font-mono font-black flex items-center gap-1.5 shrink-0 transition-all active:scale-95 shadow-md"
                  >
                    {currentSlideIndex === 4 ? (activeModuleId === 22 ? 'Concluir Apresentação' : 'Próximo Módulo') : 'Avançar'} 
                    {revealedCount < getMaxRevealsForSlide(currentSlideIndex) ? <Sparkles className="w-4 h-4 text-slate-950" /> : <ChevronRight className="w-4 h-4 text-slate-950" />}
                  </button>
                </div>

                {/* Slideshow indicator index dots */}
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, idx) => {
                    const isPassed = idx < currentSlideIndex;
                    const isActive = idx === currentSlideIndex;
                    return (
                      <button
                        key={idx}
                        onClick={() => { setCurrentSlideIndex(idx); playSound('slide'); }}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          isActive 
                            ? 'bg-amber-500 scale-125 shadow-[0_0_8px_rgba(245,158,11,0.5)]' 
                            : isPassed 
                              ? 'bg-amber-500/40' 
                              : 'bg-slate-800 hover:bg-slate-700'
                        }`}
                        title={`Slide ${idx + 1}`}
                      />
                    );
                  })}
                </div>

                {/* Autoplay / Quick controls toggle */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setAutoPlay(!autoPlay)}
                    className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono font-bold transition-all flex items-center gap-1.5 ${
                      autoPlay 
                        ? 'bg-amber-500/10 border-amber-500 text-amber-500' 
                        : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" /> 
                    <span>{autoPlay ? "Slideshow Ligado" : "Slideshow Manual"}</span>
                  </button>
                  <span className="text-[10px] text-slate-600 font-mono hidden lg:inline">
                    Atalhos: [← / →] Mudar Slide • [Espaço] Avançar Tópicos
                  </span>
                </div>

              </div>

            </div>
          </div>

        </main>

        {/* COMPANION TOOLS DRAWER COLLAPSIBLE (Right) */}
        <aside id="drawer" className={`bg-slate-900 border-l border-slate-800 transition-all duration-300 flex flex-col z-20 ${drawerOpen ? 'w-full md:w-80 p-4' : 'w-0 overflow-hidden'}`}>
          {drawerOpen && (
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
              
              {/* Virtual factory floor mapping widget */}
              <VirtualFactoryFloor activeModuleId={activeModuleId} />
              
              {/* Interactive Copilot Assistant widget */}
              <div className="flex-1 min-h-[350px]">
                <CopilotChat currentModule={currentModule} activeSlideIndex={currentSlideIndex} />
              </div>

            </div>
          )}
        </aside>

        {/* DRAWER COLLAPSE BUTTON HANDLER */}
        <button 
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-30 bg-slate-800 hover:bg-amber-500 text-white hover:text-slate-950 p-1.5 rounded-l-md border border-slate-700 hidden md:flex items-center justify-center transition-colors shadow-md"
          title={drawerOpen ? "Ocultar Painel de Apoio" : "Expandir Painel de Apoio"}
        >
          {drawerOpen ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

      </div>

      {/* 4. PERSISTENT FOOTER */}
      <footer id="footer" className="bg-slate-900 border-t border-slate-850 px-6 py-2 text-center text-[10px] text-slate-600 font-mono flex flex-col sm:flex-row justify-between items-center gap-2">
        <p>© 2026 Industrial OS Technologies S/A. Todos os direitos reservados.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-amber-500 transition-colors">Normativos da Indústria</a>
          <a href="#" className="hover:text-amber-500 transition-colors">Fichas de Engenharia</a>
          <a href="#" className="hover:text-amber-500 transition-colors">Termos do Chão de Fábrica</a>
        </div>
      </footer>

      {/* CERTIFICATE MODAL OVERLAY */}
      <AnimatePresence>
        {showCertificateModal && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl bg-slate-900 border-[10px] border-double border-amber-500/60 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-center"
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowCertificateModal(false)}
                className="absolute top-4 right-4 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white p-2 rounded-full transition-colors z-20 shadow-md"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/[0.02] rounded-full blur-3xl -z-10"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/[0.02] rounded-full blur-3xl -z-10"></div>
              
              <span className="text-[9px] font-mono tracking-widest text-amber-500 font-bold block mb-3">INDUSTRIAL OS PLATFORM</span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-serif tracking-tight mb-6">Certificado de Conclusão</h1>
              
              <p className="text-xs text-slate-500 italic mb-3">Certificamos para os devidos fins de engenharia e gestão fabril que</p>
              <p className="text-xl sm:text-3xl font-extrabold font-mono text-amber-500 border-b border-slate-800 pb-2 max-w-md mx-auto mb-5">
                {progress.userName.toUpperCase()}
              </p>
              
              <p className="text-[11px] text-slate-300 max-w-xl mx-auto leading-relaxed mb-8">
                concluiu com aproveitamento de 100% o programa de slides interativos e simulações em <strong className="text-white">Fundamentos do Chão de Fábrica para o Industrial OS</strong>, abrangendo todas as 22 disciplinas curriculares incluindo estrutura física, balanceamento de capacidade, estruturas de materiais (BOM), roteiros de operação, emissão de ordens, PCP, apontamento de produção, cálculo de perdas de retalho, OEE e suporte do Copilot de IA.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[10px] text-slate-500 font-mono pt-5 border-t border-slate-850">
                <div>
                  <span className="block text-slate-600 text-[9px]">DATA DA CONCLUSÃO</span>
                  <span className="font-bold text-slate-300 mt-1 block">{progress.completionDate}</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full mb-1">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-[8px] font-bold text-slate-500 tracking-widest">SÉRIE OURO</span>
                </div>
                <div>
                  <span className="block text-slate-600 text-[9px]">CHAVE OPERACIONAL</span>
                  <span className="font-bold text-slate-300 mt-1 block select-all">{progress.certificateCode}</span>
                </div>
              </div>

              <div className="mt-8 flex justify-center gap-3">
                <button 
                  onClick={() => window.print()}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-lg text-xs font-mono shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Printer className="w-4 h-4" /> Imprimir Documento / PDF
                </button>
                <button 
                  onClick={() => setShowCertificateModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-2.5 rounded-lg text-xs font-mono shadow-md flex items-center gap-1.5 transition-all"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
