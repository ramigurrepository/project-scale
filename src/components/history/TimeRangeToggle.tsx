import { TIME_RANGES } from '../../constants'
import type { TimeRange } from '../../types'

interface Props {
  value: TimeRange
  onChange: (range: TimeRange) => void
}

export function TimeRangeToggle({ value, onChange }: Props) {
  return (
    <div className="flex gap-1 bg-white/60 rounded-2xl p-1 shadow-sm">
      {TIME_RANGES.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className={`flex-1 rounded-xl py-2 text-sm font-medium transition-all ${
            value === range.value
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  )
}
