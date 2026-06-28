import { useState, useEffect, useRef } from 'react';
import { 
  Factory, Layout, Layers, Cpu, Hammer, Users, Boxes, Wrench, 
  Truck, Settings, ClipboardList, CheckSquare, TrendingUp, 
  Coins, MessageSquare, Award, Search, Lock, Unlock, Play, Pause, 
  CheckCircle2, AlertCircle, Calendar, DollarSign, Gauge, 
  Send, ChevronRight, ChevronLeft, ArrowRight, 
  BookOpen, Puzzle, FileText, Check, RotateCcw, User, Printer, Clock,
  Presentation, PlayCircle, Volume2, VolumeX, Maximize2, Minimize2, Sparkles, Menu, X,
  Mic, MicOff, HelpCircle, Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { modulesData } from './data/modulesData';
import { UserProgress, ModuleData } from './types';

// Import our gorgeous modular sub-components
import InteractiveExerciseRenderer from './components/InteractiveExerciseRenderer';
import CopilotChat from './components/CopilotChat';
import VirtualFactoryFloor from './components/VirtualFactoryFloor';
import { WelcomePage } from './components/WelcomePage';
import { InteractiveTour } from './components/InteractiveTour';
import { Tooltip } from './components/Tooltip';
import { ModuleQuiz } from './components/ModuleQuiz';
import { AllInLogo } from './components/AllInLogo';

// Dynamic voice narration script builder in Portuguese for Allin-SO Modules
const getNarrationText = (module: ModuleData, slideIndex: number): string => {
  switch (slideIndex) {
    case 0:
      return `Abertura do Módulo ${module.id}: ${module.title}. O objetivo pedagógico deste treinamento é: ${module.objective}. Vamos iniciar a apresentação do conteúdo.`;
    case 1: {
      const conceptsNarrative = module.concepts
        .map((c, idx) => `Conceito número ${idx + 1}, ${c.title}: ${c.description}`)
        .join(". ");
      return `Conceitos fundamentais de engenharia para o módulo ${module.title}. Analisamos os seguintes pontos estratégicos: ${conceptsNarrative}. Clique diretamente nos tópicos para revelar as definições industriais completas.`;
    }
    case 2: {
      const stepsNarrative = module.flowchartSteps
        .map((step, idx) => `Passo ${idx + 1}, ${step.label}: ${step.description}`)
        .join(". ");
      return `Fluxo operacional sequencial de valor. Acompanhe o caminho físico e lógico dos materiais de ponta a ponta: ${stepsNarrative}. Como representação física no galpão de fábrica: ${module.illustratedExplanation}`;
    }
    case 3:
      return `Caso prático versus modelagem digital. No mundo real, do chão de fábrica físico, ${module.practicalExample}. Para conectar essa realidade ao nosso sistema industrial, no Allin-SO, ${module.systemApplication}`;
    case 4: {
      const errorsNarrative = module.commonErrors.join(". ");
      const summaryNarrative = module.summary.join(". ");
      return `Diretrizes de conformidade operacional. Para garantir o sucesso da equipe, evite estes erros comuns de processo: ${errorsNarrative}. Como práticas recomendadas essenciais ao operador, lembre-se de que: ${summaryNarrative}`;
    }
    case 5:
      return `Desafio de Consolidação. Responda ao quiz rápido de múltipla escolha para validar o seu aprendizado técnico neste módulo.`;
    default:
      return "";
  }
};

// Dynamic step-by-step voice narration script builder for real-time synchronization
const getStepNarrationText = (module: ModuleData, slideIndex: number, step: number): string => {
  switch (slideIndex) {
    case 0:
      return `Abertura do Módulo ${module.id}: ${module.title}. O objetivo pedagógico deste treinamento é: ${module.objective}. Vamos iniciar a apresentação do conteúdo.`;
    case 1: {
      const concept = module.concepts[step - 1];
      if (concept) {
        return `Conceito número ${step}: ${concept.title}. ${concept.description}`;
      }
      return "";
    }
    case 2: {
      const flowStep = module.flowchartSteps[step - 1];
      if (flowStep) {
        let text = `Passo número ${step} do fluxo: ${flowStep.label}. ${flowStep.description}`;
        if (step === module.flowchartSteps.length) {
          text += `. Em resumo, sobre a representação física no galpão de fábrica: ${module.illustratedExplanation}`;
        }
        return text;
      }
      return "";
    }
    case 3: {
      if (step === 1) {
        return `Análise do caso prático no chão de fábrica físico: ${module.practicalExample}`;
      } else if (step === 2) {
        return `Para conectar essa realidade ao nosso sistema industrial, no Allin-SO: ${module.systemApplication}`;
      }
      return "";
    }
    case 4: {
      if (step === 1) {
        const errors = module.commonErrors.join(". ");
        return `Diretrizes operacionais de conformidade. Evite estes erros comuns de configuração de processo: ${errors}`;
      } else if (step === 2) {
        const summary = module.summary.join(". ");
        return `Como práticas recomendadas essenciais ao operador, lembre-se de que: ${summary}`;
      }
      return "";
    }
    case 5:
      return `Desafio de Consolidação. Responda ao quiz rápido de múltipla escolha para validar o seu aprendizado técnico neste módulo.`;
    default:
      return "";
  }
};

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
  const [showStartPage, setShowStartPage] = useState<boolean>(true);

  const handleSelectModule = (id: number) => {
    setActiveModuleId(id);
    setShowStartPage(false);
    setCurrentSlideIndex(0);
    setRevealedCount(1);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsNarrating(false);
    playSound('slide');
  };
  
  // Slide controls and settings
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const [timerProgress, setTimerProgress] = useState<number>(0);
  const [presentationMode, setPresentationMode] = useState<boolean>(false);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [showTour, setShowTour] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  // Auto-start tour for new visitors with a small delay
  useEffect(() => {
    const isCompleted = localStorage.getItem('allin_so_tour_completed');
    if (isCompleted !== 'true') {
      const timer = setTimeout(() => {
        setShowTour(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Layout Sidebars/Panels Toggles
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // User name editor
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(progress.userName);

  // --- Toast Notification State ---
  const [toast, setToast] = useState<{ message: string; subMessage?: string } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // --- Voice Narration States ---
  const [isNarrating, setIsNarrating] = useState<boolean>(false);
  const [narratorRate, setNarratorRate] = useState<number>(1.3);
  const [narratorSubtitleText, setNarratorSubtitleText] = useState<string>("");
  const [showNarratorSubtitles, setShowNarratorSubtitles] = useState<boolean>(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Pre-load voices list and add user gesture listener to unlock speech synthesis on strict browsers
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    // Active gesture unlock to bypass browser restrictions on programmatic speech
    const unlockSpeech = () => {
      try {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.resume();
          const silentUtterance = new SpeechSynthesisUtterance('');
          silentUtterance.volume = 0;
          window.speechSynthesis.speak(silentUtterance);
        }
      } catch (e) {
        console.warn("Could not unlock speech synthesis:", e);
      }
      // Remove listeners after first interaction
      window.removeEventListener('click', unlockSpeech);
      window.removeEventListener('keydown', unlockSpeech);
      window.removeEventListener('touchstart', unlockSpeech);
    };

    window.addEventListener('click', unlockSpeech);
    window.addEventListener('keydown', unlockSpeech);
    window.addEventListener('touchstart', unlockSpeech);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      window.removeEventListener('click', unlockSpeech);
      window.removeEventListener('keydown', unlockSpeech);
      window.removeEventListener('touchstart', unlockSpeech);
    };
  }, []);

  // --- Speech Recognition States ---
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceStatus, setVoiceStatus] = useState<string>("");
  const [showVoiceHelpModal, setShowVoiceHelpModal] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  // References to handle accurate synchronization of automatic transitions
  const activeAutoPlayTimeoutRef = useRef<any>(null);
  const autoPlayRef = useRef<boolean>(autoPlay);

  useEffect(() => {
    autoPlayRef.current = autoPlay;
  }, [autoPlay]);

  const clearAutoPlayTimeout = () => {
    if (activeAutoPlayTimeoutRef.current) {
      clearTimeout(activeAutoPlayTimeoutRef.current);
      activeAutoPlayTimeoutRef.current = null;
    }
  };

  // Helper to estimate the duration of a spoken text in ms to feed the countdown timer
  const getEstimatedSpeechDuration = (text: string, rate: number): number => {
    if (!text) return 5000;
    const charRate = 14; // Characters spoken per second on average
    const speakingTimeMs = (text.length / charRate) * 1000 * (1 / rate);
    // Add 1200ms of entry padding and 1800ms post-narration wait time for comfortable transitions
    return Math.max(4500, Math.min(22000, speakingTimeMs + 1200 + 1800));
  };

  // Core speak action using browser SpeechSynthesis with event listeners for autoPlay progression
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    // Help Chrome / Safari unstick their speech synthesis queues by calling resume first
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch (e) {}

    window.speechSynthesis.cancel();
    clearAutoPlayTimeout();
    setIsNarrating(false);

    if (!text) return;

    // Use a short delay (15ms) to ensure previous cancel completed cleanly before launching new speak
    setTimeout(() => {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = narratorRate;
        utterance.pitch = 1.0; // Balanced high-fidelity pitch for natural human feel

        // Locate high-fidelity female Portuguese voice
        let availableVoices = window.speechSynthesis.getVoices();
        if (!availableVoices || availableVoices.length === 0) {
          availableVoices = voices;
        }
        
        // Filter Portuguese voices (prioritizing pt-BR)
        const ptVoices = availableVoices.filter(v => {
          const l = v.lang.toLowerCase();
          return l.includes('pt-br') || l === 'pt_br' || l.startsWith('pt');
        });

        let selectedVoice = null;

        // Male voice names to search for (e.g. Daniel, Felipe, Antonio, Ricardo, Lucas, Thiago, Guilherme, Heitor, Diogo)
        const maleNames = ['daniel', 'antonio', 'felipe', 'ricardo', 'lucas', 'thiago', 'guilherme', 'heitor', 'diogo'];

        // 1. High-fidelity LOCAL system male voices (most robust in iframe sandboxes)
        selectedVoice = ptVoices.find(v => {
          const name = v.name.toLowerCase();
          const isMale = maleNames.some(mn => name.includes(mn));
          return isMale && v.localService;
        });

        // 2. Any Portuguese voice that matches a male name
        if (!selectedVoice) {
          selectedVoice = ptVoices.find(v => {
            const name = v.name.toLowerCase();
            return maleNames.some(mn => name.includes(mn));
          });
        }

        // 3. Any local system Portuguese voice
        if (!selectedVoice) {
          selectedVoice = ptVoices.find(v => v.localService);
        }

        // 4. Any other pt-BR voice
        if (!selectedVoice) {
          selectedVoice = ptVoices.find(v => {
            const l = v.lang.toLowerCase();
            return l.includes('pt-br') || l === 'pt_br';
          });
        }

        // 5. Fallback to any Portuguese voice
        if (!selectedVoice) {
          selectedVoice = ptVoices[0];
        }

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }

        utterance.onstart = () => {
          setIsNarrating(true);
        };

        utterance.onend = () => {
          setIsNarrating(false);
          
          // Automatically advance if autoPlay mode is active
          if (autoPlayRef.current) {
            clearAutoPlayTimeout();
            activeAutoPlayTimeoutRef.current = setTimeout(() => {
              handleNextAction();
            }, 1800); // Wait 1.8 seconds of comfort space, then advance
          }
        };

        utterance.onerror = (e) => {
          console.warn("Speech Synthesis error:", e);
          setIsNarrating(false);
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error("Failed to run speech synthesis:", err);
        setIsNarrating(false);
      }
    }, 15);
  };

  // Toggle narration manually for the current slide/step
  const handleToggleNarration = () => {
    if (autoPlay) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      clearAutoPlayTimeout();
      setIsNarrating(false);
      setNarratorSubtitleText("");
      setAutoPlay(false);
    } else {
      setAutoPlay(true);
    }
  };

  // Cancel any speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      clearAutoPlayTimeout();
    };
  }, []);

  // --- Web Speech API Command & Search Parser ---
  const parseVoiceCommand = (rawTranscript: string) => {
    const text = rawTranscript.toLowerCase().trim();
    
    // 1. Navigation slide actions
    if (
      text.includes("próximo") || 
      text.includes("avançar") || 
      text.includes("avanca") || 
      text.includes("proximo") || 
      text.includes("slide seguinte") || 
      text.includes("seguir") ||
      text.includes("revelar") ||
      text.includes("continuar")
    ) {
      handleNextAction();
      setToast({
        message: "🎤 Avançar Slide",
        subMessage: `Comando executado: "${rawTranscript}"`
      });
      return;
    }

    if (
      text.includes("voltar") || 
      text.includes("anterior") || 
      text.includes("retroceder") || 
      text.includes("retornar")
    ) {
      handlePrevAction();
      setToast({
        message: "🎤 Voltar Slide",
        subMessage: `Comando executado: "${rawTranscript}"`
      });
      return;
    }

    // Narration control commands
    if (
      text.includes("pausar voz") || 
      text.includes("parar voz") || 
      text.includes("silenciar") || 
      text.includes("pausar narração") || 
      text.includes("parar narração") ||
      text.includes("pausar apresentador") ||
      text.includes("parar apresentador")
    ) {
      if (autoPlay) {
        setAutoPlay(false);
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        setIsNarrating(false);
        setToast({
          message: "🎤 Apresentador Pausado",
          subMessage: "Narração de voz pausada com sucesso."
        });
      }
      return;
    }

    if (
      text.includes("iniciar voz") || 
      text.includes("tocar voz") || 
      text.includes("ativar voz") || 
      text.includes("iniciar narração") || 
      text.includes("escutar slide") || 
      text.includes("ouvir slide") ||
      text.includes("iniciar apresentador") ||
      text.includes("ativar apresentador")
    ) {
      if (!autoPlay) {
        setAutoPlay(true);
        setToast({
          message: "🎤 Apresentador Ativo",
          subMessage: "Iniciando narração automática de slides."
        });
      }
      return;
    }

    // 2. Direct module navigation by number
    const numberMap: Record<string, number> = {
      "um": 1, "dois": 2, "três": 3, "tres": 3, "quatro": 4, "cinco": 5, "seis": 6, "sete": 7, "oito": 8, "nove": 9, "dez": 10,
      "onze": 11, "doze": 12, "treze": 13, "catorze": 14, "quatorze": 14, "quinze": 15, "dezesseis": 16, "dezessete": 17, "dezoito": 18, "dezenove": 19, "vinte": 20,
      "vinte e um": 21, "vinte e dois": 22
    };

    // Match "módulo [número]" or "capítulo [número]" or "ir para o módulo [número]"
    const numberPattern = /(?:módulo|modulo|capítulo|capitulo|ir para o módulo|ir para|ir pro módulo|ir pro|tema|aula)\s*(\d+|um|dois|três|tres|quatro|cinco|seis|sete|oito|nove|dez|onze|doze|treze|catorze|quatorze|quinze|dezesseis|dezessete|dezoito|dezenove|vinte|vinte\s+e\s+um|vinte\s+e\s+dois)/i;
    const match = text.match(numberPattern);
    if (match) {
      const numStr = match[1].toLowerCase().trim();
      let targetId = parseInt(numStr, 10);
      if (isNaN(targetId)) {
        targetId = numberMap[numStr] || 0;
      }

      if (targetId >= 1 && targetId <= 22) {
        handleSelectModule(targetId);
        setToast({
          message: `🎤 Módulo ${targetId} Selecionado`,
          subMessage: modulesData[targetId - 1]?.title || ""
        });
        return;
      }
    }

    // 3. Match module by title keywords
    const normalizedModules = modulesData.map(m => ({
      id: m.id,
      title: m.title,
      normalized: m.title.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/[^a-z0-9 ]/g, "")
    }));

    const normalizedInput = text
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 ]/g, "");

    // Check matches
    for (const m of normalizedModules) {
      if (normalizedInput.includes(m.normalized) || m.normalized.includes(normalizedInput)) {
        if (normalizedInput.length > 4) { // prevent too short matches
          handleSelectModule(m.id);
          setToast({
            message: `🎤 Navegando para Módulo ${m.id}`,
            subMessage: m.title
          });
          return;
        }
      }
    }

    // Search command fallback
    const searchPattern = /(?:pesquisar|buscar|procurar|filtrar|filtro por|pesquisa por|achar)\s+(.+)/i;
    const searchMatch = text.match(searchPattern);
    if (searchMatch) {
      const query = searchMatch[1].trim();
      setSearchQuery(query);
      setSidebarOpen(true);
      setToast({
        message: `🎤 Pesquisando: "${query}"`,
        subMessage: "Filtro de módulos ativado."
      });
      return;
    }

    // Treat general speech as search query
    setSearchQuery(rawTranscript);
    setSidebarOpen(true);
    setToast({
      message: "🎤 Pesquisa por Voz Realizada",
      subMessage: `Buscando capítulos contendo "${rawTranscript}"`
    });
  };

  // Web Speech API - Recognition Lifecycle Hook
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.lang = 'pt-BR';
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      setIsListening(true);
      setVoiceStatus("Ouvindo comandos...");
    };

    rec.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setVoiceStatus(`Entendido: "${transcript}"`);
      parseVoiceCommand(transcript);
    };

    rec.onerror = (event: any) => {
      console.warn("Erro no reconhecimento de voz:", event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        setVoiceStatus("Sem microfone");
        setToast({ 
          message: "⚠️ Sem Microfone", 
          subMessage: "Por favor, permita o acesso ao microfone no navegador para usar comandos de voz." 
        });
      } else if (event.error !== 'no-speech') {
        setVoiceStatus(`Erro: ${event.error}`);
      }
    };

    rec.onend = () => {
      setIsListening(false);
      setVoiceStatus("");
    };

    recognitionRef.current = rec;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, [autoPlay]);

  const handleToggleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setToast({ 
        message: "⚠️ Recurso Indisponível", 
        subMessage: "Este navegador não suporta a Web Speech API para controle de voz." 
      });
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsNarrating(false);
      
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.error("Erro ao iniciar SpeechRecognition:", e);
        }
      }
    }
  };

  // --- Active Module Data ---
  const currentModule = modulesData.find(m => m.id === activeModuleId) || modulesData[0];

  // --- Reset slide states on module shift ---
  useEffect(() => {
    setCurrentSlideIndex(0);
    setRevealedCount(1);
    setShowNarratorSubtitles(true);
  }, [activeModuleId]);

  // Reset revealed topic count on changing active slide index & trigger auto play narration
  useEffect(() => {
    setRevealedCount(1);
    setTimerProgress(0);
    setShowNarratorSubtitles(true);
    if (currentSlideIndex === 5) {
      setAutoPlay(false);
    }
  }, [currentSlideIndex]);

  // Unified speech narration triggers for perfect real-time coordination
  useEffect(() => {
    clearAutoPlayTimeout();

    if (autoPlay) {
      const text = getStepNarrationText(currentModule, currentSlideIndex, revealedCount);
      if (text) {
        speakText(text);
      }
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsNarrating(false);
        setNarratorSubtitleText("");
      }
    }

    return () => {
      clearAutoPlayTimeout();
    };
  }, [activeModuleId, currentSlideIndex, revealedCount, autoPlay]);

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
    if (showStartPage) {
      setShowStartPage(false);
      setActiveModuleId(1);
      setCurrentSlideIndex(0);
      setRevealedCount(1);
      playSound('slide');
      return;
    }

    const maxReveals = getMaxRevealsForSlide(currentSlideIndex);
    if (revealedCount < maxReveals) {
      setRevealedCount(prev => prev + 1);
      playSound('reveal');
    } else {
      // Fully revealed, change slide
      if (currentSlideIndex < 5) {
        setCurrentSlideIndex(prev => prev + 1);
        setRevealedCount(1);
        playSound('slide');
      } else {
        // Enforce quiz completion on Slide 5
        const isQuizCompleted = progress.quizScores[activeModuleId] !== undefined;
        if (!isQuizCompleted) {
          playSound('error');
          setToast({
            message: `Responda o Quiz!`,
            subMessage: `É necessário concluir o quiz com sucesso antes de avançar para o próximo módulo.`
          });
          return;
        }

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

        // Trigger Toast Notification
        setToast({
          message: `Módulo ${activeModuleId} Concluído!`,
          subMessage: `O progresso do deck "${currentModule.title}" foi salvo com sucesso no Allin-SO.`
        });

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
    if (showStartPage) return;

    if (currentSlideIndex > 0) {
      const prevSlide = currentSlideIndex - 1;
      setCurrentSlideIndex(prevSlide);
      setRevealedCount(getMaxRevealsForSlide(prevSlide));
      playSound('slide');
    } else if (activeModuleId > 1) {
      // Go to previous module's last slide (Slide 5: Quiz)
      setActiveModuleId(activeModuleId - 1);
      setTimeout(() => {
        setCurrentSlideIndex(5);
        setRevealedCount(getMaxRevealsForSlide(5));
      }, 50);
      playSound('slide');
    } else {
      // Back to welcome page
      setShowStartPage(true);
      playSound('slide');
    }
  };

  const handleResetProgress = () => {
    setShowResetModal(true);
  };

  const confirmResetProgress = () => {
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
    setShowResetModal(false);
    playSound('slide');
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

    const currentText = getStepNarrationText(currentModule, currentSlideIndex, revealedCount);
    const hasSpeechSupport = ('speechSynthesis' in window);
    
    // Unify duration: estimate if speech is active, fallback to 7 seconds if speech is blocked/inactive
    const totalDuration = hasSpeechSupport && currentText 
      ? getEstimatedSpeechDuration(currentText, narratorRate)
      : 7000;

    const intervalTime = 50; 
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += intervalTime;
      setTimerProgress(Math.min(100, (elapsed / totalDuration) * 100));

      // Dual-channel fallback safety net:
      // If speech synthesis gets stuck, or is blocked by browser permissions, or fails to emit 'onend',
      // this timer will automatically advance the slide once elapsed reaches totalDuration + 1000ms,
      // but only if the voice is not actively speaking.
      const fallbackLimit = totalDuration + 1000;
      if (elapsed >= fallbackLimit) {
        if (!isNarrating || !hasSpeechSupport) {
          handleNextAction();
          elapsed = 0;
        }
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [autoPlay, currentSlideIndex, revealedCount, isNarrating, narratorRate]);

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
      <header id="header" className="bg-slate-900 border-b border-slate-800 px-3 sm:px-6 py-1.5 sm:py-2.5 flex flex-wrap items-center justify-between sticky top-0 z-40 gap-2 sm:gap-4 shadow-lg">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex-shrink-0 select-none pointer-events-none">
            <AllInLogo size={36} className="drop-shadow-[0_0_8px_rgba(245,158,11,0.2)]" />
          </div>
          <div>
            <h1 className="text-sm sm:text-lg font-bold tracking-tight text-white font-mono flex items-center gap-1.5 sm:gap-2 select-none">
              AllIn-SO <span className="text-amber-500 text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 bg-amber-500/10 rounded border border-amber-500/30 font-black">PLATFORM</span>
            </h1>
            <p className="text-[9px] sm:text-[10px] text-slate-400">Capacitação do Chão de Fábrica</p>
          </div>
        </div>

        {/* CLEAR, HIGHLY-VISIBLE TOGGLE BUTTONS - SOLVES FIRST SCREEN CONFUSION */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-950 p-1 sm:p-1.5 rounded-xl border border-slate-800">
          <button
            id="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? "Ocultar Menu Lateral com 22 Módulos" : "Exibir Menu Lateral com 22 Módulos"}
            className={`px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              sidebarOpen 
                ? 'bg-amber-500 text-slate-950 font-black shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Menu className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">☰ Ver Módulos (22)</span>
            <span className="inline sm:hidden">Módulos (22)</span>
            <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${sidebarOpen ? 'bg-slate-950' : 'bg-amber-400 animate-pulse'}`} />
          </button>
          
          <button
            id="drawer-toggle"
            onClick={() => setDrawerOpen(!drawerOpen)}
            title={drawerOpen ? "Ocultar Painel de Apoio" : "Exibir Painel de Apoio (Fábrica + Copiloto)"}
            className={`px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              drawerOpen 
                ? 'bg-amber-500 text-slate-950 font-black shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Factory className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">🔧 Planta & Copiloto</span>
            <span className="inline sm:hidden">Planta & Copiloto</span>
            <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${drawerOpen ? 'bg-slate-950' : 'bg-emerald-400 animate-pulse'}`} />
          </button>
        </div>

        {/* STUDY CONTROLS AND GENERAL METERS */}
        <div className="flex items-center gap-5">
          {/* Sounds and Playback Toggles */}
          <div className="flex items-center bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 gap-3">
            <Tooltip content="Iniciar o Tour de Boas-vindas interativo" position="bottom">
              <button 
                onClick={() => setShowTour(true)}
                title="Iniciar Tour de Boas-vindas"
                className="p-1 rounded text-slate-400 hover:text-amber-500 transition-all flex items-center gap-1 hover:scale-[1.1] active:scale-95"
              >
                <Compass className="w-4 h-4 text-amber-500 animate-pulse" />
              </button>
            </Tooltip>
            <span className="w-px h-3 bg-slate-800" />
            <Tooltip content={soundOn ? "Desativar efeitos sonoros de clique e transição" : "Ativar efeitos sonoros de clique e transição"} position="bottom">
              <button 
                onClick={() => setSoundOn(!soundOn)}
                title={soundOn ? "Desativar efeitos sonoros" : "Ativar efeitos sonoros"}
                className={`p-1 rounded transition-colors ${soundOn ? 'text-amber-500 hover:text-amber-400' : 'text-slate-600 hover:text-slate-400'}`}
              >
                {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </Tooltip>
            <span className="w-px h-3 bg-slate-800" />
            <Tooltip content={presentationMode ? "Sair do modo de projeção focada" : "Modo de projeção limpa em tela cheia para foco"} position="bottom">
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
            </Tooltip>
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
        
        {/* Mobile Backdrop Overlay for Sidebar */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 md:hidden"
          />
        )}

        {/* COLLAPSIBLE CHAPTERS SIDEBAR (Left) */}
        <aside id="sidebar" className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col z-40 md:z-20 ${sidebarOpen ? 'absolute md:relative inset-y-0 left-0 w-full sm:w-80 md:w-80 h-full shadow-2xl md:shadow-none' : 'w-0 overflow-hidden'}`}>
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 font-mono tracking-wider">CRONOGRAMA DE SLIDE DECKS</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">22 MÓDULOS</span>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded md:hidden"
                title="Fechar Menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-3 border-b border-slate-850">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input 
                type="text" 
                placeholder="Pesquisar módulos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {/* 🏠 WELCOME / START PAGE BUTTON */}
            <button
              onClick={() => {
                setShowStartPage(true);
                if ('speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                setIsNarrating(false);
                playSound('slide');
              }}
              className={`w-full flex items-center gap-2 p-2.5 rounded-lg text-left transition-all mb-2 ${
                showStartPage 
                  ? 'bg-amber-500 text-slate-950 border border-amber-400 font-bold shadow-md' 
                  : 'bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-800'
              }`}
            >
              <div className="flex-shrink-0">
                <Presentation className={`w-4 h-4 ${showStartPage ? 'text-slate-950' : 'text-amber-500'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-[8px] font-mono font-bold tracking-widest mb-0.5">
                  <span className={showStartPage ? 'text-slate-900' : 'text-amber-500'}>CONTEÚDO GERAL</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${showStartPage ? 'bg-slate-950' : 'bg-slate-600'}`} />
                </div>
                <p className={`text-xs font-semibold truncate ${showStartPage ? 'text-slate-950' : 'text-slate-150'}`}>🏠 Abertura do Treinamento</p>
              </div>
            </button>

            {filteredModules.map((m) => {
              const isCompleted = progress.completedModules.includes(m.id);
              const isActive = !showStartPage && activeModuleId === m.id;

              return (
                <button
                  key={m.id}
                  onClick={() => handleSelectModule(m.id)}
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
        <main id="main_content" className="flex-1 h-full flex flex-col justify-between gap-3 p-2 sm:p-3 overflow-hidden relative box-border w-full max-w-full">
          
          {showStartPage ? (
            <WelcomePage
              userName={progress.userName}
              progress={progress}
              modulesData={modulesData}
              onSelectModule={handleSelectModule}
              isListening={isListening}
              onToggleVoiceCommand={handleToggleVoiceSearch}
              onOpenVoiceHelp={() => setShowVoiceHelpModal(true)}
              getModuleIcon={getModuleIcon}
              onStartTour={() => setShowTour(true)}
            />
          ) : (
            <>
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
                    onClick={() => { setCurrentSlideIndex(idx); setRevealedCount(1); playSound('slide'); }}
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
          {progress.completedModules.length === 22 && !presentationMode && (
            <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 rounded-xl p-3 flex flex-col md:flex-row items-center justify-between gap-3 shadow-md animate-fade-in">
              <div className="flex items-center gap-3 text-center md:text-left flex-col md:flex-row">
                <div className="p-2 bg-emerald-500 text-slate-950 rounded-full shrink-0">
                  <Award className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">Treinamento Corporativo Concluído!</h3>
                  <p className="text-[11px] text-slate-300">Parabéns! Você concluiu todos os <strong>22 de 22 módulos</strong> de Fundamentos do Chão de Fábrica.</p>
                  <span className="text-[9px] text-amber-500 font-mono block">Currículo Geral Concluído com Sucesso! Chave: {progress.certificateCode || 'CURSO-COMPLETO-100'}</span>
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
          <div className="w-full max-w-full md:max-w-[96%] xl:max-w-[1360px] mx-auto flex flex-col flex-1 min-h-0">
            <div className="bg-slate-900 border-2 sm:border-4 border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden relative shadow-2xl flex flex-col min-h-[320px] sm:min-h-[380px] md:max-h-[calc(100vh-140px)] h-auto w-full flex-1">
              
              {/* Slide Background Visual Matrix Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415515_1px,transparent_1px),linear-gradient(to_bottom,#33415515_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
              <div className="absolute top-0 left-0 w-72 h-72 bg-amber-500/[0.03] rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-500/[0.03] rounded-full blur-3xl pointer-events-none"></div>

              {/* SLIDE UPPER METADATA HEADER */}
              <div className="bg-slate-950/90 backdrop-blur-sm px-6 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-mono text-slate-400 z-10 relative">
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 font-extrabold tracking-wider bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">DECK {currentModule.id.toString().padStart(2, '0')}</span>
                  <span className="text-slate-650 font-bold">•</span>
                  <span className="text-slate-200 font-bold">SLIDE {currentSlideIndex + 1} de 6</span>
                  <span className="hidden sm:inline text-slate-600 font-bold">•</span>
                  <span className="hidden sm:inline font-bold text-slate-300">{currentModule.title}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  {/* Narrator Voice Console */}
                  <div className="flex items-center gap-2 bg-slate-900 border-2 border-amber-500/30 rounded-xl p-1.5 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
                    {/* Visual Soundwave Indicator when active */}
                    {isNarrating && (
                      <div className="flex items-end gap-0.5 h-4 px-1.5 animate-pulse" title="Narrador de voz ativo">
                        <motion.div className="w-0.5 bg-amber-500 rounded-full" animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, duration: 0.6 }} />
                        <motion.div className="w-0.5 bg-amber-500 rounded-full" animate={{ height: [10, 5, 10] }} transition={{ repeat: Infinity, duration: 0.7 }} />
                        <motion.div className="w-0.5 bg-amber-500 rounded-full" animate={{ height: [3, 12, 3] }} transition={{ repeat: Infinity, duration: 0.5 }} />
                      </div>
                    )}

                    <Tooltip content={autoPlay ? "Pausar o Apresentador de Voz e o avanço autônomo de slides" : "Iniciar leitura dinâmica em áudio masculino com avanço automático"} position="bottom">
                      <button
                        id="narration-control"
                        onClick={handleToggleNarration}
                        className={`px-4 py-2 sm:px-5 sm:py-2 rounded-xl text-xs sm:text-xs font-black font-mono transition-all flex items-center gap-2 uppercase tracking-wider ${
                          autoPlay 
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.6)] scale-105 border border-amber-400' 
                            : 'bg-amber-500/10 text-amber-400 hover:text-amber-300 border-2 border-amber-500/40 hover:border-amber-500/60 font-extrabold shadow-[0_0_10px_rgba(245,158,11,0.15)] hover:scale-105'
                        }`}
                        title={autoPlay ? "Pausar Apresentador de Voz (Narração + Avanço Autônomo)" : "Iniciar Apresentador de Voz (Narração + Avanço Autônomo)"}
                      >
                        {autoPlay ? (
                          <>
                            <Pause className="w-4 h-4 fill-current animate-bounce" /> Pausar Voz
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Iniciar Narração
                          </>
                        )}
                      </button>
                    </Tooltip>

                    <span className="w-px h-4.5 bg-slate-800" />

                    {/* Rate/Speed adjustment selector */}
                    <Tooltip content={`Velocidade de reprodução da voz. Velocidade ideal recomendada: 1.3x`} position="bottom">
                      <button
                        onClick={() => {
                          let nextRate = 1.1;
                          if (narratorRate === 1.1) nextRate = 1.3;
                          else if (narratorRate === 1.3) nextRate = 0.95;
                          else nextRate = 1.1;
                          
                          setNarratorRate(nextRate);
                          
                          // If currently playing, restart with new rate
                          if (isNarrating) {
                            const text = getStepNarrationText(currentModule, currentSlideIndex, revealedCount);
                            setTimeout(() => {
                              speakText(text);
                            }, 100);
                          }
                        }}
                        className="px-2.5 py-1.5 hover:bg-slate-800 rounded-lg text-[10px] sm:text-xs text-slate-400 hover:text-white font-mono font-bold border border-slate-800/80"
                        title="Alterar velocidade da voz"
                      >
                        Vel: {narratorRate === 0.95 ? "0.95x" : narratorRate === 1.1 ? "1.1x" : "1.3x"}
                      </button>
                    </Tooltip>
                  </div>

                  <span className="text-[10px] sm:text-xs bg-slate-950 border border-slate-800 text-amber-400 font-black uppercase tracking-widest px-3 py-1 rounded-md hidden lg:inline-block">
                    Chão de Fábrica Inteligente
                  </span>
                </div>
              </div>

              {/* SLIDE CONTENT INTERIOR VIEW WITH TRANSITION */}
              <div className="flex-1 flex flex-col relative z-10 justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeModuleId}-${currentSlideIndex}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="flex-1 flex flex-col justify-between p-3.5 sm:p-5 md:p-6"
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
                                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-wide leading-tight mt-1">
                                  {currentModule.title}
                                </h1>
                                <p className="text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed italic border-l-4 border-amber-500 pl-4 py-1.5 font-semibold text-left">
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
                                <h4 className="text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> COMO UTILIZAR ESTA APRESENTAÇÃO:
                                </h4>
                                <div className="flex flex-col gap-2.5 text-xs">
                                  <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-850">
                                    <span className="font-mono text-amber-500 font-extrabold block mb-0.5 text-xs sm:text-sm">1. Avançar</span>
                                    <p className="text-slate-200 leading-relaxed text-xs">Use o botão amarelo ou as setas do teclado <strong className="text-white">[→]</strong> para revelar tópicos.</p>
                                  </div>
                                  <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-850">
                                    <span className="font-mono text-amber-500 font-extrabold block mb-0.5 text-xs sm:text-sm">2. Navegar</span>
                                    <p className="text-slate-200 leading-relaxed text-xs">Use <strong className="text-white">Ver Módulos (22)</strong> no topo para saltar entre os 22 temas.</p>
                                  </div>
                                  <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-850">
                                    <span className="font-mono text-amber-500 font-extrabold block mb-0.5 text-xs sm:text-sm">3. Planta & Copiloto</span>
                                    <p className="text-slate-200 leading-relaxed text-xs">Visualize a planta fabril e tire dúvidas com o assistente inteligente.</p>
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
                              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center gap-2 font-mono tracking-wide">
                                <BookOpen className="w-5 h-5 text-amber-500" /> CONCEITOS FUNDAMENTAIS DE ENGENHARIA
                              </h3>
                              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed mt-1">
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
                                        <h4 className="font-black text-sm sm:text-base text-white flex items-center justify-between tracking-wide">
                                          <span>{concept.title}</span>
                                          <span className="text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono uppercase font-black">REVELADO</span>
                                        </h4>
                                        <motion.p 
                                          initial={{ opacity: 0, y: 3 }} 
                                          animate={{ opacity: 1, y: 0 }} 
                                          className="text-xs sm:text-sm md:text-base text-slate-200 mt-2 leading-relaxed font-semibold"
                                        >
                                          {concept.description}
                                        </motion.p>
                                      </>
                                    ) : (
                                      <div className="flex flex-col items-center justify-center text-center py-1 space-y-1">
                                        <Unlock className="w-4 h-4 text-amber-500/80 mb-0.5 animate-bounce" />
                                        <h4 className="font-bold text-xs sm:text-sm text-slate-300 tracking-wide uppercase">
                                          Tópico {idx + 1}: [Clique para Revelar]
                                        </h4>
                                        <p className="text-xs sm:text-sm text-amber-500/90 font-mono font-bold">
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
                              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center gap-2 font-mono tracking-wide">
                                <Layout className="w-5 h-5 text-amber-500" /> FLUXO OPERACIONAL SEQUENCIAL DE VALOR
                              </h3>
                              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed mt-1">
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
                                        <span className={`text-[10px] sm:text-xs font-mono font-extrabold tracking-widest block uppercase ${isRevealed ? 'text-amber-500' : 'text-slate-600'}`}>PASSO {idx + 1}</span>
                                        {isRevealed && <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />}
                                      </div>
                                      <h5 className={`text-xs sm:text-sm md:text-base font-black leading-tight ${isRevealed ? 'text-white' : 'text-slate-500 italic'}`}>{step.label}</h5>
                                    </div>
                                    <p className={`text-[11px] sm:text-xs md:text-sm mt-1.5 leading-normal font-semibold ${isRevealed ? 'text-slate-200' : 'text-slate-600'}`}>
                                      {step.description}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>

                            <div className="text-xs sm:text-sm md:text-base font-medium text-slate-100 bg-slate-950 p-3 sm:p-4 border border-slate-800 rounded-xl leading-relaxed shadow-inner">
                              <span className="text-xs font-mono text-amber-500 font-black block uppercase tracking-wider mb-0.5">💡 Representação Física no Galpão:</span>
                              {currentModule.illustratedExplanation}
                            </div>
                          </div>
                        );

                        // Slide 3: Case study (side by side comparison)
                        case 3: return (
                          <div className="space-y-3.5 my-auto h-full flex flex-col justify-between py-1">
                            <div>
                              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center gap-2 font-mono tracking-wide">
                                <Layers className="w-5 h-5 text-amber-500" /> CASO PRÁTICO vs MODELAGEM DIGITAL
                              </h3>
                              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed mt-1">
                                Compreenda como conectamos os fatos do chão de fábrica físico ao ecossistema Allin-SO.
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                              {/* Left Panel: Real Factory case */}
                              {revealedCount >= 1 ? (
                                <div className="p-4 rounded-xl border border-amber-500 bg-slate-950 shadow-lg transition-all">
                                  <h4 className="text-xs sm:text-sm md:text-base font-black font-mono text-amber-500 mb-2 tracking-widest flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> MUNDO REAL: CHÃO DE FÁBRICA FÍSICO (ALLIN)
                                  </h4>
                                  <p className="text-xs sm:text-sm md:text-base text-slate-100 leading-relaxed bg-slate-900/80 p-2.5 sm:p-3 rounded-lg border border-slate-800 font-semibold shadow-inner">
                                    {currentModule.practicalExample}
                                  </p>
                                </div>
                              ) : (
                                <div className="p-4 rounded-xl border border-dashed border-slate-800 bg-slate-900/10 flex flex-col items-center justify-center text-center py-6 sm:py-8">
                                  <Lock className="w-5 h-5 text-slate-600 mb-1.5" />
                                  <span className="text-slate-500 text-xs sm:text-sm font-black font-mono tracking-widest">
                                    🔒 AVANCE PARA REVELAR O CASO REAL
                                  </span>
                                </div>
                              )}

                              {/* Right Panel: Allin-SO System Application */}
                              {revealedCount >= 2 ? (
                                <div className="p-4 rounded-xl border border-emerald-500 bg-slate-950 shadow-lg transition-all">
                                  <h4 className="text-xs sm:text-sm md:text-base font-black font-mono text-emerald-400 mb-2 tracking-widest flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> MUNDO DIGITAL: ALLIN-SO
                                  </h4>
                                  <p className="text-xs sm:text-sm md:text-base text-slate-100 leading-relaxed bg-slate-900/80 p-2.5 sm:p-3 rounded-lg border border-slate-800 font-semibold shadow-inner">
                                    {currentModule.systemApplication}
                                  </p>
                                </div>
                              ) : (
                                <div 
                                  onClick={() => { if (revealedCount === 1) { setRevealedCount(2); playSound('reveal'); } }}
                                  className="p-4 rounded-xl border border-dashed border-slate-800 bg-slate-900/10 flex flex-col items-center justify-center text-center py-6 sm:py-8 cursor-pointer hover:bg-slate-900/30 hover:border-slate-700 transition-all group"
                                >
                                  <Unlock className="w-5 h-5 text-amber-500 mb-1.5 animate-bounce group-hover:scale-110" />
                                  <span className="text-amber-500 text-xs sm:text-sm font-black font-mono tracking-widest">
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
                              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center gap-2 font-mono tracking-wide">
                                <AlertCircle className="w-5 h-5 text-amber-500" /> EVITAR ERROS DE PROCESSO vs PRÁTICAS RECOMENDADAS
                              </h3>
                              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed mt-1">
                                Garanta a integridade operacional e evite retrabalho na implantação da equipe.
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                              {/* Left column: Common Errors */}
                              {revealedCount >= 1 ? (
                                <div className="p-4 rounded-xl border border-red-500 bg-slate-950 shadow-lg transition-all">
                                  <h4 className="text-xs sm:text-sm md:text-base font-black font-mono text-red-400 mb-2 tracking-widest flex items-center gap-1.5">
                                    ❌ EVITE ESTES ERROS DE CONFIGURAÇÃO
                                  </h4>
                                  <ul className="space-y-2">
                                    {currentModule.commonErrors.map((err, i) => (
                                      <li key={i} className="text-xs sm:text-sm md:text-base text-slate-100 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 leading-relaxed font-semibold shadow-inner">
                                        {err}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : (
                                <div className="p-4 rounded-xl border border-dashed border-slate-800 bg-slate-900/10 flex flex-col items-center justify-center text-center py-6 sm:py-8">
                                  <Lock className="w-5 h-5 text-slate-600 mb-1.5" />
                                  <span className="text-slate-500 text-xs sm:text-sm font-black font-mono tracking-widest">
                                    🔒 AVANCE PARA REVELAR OS ERROS OPERACIONAIS
                                  </span>
                                </div>
                              )}

                              {/* Right column: Summary learnings */}
                              {revealedCount >= 2 ? (
                                <div className="p-4 rounded-xl border border-emerald-500 bg-slate-950 shadow-lg transition-all">
                                  <h4 className="text-xs sm:text-sm md:text-base font-black font-mono text-emerald-400 mb-2 tracking-widest flex items-center gap-1.5">
                                    ✓ DIRETRIZES DE SUCESSO DO OPERADOR
                                  </h4>
                                  <ul className="space-y-2">
                                    {currentModule.summary.map((sum, i) => (
                                      <li key={i} className="text-xs sm:text-sm md:text-base text-slate-100 bg-slate-900/90 p-2.5 rounded-lg border border-slate-850 leading-relaxed font-semibold shadow-inner">
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
                                  <span className="text-amber-500 text-xs sm:text-sm font-black font-mono tracking-widest">
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

                        // Slide 5: Quiz Interativo
                        case 5: return (
                          <ModuleQuiz
                            currentModule={currentModule}
                            onQuizCompleted={(scorePercentage) => {
                              setProgress(prev => {
                                const newScores = {
                                  ...prev.quizScores,
                                  [activeModuleId]: scorePercentage
                                };
                                const updatedProgress = {
                                  ...prev,
                                  quizScores: newScores
                                };
                                localStorage.setItem('industrial_os_training_progress', JSON.stringify(updatedProgress));
                                return updatedProgress;
                              });
                            }}
                            savedScore={progress.quizScores[activeModuleId]}
                            playSound={playSound}
                          />
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
                  {(() => {
                    const isQuizCompleted = progress.quizScores[activeModuleId] !== undefined;
                    const isNextDisabled = currentSlideIndex === 5 && !isQuizCompleted;
                    return (
                      <button 
                        onClick={handleNextAction}
                        disabled={isNextDisabled}
                        title={isNextDisabled ? "Você precisa concluir o quiz para poder avançar para o próximo módulo!" : "Avançar"}
                        className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-mono font-black flex items-center gap-1.5 shrink-0 transition-all active:scale-95 shadow-md ${
                          isNextDisabled
                            ? 'bg-slate-850 text-slate-500 border border-slate-800 cursor-not-allowed opacity-50'
                            : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                        }`}
                      >
                        {currentSlideIndex === 5 
                          ? (activeModuleId === 22 ? 'Concluir Apresentação' : 'Próximo Módulo') 
                          : currentSlideIndex === 4 
                            ? 'Ir para o Quiz' 
                            : 'Avançar'} 
                        {revealedCount < getMaxRevealsForSlide(currentSlideIndex) && currentSlideIndex < 5 ? (
                          <Sparkles className={`w-4 h-4 ${isNextDisabled ? 'text-slate-500' : 'text-slate-950'}`} />
                        ) : (
                          <ChevronRight className={`w-4 h-4 ${isNextDisabled ? 'text-slate-500' : 'text-slate-950'}`} />
                        )}
                      </button>
                    );
                  })()}
                </div>

                {/* Slideshow indicator index dots */}
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 6 }).map((_, idx) => {
                    const isPassed = idx < currentSlideIndex;
                    const isActive = idx === currentSlideIndex;
                    return (
                      <button
                        key={idx}
                        onClick={() => { setCurrentSlideIndex(idx); setRevealedCount(1); playSound('slide'); }}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          isActive 
                            ? 'bg-amber-500 scale-125 shadow-[0_0_8px_rgba(245,158,11,0.5)]' 
                            : isPassed 
                              ? 'bg-amber-500/40' 
                              : 'bg-slate-800 hover:bg-slate-700'
                        }`}
                        title={idx === 5 ? "Quiz de Consolidação" : `Slide ${idx + 1}`}
                      />
                    );
                  })}
                </div>

                {/* Autoplay / Quick controls toggle */}
                <div className="flex items-center gap-3">

                  <Tooltip content={autoPlay ? "Pausar Apresentador de Voz" : "Iniciar leitura de slides com avanço automático"} position="top">
                    <button
                      onClick={() => setAutoPlay(!autoPlay)}
                      className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono font-bold transition-all flex items-center gap-1.5 uppercase tracking-wider ${
                        autoPlay 
                          ? 'bg-amber-500/10 border-amber-500 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.1)]' 
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                      title={autoPlay ? "Pausar Apresentador de Voz" : "Iniciar Apresentador de Voz"}
                    >
                      {autoPlay ? <Pause className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> : <Play className="w-3.5 h-3.5 text-slate-500 fill-slate-500" />} 
                      <span>{autoPlay ? "Apresentador Ativo" : "Iniciar Apresentador"}</span>
                    </button>
                  </Tooltip>
                  <span className="text-[10px] text-slate-600 font-mono hidden lg:inline">
                    Atalhos: [← / →] Mudar Slide • [Espaço] Avançar Tópicos
                  </span>
                </div>

              </div>

            </div>
          </div>
          </>
          )}

        </main>

        {/* Mobile Backdrop Overlay for Drawer */}
        {drawerOpen && (
          <div 
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 md:hidden"
          />
        )}

        {/* COMPANION TOOLS DRAWER COLLAPSIBLE (Right) */}
        <aside id="drawer" className={`bg-slate-900 border-l border-slate-800 transition-all duration-300 flex flex-col z-40 md:z-20 ${drawerOpen ? 'absolute md:relative inset-y-0 right-0 w-full sm:w-80 md:w-80 h-full p-4 shadow-2xl md:shadow-none bg-slate-900' : 'w-0 overflow-hidden'}`}>
          {drawerOpen && (
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
              
              {/* Drawer Mobile Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 md:hidden">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">🔧 PLANTA & COPILOTO</span>
                <button 
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
                  title="Fechar Painel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

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
        <p>© 2026 Allin Technologies S/A. Todos os direitos reservados.</p>
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
              
              {/* Official Brand Logo */}
              <div className="flex justify-center mb-3 select-none pointer-events-none">
                <AllInLogo size={120} className="drop-shadow-[0_0_10px_rgba(245,158,11,0.12)]" />
              </div>

              <span className="text-[9px] font-mono tracking-widest text-amber-500 font-bold block mb-3">ALLIN-SO PLATFORM</span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-serif tracking-tight mb-6">Certificado de Conclusão</h1>
              
              <p className="text-xs text-slate-500 italic mb-3">Certificamos para os devidos fins de engenharia e gestão fabril que</p>
              <p className="text-xl sm:text-3xl font-extrabold font-mono text-amber-500 border-b border-slate-800 pb-2 max-w-md mx-auto mb-5">
                {progress.userName.toUpperCase()}
              </p>
              
              <p className="text-[11px] text-slate-300 max-w-xl mx-auto leading-relaxed mb-8">
                concluiu com aproveitamento de 100% o programa de slides interativos e simulações em <strong className="text-white">Fundamentos do Chão de Fábrica para o Allin-SO (Allin)</strong>, abrangendo todas as 22 disciplinas curriculares incluindo estrutura física, balanceamento de capacidade, estruturas de materiais (BOM), roteiros de operação, emissão de ordens, PCP, apontamento de produção, cálculo de perdas de retalho, OEE e suporte do Copilot de IA.
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

      {/* VOICE COMMANDS HELP MODAL */}
      <AnimatePresence>
        {showVoiceHelpModal && (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowVoiceHelpModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-800">
                <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                  <Mic className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">Comandos de Voz da Apresentação</h3>
                  <p className="text-[11px] text-slate-400">Controle a apresentação por voz sem precisar de teclado ou mouse.</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="text-[11px] font-bold text-amber-500 font-mono uppercase tracking-wider mb-2">1. Navegação de Slides</h4>
                  <div className="grid grid-cols-2 gap-2 bg-slate-950/50 p-2.5 rounded-lg border border-slate-850">
                    <div>
                      <span className="text-slate-400 font-medium block">Ir para frente</span>
                      <span className="text-white font-mono text-[10px] bg-slate-800 px-1 py-0.5 rounded">"Avançar" • "Próximo"</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Ir para trás</span>
                      <span className="text-white font-mono text-[10px] bg-slate-800 px-1 py-0.5 rounded">"Anterior" • "Voltar"</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold text-indigo-400 font-mono uppercase tracking-wider mb-2">2. Seleção de Módulos (22 Capítulos)</h4>
                  <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-850 space-y-2">
                    <div>
                      <span className="text-slate-400 font-medium block">Por número do módulo (1 a 22):</span>
                      <span className="text-white font-mono text-[10px] bg-slate-800 px-1 py-0.5 rounded">"Ir para módulo cinco" • "Tema dez"</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Por nome ou palavra-chave do capítulo:</span>
                      <span className="text-white font-mono text-[10px] bg-slate-800 px-1 py-0.5 rounded block mt-1">"Conhecendo a Fábrica" • "Mapeamento de Processo" • "OEE"</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold text-emerald-400 font-mono uppercase tracking-wider mb-2">3. Controle de Narração de Voz</h4>
                  <div className="grid grid-cols-2 gap-2 bg-slate-950/50 p-2.5 rounded-lg border border-slate-850">
                    <div>
                      <span className="text-slate-400 font-medium block">Iniciar Leitura</span>
                      <span className="text-white font-mono text-[10px] bg-slate-800 px-1 py-0.5 rounded">"Iniciar voz" • "Tocar voz"</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Pausar Leitura</span>
                      <span className="text-white font-mono text-[10px] bg-slate-800 px-1 py-0.5 rounded">"Pausar voz" • "Parar voz"</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold text-rose-400 font-mono uppercase tracking-wider mb-2">4. Busca Geral por Voz</h4>
                  <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-850">
                    <span className="text-slate-400 font-medium block">Qualquer outro termo falado aplicará filtro de busca:</span>
                    <span className="text-white font-mono text-[10px] bg-slate-800 px-1 py-0.5 rounded mt-1 block">"Pesquisar espuma" • "Buscar costura" • "Cálculo de retalho"</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-850 flex justify-end">
                <button
                  onClick={() => setShowVoiceHelpModal(false)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs font-mono transition-all"
                >
                  Entendi
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING SUCCESS TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 border border-emerald-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md flex items-start gap-3.5"
          >
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl mt-0.5 shrink-0">
              <CheckCircle2 className="w-5 h-5 animate-bounce" />
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="text-sm font-bold text-white font-mono flex items-center gap-1.5 uppercase tracking-wide">
                {toast.message} <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              </h4>
              <p className="text-[11px] text-slate-300 leading-normal font-medium">
                {toast.subMessage}
              </p>
              <div className="text-[9px] text-emerald-400 font-mono flex items-center gap-1 font-bold pt-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                CONEXÃO SEGURA • PROGRESSO SALVO COM SUCESSO
              </div>
            </div>
            <button 
              onClick={() => setToast(null)}
              className="text-slate-500 hover:text-white transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GUIDED WELCOME TOUR */}
      <InteractiveTour
        isOpen={showTour}
        onClose={() => setShowTour(false)}
        setSidebarOpen={setSidebarOpen}
        setDrawerOpen={setDrawerOpen}
        setShowStartPage={setShowStartPage}
        onSelectModule={handleSelectModule}
      />

      {/* CUSTOM RESET PROGRESS CONFIRMATION MODAL */}
      <AnimatePresence>
        {showResetModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-md bg-slate-900 border-2 border-red-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 text-center"
            >
              <button
                onClick={() => setShowResetModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                title="Fechar"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mx-auto w-12 h-12 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4">
                <RotateCcw className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
              </div>

              <h3 className="text-base font-bold text-white mb-2 uppercase font-mono tracking-wider">
                Redefinir Progresso?
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Tem certeza de que deseja redefinir os módulos estratégicos Allin-SO apresentados? Todo o seu progresso acumulado de estudo nesta máquina será apagado.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 text-xs font-bold transition-all active:scale-95"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmResetProgress}
                  className="px-5 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white text-xs font-black uppercase rounded-xl transition-all shadow-lg active:scale-95 hover:scale-[1.02]"
                >
                  Sim, Redefinir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
