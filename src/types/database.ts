import { ReadinessLevel } from '../types';

export interface QuizResult {
  id?: string;
  user_id?: string;
  selected_field: string;
  total_score: number;
  readiness_level: ReadinessLevel;
  category_scores: Record<string, number>;
  strengths: string[];
  improvement_areas: string[];
  created_at?: string;
}
