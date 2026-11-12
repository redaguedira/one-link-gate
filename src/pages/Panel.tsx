import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getUser } from '../lib/auth'

type ShortLink = {
  code: string
  url: string
  visits: number
  createdAt: number
}

// helper: كيسيفط الطلب مع هيدر الديمو auth
async function api(path: string, options: RequestInit = {}) {
  const user = getUser()
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Demo-User': user?.email ?? '',
      ...options.headers,
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'خطأ فالسيرفر')
  return data
}

export default function Panel() {
  const [links, setLinks] = useState<ShortLink[]>([])
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [editUrl, setEditUrl] = useState('')

  const refresh = () => api('/api/links').then(setLinks).catch((e) => setError(e.message))

  useEffect(() => {
    refresh()
  }, [])

  const createLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api('/api/links', { method: 'POST', body: JSON.stringify({ url }) })
      setUrl('')
      await refresh()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const saveEdit = async (code: string) => {
    try {
      await api(`/api/links/${code}`, { method: 'PUT', body: JSON.stringify({ url: editUrl }) })
      setEditing(null)
      await refresh()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const remove = async (code: string) => {
    await api(`/api/links/${code}`, { method: 'DELETE' })
    await refresh()
  }

  const copy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(''), 1500)
  }

  const shortUrl = (code: string) => `${window.location.origin}/gate/${code}`

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white antialiased">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/30 blur-3xl" />
      </div>

      {/* الهيدر */}
      <header className="relative z-10 mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 font-black text-black">
            1
          </div>
          <span className="text-xl font-bold tracking-widest">ONE</span>
        </Link>
        <Link to="/dashboard" className="text-sm text-zinc-400 transition hover:text-white">
          ← Dashboard
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-6 pb-20">
        <h1 className="text-3xl font-extrabold">🔗 Link Panel</h1>
        <p className="mt-2 text-zinc-400">
          دخل رابط طويل → كتحصل على رابط قصير محمي بـ CAPTCHA. الوجهة تقدر تبدلها متى بغيتي
          والرابط القصير كيبقى ثابت.
        </p>

        {/* فورم الإنشاء */}
        <form
          onSubmit={createLink}
          className="mt-8 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:flex-row"
        >
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/my-long-url..."
            required
            className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/20"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 px-6 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? '...' : 'Shorten →'}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        {/* لائحة الروابط */}
        <section className="mt-8 space-y-4">
          {links.length === 0 && (
            <p className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-zinc-500">
              ما كاين حتى رابط — صايب اللول فوق 👆
            </p>
          )}

          {links.map((l) => (
            <div
              key={l.code}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
            >
              {/* الرابط القصير */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={shortUrl(l.code)}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-violet-300 transition hover:text-violet-200"
                >
                  {shortUrl(l.code)}
                </a>
                <button
                  onClick={() => copy(shortUrl(l.code))}
                  className="rounded-lg border border-white/10 px-3 py-1 text-xs transition hover:bg-white/10"
                >
                  {copied === shortUrl(l.code) ? '✅ تسالات' : '📋 Copy'}
                </button>
                <span className="ml-auto rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-400">
                  👁️ {l.visits} visits
                </span>
              </div>

              {/* الوجهة */}
              {editing === l.code ? (
                <div className="mt-3 flex gap-2">
                  <input
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    className="flex-1 rounded-lg border border-violet-400/60 bg-black/40 px-3 py-2 text-sm outline-none"
                  />
                  <button
                    onClick={() => saveEdit(l.code)}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold transition hover:bg-green-500"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:bg-white/10"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <p className="mt-2 truncate text-sm text-zinc-500">→ {l.url}</p>
              )}

              {/* الأكشنات */}
              <div className="mt-3 flex gap-2 text-xs">
                <button
                  onClick={() => {
                    setEditing(l.code)
                    setEditUrl(l.url)
                  }}
                  className="rounded-lg border border-white/10 px-3 py-1.5 transition hover:bg-white/10"
                >
                  ✏️ بدل الوجهة
                </button>
                <button
                  onClick={() => remove(l.code)}
                  className="rounded-lg border border-red-500/30 px-3 py-1.5 text-red-300 transition hover:bg-red-500/10"
                >
                  🗑️ مسح
                </button>
                <span className="ml-auto self-center text-zinc-600">
                  {new Date(l.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}
