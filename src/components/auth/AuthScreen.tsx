import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Button } from '../shared/Button'
import { Input } from '../shared/Input'

export function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setLoading(true)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError('אימייל או סיסמה שגויים')
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError('שגיאה ביצירת החשבון, נסה שוב')
      else setSuccessMsg('נשלח אימייל אימות — בדוק את תיבת הדואר שלך')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">
        <div className="text-center">
          <div className="text-4xl mb-2">⚖️</div>
          <h1 className="text-xl font-bold text-gray-900">מעקב משקל</h1>
          <p className="text-sm text-gray-500 mt-1">
            {mode === 'login' ? 'כניסה לחשבון' : 'יצירת חשבון חדש'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            type="email"
            placeholder="אימייל"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}
          {successMsg && (
            <p className="text-sm text-green-600 text-center">{successMsg}</p>
          )}

          <Button type="submit" fullWidth disabled={loading} className="py-4 min-h-[52px]">
            {loading ? '...' : mode === 'login' ? 'כניסה' : 'הרשמה'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500">
          {mode === 'login' ? 'אין לך חשבון?' : 'יש לך כבר חשבון?'}{' '}
          <button
            type="button"
            className="text-indigo-600 font-medium"
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccessMsg('') }}
          >
            {mode === 'login' ? 'הרשמה' : 'כניסה'}
          </button>
        </p>
      </div>
    </div>
  )
}
