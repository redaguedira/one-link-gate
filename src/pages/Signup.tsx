import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { login } from '../lib/auth'

export default function Signup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // ديمو غير محلياً — ما كنسيفطو والو
    if (name.trim().length < 2) {
      setMessage('⚠️ دخل سميتك')
      return
    }
    if (!email.includes('@')) {
      setMessage('⚠️ Email غير صحيح')
      return
    }
    if (password.length < 6) {
      setMessage('⚠️ Password خاصو يكون 6 أحرف على الأقل')
      return
    }
    if (password !== confirm) {
      setMessage('⚠️ الپاسووردات ما متطابقينش')
      return
    }
    login(email)
    navigate('/dashboard')
  }

  const passwordStrength =
    password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3
  const strengthLabel = ['', 'ضعيف', 'متوسط', 'قوي 💪']
  const strengthColor = ['', 'bg-red-500', 'bg-yellow-500', 'bg-green-500']

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-6 py-12 text-white antialiased">
      {/* خلفية متوهجة */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* اللوگو */}
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 font-black text-black">
            1
          </div>
          <span className="text-2xl font-bold tracking-widest">ONE</span>
        </Link>

        {/* كارت التسجيل */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <h1 className="text-2xl font-bold">Create account</h1>
          <p className="mt-1 text-sm text-zinc-400">Join us — it takes 30 seconds</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm text-zinc-300">
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm text-zinc-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm text-zinc-300">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 pr-12 text-sm outline-none transition placeholder:text-zinc-600 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {/* مقياس قوة الپاسوورد */}
              {passwordStrength > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex h-1.5 flex-1 gap-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition ${
                          i <= passwordStrength ? strengthColor[passwordStrength] : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-zinc-400">{strengthLabel[passwordStrength]}</span>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirm" className="mb-2 block text-sm text-zinc-300">
                Confirm password
              </label>
              <input
                id="confirm"
                type={showPassword ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className={`w-full rounded-xl border bg-black/40 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:ring-2 focus:ring-violet-500/20 ${
                  confirm && confirm !== password
                    ? 'border-red-500/60'
                    : 'border-white/10 focus:border-violet-400/60'
                }`}
              />
              {confirm && confirm !== password && (
                <p className="mt-1 text-xs text-red-400">الپاسووردات ما متطابقينش</p>
              )}
            </div>

            <label className="flex items-start gap-2 text-sm text-zinc-400">
              <input type="checkbox" required className="mt-0.5 accent-violet-500" />
              <span>
                I agree to the{' '}
                <a href="#" className="text-violet-300 hover:text-violet-200">Terms</a> and{' '}
                <a href="#" className="text-violet-300 hover:text-violet-200">Privacy Policy</a>
              </span>
            </label>

            {message && (
              <p className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 py-3 font-semibold text-black transition hover:opacity-90"
            >
              Create account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-400">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-300 transition hover:text-violet-200">
              Sign in
            </Link>
          </p>
        </div>

        <Link
          to="/"
          className="mt-6 block text-center text-sm text-zinc-500 transition hover:text-white"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
