import { useMemo } from 'react'
import { useData } from '../context/DataContext'
import { getCutoffDate, toDateKey } from '../utils/dateUtils'
import type { Scale } from '../types'

export interface ChartPoint {
  date: string
  [scaleId: string]: number | string | undefined
}

export function useChartData(days: number): { data: ChartPoint[]; scales: Scale[] } {
  const { state } = useData()

  return useMemo(() => {
    const cutoff = getCutoffDate(days)

    const filtered = state.entries.filter(
      (e) => new Date(e.loggedAt) >= cutoff,
    )

    const scaleIds = [...new Set(filtered.map((e) => e.scaleId))]
    const scales = state.scales.filter((s) => scaleIds.includes(s.id))

    // Build map: dateKey → { scaleId → latest entry weight }
    const map = new Map<string, Map<string, { weight: number; loggedAt: string }>>()

    for (const entry of filtered) {
      const dateKey = toDateKey(entry.loggedAt)
      if (!map.has(dateKey)) map.set(dateKey, new Map())
      const dayMap = map.get(dateKey)!
      const existing = dayMap.get(entry.scaleId)
      if (!existing || entry.loggedAt > existing.loggedAt) {
        dayMap.set(entry.scaleId, { weight: entry.weight, loggedAt: entry.loggedAt })
      }
    }

    const data: ChartPoint[] = Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, dayMap]) => {
        const point: ChartPoint = { date }
        for (const [scaleId, { weight }] of dayMap.entries()) {
          point[scaleId] = weight
        }
        return point
      })

    return { data, scales }
  }, [state.entries, state.scales, days])
}
