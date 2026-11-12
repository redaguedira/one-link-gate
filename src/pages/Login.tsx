import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { login } from '../lib/auth'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // ديمو غير محلياً — ما كنسيفطو والو
    if (!email.includes('@')) {
      setMessage('⚠️ Email غير صحيح')
      return
    }
    if (password.length < 6) {
      setMessage('⚠️ Password خاصو يكون 6 أحرف على الأقل')
      return
    }
    // محاكاة طلب للسيرفر
    setLoading(true)
    setMessage('')
    setTimeout(() => {
      login(email)
      navigate('/dashboard')
    }, 800)
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0f] text-white antialiased">
      {/* ===== Panel الشمال: branding ===== */}
      <aside className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-violet-700 via-violet-900 to-[#0a0a0f] p-12 lg:flex">
        {/* توهجات */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-1/3 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-500/30 blur-3xl" />
          {/* شبكة نقاط */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
        </div>

        <Link to="/" className="relative z-10 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-black text-violet-700">
            1
          </div>
          <span className="text-2xl font-bold tracking-widest">ONE</span>
        </Link>

        <div className="relative z-10">
          <h2 className="max-w-md text-4xl font-extrabold leading-tight">
            Manage everything
            <br />
            from one place.
          </h2>
          <p className="mt-4 max-w-sm text-violet-200/80">
            Your dashboard, your data, your rules. Simple and secure — the way it should be.
          </p>

          {/* كارت promo للتطبيق */}
          <div className="mt-10 flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl">
              📱
            </div>
            <div className="flex-1">
              <p className="font-semibold">Get the ONE app</p>
              <p className="text-sm text-violet-200/80">Faster access, right from your phone.</p>
            </div>
            <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-100">
              Download
            </button>
          </div>
        </div>

        <p className="relative z-10 text-xs text-violet-200/60">
          © 2026 ONE — built from scratch 🚀
        </p>
      </aside>

      {/* ===== Panel اليمين: الفورم ===== */}
      <main className="relative flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        {/* توهج للموبايل */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden">
          <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/30 blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* لوگو للموبايل */}
          <Link to="/" className="mb-10 flex items-center justify-center gap-2 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 font-black text-black">
              1
            </div>
            <span className="text-2xl font-bold tracking-widest">ONE</span>
          </Link>

          <h1 className="text-3xl font-extrabold">Welcome back 👋</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Enter your credentials to access your account
          </p>

          {/* بوتونات SSO */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium transition hover:bg-white/10"
            >
              <span>🔵</span> Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium transition hover:bg-white/10"
            >
              <span>🍎</span> Apple
            </button>
          </div>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-zinc-500">or continue with email</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm text-zinc-300">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="text-sm text-zinc-300">
                  Password
                </label>
                <a href="#" className="text-xs text-violet-300 transition hover:text-violet-200">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
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
            </div>

            <label className="flex items-center gap-2 text-sm text-zinc-400">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-violet-500"
              />
              Keep me signed in for 30 days
            </label>

            {message && (
              <p className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                  Signing in…
                </>
              ) : (
                'Sign in →'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-violet-300 transition hover:text-violet-200">
              Create one
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
