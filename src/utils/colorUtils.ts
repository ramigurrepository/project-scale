import { SCALE_COLORS } from '../constants'
import type { Scale } from '../types'

export function getNextColor(existingScales: Scale[]): string {
  const usedColors = new Set(existingScales.map((s) => s.color))
  const next = SCALE_COLORS.find((c) => !usedColors.has(c))
  return next ?? SCALE_COLORS[existingScales.length % SCALE_COLORS.length]!
}
