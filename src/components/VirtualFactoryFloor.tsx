import React from 'react';
import { 
  Factory, Truck, Boxes, Wrench, Layout, Layers, Settings, Cpu, CheckCircle2 
} from 'lucide-react';

interface VirtualFactoryFloorProps {
  activeModuleId: number;
}

export default function VirtualFactoryFloor({ activeModuleId }: VirtualFactoryFloorProps) {
  // Returns whether a specific sector should flash or focus based on active module ID
  const isSectorActive = (sector: string) => {
    switch(sector) {
      case 'docas': return activeModuleId === 1 || activeModuleId === 9;
      case 'almoxarifado': return activeModuleId === 16 || activeModuleId === 9 || activeModuleId === 11;
      case 'corte': return activeModuleId === 5 || activeModuleId === 12;
      case 'costura': return activeModuleId === 7 || activeModuleId === 10;
      case 'montagem': return activeModuleId === 4 || activeModuleId === 13;
      case 'tape': return activeModuleId === 2 || activeModuleId === 17 || activeModuleId === 15;
      case 'embalagem': return activeModuleId === 21 || activeModuleId === 18;
      case 'qualidade': return activeModuleId === 17 || activeModuleId === 8 || activeModuleId === 14;
      case 'expedicao': return activeModuleId === 22 || activeModuleId === 20;
      default: return false;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3.5 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h4 className="text-sm font-bold text-white flex items-center gap-1.5 font-mono">
          <Factory className="w-4 h-4 text-amber-500" /> PLANTA FÍSICA INDUSTRIAL
        </h4>
        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded px-2.5 py-0.5">
          ● MONITOR ATIVO
        </span>
      </div>

      {/* Grid Visual of factory layout */}
      <div className="bg-slate-950 rounded-xl p-3 border border-slate-850 space-y-2">
        <span className="text-[9px] font-mono text-slate-500 block text-right font-bold uppercase tracking-wider">REGISTRO DE ATIVOS DE CHÃO DE FÁBRICA</span>
        
        <div className="grid grid-cols-3 gap-2.5 text-center text-[10px] font-mono">
          
          {/* Doca Recebimento */}
          <div className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 ${
            isSectorActive('docas') 
              ? 'bg-amber-500 border-amber-400 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-105 z-10' 
              : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <Truck className={`w-4 h-4 mb-1 ${isSectorActive('docas') ? 'text-slate-950' : 'text-slate-400'}`} />
            <span className="font-bold tracking-wide block truncate w-full">DOCAS RECEB.</span>
            <span className={`text-[8px] mt-0.5 block font-sans ${isSectorActive('docas') ? 'text-slate-900/95 font-semibold' : 'text-slate-400'}`}>Matéria-Prima</span>
          </div>

          {/* Almoxarifado */}
          <div className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 ${
            isSectorActive('almoxarifado')
              ? 'bg-amber-500 border-amber-400 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-105 z-10' 
              : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <Boxes className={`w-4 h-4 mb-1 ${isSectorActive('almoxarifado') ? 'text-slate-950' : 'text-slate-400'}`} />
            <span className="font-bold tracking-wide block truncate w-full">ALMOXARIFADO</span>
            <span className={`text-[8px] mt-0.5 block font-sans ${isSectorActive('almoxarifado') ? 'text-slate-900/95 font-semibold' : 'text-slate-400'}`}>Endereçado</span>
          </div>

          {/* Corte */}
          <div className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 ${
            isSectorActive('corte')
              ? 'bg-amber-500 border-amber-400 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-105 z-10' 
              : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <Wrench className={`w-4 h-4 mb-1 ${isSectorActive('corte') ? 'text-slate-950' : 'text-slate-400'}`} />
            <span className="font-bold tracking-wide block truncate w-full">SETOR CORTE</span>
            <span className={`text-[8px] mt-0.5 block font-sans ${isSectorActive('corte') ? 'text-slate-900/95 font-semibold' : 'text-slate-400'}`}>Serra Vert/Placas</span>
          </div>

          {/* Costura */}
          <div className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 ${
            isSectorActive('costura')
              ? 'bg-amber-500 border-amber-400 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-105 z-10' 
              : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <Layout className={`w-4 h-4 mb-1 ${isSectorActive('costura') ? 'text-slate-950' : 'text-slate-400'}`} />
            <span className="font-bold tracking-wide block truncate w-full">COSTURA / QUILT.</span>
            <span className={`text-[8px] mt-0.5 block font-sans ${isSectorActive('costura') ? 'text-slate-900/95 font-semibold' : 'text-slate-400'}`}>Tampo e Faixa</span>
          </div>

          {/* Montagem */}
          <div className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 ${
            isSectorActive('montagem')
              ? 'bg-amber-500 border-amber-400 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-105 z-10' 
              : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <Layers className={`w-4 h-4 mb-1 ${isSectorActive('montagem') ? 'text-slate-950' : 'text-slate-400'}`} />
            <span className="font-bold tracking-wide block truncate w-full">MONTAGEM / COLA</span>
            <span className={`text-[8px] mt-0.5 block font-sans ${isSectorActive('montagem') ? 'text-slate-900/95 font-semibold' : 'text-slate-400'}`}>Mola e Espuma</span>
          </div>

          {/* Fechamento */}
          <div className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 ${
            isSectorActive('tape')
              ? 'bg-amber-500 border-amber-400 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-105 z-10' 
              : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <Settings className={`w-4 h-4 mb-1 ${isSectorActive('tape') ? 'text-slate-950' : 'text-slate-400'}`} />
            <span className="font-bold tracking-wide block truncate w-full">TAPE EDGE (FECH)</span>
            <span className={`text-[8px] mt-0.5 block font-sans ${isSectorActive('tape') ? 'text-slate-900/95 font-semibold' : 'text-slate-400'}`}>Costura de Orla</span>
          </div>

          {/* Embalagem */}
          <div className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 ${
            isSectorActive('embalagem')
              ? 'bg-amber-500 border-amber-400 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-105 z-10' 
              : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <Cpu className={`w-4 h-4 mb-1 ${isSectorActive('embalagem') ? 'text-slate-950' : 'text-slate-400'}`} />
            <span className="font-bold tracking-wide block truncate w-full">EMBALAGEM</span>
            <span className={`text-[8px] mt-0.5 block font-sans ${isSectorActive('embalagem') ? 'text-slate-900/95 font-semibold' : 'text-slate-400'}`}>Prensa e Rolagem</span>
          </div>

          {/* Qualidade */}
          <div className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 ${
            isSectorActive('qualidade')
              ? 'bg-amber-500 border-amber-400 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-105 z-10' 
              : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <CheckCircle2 className={`w-4 h-4 mb-1 ${isSectorActive('qualidade') ? 'text-slate-950' : 'text-slate-400'}`} />
            <span className="font-bold tracking-wide block truncate w-full">INSPECÃO QUAL.</span>
            <span className={`text-[8px] mt-0.5 block font-sans ${isSectorActive('qualidade') ? 'text-slate-900/95 font-semibold' : 'text-slate-400'}`}>RNC e Checklists</span>
          </div>

          {/* Expedicao */}
          <div className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 ${
            isSectorActive('expedicao')
              ? 'bg-amber-500 border-amber-400 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-105 z-10' 
              : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <Truck className={`w-4 h-4 mb-1 ${isSectorActive('expedicao') ? 'text-slate-950' : 'text-slate-400'}`} />
            <span className="font-bold tracking-wide block truncate w-full">EXPEDICÃO</span>
            <span className={`text-[8px] mt-0.5 block font-sans ${isSectorActive('expedicao') ? 'text-slate-900/95 font-semibold' : 'text-slate-400'}`}>Despacho Doca PA</span>
          </div>

        </div>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed italic text-center font-medium bg-slate-950/40 p-2 rounded-lg border border-slate-850/50">
        O sistema destaca em <strong className="text-amber-400">âmbar</strong> o setor físico correspondente aos conceitos estudados no slide ativo.
      </p>
    </div>
  );
}
