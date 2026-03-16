export type TimeOfDay = 'morning' | 'noon' | 'evening'

export const TIME_OF_DAY_OPTIONS: { value: TimeOfDay; label: string; hour: number; icon: JSX.Element }[] = [
  {
    value: 'morning', label: 'בוקר', hour: 7,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 7v1M12 3v1M4.22 10.22l.7.7M18.36 5.64l.7.7M3 14h1M20 14h1" />
        <path d="M5 17a7 7 0 0114 0" />
        <line x1="3" y1="20" x2="21" y2="20" />
      </svg>
    ),
  },
  {
    value: 'noon', label: 'צהריים', hour: 12,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
  },
  {
    value: 'evening', label: 'ערב', hour: 19,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    ),
  },
]

export function timeOfDayFromHour(hour: number): TimeOfDay {
  if (hour < 10) return 'morning'
  if (hour < 16) return 'noon'
  return 'evening'
}

export function buildISOFromDateAndTimeOfDay(dateStr: string, timeOfDay: TimeOfDay): string {
  const hour = TIME_OF_DAY_OPTIONS.find((o) => o.value === timeOfDay)!.hour
  return new Date(`${dateStr}T${String(hour).padStart(2, '0')}:00:00`).toISOString()
}

export function todayDateString(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

interface Props {
  date: string
  timeOfDay: TimeOfDay
  onDateChange: (date: string) => void
  onTimeOfDayChange: (time: TimeOfDay) => void
}

export function DateTimePicker({ date, timeOfDay, onDateChange, onTimeOfDayChange }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-600">תאריך</label>
        <div className="relative min-h-[48px]">
          {/* Styled display */}
          <div className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-base text-gray-900 min-h-[48px] shadow-sm flex items-center justify-between pointer-events-none">
            <span>
              {date
                ? `${date.slice(8, 10)}/${date.slice(5, 7)}/${date.slice(2, 4)}`
                : 'בחר תאריך'}
            </span>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 text-gray-400 flex-shrink-0">
              <rect x="3" y="4" width="14" height="14" rx="2" />
              <path d="M7 2v4M13 2v4M3 9h14" strokeLinecap="round" />
            </svg>
          </div>
          {/* Native date input overlaid, fully transparent */}
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-600">שעת שקילה</label>
        <div className="flex gap-2">
          {TIME_OF_DAY_OPTIONS.map((opt) => {
            const active = timeOfDay === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onTimeOfDayChange(opt.value)}
                className={`flex-1 flex items-center justify-center rounded-xl py-3 gap-2 border transition-all text-sm font-semibold ${
                  active
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                    : 'bg-white border-gray-100 text-gray-500 hover:border-indigo-200'
                }`}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
