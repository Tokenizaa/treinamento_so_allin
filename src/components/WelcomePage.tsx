import React, { useState } from 'react';
import { 
  Play, BookOpen, Award, Mic, Clock, Sparkles, HelpCircle, 
  CheckCircle2, ChevronRight, GraduationCap, ShieldCheck, Cpu, 
  BarChart3, Factory, Users, Settings, Workflow, Layout,
  ArrowRight, ChevronLeft, Presentation, Grid, Landmark, Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ModuleData, UserProgress } from '../types';
import { AllInLogo } from './AllInLogo';

interface WelcomePageProps {
  userName: string;
  progress: UserProgress;
  modulesData: ModuleData[];
  onSelectModule: (moduleId: number) => void;
  isListening: boolean;
  onToggleVoiceCommand: () => void;
  onOpenVoiceHelp: () => void;
  getModuleIcon: (id: number) => React.ReactNode;
  onStartTour?: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  userName,
  progress,
  modulesData,
  onSelectModule,
  isListening,
  onToggleVoiceCommand,
  onOpenVoiceHelp,
  getModuleIcon,
  onStartTour
}) => {
  const [viewMode, setViewMode] = useState<'cover' | 'curriculum'>('cover');
  const [selectedTrilhaIndex, setSelectedTrilhaIndex] = useState<number>(0);
  const completedCount = progress.completedModules.length;
  const percentComplete = Math.round((completedCount / 22) * 100);

  // Group modules into thematic trilhas (learning paths)
  const learningPaths = [
    {
      title: "1. Estrutura e Engenharia Base",
      shortTitle: "Engenharia Base",
      description: "Infraestrutura física, organização espacial e dimensionamento produtivo.",
      modules: modulesData.slice(0, 5), // Modules 1-5
      color: "from-amber-500/20 to-orange-500/10",
      borderColor: "border-amber-500/30",
      icon: <Factory className="w-3.5 h-3.5 text-amber-400" />
    },
    {
      title: "2. Postos de Trabalho & Força Humana",
      shortTitle: "Postos & Equipes",
      description: "Equipamentos de apoio, ferramental essencial e funções organizacionais.",
      modules: modulesData.slice(5, 8), // Modules 6-8
      color: "from-blue-500/20 to-indigo-500/10",
      borderColor: "border-blue-500/30",
      icon: <Users className="w-3.5 h-3.5 text-blue-400" />
    },
    {
      title: "3. Engenharia de Produtos & Insumos",
      shortTitle: "Produtos & Insumos",
      description: "Composição de materiais, estruturas de montagem (BOM) e variantes de produto.",
      modules: modulesData.slice(8, 12), // Modules 9-12
      color: "from-teal-500/20 to-emerald-500/10",
      borderColor: "border-teal-500/30",
      icon: <Workflow className="w-3.5 h-3.5 text-teal-400" />
    },
    {
      title: "4. Execução Operacional & Fluxo de Estoque",
      shortTitle: "Execução & Estoque",
      description: "Padronização (SOP), ordens de produção, apontamentos e acuracidade de estoque.",
      modules: modulesData.slice(12, 16), // Modules 13-16
      color: "from-purple-500/20 to-pink-500/10",
      borderColor: "border-purple-500/30",
      icon: <Settings className="w-3.5 h-3.5 text-purple-400" />
    },
    {
      title: "5. Gestão, Custos, Qualidade & IA",
      shortTitle: "Gestão, Custos & IA",
      description: "Manutenção de ativos, custos industriais, KPIs (OEE) e suporte com IA.",
      modules: modulesData.slice(16, 22), // Modules 17-22
      color: "from-emerald-500/20 to-cyan-500/10",
      borderColor: "border-emerald-500/30",
      icon: <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
    }
  ];

  // Determine which module the user should "resume" or "start"
  const firstUncompleted = modulesData.find(m => !progress.completedModules.includes(m.id));
  const resumeModuleId = firstUncompleted ? firstUncompleted.id : 1;

  return (
    <div className="w-full max-w-6xl mx-auto h-full flex flex-col justify-between py-2 px-3 sm:px-6 md:px-8 text-slate-200 overflow-hidden box-border">
      
      {/* NAVIGATION TABS TO TOGGLE VIEW */}
      <div className="flex items-center justify-between border-b border-slate-850 pb-2.5 shrink-0">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-amber-500" />
          <span className="text-[10px] sm:text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
            Allin-SO Training Center
          </span>
        </div>
        <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
          <button
            onClick={() => setViewMode('cover')}
            className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'cover'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            Slide de Abertura
          </button>
          <button
            onClick={() => setViewMode('curriculum')}
            className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'curriculum'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            Grade de Módulos (22)
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col justify-center py-2">
        <AnimatePresence mode="wait">
          {viewMode === 'cover' ? (
            /* ==================== VIEW 1: IMMERSIVE PRESENTATION COVER SLIDE ==================== */
            <motion.div
              key="presentation_cover"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col justify-between h-full gap-3 overflow-hidden"
            >
              <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 border border-slate-800 rounded-2xl p-5 sm:p-8 overflow-hidden shadow-xl flex flex-col items-center text-center justify-center flex-1 min-h-[300px]">
                {/* Background ambient light and grids */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/[0.04] rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/[0.02] rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415510_1px,transparent_1px),linear-gradient(to_bottom,#33415510_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none"></div>
                
                <div className="space-y-4 max-w-3xl relative z-10 flex flex-col items-center">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/25">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[9px] sm:text-[10px] font-mono font-black tracking-widest text-amber-400 uppercase">
                      Abertura Geral do Treinamento
                    </span>
                  </div>

                  {/* Brand Logo with perfect size adjustment */}
                  <div className="py-2 flex justify-center select-none pointer-events-none">
                    <AllInLogo size={150} className="drop-shadow-[0_0_15px_rgba(245,158,11,0.1)]" />
                  </div>

                  {/* Subtitle / Factory context */}
                  <span className="text-[10px] sm:text-xs font-mono text-slate-400 uppercase tracking-widest block font-bold">
                    SISTEMA DE GESTÃO E CAPACITAÇÃO OPERACIONAL
                  </span>

                  {/* Huge Title */}
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none uppercase">
                    Allin-SO <span className="text-amber-500 font-light font-sans">|</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-amber-400">Chão de Fábrica</span>
                  </h1>

                  {/* Focus indicator / objective statement */}
                  <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed font-light max-w-2xl">
                    Bem-vindo, <strong className="text-amber-400 font-bold">{userName}</strong>! Este manual interativo foi projetado para alinhar a teoria de Engenharia de Produção à modelagem lógica do sistema integrado <strong className="text-white font-semibold">Allin-SO</strong> dentro da fábrica de colchões da <strong className="text-amber-400 font-bold">Allin</strong>.
                  </p>

                  {/* Main Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full justify-center items-center">
                    <button
                      onClick={() => onSelectModule(resumeModuleId)}
                      className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-3 rounded-xl text-xs font-mono transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:scale-[1.02] active:scale-95 uppercase tracking-wider cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      {completedCount > 0 ? `Continuar do Módulo ${resumeModuleId}` : "Iniciar Treinamento Geral (Módulo 1)"}
                    </button>

                    <button
                      onClick={() => setViewMode('curriculum')}
                      className="w-full sm:w-auto bg-slate-950 hover:bg-slate-900 text-white border border-slate-800 hover:border-slate-700 font-black px-5 py-3 rounded-xl text-xs font-mono transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 uppercase tracking-wider cursor-pointer"
                    >
                      <Grid className="w-3.5 h-3.5 text-amber-500" />
                      Ver Cronograma de Módulos
                    </button>

                    {onStartTour && (
                      <button
                        onClick={onStartTour}
                        className="w-full sm:w-auto bg-slate-900 hover:bg-slate-805 text-amber-500 border border-amber-500/30 hover:border-amber-500/50 font-black px-5 py-3 rounded-xl text-xs font-mono transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.05)]"
                      >
                        <Compass className="w-3.5 h-3.5 animate-pulse text-amber-500" />
                        Fazer Tour Guiado
                      </button>
                    )}
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-xl pt-4 border-t border-slate-800/60 text-center">
                    <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-850/50">
                      <span className="block text-lg sm:text-xl font-mono font-black text-white">22</span>
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-medium mt-0.5">Módulos</span>
                    </div>
                    <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-850/50">
                      <span className="block text-lg sm:text-xl font-mono font-black text-white">5</span>
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-medium mt-0.5">Trilhas</span>
                    </div>
                    <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-850/50">
                      <span className="block text-lg sm:text-xl font-mono font-black text-amber-500">{percentComplete}%</span>
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-medium mt-0.5">Progresso</span>
                    </div>
                    <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-850/50">
                      <span className="block text-lg sm:text-xl font-mono font-black text-emerald-400">Ouro</span>
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-medium mt-0.5">Certificado</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* QUICK INSTRUCTIONAL PILLARS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 shrink-0">
                <div className="bg-slate-900 border border-slate-850 rounded-xl p-3 flex gap-2.5 items-start">
                  <div className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg shrink-0 mt-0.5">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold text-white uppercase font-mono tracking-wider mb-0.5">Módulos com Abertura (Capa)</h3>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Cada um dos 22 módulos possui uma capa de abertura estratégica com os objetivos da disciplina, evitando que você comece direto no conteúdo prático.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-850 rounded-xl p-3 flex gap-2.5 items-start">
                  <div className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg shrink-0 mt-0.5">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold text-white uppercase font-mono tracking-wider mb-0.5">Copiloto Integrado</h3>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Esclareça dúvidas operacionais em tempo real sobre o sistema Allin-SO clicando na aba lateral "Planta & Copiloto" durante qualquer aula.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-850 rounded-xl p-3 flex gap-2.5 items-start">
                  <div className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg shrink-0 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold text-white uppercase font-mono tracking-wider mb-0.5">Narração de Voz</h3>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Ative o Apresentador de Voz para ouvir a leitura estratégica em áudio de cada slide, com velocidade padrão otimizada em 1.3x para maior produtividade.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ==================== VIEW 2: COMPREHENSIVE CURRICULUM GRID WITH NO SCROLLBAR ==================== */
            <motion.div
              key="curriculum_directory"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col justify-between h-full gap-3 overflow-hidden"
            >
              {/* HERO MINI HEADER AREA FOR DIRECTORY */}
              <div className="relative bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/10 border border-slate-800 rounded-xl p-3 sm:p-4 overflow-hidden shadow-md shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 relative z-10">
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono font-bold tracking-widest text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 uppercase">
                      Cronograma Geral
                    </span>
                    <h2 className="text-sm sm:text-base font-bold text-white tracking-tight uppercase">
                      Estrutura de Ensino Continuado da Fábrica Allin
                    </h2>
                    <p className="text-[10px] text-slate-400">
                      Escolha qualquer módulo para iniciar. Cada um abrirá com sua respectiva <strong className="text-amber-500">Página de Capa e Objetivos</strong> antes do conteúdo.
                    </p>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-850 px-3 py-1 rounded-xl flex items-center gap-2.5 shrink-0">
                    <div className="text-left">
                      <span className="text-[8px] font-mono text-slate-500 font-bold uppercase block">Treinando</span>
                      <strong className="text-[10px] text-slate-200 block font-mono">{userName}</strong>
                    </div>
                    <span className="w-px h-5 bg-slate-850" />
                    <div className="text-center">
                      <span className="text-xs font-bold text-amber-500 font-mono block">{completedCount} / 22</span>
                      <span className="text-[8px] text-slate-500 font-mono uppercase font-bold block">Finalizados</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* THEMATIC TRILHAS TAB NAVIGATION (ELIMINATES VERTICAL SCROLLING!) */}
              <div className="flex-1 flex flex-col min-h-0 gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 shrink-0">
                  <h3 className="text-[10px] font-bold text-white uppercase font-mono tracking-wider">
                    Selecione a Trilha do Curso
                  </h3>
                  <button
                    onClick={onOpenVoiceHelp}
                    className="text-[9px] font-mono text-amber-500 hover:underline flex items-center gap-1 font-bold border border-amber-500/20 px-2 py-0.5 rounded-md bg-amber-500/5 hover:bg-amber-500/10 transition-all uppercase"
                  >
                    <HelpCircle className="w-3 h-3" /> Dicas de Voz
                  </button>
                </div>

                {/* Tabs Row */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 shrink-0">
                  {learningPaths.map((path, idx) => {
                    const isActive = selectedTrilhaIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedTrilhaIndex(idx)}
                        className={`p-2 rounded-lg border text-left transition-all ${
                          isActive 
                            ? 'bg-amber-500/10 border-amber-500/60 shadow-sm text-amber-400' 
                            : 'bg-slate-900/60 border-slate-850 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          {path.icon}
                          <span className="text-[9px] font-mono font-black uppercase tracking-wider block truncate">
                            T{idx + 1}. {path.shortTitle}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Tab content area (Selected Trilha modules in a perfectly sized 3x2 grid with NO scrollbar) */}
                <div className="flex-1 min-h-0 bg-slate-900/40 border border-slate-850 rounded-xl overflow-hidden flex flex-col justify-between">
                  
                  {/* Trilha Title Banner */}
                  <div className="px-3.5 py-2 bg-slate-950/60 border-b border-slate-850 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      {learningPaths[selectedTrilhaIndex].icon}
                      <span className="text-[10px] font-bold text-white font-mono uppercase tracking-wide">
                        {learningPaths[selectedTrilhaIndex].title}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 italic">
                      {learningPaths[selectedTrilhaIndex].description}
                    </span>
                  </div>

                  {/* Grid of modules inside the selected trilha */}
                  <div className="flex-1 p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 min-h-0 overflow-hidden items-center justify-center">
                    {learningPaths[selectedTrilhaIndex].modules.map((m) => {
                      const isCompleted = progress.completedModules.includes(m.id);
                      const isNextToLearn = m.id === resumeModuleId;
                      
                      return (
                        <button
                          key={m.id}
                          onClick={() => onSelectModule(m.id)}
                          className={`group h-[78px] p-2.5 rounded-xl border text-left transition-all duration-200 flex items-center gap-2.5 relative overflow-hidden ${
                            isCompleted 
                              ? 'bg-slate-900/40 border-emerald-500/20 hover:border-emerald-500/40 text-slate-300 hover:bg-slate-900/80' 
                              : isNextToLearn
                                ? 'bg-amber-500/5 border-amber-500/40 text-slate-100 hover:bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.05)]'
                                : 'bg-slate-900/20 border-slate-850 hover:border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                          }`}
                        >
                          {/* Highlight glow for next suggested module */}
                          {isNextToLearn && (
                            <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-amber-500 m-1 animate-ping" />
                          )}

                          <div className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                            isCompleted 
                              ? 'bg-emerald-500/10 text-emerald-400' 
                              : isNextToLearn
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-slate-850 text-slate-500 group-hover:bg-slate-800 group-hover:text-slate-300'
                          }`}>
                            {getModuleIcon(m.id)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 justify-between">
                              <span className={`text-[8px] font-mono font-black tracking-widest ${
                                isCompleted 
                                  ? 'text-emerald-400' 
                                  : isNextToLearn
                                    ? 'text-amber-500'
                                    : 'text-slate-500 group-hover:text-slate-400'
                              }`}>
                                MÓDULO {m.id.toString().padStart(2, '0')}
                              </span>
                              {isCompleted && (
                                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                              )}
                            </div>
                            <h4 className={`text-[11px] font-bold truncate mt-0.5 ${
                              isCompleted 
                                ? 'text-slate-300 group-hover:text-white' 
                                : isNextToLearn
                                  ? 'text-white'
                                  : 'text-slate-400 group-hover:text-slate-200'
                            }`}>
                              {m.title}
                            </h4>
                            <p className="text-[9px] text-slate-500 truncate group-hover:text-slate-400 mt-0.5 leading-none">
                              {m.objective}
                            </p>
                          </div>
                          
                          <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                        </button>
                      );
                    })}
                  </div>

                </div>
              </div>

              {/* FOOTER CREDITS / STATS SUMMARY */}
              <div className="bg-slate-900/35 border border-slate-850 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 font-mono gap-1 shrink-0">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/60" />
                  <span>Certificação Oficial de Capacitação do Chão de Fábrica - Allin-SO (Allin)</span>
                </div>
                <div>
                  <span>Código do Curso: <strong className="text-slate-400 font-bold">CH-FAB-2026</strong></span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
