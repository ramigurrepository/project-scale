import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { DataProvider } from './context/DataContext'
import { AppShell } from './components/layout/AppShell'
import { BottomNav } from './components/layout/BottomNav'
import { LogScreen } from './screens/LogScreen'
import { HistoryScreen } from './screens/HistoryScreen'
import { ScalesScreen } from './screens/ScalesScreen'
import { AuthScreen } from './components/auth/AuthScreen'
import type { Screen } from './types'
import type { Session } from '@supabase/supabase-js'

function AppContent() {
  const [screen, setScreen] = useState<Screen>('log')

  return (
    <AppShell>
      {screen === 'log' && (
        <LogScreen onNavigateToScales={() => setScreen('scales')} />
      )}
      {screen === 'history' && (
        <HistoryScreen onNavigateToLog={() => setScreen('log')} />
      )}
      {screen === 'scales' && <ScalesScreen />}
      <BottomNav active={screen} onNavigate={setScreen} />
    </AppShell>
  )
}

export default function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setSession(session))
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) return null

  if (!session) return <AuthScreen />

  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  )
}
