import type { ReactNode } from 'react'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto">
      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-6">
        {children}
      </main>
    </div>
  )
}
