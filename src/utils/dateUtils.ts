export function toDatetimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const pad = (n: number) => String(n).padStart(2, '0')

export function formatDate(isoString: string): string {
  const d = new Date(isoString)
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${String(d.getFullYear()).slice(2)}`
}

export function formatDateShort(isoString: string): string {
  const d = new Date(isoString)
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`
}

export function formatDateTime(isoString: string): string {
  const d = new Date(isoString)
  const h = d.getHours()
  const timeLabel = h < 10 ? 'בוקר' : h < 16 ? 'צהריים' : 'ערב'
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${String(d.getFullYear()).slice(2)} · ${timeLabel}`
}

export function toDateKey(isoString: string): string {
  return isoString.slice(0, 10)
}

export function getCutoffDate(days: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - days + 1)
  d.setHours(0, 0, 0, 0)
  return d
}
