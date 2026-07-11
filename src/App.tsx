import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { WorkoutEntry } from './types'
import { useLocalStorage } from './useLocalStorage'
import { workoutPresets } from './presets'
import { WeightTracker } from './WeightTracker'
import './App.css'

function App() {
  const [entries, setEntries] = useLocalStorage<WorkoutEntry[]>('fitness-tracker:entries', [])
  const [activeDay, setActiveDay] = useState<string | null>(null)
  const [exercise, setExercise] = useState('')
  const [sets, setSets] = useState(3)
  const [reps, setReps] = useState(10)
  const [weight, setWeight] = useState(0)

  const visibleEntries = useMemo(
    () => (activeDay ? entries.filter((e) => e.day === activeDay) : entries),
    [entries, activeDay],
  )

  const completedCount = useMemo(
    () => visibleEntries.filter((e) => e.done).length,
    [visibleEntries],
  )

  function addEntry(e: FormEvent) {
    e.preventDefault()
    if (!exercise.trim()) return

    const entry: WorkoutEntry = {
      id: crypto.randomUUID(),
      exercise: exercise.trim(),
      sets,
      reps,
      weight,
      done: false,
      createdAt: Date.now(),
      day: activeDay ?? undefined,
    }

    setEntries((prev) => [entry, ...prev])
    setExercise('')
    setSets(3)
    setReps(10)
    setWeight(0)
  }

  function toggleDone(id: string) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, done: !e.done } : e)))
  }

  function removeEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  function selectDay(dayName: string | null) {
    setActiveDay(dayName)
    if (!dayName) return

    const preset = workoutPresets.find((p) => p.name === dayName)
    if (!preset) return

    const alreadyLoaded = entries.some((e) => e.day === dayName)
    if (alreadyLoaded) return

    const now = Date.now()
    const newEntries: WorkoutEntry[] = preset.exercises.map((ex, i) => ({
      id: crypto.randomUUID(),
      exercise: ex.exercise,
      sets: ex.sets,
      reps: ex.reps,
      weight: ex.weight,
      done: false,
      createdAt: now + i,
      day: dayName,
    }))

    setEntries((prev) => [...newEntries, ...prev])
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Beast App</h1>
        <p className="subtitle">
          {visibleEntries.length === 0
            ? 'Log your first workout below'
            : `${completedCount} of ${visibleEntries.length} exercises completed today`}
        </p>
      </header>

      <WeightTracker />

      <div className="preset-picker">
        <h2 className="preset-heading">Workout day</h2>
        <div className="preset-buttons">
          <button
            type="button"
            className={activeDay === null ? 'preset-btn active' : 'preset-btn'}
            onClick={() => selectDay(null)}
          >
            All
          </button>
          {workoutPresets.map((preset) => (
            <button
              key={preset.name}
              type="button"
              className={activeDay === preset.name ? 'preset-btn active' : 'preset-btn'}
              onClick={() => selectDay(preset.name)}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <form className="entry-form" onSubmit={addEntry}>
        <input
          type="text"
          placeholder="Exercise (e.g. Bench Press)"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          className="exercise-input"
        />
        <div className="numeric-fields">
          <label>
            Sets
            <input
              type="number"
              min={1}
              value={sets}
              onChange={(e) => setSets(Number(e.target.value))}
            />
          </label>
          <label>
            Reps
            <input
              type="number"
              min={1}
              value={reps}
              onChange={(e) => setReps(Number(e.target.value))}
            />
          </label>
          <label>
            Weight (lb)
            <input
              type="number"
              min={0}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
            />
          </label>
        </div>
        <button type="submit">Add exercise</button>
      </form>

      <ul className="entry-list">
        {visibleEntries.map((entry) => (
          <li key={entry.id} className={entry.done ? 'entry done' : 'entry'}>
            <label className="entry-check">
              <input
                type="checkbox"
                checked={entry.done}
                onChange={() => toggleDone(entry.id)}
              />
              <span className="entry-name">{entry.exercise}</span>
            </label>
            <span className="entry-meta">
              {entry.sets} × {entry.reps}{entry.weight > 0 ? ` @ ${entry.weight}lb` : ''}
            </span>
            <button
              type="button"
              className="remove-btn"
              onClick={() => removeEntry(entry.id)}
              aria-label={`Remove ${entry.exercise}`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
