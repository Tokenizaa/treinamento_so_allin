import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Sparkles, 
  Info, 
  HelpCircle,
  Volume2,
  BookOpen
} from 'lucide-react';

interface TourStep {
  title: string;
  description: string;
  targetSelector: string | null;
  actionBefore?: () => void;
  icon: React.ReactNode;
}

interface InteractiveTourProps {
  isOpen: boolean;
  onClose: () => void;
  setSidebarOpen: (open: boolean) => void;
  setDrawerOpen: (open: boolean) => void;
  setShowStartPage: (show: boolean) => void;
  onSelectModule: (moduleId: number) => void;
}

export const InteractiveTour: React.FC<InteractiveTourProps> = ({
  isOpen,
  onClose,
  setSidebarOpen,
  setDrawerOpen,
  setShowStartPage,
  onSelectModule,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [rect, setRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const highlightTimerRef = useRef<number | null>(null);

  const steps: TourStep[] = [
    {
      title: "Boas-vindas ao Industrial OS! 🚀",
      description: "Bem-vindo ao centro de treinamento estratégico da Allin-SO! Desenvolvemos esta plataforma integrada para capacitar você em Engenharia de Produção aplicada à nossa fábrica de colchões. Vamos fazer um tour interativo de 1 minuto para conhecer as ferramentas?",
      targetSelector: null,
      icon: <Compass className="w-6 h-6 text-amber-500 animate-spin" />,
    },
    {
      title: "Cronograma de Slide Decks 📋",
      description: "Aqui fica a barra lateral contendo os 22 módulos de treinamento estratégico. Eles cobrem desde o fluxo de espumas e PCP até o acabamento e a expedição de colchões. Você pode pesquisar termos técnicos e ver o seu percentual de progresso em tempo real.",
      targetSelector: "#sidebar",
      actionBefore: () => {
        setShowStartPage(false);
        onSelectModule(1); // Select Module 1 to make slides visible
        setSidebarOpen(true);
        setDrawerOpen(false);
      },
      icon: <BookOpen className="w-6 h-6 text-amber-400" />,
    },
    {
      title: "Painel de Apoio e Planta Interativa 🔧",
      description: "Este painel lateral é o seu centro de apoio operacional! Ele contém o mapa dinâmico em tempo real do chão de fábrica Allin-SO (mostrando costura, montagem de molas, estoque) e o Copiloto IA pronto para responder qualquer dúvida sobre engenharia industrial.",
      targetSelector: "#drawer",
      actionBefore: () => {
        setShowStartPage(false);
        setSidebarOpen(false);
        setDrawerOpen(true);
      },
      icon: <Sparkles className="w-6 h-6 text-emerald-400" />,
    },
    {
      title: "Apresentador de Voz Otimizado 🎙️",
      description: "Este controle inicia a narração explicativa em áudio de cada slide. Ajustamos a velocidade padrão em 1.3x e configuramos uma voz masculina ideal para garantir foco, produtividade e máxima absorção do conteúdo. O texto lido está sempre na própria apresentação!",
      targetSelector: "#narration-control",
      actionBefore: () => {
        setShowStartPage(false);
        setSidebarOpen(false);
        setDrawerOpen(false);
      },
      icon: <Volume2 className="w-6 h-6 text-amber-500" />,
    },
    {
      title: "Tudo Pronto para o Sucesso! 🏆",
      description: "Agora você conhece os três pilares do Industrial OS! Navegue pelos módulos, ative o áudio explicativo em 1.3x e interaja com o mapa da fábrica para consolidar seus conhecimentos. Bom aprendizado!",
      targetSelector: null,
      actionBefore: () => {
        setShowStartPage(true);
        setSidebarOpen(false);
        setDrawerOpen(false);
      },
      icon: <Info className="w-6 h-6 text-emerald-500" />,
    }
  ];

  // Execute actions before step is rendered
  useEffect(() => {
    if (!isOpen) return;
    const step = steps[currentStep];
    if (step && step.actionBefore) {
      step.actionBefore();
    }
  }, [currentStep, isOpen]);

  // Recalculate target element position
  const updateHighlightRect = () => {
    if (!isOpen) return;
    const step = steps[currentStep];
    if (!step || !step.targetSelector) {
      setRect(null);
      return;
    }

    const element = document.querySelector(step.targetSelector);
    if (element) {
      const bounds = element.getBoundingClientRect();
      setRect({
        x: bounds.left,
        y: bounds.top,
        width: bounds.width,
        height: bounds.height,
      });
    } else {
      setRect(null);
    }
  };

  // Keep rect updated on resize, scroll or steps
  useEffect(() => {
    updateHighlightRect();
    
    // Periodically poll coordinates for dynamic transitions (like drawer opening transitions)
    const interval = setInterval(updateHighlightRect, 100);

    window.addEventListener('resize', updateHighlightRect);
    window.addEventListener('scroll', updateHighlightRect);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateHighlightRect);
      window.removeEventListener('scroll', updateHighlightRect);
    };
  }, [currentStep, isOpen]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      localStorage.setItem('allin_so_tour_completed', 'true');
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('allin_so_tour_completed', 'true');
    onClose();
  };

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
      {/* SVG Spotlight Mask */}
      <AnimatePresence>
        {rect && (
          <svg className="fixed inset-0 z-40 pointer-events-none w-full h-full transition-all duration-300">
            <defs>
              <mask id="spotlight-mask">
                <rect width="100%" height="100%" fill="white" />
                <rect 
                  x={rect.x - 6} 
                  y={rect.y - 6} 
                  width={rect.width + 12} 
                  height={rect.height + 12} 
                  rx="12" 
                  fill="black" 
                />
              </mask>
            </defs>
            <rect 
              width="100%" 
              height="100%" 
              fill="rgba(2, 6, 23, 0.78)" 
              mask="url(#spotlight-mask)" 
              className="pointer-events-auto"
            />
          </svg>
        )}
      </AnimatePresence>

      {/* Default Overlay when no element highlighted */}
      {!rect && (
        <div 
          onClick={handleSkip}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40"
        />
      )}

      {/* Tour Dialogue Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative z-50 w-full max-w-md mx-4 bg-slate-900 border-2 border-amber-500/40 rounded-2xl p-6 shadow-2xl overflow-hidden"
        style={{
          // If spotlight is on, place dialog near but not overlapping (or let it float beautifully centered if preferred)
          boxShadow: "0 25px 50px -12px rgba(245, 158, 11, 0.15)"
        }}
      >
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <button 
          onClick={handleSkip}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
          title="Pular Tour"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step Content */}
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 mb-4 shadow-inner">
            {currentStepData.icon}
          </div>

          <span className="text-[10px] font-mono font-black text-amber-500 tracking-widest uppercase mb-1">
            PASSO {currentStep + 1} DE {steps.length}
          </span>

          <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
            {currentStepData.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
            {currentStepData.description}
          </p>

          {/* Progress Dot Indicators */}
          <div className="flex gap-1.5 mb-6">
            {steps.map((_, idx) => (
              <span 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentStep ? 'w-6 bg-amber-500' : 'w-1.5 bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="w-full flex items-center justify-between gap-3">
            <button
              onClick={handleSkip}
              className="text-xs font-semibold text-slate-500 hover:text-slate-300 px-3 py-2 transition-colors"
            >
              Pular Tour
            </button>

            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handlePrev}
                  className="px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 text-xs font-bold transition-all flex items-center gap-1 active:scale-95"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Voltar
                </button>
              )}

              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black uppercase rounded-xl transition-all flex items-center gap-1.5 shadow-lg active:scale-95 hover:scale-[1.02]"
              >
                {currentStep === steps.length - 1 ? "Concluir" : "Avançar"}{" "}
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
