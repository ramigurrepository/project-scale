import type { WeightEntry, Scale } from '../../types'
import { formatDateTime } from '../../utils/dateUtils'

interface Props {
  entries: WeightEntry[]
  scales: Scale[]
  onEdit: (entry: WeightEntry) => void
}

export function EntryList({ entries, scales, onEdit }: Props) {
  const scaleMap = new Map(scales.map((s) => [s.id, s]))

  const sorted = [...entries].sort(
    (a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime(),
  )

  if (sorted.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-sm font-semibold text-gray-400 tracking-wide">שקילות אחרונות</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
        {sorted.map((entry) => {
          const scale = scaleMap.get(entry.scaleId)
          return (
            <div key={entry.id} className="flex items-center gap-3 px-4 py-3">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: scale?.color ?? '#D1D5DB' }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-base text-gray-900">
                  {entry.weight.toFixed(1)}{' '}
                  <span className="text-sm font-normal text-gray-400">ק"ג</span>
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {scale?.name ?? 'משקל לא ידוע'} · {formatDateTime(entry.loggedAt)}
                </p>
              </div>
              <button
                onClick={() => onEdit(entry)}
                className="text-xs text-indigo-500 font-medium px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                עריכה
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
