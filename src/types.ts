export interface WorkoutEntry {
  id: string;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  done: boolean;
  createdAt: number;
  day?: string;
  setWeights?: number[];
}

export interface WeightEntry {
  date: string;
  weight: number;
}

export interface ExerciseHistoryRecord {
  date: string;
  weights: number[];
}

export type ExerciseHistory = Record<string, ExerciseHistoryRecord[]>;
