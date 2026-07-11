import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { WeightEntry } from './types'
import { useLocalStorage } from './useLocalStorage'

const CHART_WIDTH = 480
const CHART_HEIGHT = 140
const PAD_X = 12
const PAD_TOP = 16
const PAD_BOTTOM = 24

function todayKey() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatShortDate(dateKey: string) {
  const [y, m, d] = dateKey.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function WeightTracker() {
  const [entries, setEntries] = useLocalStorage<WeightEntry[]>('fitness-tracker:weight-log', [])
  const [input, setInput] = useState('')
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const sorted = useMemo(
    () => [...entries].sort((a, b) => a.date.localeCompare(b.date)),
    [entries],
  )

  function logWeight(e: FormEvent) {
    e.preventDefault()
    const value = Number(input)
    if (!value || value <= 0) return
    const today = todayKey()
    setEntries((prev) => {
      const existing = prev.find((entry) => entry.date === today)
      if (existing) {
        return prev.map((entry) => (entry.date === today ? { ...entry, weight: value } : entry))
      }
      return [...prev, { date: today, weight: value }]
    })
    setInput('')
  }

  function removeEntry(date: string) {
    setEntries((prev) => prev.filter((entry) => entry.date !== date))
  }

  const latest = sorted[sorted.length - 1]
  const previous = sorted[sorted.length - 2]
  const delta = latest && previous ? latest.weight - previous.weight : null

  const points = useMemo(() => {
    if (sorted.length === 0) return []
    const weights = sorted.map((e) => e.weight)
    const min = Math.min(...weights)
    const max = Math.max(...weights)
    const range = max - min
    const yPad = range > 0 ? range * 0.15 : 2
    const scaledMin = min - yPad
    const scaledMax = max + yPad
    const innerWidth = CHART_WIDTH - PAD_X * 2
    const innerHeight = CHART_HEIGHT - PAD_TOP - PAD_BOTTOM
    return sorted.map((entry, i) => {
      const x =
        sorted.length === 1
          ? PAD_X + innerWidth / 2
          : PAD_X + (i / (sorted.length - 1)) * innerWidth
      const y =
        PAD_TOP +
        innerHeight -
        ((entry.weight - scaledMin) / (scaledMax - scaledMin)) * innerHeight
      return { x, y, entry }
    })
  }, [sorted])

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const bandWidth = CHART_WIDTH / Math.max(points.length, 1)

  return (
    <div className="weight-tracker">
      <h2 className="preset-heading">Body weight</h2>
      <form className="weight-form" onSubmit={logWeight}>
        <input
          type="number"
          min={0}
          step="0.1"
          placeholder="Weight (lb)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Log today's weight</button>
      </form>

      {sorted.length === 0 ? (
        <p className="weight-empty">No entries yet — log your weight to start tracking.</p>
      ) : (
        <>
          <div className="weight-summary">
            <span className="weight-latest">{latest.weight} lb</span>
            {delta !== null && (
              <span className="weight-delta">
                {delta > 0 ? '▲' : delta < 0 ? '▼' : '—'} {Math.abs(delta).toFixed(1)} lb since last log
              </span>
            )}
          </div>

          <svg
            className="weight-chart"
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            preserveAspectRatio="none"
            onMouseLeave={() => setHoverIndex(null)}
          >
            {points.length > 1 && <path d={linePath} className="weight-line" />}
            {points.map((p, i) => (
              <circle
                key={p.entry.date}
                cx={p.x}
                cy={p.y}
                r={i === points.length - 1 ? 5 : 3}
                className={
                  i === points.length - 1 ? 'weight-point weight-point-last' : 'weight-point'
                }
              />
            ))}
            {points.map((p, i) => (
              <rect
                key={`hit-${p.entry.date}`}
                x={p.x - bandWidth / 2}
                y={0}
                width={bandWidth}
                height={CHART_HEIGHT}
                fill="transparent"
                onMouseEnter={() => setHoverIndex(i)}
              />
            ))}
            {hoverIndex !== null && (
              <line
                x1={points[hoverIndex].x}
                x2={points[hoverIndex].x}
                y1={PAD_TOP}
                y2={CHART_HEIGHT - PAD_BOTTOM}
                className="weight-crosshair"
              />
            )}
          </svg>

          {hoverIndex !== null && (
            <div className="weight-tooltip">
              {formatShortDate(points[hoverIndex].entry.date)}: {points[hoverIndex].entry.weight} lb
            </div>
          )}

          <div className="weight-axis-labels">
            <span>{formatShortDate(sorted[0].date)}</span>
            <span>{formatShortDate(sorted[sorted.length - 1].date)}</span>
          </div>

          <ul className="weight-log-list">
            {[...sorted]
              .reverse()
              .slice(0, 7)
              .map((entry) => (
                <li key={entry.date}>
                  <span>{formatShortDate(entry.date)}</span>
                  <span>{entry.weight} lb</span>
                  <button
                    type="button"
                    onClick={() => removeEntry(entry.date)}
                    aria-label={`Remove weight log for ${entry.date}`}
                  >
                    ×
                  </button>
                </li>
              ))}
          </ul>
        </>
      )}
    </div>
  )
}
