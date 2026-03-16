import type { Scale } from '../../types'

interface Props {
  scales: Scale[]
  value: string
  onChange: (scaleId: string) => void
}

export function ScaleSelector({ scales, value, onChange }: Props) {
  const selected = scales.find((s) => s.id === value)

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-600">משקל</label>
      <div className="relative">
        {selected && (
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full pointer-events-none z-10"
            style={{ backgroundColor: selected.color }}
          />
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={scales.length === 0}
          className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-base outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all min-h-[48px] pr-8 appearance-none disabled:opacity-50 shadow-sm"
        >
          {scales.length === 0 ? (
            <option value="">אין משקלים - הוסף תחילה</option>
          ) : (
            scales.map((scale) => (
              <option key={scale.id} value={scale.id}>
                {scale.name}
              </option>
            ))
          )}
        </select>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg viewBox="0 0 16 16" className="w-4 h-4 text-gray-400" fill="currentColor">
            <path d="M4.5 6L8 9.5 11.5 6" stroke="currentColor" strokeWidth={1.5} fill="none" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}
