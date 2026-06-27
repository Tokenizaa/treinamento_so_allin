import React from 'react';
import { 
  RotateCcw, Play, CheckCircle2, AlertCircle, DollarSign, ArrowRight 
} from 'lucide-react';
import { ModuleData } from '../types';

interface ExerciseRendererProps {
  currentModule: ModuleData;
  exerciseAnswer: any;
  setExerciseAnswer: (val: any) => void;
  exerciseFeedback: { success: boolean; text: string } | null;
  onSubmit: () => void;
  onReset: () => void;
}

export default function InteractiveExerciseRenderer({
  currentModule,
  exerciseAnswer,
  setExerciseAnswer,
  exerciseFeedback,
  onSubmit,
  onReset
}: ExerciseRendererProps) {
  const { exercise } = currentModule;

  // Render help header
  const renderHeader = () => (
    <div className="mb-4">
      <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
        <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded text-xs">LAB</span>
        {exercise.title}
      </h3>
      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{exercise.instruction}</p>
    </div>
  );

  // Group 1: Ordering (drag_drop_layout, process_sequencing, pcp_sequencing)
  const renderOrdering = () => {
    if (!Array.isArray(exerciseAnswer)) return null;
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2 justify-center">
          {exerciseAnswer.map((stepId: string, index: number) => {
            const label = exercise.data.zones?.find((z: any) => z.id === stepId)?.label ||
                          exercise.data.orders?.find((o: any) => o.id === stepId)?.name ||
                          exercise.data.steps?.[exercise.data.steps.indexOf(stepId)] ||
                          stepId;

            return (
              <div 
                key={stepId} 
                className="flex items-center bg-slate-900 border border-slate-750 px-3 py-2 rounded-lg text-xs font-mono font-bold text-white shadow-sm gap-2 transition-all hover:border-amber-500/50"
              >
                <span className="bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/20 text-[9px]">
                  Passo {index + 1}
                </span>
                <span className="truncate max-w-[130px]">{label}</span>
                <div className="flex gap-1 ml-1 border-l border-slate-800 pl-1.5">
                  <button 
                    disabled={index === 0}
                    onClick={() => {
                      const updated = [...exerciseAnswer];
                      const temp = updated[index];
                      updated[index] = updated[index - 1];
                      updated[index - 1] = temp;
                      setExerciseAnswer(updated);
                    }}
                    className="p-1 hover:bg-slate-800 disabled:opacity-30 rounded text-amber-500"
                  >
                    ←
                  </button>
                  <button 
                    disabled={index === exerciseAnswer.length - 1}
                    onClick={() => {
                      const updated = [...exerciseAnswer];
                      const temp = updated[index];
                      updated[index] = updated[index + 1];
                      updated[index + 1] = temp;
                      setExerciseAnswer(updated);
                    }}
                    className="p-1 hover:bg-slate-800 disabled:opacity-30 rounded text-amber-500"
                  >
                    →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Group 2: Key-Value Matching (setores_matching, tool_matching, machine_selection)
  const renderMatching = () => {
    if (!exerciseAnswer || typeof exerciseAnswer !== 'object' || Array.isArray(exerciseAnswer)) return null;
    
    // Determine the dropdown options pool
    let pool: string[] = [];
    if (exercise.type === 'setores_matching' || exercise.type === 'tool_matching') {
      pool = Array.from(new Set(exercise.data.pairs.map((p: any) => p.sector || p.function))) as string[];
    } else if (exercise.type === 'machine_selection') {
      pool = Array.from(new Set(exercise.data.associations.map((a: any) => a.correctMachine))) as string[];
    }

    const items = exercise.type === 'machine_selection' 
      ? exercise.data.associations.map((a: any) => a.operation) 
      : Object.keys(exerciseAnswer);

    return (
      <div className="space-y-2 max-w-lg mx-auto">
        {items.map((itemKey: string) => (
          <div key={itemKey} className="grid grid-cols-1 md:grid-cols-2 items-center gap-3 border-b border-slate-850 pb-2">
            <span className="text-xs text-slate-300 font-medium leading-relaxed">{itemKey}</span>
            <select
              value={exerciseAnswer[itemKey] || ''}
              onChange={(e) => {
                setExerciseAnswer({
                  ...exerciseAnswer,
                  [itemKey]: e.target.value
                });
              }}
              className="bg-slate-900 border border-slate-800 text-xs rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">-- Selecione o Ativo/Setor --</option>
              {pool.map(val => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    );
  };

  // Group 3: Capacidade Centros de Trabalho (ct_capacity_balance)
  const renderCapacityBalance = () => {
    return (
      <div className="space-y-4 max-w-sm mx-auto">
        <div className="bg-slate-900 p-3 rounded-xl border border-slate-850 text-center">
          <span className="text-[10px] text-slate-500 font-mono block">DEMANDA REQUERIDA</span>
          <span className="text-2xl font-bold font-mono text-amber-500">30 Colchões</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-400 font-mono">CT-Colagem-01 (Molas)</label>
            <input 
              type="number"
              value={exerciseAnswer?.ct1 || 0}
              onChange={(e) => setExerciseAnswer({ ...exerciseAnswer, ct1: parseInt(e.target.value) || 0 })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 text-center text-sm font-mono text-white focus:border-amber-500 focus:outline-none"
            />
            <span className="text-[9px] text-slate-600 block">Capacidade máxima: 20</span>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-400 font-mono">CT-Colagem-02 (Espumas)</label>
            <input 
              type="number"
              value={exerciseAnswer?.ct2 || 0}
              onChange={(e) => setExerciseAnswer({ ...exerciseAnswer, ct2: parseInt(e.target.value) || 0 })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 text-center text-sm font-mono text-white focus:border-amber-500 focus:outline-none"
            />
            <span className="text-[9px] text-slate-600 block">Capacidade máxima: 20</span>
          </div>
        </div>
        <div className="text-center font-mono text-[11px] text-slate-400 border-t border-slate-850 pt-2">
          Soma alocada: <span className={`font-bold ${((exerciseAnswer?.ct1 || 0) + (exerciseAnswer?.ct2 || 0)) === 30 ? 'text-emerald-500' : 'text-red-500'}`}>
            {(exerciseAnswer?.ct1 || 0) + (exerciseAnswer?.ct2 || 0)} / 30
          </span>
        </div>
      </div>
    );
  };

  // Group 4: Materia Prima / Inventory Approved/Rejected (mp_inventory)
  const renderInventory = () => {
    if (!exerciseAnswer || typeof exerciseAnswer !== 'object') return null;
    return (
      <div className="space-y-3 max-w-md mx-auto">
        <div className="font-mono text-[10px] text-amber-500 mb-1 text-center">ESPECIFICACÃO EXIGIDA: LARGURA MÍNIMA {exercise.data.specWidth} METROS</div>
        {exercise.data.receivedItems.map((item: any) => (
          <div key={item.batch} className="flex items-center justify-between bg-slate-900 border border-slate-800 p-2.5 rounded-lg">
            <div>
              <span className="text-xs font-bold text-white block">{item.batch}</span>
              <span className="text-[9px] text-slate-500 font-mono">Medido: {item.width}m</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setExerciseAnswer({ ...exerciseAnswer, [item.batch]: true })}
                className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold ${
                  exerciseAnswer[item.batch] === true ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                APROVAR
              </button>
              <button
                onClick={() => setExerciseAnswer({ ...exerciseAnswer, [item.batch]: false })}
                className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold ${
                  exerciseAnswer[item.batch] === false ? 'bg-red-500 text-slate-950' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                REJEITAR
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Group 5: BOM Component Assembly Checklist (bom_assembly)
  const renderBomAssembly = () => {
    if (!Array.isArray(exerciseAnswer)) return null;
    return (
      <div className="space-y-3">
        <div className="text-[10px] font-mono text-slate-500 text-center mb-1">Selecione apenas as matérias-primas que compõem o <strong>{exercise.data.target}</strong>:</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {exercise.data.itemsPool.map((item: any) => {
            const isSelected = exerciseAnswer.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => {
                  const updated = isSelected 
                    ? exerciseAnswer.filter((id: string) => id !== item.id)
                    : [...exerciseAnswer, item.id];
                  setExerciseAnswer(updated);
                }}
                className={`p-2.5 rounded-lg text-left border text-xs transition-all flex items-center justify-between ${
                  isSelected 
                    ? 'bg-amber-500/10 border-amber-500 text-white' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div>
                  <span className="font-bold block text-white text-[11px]">{item.name}</span>
                  <span className="text-[9px] text-slate-500 font-mono">Consumo: {item.qty}</span>
                </div>
                <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                  isSelected ? 'border-amber-500 text-amber-500 bg-amber-500/10 text-[10px]' : 'border-slate-700'
                }`}>
                  {isSelected ? '✓' : ''}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Group 6: OP Release Strategy (op_planning)
  const renderOpPlanning = () => {
    return (
      <div className="space-y-3 max-w-sm mx-auto text-center">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-xs">
          <span className="text-[9px] text-slate-500 font-mono block">DEMANDA DA ORDEM (OP)</span>
          <span className="text-sm font-bold text-white block">{exercise.data.targetQty} Colchões de Casal</span>
          <span className="text-[10px] text-red-400 font-mono mt-0.5 block">ESTOQUE FÍSICO DE ESPUMA: {exercise.data.availableFoam} BLOCOS</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => setExerciseAnswer('liberar')}
            className={`p-2 rounded-lg border text-[11px] font-mono transition-all text-left flex justify-between items-center ${
              exerciseAnswer === 'liberar' ? 'bg-red-500/10 border-red-500 text-red-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span>Forçar liberação sem estoque físico (venda)</span>
            <span>{exerciseAnswer === 'liberar' ? '●' : '○'}</span>
          </button>
          <button
            onClick={() => setExerciseAnswer('rejeitar')}
            className={`p-2 rounded-lg border text-[11px] font-mono transition-all text-left flex justify-between items-center ${
              exerciseAnswer === 'rejeitar' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span>Bloquear Ordem e solicitar compra imediata</span>
            <span>{exerciseAnswer === 'rejeitar' ? '●' : '○'}</span>
          </button>
        </div>
      </div>
    );
  };

  // Group 7: Apontamento Scrap/Prod Form (apontamento_form)
  const renderApontamento = () => {
    return (
      <div className="space-y-3 max-w-xs mx-auto text-center">
        <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-850 mb-1">
          <span className="text-[9px] text-slate-500 font-mono block">LOTE EM PROCESSO</span>
          <span className="text-sm font-bold text-white">{exercise.data.target} Colchões</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1 text-left">
            <label className="text-[10px] text-slate-400 font-mono">Peças Boas</label>
            <input 
              type="number"
              value={exerciseAnswer?.good || 0}
              onChange={(e) => setExerciseAnswer({ ...exerciseAnswer, good: parseInt(e.target.value) || 0 })}
              className="w-full bg-slate-900 border border-slate-800 py-1.5 px-2 rounded font-mono text-center text-sm text-white focus:outline-none"
            />
          </div>
          <div className="space-y-1 text-left">
            <label className="text-[10px] text-slate-400 font-mono">Peças Refugo</label>
            <input 
              type="number"
              value={exerciseAnswer?.scrap || 0}
              onChange={(e) => setExerciseAnswer({ ...exerciseAnswer, scrap: parseInt(e.target.value) || 0 })}
              className="w-full bg-slate-900 border border-slate-800 py-1.5 px-2 rounded font-mono text-center text-sm text-white focus:outline-none"
            />
          </div>
        </div>
        <div className="space-y-1 text-left">
          <label className="text-[10px] text-slate-400 font-mono">Motivo do Refugo</label>
          <select
            value={exerciseAnswer?.reason || ''}
            onChange={(e) => setExerciseAnswer({ ...exerciseAnswer, reason: e.target.value })}
            className="w-full bg-slate-900 border border-slate-800 p-1.5 rounded text-xs text-white"
          >
            <option value="Mancha de Cola">Mancha de Cola</option>
            <option value="Agulha Quebrada">Agulha Quebrada</option>
            <option value="Tamanho Fora do Padrão">Tamanho Fora do Padrão</option>
          </select>
        </div>
      </div>
    );
  };

  // Group 8: Single Choice Selection List (maintenance_scheduling, copilot_analysis, general_trivia)
  const renderSingleChoice = () => {
    const list = exercise.data.actions || exercise.data.insights || exercise.data.options || [];
    return (
      <div className="space-y-2 max-w-md mx-auto">
        {list.map((opt: string) => {
          const isSelected = exerciseAnswer === opt;
          return (
            <button
              key={opt}
              onClick={() => setExerciseAnswer(opt)}
              className={`w-full p-2.5 text-left border text-xs font-semibold rounded-lg transition-all flex items-center justify-between ${
                isSelected 
                  ? 'bg-amber-500/10 border-amber-500 text-white font-bold' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="truncate max-w-[90%]">{opt}</span>
              <span className={`w-3.5 h-3.5 rounded-full border shrink-0 flex items-center justify-center ${
                isSelected ? 'border-amber-500 text-amber-500 text-[10px]' : 'border-slate-700'
              }`}>
                {isSelected ? '●' : ''}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  // Group 9: Numeric calculation inputs (cost_calculation, oee_calculator, scrap_calculation)
  const renderNumeric = () => {
    return (
      <div className="space-y-3 max-w-xs mx-auto text-center">
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-850 mb-1 font-mono text-[11px]">
          {exercise.type === 'cost_calculation' ? (
            <div className="grid grid-cols-3 gap-1">
              <div><span className="text-slate-500 block text-[9px]">BOM (MP)</span> R$ {exercise.data.mp}</div>
              <div><span className="text-slate-500 block text-[9px]">MOD</span> R$ {exercise.data.mod}</div>
              <div><span className="text-slate-500 block text-[9px]">CIF</span> R$ {exercise.data.cif}</div>
            </div>
          ) : exercise.type === 'scrap_calculation' ? (
            <div className="grid grid-cols-2 gap-2">
              <div><span className="text-slate-500 block text-[9px]">PESO MP INICIAL</span> {exercise.data.rawWeight} kg</div>
              <div><span className="text-slate-500 block text-[9px]">PESO ACABADO</span> {exercise.data.finishedWeight} kg</div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              <div><span className="text-slate-500 block text-[9px]">DISPONIB.</span> {Math.round(exercise.data.disp * 100)}%</div>
              <div><span className="text-slate-500 block text-[9px]">PERFORM.</span> {Math.round(exercise.data.perf * 100)}%</div>
              <div><span className="text-slate-500 block text-[9px]">QUALIDADE</span> {Math.round(exercise.data.qual * 100)}%</div>
            </div>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 font-mono block">RESULTADO MATEMÁTICO</label>
          <div className="relative max-w-[150px] mx-auto">
            {exercise.type === 'cost_calculation' && <DollarSign className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />}
            <input 
              type="number"
              placeholder="0"
              value={exerciseAnswer || ''}
              onChange={(e) => setExerciseAnswer(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-3 font-mono text-center text-sm text-white focus:outline-none focus:border-amber-500"
            />
            {(exercise.type === 'oee_calculator' || exercise.type === 'scrap_calculation') && <span className="text-slate-500 absolute right-2.5 top-2.5 font-mono text-xs">%</span>}
          </div>
        </div>
      </div>
    );
  };

  // Switch display challenge
  const renderChallengeUI = () => {
    switch (exercise.type) {
      case 'drag_drop_layout':
      case 'process_sequencing':
      case 'pcp_sequencing':
        return renderOrdering();
      case 'setores_matching':
      case 'tool_matching':
      case 'machine_selection':
        return renderMatching();
      case 'ct_capacity_balance':
        return renderCapacityBalance();
      case 'mp_inventory':
        return renderInventory();
      case 'bom_assembly':
        return renderBomAssembly();
      case 'op_planning':
        return renderOpPlanning();
      case 'apontamento_form':
        return renderApontamento();
      case 'maintenance_scheduling':
      case 'copilot_analysis':
      case 'general_trivia':
        return renderSingleChoice();
      case 'cost_calculation':
      case 'oee_calculator':
      case 'scrap_calculation':
        return renderNumeric();
      default:
        return <div className="text-xs text-center text-slate-500 py-4">Desafio Interativo Indisponível</div>;
    }
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        {renderHeader()}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/60 min-h-[180px] flex flex-col justify-center">
          {renderChallengeUI()}
        </div>
      </div>

      <div className="space-y-3 mt-4">
        {/* ACTION BUTTONS */}
        <div className="flex justify-between items-center">
          <button 
            onClick={onReset}
            className="text-slate-500 hover:text-white flex items-center gap-1 font-mono text-[10px] transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reiniciar Desafio
          </button>
          <button 
            onClick={onSubmit}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-2 rounded-lg text-xs font-mono shadow-md flex items-center gap-1.5 transition-all"
          >
            Submeter Resposta <Play className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* FEEDBACK STATUS */}
        {exerciseFeedback && (
          <div 
            className={`p-3 rounded-lg border flex gap-2.5 items-start ${
              exerciseFeedback.success 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            {exerciseFeedback.success ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />}
            <div className="text-xs">
              <h4 className="font-bold font-mono text-[11px] uppercase">
                {exerciseFeedback.success ? '✓ Desafio Concluído!' : '❌ Falha Operacional'}
              </h4>
              <p className="mt-0.5 leading-relaxed text-[11px]">{exerciseFeedback.text}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
