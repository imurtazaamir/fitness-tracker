import { useEffect, useMemo, useState } from 'react'
import { getCompletionsSince } from './db'
import type { CompletionRecord } from './db'
import { todayKey, lastNDays, formatWeekday } from './date'

const CHART_HEIGHT = 160
const PAD_TOP = 18
const BAR_WIDTH = 32
const BAR_GAP = 16

export function AnalyticsPage() {
  const [completions, setCompletions] = useState<CompletionRecord[]>([])
  const [loading, setLoading] = useState(true)

  const days = useMemo(() => lastNDays(7), [])

  useEffect(() => {
    let cancelled = false
    getCompletionsSince(days[0])
      .then((records) => {
        if (!cancelled) setCompletions(records)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [days])

  const byDay = useMemo(() => {
    const map = new Map<string, CompletionRecord[]>()
    for (const day of days) map.set(day, [])
    for (const c of completions) {
      map.get(c.date)?.push(c)
    }
    return map
  }, [completions, days])

  const maxCount = Math.max(1, ...days.map((d) => byDay.get(d)?.length ?? 0))
  const totalCompleted = completions.length
  const daysTrained = days.filter((d) => (byDay.get(d)?.length ?? 0) > 0).length
  const today = todayKey()

  if (loading) {
    return <p className="analytics-loading">Loading progress…</p>
  }

  return (
    <div className="analytics">
      <div className="analytics-summary">
        <div className="stat-tile">
          <span className="stat-value">{totalCompleted}</span>
          <span className="stat-label">exercises completed</span>
        </div>
        <div className="stat-tile">
          <span className="stat-value">{daysTrained}</span>
          <span className="stat-label">of 7 days trained</span>
        </div>
      </div>

      <svg
        className="bar-chart"
        viewBox={`0 0 ${days.length * (BAR_WIDTH + BAR_GAP)} ${CHART_HEIGHT}`}
        preserveAspectRatio="none"
      >
        {days.map((day, i) => {
          const count = byDay.get(day)?.length ?? 0
          const barHeight =
            count === 0 ? 0 : Math.max((count / maxCount) * (CHART_HEIGHT - 24 - PAD_TOP), 6)
          const x = i * (BAR_WIDTH + BAR_GAP)
          const y = CHART_HEIGHT - 24 - barHeight
          return (
            <g key={day}>
              {count > 0 && (
                <rect
                  x={x}
                  y={y}
                  width={BAR_WIDTH}
                  height={barHeight}
                  rx={4}
                  className={day === today ? 'bar bar-today' : 'bar'}
                />
              )}
              {count > 0 && (
                <text x={x + BAR_WIDTH / 2} y={y - 6} textAnchor="middle" className="bar-value">
                  {count}
                </text>
              )}
              <text
                x={x + BAR_WIDTH / 2}
                y={CHART_HEIGHT - 6}
                textAnchor="middle"
                className="bar-label"
              >
                {formatWeekday(day)}
              </text>
            </g>
          )
        })}
      </svg>

      <ul className="analytics-log">
        {[...days].reverse().map((day) => {
          const dayCompletions = byDay.get(day) ?? []
          const workoutDays = [...new Set(dayCompletions.map((c) => c.day).filter(Boolean))]
          return (
            <li key={day}>
              <span className="analytics-log-date">{formatWeekday(day)}</span>
              <span className="analytics-log-detail">
                {dayCompletions.length === 0
                  ? 'Rest day'
                  : `${dayCompletions.length} exercise${dayCompletions.length === 1 ? '' : 's'}${
                      workoutDays.length ? ` · ${workoutDays.join(', ')}` : ''
                    }`}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
