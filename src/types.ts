
export type ReadinessLevel = 'AI Beginner' | 'AI Aware' | 'AI Active User' | 'AI Power User' | 'AI-Ready Leader';

export interface Option {
  text: string;
  score: number;
}

export interface Question {
  id: string;
  category: 'AI Awareness' | 'Prompting Skill' | 'Workflow Integration' | 'Tool Usage' | 'Automation' | 'Data/Privacy Awareness' | 'Quality Control' | 'Field-Specific' | 'Evaluation' | 'Tool Combination' | 'Learning Capacity' | 'Collaboration';
  question: string;
  options: Option[];
}

export interface FieldData {
  name: string;
  description: string;
  icon: string;
  questions: Question[];
  recommendedTools: {
    name: string;
    category: string;
    description: string;
    disclaimer?: string;
  }[];
  disclaimer?: string;
}

export interface QuizState {
  currentStep: 'landing' | 'field-selection' | 'quiz' | 'results';
  selectedField: string | null;
  answers: Record<string, number>;
  currentQuestionIndex: number;
}
