export interface Scale {
  id: string
  name: string
  color: string
  createdAt: string
}

export interface WeightEntry {
  id: string
  scaleId: string
  weight: number
  loggedAt: string
  createdAt: string
}

export interface AppState {
  scales: Scale[]
  entries: WeightEntry[]
}

export type AppAction =
  | { type: 'ADD_ENTRY'; payload: Omit<WeightEntry, 'id' | 'createdAt'> & { id?: string; createdAt?: string } }
  | { type: 'UPDATE_ENTRY'; payload: WeightEntry }
  | { type: 'DELETE_ENTRY'; payload: string }
  | { type: 'ADD_SCALE'; payload: Omit<Scale, 'id' | 'createdAt' | 'color'> & { id?: string; color?: string; createdAt?: string } }
  | { type: 'UPDATE_SCALE'; payload: Scale }
  | { type: 'DELETE_SCALE'; payload: string }
  | { type: 'HYDRATE'; payload: AppState }

export type Screen = 'log' | 'history' | 'scales'

export type TimeRange = 7 | 14 | 30 | 365
