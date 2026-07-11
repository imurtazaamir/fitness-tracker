import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { WorkoutEntry } from './types'
import { useLocalStorage } from './useLocalStorage'
import './App.css'

function App() {
  const [entries, setEntries] = useLocalStorage<WorkoutEntry[]>('fitness-tracker:entries', [])
  const [exercise, setExercise] = useState('')
  const [sets, setSets] = useState(3)
  const [reps, setReps] = useState(10)
  const [weight, setWeight] = useState(0)

  const completedCount = useMemo(() => entries.filter((e) => e.done).length, [entries])

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

  return (
    <div className="app">
      <header className="header">
        <h1>Fitness Tracker</h1>
        <p className="subtitle">
          {entries.length === 0
            ? 'Log your first workout below'
            : `${completedCount} of ${entries.length} exercises completed today`}
        </p>
      </header>

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
        {entries.map((entry) => (
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
