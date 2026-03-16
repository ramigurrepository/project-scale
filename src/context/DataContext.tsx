import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import { dataReducer, initialState } from './dataReducer'
import { STORAGE_KEYS } from '../constants'
import type { AppState, AppAction } from '../types'

interface DataContextValue {
  state: AppState
  dispatch: React.Dispatch<AppAction>
}

const DataContext = createContext<DataContextValue | null>(null)

function loadFromStorage(): AppState {
  try {
    const scales = localStorage.getItem(STORAGE_KEYS.SCALES)
    const entries = localStorage.getItem(STORAGE_KEYS.ENTRIES)
    return {
      scales: scales ? JSON.parse(scales) : [],
      entries: entries ? JSON.parse(entries) : [],
    }
  } catch {
    return initialState
  }
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dataReducer, undefined, loadFromStorage)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCALES, JSON.stringify(state.scales))
      localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(state.entries))
    } catch {
      // localStorage unavailable, data lives in memory only
    }
  }, [state])

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
