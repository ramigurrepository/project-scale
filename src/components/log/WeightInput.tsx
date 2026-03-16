import { useEffect, useRef } from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
  autoFocus?: boolean
}

export function WeightInput({ value, onChange, autoFocus }: Props) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus) {
      // small delay so the screen transition completes first
      const t = setTimeout(() => ref.current?.focus(), 80)
      return () => clearTimeout(t)
    }
  }, [autoFocus])

  return (
    <div className="flex flex-col items-center gap-1 py-6">
      <label className="text-xs font-semibold tracking-widest uppercase text-gray-400">משקל</label>
      <div className="flex items-baseline gap-2">
        <input
          ref={ref}
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="00.0"
          min={1}
          max={999}
          step={0.1}
          className="w-44 text-center text-7xl font-bold bg-transparent outline-none text-gray-900 placeholder-gray-200 tracking-tight"
        />
        <span className="text-2xl font-medium text-gray-400">ק"ג</span>
      </div>
    </div>
  )
}
