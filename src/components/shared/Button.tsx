import type { ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger'
  fullWidth?: boolean
}

const variants = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed',
  ghost: 'bg-transparent text-gray-500 hover:bg-black/5 active:bg-black/10',
  danger: 'bg-transparent text-red-500 hover:bg-red-50 active:bg-red-100',
}

export function Button({ variant = 'primary', fullWidth, className = '', children, ...props }: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl font-medium transition-colors px-4 py-3 text-sm min-h-[48px] ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
