import type { Scale } from '../../types'
import { ScaleForm } from './ScaleForm'
import { Button } from '../shared/Button'

interface Props {
  scale: Scale
  entryCount: number
  isEditing: boolean
  onEdit: () => void
  onSave: (name: string) => void
  onCancelEdit: () => void
  onDelete: () => void
}

export function ScaleCard({ scale, entryCount, isEditing, onEdit, onSave, onCancelEdit, onDelete }: Props) {
  if (isEditing) {
    return (
      <div className="py-2">
        <ScaleForm initialName={scale.name} onSave={onSave} onCancel={onCancelEdit} />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
      <div
        className="w-4 h-4 rounded-full flex-shrink-0"
        style={{ backgroundColor: scale.color }}
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{scale.name}</p>
        <p className="text-xs text-gray-400">{entryCount} שקילות</p>
      </div>
      <Button variant="ghost" className="text-xs px-3 py-2 min-h-0" onClick={onEdit}>
        עריכה
      </Button>
      <Button variant="danger" className="text-xs px-3 py-2 min-h-0" onClick={onDelete}>
        מחיקה
      </Button>
    </div>
  )
}
