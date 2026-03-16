import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts'
import type { Scale } from '../../types'
import type { ChartPoint } from '../../hooks/useChartData'
import { formatDateShort } from '../../utils/dateUtils'

interface Props {
  data: ChartPoint[]
  scales: Scale[]
}

interface TooltipPayloadItem {
  color: string
  value: number
  dataKey: string
}

function CustomTooltip({
  active,
  payload,
  label,
  scales,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
  scales: Scale[]
}) {
  if (!active || !payload?.length) return null
  const scaleMap = new Map(scales.map((s) => [s.id, s]))
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-3 text-sm">
      <p className="font-semibold text-gray-500 mb-2 text-xs tracking-wide">
        {label ? formatDateShort(label + 'T00:00:00') : ''}
      </p>
      {payload.map((item) => {
        const scale = scaleMap.get(item.dataKey)
        return (
          <div key={item.dataKey} className="flex items-center gap-2 py-0.5">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-gray-500">{scale?.name ?? item.dataKey}</span>
            <span className="font-bold text-gray-900 mr-auto">{Number(item.value).toFixed(1)}</span>
          </div>
        )
      })}
    </div>
  )
}

function WeightLabel(props: { x?: number; y?: number; value?: number | string; fill?: string }) {
  const { x = 0, y = 0, value, fill } = props
  if (value === undefined || value === null || value === '') return null
  return (
    <text
      x={x}
      y={y - 10}
      fill={fill ?? '#6366f1'}
      fontSize={10}
      fontWeight={700}
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {Number(value).toFixed(1)}
    </text>
  )
}

export function WeightChart({ data, scales }: Props) {
  const allValues = data.flatMap((point) =>
    scales
      .map((s) => point[s.id])
      .filter((v): v is number => typeof v === 'number'),
  )
  const minVal = allValues.length ? Math.min(...allValues) : 0
  const maxVal = allValues.length ? Math.max(...allValues) : 100
  const spread = maxVal - minVal
  const padding = Math.max(spread * 0.2, 2)
  const yMin = Math.floor(minVal - padding)
  const yMax = Math.ceil(maxVal + padding + (data.length <= 30 ? 4 : 2))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 24, right: 12, bottom: 0, left: -16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0F1F8" vertical={false} />

        <XAxis
          dataKey="date"
          tickFormatter={(val: string) => formatDateShort(val + 'T00:00:00')}
          tick={{ fontSize: 10, fill: '#B0B3C4' }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[yMin, yMax]}
          tick={{ fontSize: 10, fill: '#B0B3C4' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => `${v}`}
          width={36}
        />

        <Tooltip content={<CustomTooltip scales={scales} />} cursor={{ stroke: '#E4E6F2', strokeWidth: 1.5, strokeDasharray: '4 4' }} />

        {scales.map((scale) => (
          <Line
            key={scale.id}
            type="monotone"
            dataKey={scale.id}
            stroke={scale.color}
            strokeWidth={2.5}
            dot={{ r: 5, fill: scale.color, stroke: 'white', strokeWidth: 2.5 }}
            activeDot={{ r: 7, strokeWidth: 2.5, stroke: 'white', fill: scale.color }}
            connectNulls={true}
          >
            <LabelList
              dataKey={scale.id}
              content={(props) => (
                <WeightLabel
                  x={props.x as number}
                  y={props.y as number}
                  value={props.value as number | string | undefined}
                  fill={scale.color}
                />
              )}
            />
          </Line>
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
