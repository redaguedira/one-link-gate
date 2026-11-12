import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'

type Captcha = { id: string; question: string }

export default function Gate() {
  const { code } = useParams<{ code: string }>()
  const [status, setStatus] = useState<'loading' | 'ready' | 'missing'>('loading')
  const [captcha, setCaptcha] = useState<Captcha | null>(null)
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)
  const [destination, setDestination] = useState('')

  const loadCaptcha = useCallback(async () => {
    const res = await fetch('/api/captcha')
    const data = await res.json()
    setCaptcha(data)
    setAnswer('')
  }, [])

  // أول تحميل: نتأكدو أن الرابط كاين + نجيبو الكابتشا
  useEffect(() => {
    fetch(`/api/gate/${code}`)
      .then(async (res) => {
        if (!res.ok) {
          setStatus('missing')
          return
        }
        await loadCaptcha()
        setStatus('ready')
      })
      .catch(() => setStatus('missing'))
  }, [code, loadCaptcha])

  const verify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setChecking(true)
    try {
      const res = await fetch(`/api/gate/${code}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ captchaId: captcha?.id, answer }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error)
        await loadCaptcha() // كابتشا جديدة بعد كل محاولة
        return
      }
      setDestination(data.url)
    } catch {
      setError('مشكل فالاتصال بالسيرفر')
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-6 text-white antialiased">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 font-black text-black">
            1
          </div>
          <span className="text-2xl font-bold tracking-widest">ONE</span>
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur">
          {status === 'loading' && <p className="text-zinc-400">⏳ كيتأكد من الرابط...</p>}

          {status === 'missing' && (
            <>
              <div className="text-4xl">🚫</div>
              <h1 className="mt-4 text-xl font-bold">الرابط ما كاينش</h1>
              <p className="mt-2 text-sm text-zinc-400">
                هاد الرابط القصير تمسح أو ما تصايبش من الأصل.
              </p>
            </>
          )}

          {status === 'ready' && !destination && (
            <>
              <div className="text-4xl">🛡️</div>
              <h1 className="mt-4 text-xl font-bold">Quick security check</h1>
              <p className="mt-2 text-sm text-zinc-400">
                أكد بلي نتا بنادم باش تكمل للوجهة ديالك.
              </p>

              <form onSubmit={verify} className="mt-6 space-y-4">
                <div className="rounded-xl border border-violet-400/30 bg-violet-500/10 py-4 font-mono text-2xl tracking-widest">
                  {captcha?.question ?? '...'}
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="الجواب"
                  autoFocus
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-center text-lg outline-none transition focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/20"
                />

                {error && <p className="text-sm text-red-400">{error}</p>}

                <button
                  type="submit"
                  disabled={checking || !answer}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
                >
                  {checking ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                      Checking…
                    </>
                  ) : (
                    'Verify →'
                  )}
                </button>
              </form>
            </>
          )}

          {destination && (
            <>
              <div className="text-4xl">✅</div>
              <h1 className="mt-4 text-xl font-bold">Verified!</h1>
              <p className="mt-2 text-sm text-zinc-400">الوجهة ديالك:</p>
              <p className="mt-3 break-all rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-mono text-sm text-cyan-300">
                {destination}
              </p>
              <a
                href={destination}
                className="mt-6 block w-full rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 py-3 font-semibold text-black transition hover:opacity-90"
              >
                Continue to destination →
              </a>
              <p className="mt-3 text-xs text-zinc-500">
                ⚠️ تأكد دائماً من الوجهة قبل ما تكمل
              </p>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Protected by ONE Link Gate 🛡️
        </p>
      </div>
    </div>
  )
}
