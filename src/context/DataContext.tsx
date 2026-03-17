import { createContext, useContext, useReducer, useEffect, useRef, useCallback, useState, type ReactNode } from 'react'
import { dataReducer, initialState } from './dataReducer'
import { supabase } from '../lib/supabase'
import { getNextColor } from '../utils/colorUtils'
import type { AppState, AppAction, Scale, WeightEntry } from '../types'

interface DataContextValue {
  state: AppState
  dispatch: (action: AppAction) => void
  loading: boolean
}

const DataContext = createContext<DataContextValue | null>(null)

function dbScaleToScale(row: Record<string, unknown>): Scale {
  return {
    id: row.id as string,
    name: row.name as string,
    color: row.color as string,
    createdAt: row.created_at as string,
  }
}

function dbEntryToEntry(row: Record<string, unknown>): WeightEntry {
  return {
    id: row.id as string,
    scaleId: row.scale_id as string,
    weight: parseFloat(String(row.weight)),
    loggedAt: row.logged_at as string,
    createdAt: row.created_at as string,
  }
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, localDispatch] = useReducer(dataReducer, initialState)
  const [loading, setLoading] = useState(true)
  const stateRef = useRef(state)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  async function loadUserData(userId: string) {
    setLoading(true)
    const [{ data: scales }, { data: entries }] = await Promise.all([
      supabase.from('scales').select().eq('user_id', userId).order('created_at'),
      supabase.from('weight_entries').select().eq('user_id', userId).order('logged_at'),
    ])
    localDispatch({
      type: 'HYDRATE',
      payload: {
        scales: (scales ?? []).map(dbScaleToScale),
        entries: (entries ?? []).map(dbEntryToEntry),
      },
    })
    setLoading(false)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        loadUserData(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        loadUserData(session.user.id)
      } else {
        localDispatch({ type: 'HYDRATE', payload: { scales: [], entries: [] } })
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const dispatch = useCallback(async (action: AppAction) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const userId = session.user.id

    switch (action.type) {
      case 'ADD_SCALE': {
        const color = getNextColor(stateRef.current.scales)
        const id = crypto.randomUUID()
        const createdAt = new Date().toISOString()
        localDispatch({ type: 'ADD_SCALE', payload: { ...action.payload, id, color, createdAt } })
        await supabase.from('scales').insert({ id, user_id: userId, name: action.payload.name, color, created_at: createdAt })
        break
      }
      case 'UPDATE_SCALE': {
        localDispatch(action)
        await supabase.from('scales').update({ name: action.payload.name, color: action.payload.color }).eq('id', action.payload.id)
        break
      }
      case 'DELETE_SCALE': {
        localDispatch(action)
        await supabase.from('scales').delete().eq('id', action.payload)
        break
      }
      case 'ADD_ENTRY': {
        const id = crypto.randomUUID()
        const createdAt = new Date().toISOString()
        localDispatch({ type: 'ADD_ENTRY', payload: { ...action.payload, id, createdAt } })
        await supabase.from('weight_entries').insert({
          id,
          user_id: userId,
          scale_id: action.payload.scaleId,
          weight: action.payload.weight,
          logged_at: action.payload.loggedAt,
          created_at: createdAt,
        })
        break
      }
      case 'UPDATE_ENTRY': {
        localDispatch(action)
        await supabase.from('weight_entries').update({
          scale_id: action.payload.scaleId,
          weight: action.payload.weight,
          logged_at: action.payload.loggedAt,
        }).eq('id', action.payload.id)
        break
      }
      case 'DELETE_ENTRY': {
        localDispatch(action)
        await supabase.from('weight_entries').delete().eq('id', action.payload)
        break
      }
      default:
        localDispatch(action)
    }
  }, [])

  return (
    <DataContext.Provider value={{ state, dispatch, loading }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
