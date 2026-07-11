export interface PresetExercise {
  exercise: string
  sets: number
  reps: number
  weight: number
}

export interface WorkoutPreset {
  name: string
  exercises: PresetExercise[]
}

export const workoutPresets: WorkoutPreset[] = [
  {
    name: 'Back',
    exercises: [
      { exercise: 'T Bar Row / Leverage Row', sets: 2, reps: 12, weight: 0 },
      { exercise: 'Hoist Row / Db Row', sets: 2, reps: 12, weight: 0 },
      { exercise: 'Neutral Pull Down', sets: 2, reps: 12, weight: 0 },
      { exercise: 'Leverage Upper Back', sets: 2, reps: 12, weight: 0 },
      { exercise: 'Straight Bar Pullover', sets: 2, reps: 16, weight: 0 },
      { exercise: 'Shrugs (Smith Machine)', sets: 2, reps: 15, weight: 0 },
    ],
  },
  {
    name: 'Chest & Delts',
    exercises: [
      { exercise: 'Incline Chest Press', sets: 2, reps: 12, weight: 0 },
      { exercise: 'Leverage Press', sets: 2, reps: 14, weight: 20 },
      { exercise: 'Incline Chest Fly', sets: 2, reps: 15, weight: 10 },
      { exercise: 'Neutral Grip Chest Press', sets: 2, reps: 12, weight: 0 },
      { exercise: 'Delt Press', sets: 2, reps: 12, weight: 10 },
      { exercise: 'Lateral Raises', sets: 2, reps: 15, weight: 6 },
      { exercise: 'Rear Delt', sets: 2, reps: 15, weight: 0 },
    ],
  },
  {
    name: 'Legs',
    exercises: [
      { exercise: 'Leg Extensions', sets: 2, reps: 15, weight: 100 },
      { exercise: 'Swing Squat', sets: 2, reps: 12, weight: 20 },
      { exercise: 'Leg Press Precor', sets: 2, reps: 15, weight: 40 },
      { exercise: 'Lying Ham Curl Nautilus', sets: 2, reps: 15, weight: 90 },
      { exercise: 'Seated Ham Curl', sets: 2, reps: 15, weight: 50 },
      { exercise: 'Glute Kickback', sets: 1, reps: 12, weight: 0 },
      { exercise: 'Abs Crunch', sets: 1, reps: 15, weight: 43 },
      { exercise: 'Seated Calf', sets: 2, reps: 12, weight: 0 },
    ],
  },
  {
    name: 'Delts, Arms & Calves',
    exercises: [
      { exercise: 'Neutral Grip Shoulder Press', sets: 3, reps: 12, weight: 0 },
      { exercise: 'Lateral Raises', sets: 3, reps: 15, weight: 0 },
      { exercise: 'Seated Calf', sets: 3, reps: 15, weight: 0 },
      { exercise: 'Reverse Fly', sets: 3, reps: 12, weight: 0 },
      { exercise: 'Preacher Curl Machine', sets: 3, reps: 12, weight: 0 },
      { exercise: 'Tricep Extension Rope', sets: 3, reps: 12, weight: 0 },
      { exercise: 'Incline Bicep Curls Dbs', sets: 3, reps: 12, weight: 0 },
      { exercise: 'Overhead Tricep Ext', sets: 3, reps: 12, weight: 0 },
      { exercise: 'Warm Up: Rope Face Pulls', sets: 2, reps: 10, weight: 0 },
      { exercise: 'Warm Up: Push Ups (Neutral Grip)', sets: 1, reps: 10, weight: 0 },
    ],
  },
]
