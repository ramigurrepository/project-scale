import type { AppState, AppAction } from '../types'
import { getNextColor } from '../utils/colorUtils'

export const initialState: AppState = {
  scales: [],
  entries: [],
}

export function dataReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload

    case 'ADD_SCALE': {
      const color = action.payload.color ?? getNextColor(state.scales)
      const scale = {
        id: action.payload.id ?? crypto.randomUUID(),
        name: action.payload.name,
        color,
        createdAt: action.payload.createdAt ?? new Date().toISOString(),
      }
      return { ...state, scales: [...state.scales, scale] }
    }

    case 'UPDATE_SCALE':
      return {
        ...state,
        scales: state.scales.map((s) =>
          s.id === action.payload.id ? action.payload : s,
        ),
      }

    case 'DELETE_SCALE':
      return {
        ...state,
        scales: state.scales.filter((s) => s.id !== action.payload),
      }

    case 'ADD_ENTRY': {
      const entry = {
        id: action.payload.id ?? crypto.randomUUID(),
        scaleId: action.payload.scaleId,
        weight: action.payload.weight,
        loggedAt: action.payload.loggedAt,
        createdAt: action.payload.createdAt ?? new Date().toISOString(),
      }
      return { ...state, entries: [...state.entries, entry] }
    }

    case 'UPDATE_ENTRY':
      return {
        ...state,
        entries: state.entries.map((e) =>
          e.id === action.payload.id ? action.payload : e,
        ),
      }

    case 'DELETE_ENTRY':
      return {
        ...state,
        entries: state.entries.filter((e) => e.id !== action.payload),
      }

    default:
      return state
  }
}
