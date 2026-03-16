import type { TimeRange } from '../types'

export const STORAGE_KEYS = {
  SCALES: 'scale_tracker_scales',
  ENTRIES: 'scale_tracker_entries',
} as const

export const SCALE_COLORS = [
  '#3B82F6',
  '#EF4444',
  '#10B981',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
  '#84CC16',
]

export const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: 7, label: '7 ימים' },
  { value: 14, label: '14 ימים' },
  { value: 30, label: '30 ימים' },
  { value: 365, label: 'שנה' },
]
