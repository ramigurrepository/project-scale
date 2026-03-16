import { useState } from 'react'
import { useData } from '../context/DataContext'
import { ScaleCard } from '../components/scales/ScaleCard'
import { ScaleForm } from '../components/scales/ScaleForm'
import { Button } from '../components/shared/Button'

export function ScalesScreen() {
  const { state, dispatch } = useData()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  function handleAddSave(name: string) {
    dispatch({ type: 'ADD_SCALE', payload: { name } })
    setShowAddForm(false)
  }

  function handleEditSave(id: string, name: string) {
    const scale = state.scales.find((s) => s.id === id)
    if (!scale) return
    dispatch({ type: 'UPDATE_SCALE', payload: { ...scale, name } })
    setEditingId(null)
  }

  function getEntryCount(scaleId: string) {
    return state.entries.filter((e) => e.scaleId === scaleId).length
  }

  function confirmDelete(id: string) {
    if (pendingDeleteId === id) {
      dispatch({ type: 'DELETE_SCALE', payload: id })
      setPendingDeleteId(null)
    } else {
      setPendingDeleteId(id)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">המשקלים שלי</h1>
        {!showAddForm && (
          <Button onClick={() => { setShowAddForm(true); setEditingId(null) }} className="text-sm px-3 py-2 min-h-0">
            + הוסף משקל
          </Button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-md p-4">
          <ScaleForm onSave={handleAddSave} onCancel={() => setShowAddForm(false)} />
        </div>
      )}

      {state.scales.length === 0 && !showAddForm ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-2">⚖️</div>
          <p className="font-medium text-gray-600">אין משקלים עדיין</p>
          <p className="text-sm mt-1">הוסף את המשקל הראשון שלך</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md px-4">
          {state.scales.map((scale) => (
            <div key={scale.id}>
              {pendingDeleteId === scale.id && (
                <div className="py-2 px-1 text-sm text-red-600 bg-red-50 rounded-lg mb-1">
                  <p>
                    יש {getEntryCount(scale.id)} שקילות עבור משקל זה.
                    לחץ שוב על "מחיקה" לאישור.
                  </p>
                </div>
              )}
              <ScaleCard
                scale={scale}
                entryCount={getEntryCount(scale.id)}
                isEditing={editingId === scale.id}
                onEdit={() => { setEditingId(scale.id); setShowAddForm(false) }}
                onSave={(name) => handleEditSave(scale.id, name)}
                onCancelEdit={() => setEditingId(null)}
                onDelete={() => confirmDelete(scale.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
