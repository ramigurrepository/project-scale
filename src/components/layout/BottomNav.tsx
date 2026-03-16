import type { Screen } from '../../types'

interface Props {
  active: Screen
  onNavigate: (screen: Screen) => void
}

const tabs: { id: Screen; label: string; icon: (active: boolean) => JSX.Element }[] = [
  {
    id: 'log',
    label: 'שקילה',
    icon: (active) => (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3C9 3 6.5 5 6.5 7.5H17.5C17.5 5 15 3 12 3Z" />
        <rect x="3" y="7.5" width="18" height="13.5" rx="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 13.5l2 2 4-4" />
      </svg>
    ),
  },
  {
    id: 'history',
    label: 'גרף',
    icon: (active) => (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
        <polyline strokeLinecap="round" strokeLinejoin="round" points="3,17 8,11 13,14 21,6" />
        <line x1="3" y1="21" x2="21" y2="21" strokeLinecap="round" />
        <line x1="3" y1="3" x2="3" y2="21" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'scales',
    label: 'משקלים',
    icon: (active) => (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18" />
      </svg>
    ),
  },
]

export function BottomNav({ active, onNavigate }: Props) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white border-t border-gray-100 flex shadow-[0_-2px_16px_rgba(0,0,0,0.05)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-all min-h-[60px] relative ${
              isActive ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-500'
            }`}
          >
            {isActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-indigo-600 rounded-full" />
            )}
            {tab.icon(isActive)}
            <span className={`text-xs font-medium ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
