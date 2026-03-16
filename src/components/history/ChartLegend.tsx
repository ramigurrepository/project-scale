import type { Scale } from '../../types'

interface Props {
  scales: Scale[]
}

export function ChartLegend({ scales }: Props) {
  if (scales.length === 0) return null
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {scales.map((scale) => (
        <div key={scale.id} className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: scale.color }} />
          <span className="text-sm text-gray-600">{scale.name}</span>
        </div>
      ))}
    </div>
  )
}
