export interface WorkoutEntry {
  id: string;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  done: boolean;
  createdAt: number;
}
