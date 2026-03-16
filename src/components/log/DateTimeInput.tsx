import { Input } from '../shared/Input'

interface Props {
  value: string
  onChange: (value: string) => void
}

export function DateTimeInput({ value, onChange }: Props) {
  return (
    <Input
      id="loggedAt"
      label="תאריך ושעה"
      type="datetime-local"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
