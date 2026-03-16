import { useState } from 'react'
import { DataProvider } from './context/DataContext'
import { AppShell } from './components/layout/AppShell'
import { BottomNav } from './components/layout/BottomNav'
import { LogScreen } from './screens/LogScreen'
import { HistoryScreen } from './screens/HistoryScreen'
import { ScalesScreen } from './screens/ScalesScreen'
import type { Screen } from './types'

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
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  )
}
