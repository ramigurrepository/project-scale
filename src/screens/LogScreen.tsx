import { useState } from 'react'
import { useData } from '../context/DataContext'
import { WeightInput } from '../components/log/WeightInput'
import { DateTimePicker, type TimeOfDay, timeOfDayFromHour, buildISOFromDateAndTimeOfDay, todayDateString } from '../components/log/DateTimePicker'
import { ScaleSelector } from '../components/log/ScaleSelector'
import { EntryList } from '../components/log/EntryList'
import { Modal } from '../components/shared/Modal'
import { Button } from '../components/shared/Button'
import { EmptyState } from '../components/shared/EmptyState'
import type { WeightEntry } from '../types'

interface Props {
  onNavigateToScales: () => void
}

export function LogScreen({ onNavigateToScales }: Props) {
  const { state, dispatch } = useData()

  const [weight, setWeight] = useState('')
  const [logDate, setLogDate] = useState(todayDateString)
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning')
  const [scaleId, setScaleId] = useState(state.scales[0]?.id ?? '')

  const [editingEntry, setEditingEntry] = useState<WeightEntry | null>(null)
  const [editWeight, setEditWeight] = useState('')
  const [editDate, setEditDate] = useState('')
  const [editTimeOfDay, setEditTimeOfDay] = useState<TimeOfDay>('morning')
  const [editScaleId, setEditScaleId] = useState('')

  const [showToast, setShowToast] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const w = parseFloat(weight)
    if (!w || w <= 0 || !scaleId) return
    dispatch({
      type: 'ADD_ENTRY',
      payload: {
        scaleId,
        weight: w,
        loggedAt: buildISOFromDateAndTimeOfDay(logDate, timeOfDay),
      },
    })
    setWeight('')
    setLogDate(todayDateString())
    setTimeOfDay('morning')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 1800)
  }

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

  if (state.scales.length === 0) {
    return (
      <EmptyState
        title="לא הוגדרו משקלים"
        description="לפני הזנת שקילה, הוסף לפחות משקל אחד"
        action={{ label: 'הוסף משקל עכשיו', onClick: onNavigateToScales }}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Success toast */}
      {showToast && (
        <div className="fixed top-6 inset-x-0 flex justify-center z-50 pointer-events-none">
          <div className="toast-fadeout bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-xl font-medium text-sm flex items-center gap-2">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            השקילה נשמרה בהצלחה
          </div>
        </div>
      )}

      <h1 className="text-xl font-bold text-gray-900">הזנת שקילה</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4">
        <WeightInput value={weight} onChange={setWeight} autoFocus />
        <ScaleSelector
          scales={state.scales}
          value={scaleId || (state.scales[0]?.id ?? '')}
          onChange={(id) => setScaleId(id)}
        />
        <DateTimePicker
          date={logDate}
          timeOfDay={timeOfDay}
          onDateChange={setLogDate}
          onTimeOfDayChange={setTimeOfDay}
        />
        <Button
          type="submit"
          fullWidth
          disabled={!weight || parseFloat(weight) <= 0 || !scaleId}
          className="text-base py-4 min-h-[56px] rounded-2xl"
        >
          שמור שקילה
        </Button>
      </form>

      <EntryList
        entries={state.entries}
        scales={state.scales}
        onEdit={openEdit}
      />

      <Modal open={!!editingEntry} onClose={() => setEditingEntry(null)} title="עריכת שקילה">
        {editingEntry && (
          <div className="flex flex-col gap-4">
            <WeightInput value={editWeight} onChange={setEditWeight} />
            <ScaleSelector
              scales={state.scales}
              value={editScaleId}
              onChange={setEditScaleId}
            />
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
