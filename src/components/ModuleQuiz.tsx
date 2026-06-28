import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  Lightbulb,
  Sparkles,
  Star
} from 'lucide-react';
import { ModuleData } from '../types';

interface ModuleQuizProps {
  currentModule: ModuleData;
  onQuizCompleted: (scorePercentage: number) => void;
  savedScore?: number;
  playSound?: (type: 'reveal' | 'slide' | 'success' | 'error') => void;
}

interface Particle {
  id: number;
  angle: number;
  color: string;
  size: number;
  delay: number;
  isStar: boolean;
}

export const ModuleQuiz: React.FC<ModuleQuizProps> = ({
  currentModule,
  onQuizCompleted,
  savedScore,
  playSound
}) => {
  const { quiz } = currentModule;
  const questions = quiz.questions;

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(savedScore !== undefined);
  const [tempAnswers, setTempAnswers] = useState<Record<number, { selected: number; correct: boolean }>>({});
  const [particles, setParticles] = useState<Particle[]>([]);

  // Reset quiz state to retake
  const handleRestartQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOptionIdx(null);
    setIsSubmitted(false);
    setCorrectAnswersCount(0);
    setQuizFinished(false);
    setTempAnswers({});
    setParticles([]);
    if (playSound) playSound('slide');
  };

  const currentQuestion = questions[currentQuestionIdx];

  const handleOptionSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOptionIdx(idx);
    if (playSound) playSound('reveal');
  };

  const handleSubmitAnswer = () => {
    if (selectedOptionIdx === null || isSubmitted) return;
    
    const isCorrect = selectedOptionIdx === currentQuestion.correctAnswerIndex;
    setIsSubmitted(true);
    
    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
      if (playSound) playSound('success');

      // Generate a satisfying burst of floating stars/confetti
      const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6', '#f43f5e'];
      const newParticles: Particle[] = Array.from({ length: 30 }).map((_, i) => ({
        id: Date.now() + i,
        angle: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 12 + 8,
        delay: Math.random() * 0.12,
        isStar: Math.random() > 0.4,
      }));
      setParticles(newParticles);
    } else {
      if (playSound) playSound('error');
    }

    setTempAnswers(prev => ({
      ...prev,
      [currentQuestionIdx]: { selected: selectedOptionIdx, correct: isCorrect }
    }));
  };

  const handleNextQuestion = () => {
    setParticles([]);
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOptionIdx(null);
      setIsSubmitted(false);
      if (playSound) playSound('slide');
    } else {
      // Finished the quiz
      const finalScore = Math.round((correctAnswersCount / questions.length) * 100);
      setQuizFinished(true);
      onQuizCompleted(finalScore);
      if (playSound) playSound('success');
    }
  };

  // If quiz is already finished (loaded from saved progress)
  if (quizFinished) {
    const finalScore = savedScore !== undefined ? savedScore : Math.round((correctAnswersCount / questions.length) * 100);
    const isGabaritado = finalScore === 100;
    const isAprovado = finalScore >= 70;

    return (
      <div className="flex flex-col items-center justify-center text-center py-6 px-4 max-w-xl mx-auto h-full">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="bg-slate-950 p-6 sm:p-8 rounded-2xl border-2 border-amber-500/30 w-full shadow-2xl space-y-5"
        >
          <div className="mx-auto w-16 h-16 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-full flex items-center justify-center mb-2">
            <Award className="w-8 h-8 animate-bounce" style={{ animationDuration: '3s' }} />
          </div>

          <div>
            <span className="text-[10px] font-mono font-black text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full uppercase tracking-widest">
              Quiz Concluído com Sucesso
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-2 font-mono">
              {currentModule.title}
            </h3>
          </div>

          <div className="py-4 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Sua Pontuação</span>
            <span className={`text-4xl sm:text-5xl font-black font-mono ${isGabaritado ? 'text-emerald-400' : isAprovado ? 'text-amber-400' : 'text-slate-300'}`}>
              {finalScore}%
            </span>
            <span className="text-xs text-slate-400 block mt-1">
              {isGabaritado ? "Gabarito perfeito! Domínio operacional total." : isAprovado ? "Ótimo desempenho! Você está qualificado neste módulo." : "Concluído! Sinta-se à vontade para refazer e melhorar sua pontuação."}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={handleRestartQuiz}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <RotateCcw className="w-4 h-4 text-amber-500" /> Refazer Quiz
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full justify-between py-1 max-w-3xl mx-auto w-full relative overflow-visible">
      {/* Visual feedback animations (floating stars & confetti) */}
      <div className="absolute inset-0 pointer-events-none overflow-visible z-50">
        <AnimatePresence>
          {particles.map((p) => {
            const distance = Math.random() * 150 + 70; // fly distance
            const targetX = Math.cos(p.angle) * distance;
            const targetY = Math.sin(p.angle) * distance - 30; // light gravity rise bias
            return (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
                animate={{
                  x: targetX,
                  y: targetY,
                  scale: [0, 1.3, 0.9, 0],
                  opacity: [0, 1, 1, 0],
                  rotate: Math.random() * 360 + 180,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.0 + Math.random() * 0.5,
                  ease: "easeOut",
                  delay: p.delay,
                }}
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  width: p.size,
                  height: p.size,
                  marginTop: -p.size / 2,
                  marginLeft: -p.size / 2,
                }}
              >
                {p.isStar ? (
                  <Star 
                    className="w-full h-full drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse" 
                    style={{ color: p.color, fill: p.color }} 
                  />
                ) : (
                  <Sparkles 
                    className="w-full h-full drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]" 
                    style={{ color: p.color }} 
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Quiz Header Info */}
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-3 mb-2">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-500 animate-pulse" />
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white font-mono uppercase tracking-wide">
              Desafio de Consolidação
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-400">
              Responda às perguntas para avaliar sua absorção técnica.
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono text-amber-500 font-bold uppercase block tracking-wider">
            Questão {currentQuestionIdx + 1} de {questions.length}
          </span>
          <div className="w-24 sm:w-32 bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1 border border-slate-850">
            <div 
              className="bg-amber-500 h-full transition-all duration-300" 
              style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="flex-1 flex flex-col justify-center space-y-4 py-2">
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-850 shadow-inner">
          <p className="text-sm sm:text-base text-slate-100 font-semibold leading-relaxed">
            {currentQuestion.text}
          </p>
        </div>

        {/* Options List */}
        <div className="space-y-2.5">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOptionIdx === idx;
            const isCorrectAnswer = idx === currentQuestion.correctAnswerIndex;
            
            let btnStyle = "bg-slate-900/40 border-slate-800 text-slate-300 hover:bg-slate-900/80 hover:border-slate-700";
            let indicator = null;

            if (isSubmitted) {
              if (isCorrectAnswer) {
                // Correct answer always highlighted green
                btnStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold scale-[1.01]";
                indicator = <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
              } else if (isSelected) {
                // Selected incorrect answer highlighted red
                btnStyle = "bg-red-500/10 border-red-500 text-red-400 font-bold scale-[1.01]";
                indicator = <XCircle className="w-4 h-4 text-red-500 shrink-0" />;
              } else {
                // Non-selected options faded
                btnStyle = "bg-slate-950/20 border-slate-900 text-slate-500 opacity-60";
              }
            } else if (isSelected) {
              // Pre-submission select glow
              btnStyle = "bg-amber-500/10 border-amber-500 text-white font-bold ring-1 ring-amber-500/40 scale-[1.01]";
            }

            return (
              <button
                key={idx}
                disabled={isSubmitted}
                onClick={() => handleOptionSelect(idx)}
                className={`w-full p-3 sm:p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-3 active:scale-[0.99] ${btnStyle}`}
              >
                <span className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-[10px] sm:text-xs font-bold shrink-0 ${
                  isSelected 
                    ? 'bg-amber-500 text-slate-950' 
                    : isSubmitted && isCorrectAnswer 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-slate-950 text-slate-500 border border-slate-800'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 leading-normal">{option}</span>
                {indicator}
              </button>
            );
          })}
        </div>

        {/* Feedback Section (appears after submitting) */}
        <AnimatePresence mode="wait">
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm leading-relaxed flex items-start gap-3 shadow-md ${
                selectedOptionIdx === currentQuestion.correctAnswerIndex
                  ? 'bg-emerald-950/25 border-emerald-500/30 text-emerald-300'
                  : 'bg-red-950/15 border-red-500/20 text-red-200'
              }`}
            >
              <Lightbulb className={`w-5 h-5 shrink-0 ${selectedOptionIdx === currentQuestion.correctAnswerIndex ? 'text-emerald-400 animate-pulse' : 'text-red-400'}`} />
              <div>
                <strong className="block font-bold mb-0.5 uppercase tracking-wide font-mono text-[10px] sm:text-xs">
                  {selectedOptionIdx === currentQuestion.correctAnswerIndex ? "✓ Resposta Correta!" : "✗ Resposta Incorreta"}
                </strong>
                <p className="font-medium text-slate-200">{currentQuestion.explanation}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Controls Footer */}
      <div className="border-t border-slate-800/60 pt-3 mt-2 flex justify-between items-center">
        <span className="text-[10px] sm:text-xs font-mono text-slate-500">
          * Aprovado com mínimo de 70% de acertos
        </span>

        {!isSubmitted ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedOptionIdx === null}
            className="px-5 py-2.5 bg-amber-500 disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed hover:bg-amber-400 text-slate-950 text-xs font-black uppercase font-mono rounded-xl transition-all shadow-md flex items-center gap-1 hover:scale-[1.02] active:scale-95"
          >
            Confirmar Resposta <Sparkles className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black uppercase font-mono rounded-xl transition-all shadow-lg flex items-center gap-1.5 hover:scale-[1.02] active:scale-95"
          >
            {currentQuestionIdx < questions.length - 1 ? (
              <>Próxima Questão <ArrowRight className="w-3.5 h-3.5" /></>
            ) : (
              <>Concluir Quiz <CheckCircle2 className="w-3.5 h-3.5" /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
