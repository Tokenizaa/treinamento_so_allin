import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Sparkles, HelpCircle } from 'lucide-react';
import { ModuleData } from '../types';

interface CopilotChatProps {
  currentModule: ModuleData;
  activeSlideIndex: number;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export default function CopilotChat({ currentModule, activeSlideIndex }: CopilotChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: "msg_init_1",
        sender: "assistant",
        text: "Olá! Sou o Copilot da plataforma Allin-SO. Estou monitorando seus slides de treinamento em tempo real.\n\nComo posso te ajudar com o conteúdo deste módulo hoje?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Contextual initial message when current module changes
  useEffect(() => {
    const welcomeMsg: ChatMessage = {
      id: `welcome_${currentModule.id}_${Date.now()}`,
      sender: 'assistant',
      text: `Entrando no Módulo ${currentModule.id}: *${currentModule.title}*.\n\nEstou pronto para detalhar fichas técnicas, OEE, balanceamento de capacidades ou dar dicas para resolver o Desafio Prático deste módulo. O que quer explorar?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, welcomeMsg]);
  }, [currentModule.id]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // Simulated context-aware response generator
    setTimeout(() => {
      const query = input.toLowerCase();
      let responseText = `Como especialista do Allin-SO, analisei seu questionamento. No Módulo ${currentModule.id} (${currentModule.title}), nós modelamos exatamente esses conceitos físicos na base de dados para otimizar o fluxo de valor do colchão na Allin.`;

      if (query.includes('colchão') || query.includes('colchao') || query.includes('espuma')) {
        responseText = `Na fabricação de colchões, a espuma (seja D33, Viscoelástica ou Soft) é o material mais crítico. O Copilot monitora a perda por retalho nas serras de corte horizontal e vertical. O segredo de engenharia está em otimizar o empilhamento das placas para maximizar o rendimento da área útil de espuma.`;
      } else if (query.includes('oee') || query.includes('kpi') || query.includes('indicador')) {
        responseText = `O OEE (Overall Equipment Effectiveness) é a métrica mestra de produtividade. Ele multiplica: Disponibilidade × Performance × Qualidade. Se o seu OEE no Tape Edge estiver abaixo de 85%, geralmente a causa raiz são pequenas paradas por travamento de bobina de fita ou falta de linha de costura.`;
      } else if (query.includes('bom') || query.includes('engenharia') || query.includes('ficha técnica') || query.includes('estrutura')) {
        responseText = `A BOM (Bill of Materials) ou estrutura de produto mapeia todos os insumos. Para um colchão tradicional, o nível 0 é o produto acabado; o nível 1 engloba o bloco colado, o tampo quiltado e a faixa lateral bordada; o nível 2 desce até químicos de poliuretano, tecido de malha em rolo e fardos de molas pocket.`;
      } else if (query.includes('gargalo') || query.includes('layout') || query.includes('balanceamento')) {
        responseText = `O gargalo dita o ritmo de toda a fábrica. Na colchoaria tradicional, o posto de fechamento (Tape Edge) costuma ser o gargalo devido à alta habilidade exigida do operador. No Allin-SO, nós calculamos os tempos de ciclo e distribuímos WIP (estoque em processo) taticamente antes desse posto para evitar que ele pare.`;
      } else if (query.includes('exercício') || query.includes('desafio') || query.includes('dica') || query.includes('ajuda')) {
        responseText = `Para superar o Desafio Prático do Módulo ${currentModule.id} ("${currentModule.exercise.title}"): leia atentamente as instruções da especificação no slide e lembre-se que no Allin-SO a modelagem física do estoque e o tempo de processo devem coincidir com o fluxo produtivo real sem gerar gargalos artificiais!`;
      } else if (query.includes('certificado')) {
        responseText = `O seu certificado de Capacitação de Ouro do Allin-SO é desbloqueado assim que concluir todos os 22 módulos do curso. Você pode exportar o arquivo e imprimi-lo diretamente aqui no slide final de encerramento!`;
      } else if (query.includes('slides') || query.includes('slide') || query.includes('navegar')) {
        responseText = `Você está lendo o Slide ${activeSlideIndex + 1} deste módulo. Você pode usar os botões [Anterior] e [Próximo] ou as setas direcionais [←] [→] do teclado para passar as páginas. Pressione a tecla [Espaço] para revelar novos tópicos explicativos no slide!`;
      }

      const assistantMsg: ChatMessage = {
        id: `msg_copi_${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    }, 850);
  };

  const handleSuggestionClick = (text: string) => {
    setInput(text);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* HEADER */}
      <div className="bg-slate-950 border-b border-slate-850 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-500 rounded-lg">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Copilot de Engenharia</h4>
            <p className="text-[10px] text-slate-500 font-mono">Status: Ativo em Tempo Real</p>
          </div>
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      {/* CHAT LOG */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 max-h-[300px]">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col max-w-[85%] rounded-xl p-3 ${
              msg.sender === 'user' 
                ? 'bg-amber-500 text-slate-950 font-medium self-end rounded-tr-none ml-auto shadow-md' 
                : 'bg-slate-950 text-slate-300 border border-slate-850 self-start rounded-tl-none mr-auto shadow-sm'
            }`}
          >
            <p className="text-xs leading-relaxed whitespace-pre-line">{msg.text}</p>
            <span className={`text-[8px] mt-1 font-mono block text-right ${
              msg.sender === 'user' ? 'text-slate-950/60' : 'text-slate-500'
            }`}>
              {msg.timestamp}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* QUICK SUGGESTIONS */}
      <div className="px-4 py-1.5 bg-slate-950/40 border-t border-slate-850 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button 
          onClick={() => handleSuggestionClick("Me dá uma dica do exercício?")}
          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[9px] text-slate-400 hover:text-white px-2 py-1 rounded-md font-mono"
        >
          💡 Dica do Exercício
        </button>
        <button 
          onClick={() => handleSuggestionClick(`Explique o Módulo ${currentModule.id}`)}
          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[9px] text-slate-400 hover:text-white px-2 py-1 rounded-md font-mono"
        >
          📘 Explicar Teoria
        </button>
        <button 
          onClick={() => handleSuggestionClick("Como calculo o OEE?")}
          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[9px] text-slate-400 hover:text-white px-2 py-1 rounded-md font-mono"
        >
          🔢 Calcular OEE
        </button>
      </div>

      {/* CHAT INPUT */}
      <div className="p-3 bg-slate-950 border-t border-slate-850 flex gap-2">
        <input 
          type="text" 
          placeholder="Perguntar sobre OEE, BOM, custos..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 bg-slate-900 border border-slate-800 text-xs rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
        />
        <button 
          onClick={handleSendMessage}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 p-2 rounded-lg transition-all shadow-md shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
