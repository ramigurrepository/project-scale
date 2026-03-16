import { useState } from 'react'
import { useData } from '../context/DataContext'
import { useChartData } from '../hooks/useChartData'
import { TimeRangeToggle } from '../components/history/TimeRangeToggle'
import { WeightChart } from '../components/history/WeightChart'
import { ChartLegend } from '../components/history/ChartLegend'
import { EmptyState } from '../components/shared/EmptyState'
import { Modal } from '../components/shared/Modal'
import { Button } from '../components/shared/Button'
import { WeightInput } from '../components/log/WeightInput'
import { ScaleSelector } from '../components/log/ScaleSelector'
import { DateTimePicker, type TimeOfDay, timeOfDayFromHour, buildISOFromDateAndTimeOfDay } from '../components/log/DateTimePicker'
import { formatDateTime } from '../utils/dateUtils'
import type { TimeRange, WeightEntry } from '../types'

interface Props {
  onNavigateToLog: () => void
}

export function HistoryScreen({ onNavigateToLog }: Props) {
  const [range, setRange] = useState<TimeRange>(14)
  const { data, scales } = useChartData(range)
  const { state, dispatch } = useData()

  const [editingEntry, setEditingEntry] = useState<WeightEntry | null>(null)
  const [editWeight, setEditWeight] = useState('')
  const [editDate, setEditDate] = useState('')
  const [editTimeOfDay, setEditTimeOfDay] = useState<TimeOfDay>('morning')
  const [editScaleId, setEditScaleId] = useState('')

  const scaleMap = new Map(state.scales.map((s) => [s.id, s]))
  const last10 = [...state.entries]
    .sort((a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime())
    .slice(0, 10)

  function openEdit(entry: WeightEntry) {
    const d = new Date(entry.loggedAt)
    setEditingEntry(entry)
    setEditWeight(String(entry.weight))
    setEditDate(entry.loggedAt.slice(0, 10))
    setEditTimeOfDay(timeOfDayFromHour(d.getHours()))
    setEditScaleId(entry.scaleId)
  }

  function handleEditSave() {
    if (!editingEntry) return
    const w = parseFloat(editWeight)
    if (!w || w <= 0) return
    dispatch({
      type: 'UPDATE_ENTRY',
      payload: {
        ...editingEntry,
        weight: w,
        scaleId: editScaleId,
        loggedAt: buildISOFromDateAndTimeOfDay(editDate, editTimeOfDay),
      },
    })
    setEditingEntry(null)
  }

  function handleEditDelete() {
    if (!editingEntry) return
    dispatch({ type: 'DELETE_ENTRY', payload: editingEntry.id })
    setEditingEntry(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-gray-900">היסטוריית שקילות</h1>
      <TimeRangeToggle value={range} onChange={setRange} />

      {data.length === 0 ? (
        <EmptyState
          title="אין נתונים בטווח זה"
          description="לא נמצאו שקילות בטווח הזמן שנבחר"
          action={{ label: 'הוסף שקילה', onClick: onNavigateToLog }}
        />
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-4">
            <WeightChart data={data} scales={scales} />
            <ChartLegend scales={scales} />
          </div>

          {last10.length > 0 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-sm font-semibold text-gray-400 tracking-wide">10 שקילות אחרונות</h2>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                  {last10.map((entry) => {
                    const scale = scaleMap.get(entry.scaleId)
                    return (
                      <div key={entry.id} className="flex items-center gap-3 px-4 py-3">
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: scale?.color ?? '#D1D5DB' }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-base text-gray-900">{entry.weight.toFixed(1)} <span className="text-sm font-normal text-gray-400">ק"ג</span></p>
                          <p className="text-xs text-gray-400 truncate">
                            {scale?.name ?? 'משקל לא ידוע'} · {formatDateTime(entry.loggedAt)}
                          </p>
                        </div>
                        <button
                          onClick={() => openEdit(entry)}
                          className="text-xs text-indigo-500 font-medium px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors"
                        >
                          עריכה
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <Modal open={!!editingEntry} onClose={() => setEditingEntry(null)} title="עריכת שקילה">
        {editingEntry && (
          <div className="flex flex-col gap-4">
            <WeightInput value={editWeight} onChange={setEditWeight} />
            <ScaleSelector scales={state.scales} value={editScaleId} onChange={setEditScaleId} />
            <DateTimePicker
              date={editDate}
              timeOfDay={editTimeOfDay}
              onDateChange={setEditDate}
              onTimeOfDayChange={setEditTimeOfDay}
            />
            <Button
              fullWidth
              onClick={handleEditSave}
              disabled={!editWeight || parseFloat(editWeight) <= 0}
              className="py-4 min-h-[56px] rounded-2xl"
            >
              שמור שינויים
            </Button>
            <Button variant="danger" fullWidth onClick={handleEditDelete}>
              מחק שקילה זו
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}
