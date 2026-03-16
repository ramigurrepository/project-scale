import { useState } from 'react'
import { Input } from '../shared/Input'
import { Button } from '../shared/Button'

interface Props {
  initialName?: string
  onSave: (name: string) => void
  onCancel: () => void
}

export function ScaleForm({ initialName = '', onSave, onCancel }: Props) {
  const [name, setName] = useState(initialName)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onSave(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="שם המשקל"
          autoFocus
          maxLength={50}
        />
      </div>
      <Button type="submit" disabled={!name.trim()}>שמור</Button>
      <Button type="button" variant="ghost" onClick={onCancel}>ביטול</Button>
    </form>
  )
}
