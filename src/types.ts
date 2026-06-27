export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  questions: Question[];
}

export type ExerciseType = 
  | 'drag_drop_layout'
  | 'setores_matching'
  | 'ct_capacity_balance'
  | 'machine_selection'
  | 'tool_matching'
  | 'mp_inventory'
  | 'bom_assembly'
  | 'process_sequencing'
  | 'op_planning'
  | 'apontamento_form'
  | 'scrap_calculation'
  | 'maintenance_scheduling'
  | 'pcp_sequencing'
  | 'cost_calculation'
  | 'oee_calculator'
  | 'copilot_analysis'
  | 'general_trivia';

export interface InteractiveExercise {
  type: ExerciseType;
  title: string;
  instruction: string;
  data: any; // Context-dependent data for each challenge
  successCondition: (userAnswer: any) => { success: boolean; feedback: string };
}

export interface ModuleData {
  id: number;
  title: string;
  objective: string;
  concepts: {
    title: string;
    description: string;
    bullets?: string[];
  }[];
  illustratedExplanation: string;
  flowchartSteps: {
    label: string;
    description: string;
    arrow?: boolean;
  }[];
  practicalExample: string;
  systemApplication: string;
  commonErrors: string[];
  summary: string[];
  quiz: Quiz;
  exercise: InteractiveExercise;
}

export interface UserProgress {
  currentModuleId: number;
  completedModules: number[];
  quizScores: Record<number, number>; // moduleId -> score %
  exerciseCompleted: Record<number, boolean>; // moduleId -> completed
  userName: string;
  completionDate?: string;
  certificateCode?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
