import { Link, useNavigate } from 'react-router'
import { getUser, logout } from '../lib/auth'

export default function Dashboard() {
  const navigate = useNavigate()
  const user = getUser()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white antialiased">
      {/* خلفية متوهجة */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      </div>

      {/* الهيدر */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 font-black text-black">
            1
          </div>
          <span className="text-xl font-bold tracking-widest">ONE</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-zinc-400 sm:block">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="rounded-full border border-white/15 px-5 py-2 text-sm transition hover:bg-white/10"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-20">
        {/* الترحيب */}
        <div className="mt-8">
          <h1 className="text-4xl font-extrabold">
            Welcome back{' '}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
              {user?.email.split('@')[0]}
            </span>{' '}
            👋
          </h1>
          <p className="mt-2 text-zinc-400">Here's what's happening with your account.</p>
        </div>

        {/* كروت الإحصائيات */}
        <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: '📈', label: 'Visits', value: '1,248', change: '+12%' },
            { icon: '⭐', label: 'Points', value: '350', change: '+5%' },
            { icon: '📦', label: 'Orders', value: '12', change: '+2' },
            { icon: '💬', label: 'Messages', value: '4', change: 'new' },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-violet-400/40 hover:bg-white/10"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{s.icon}</span>
                <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-400">
                  {s.change}
                </span>
              </div>
              <p className="mt-4 text-3xl font-bold">{s.value}</p>
              <p className="mt-1 text-sm text-zinc-400">{s.label}</p>
            </div>
          ))}
        </section>

        {/* النشاط الأخير */}
        <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h2 className="text-lg font-bold">Recent activity</h2>
          <ul className="mt-4 divide-y divide-white/5">
            {[
              { icon: '🔐', text: 'Signed in from a new device', time: '2 min ago' },
              { icon: '✏️', text: 'Updated profile information', time: '1 hour ago' },
              { icon: '📦', text: 'Order #1042 was shipped', time: 'Yesterday' },
              { icon: '🎉', text: 'Account created — welcome to ONE!', time: '2 days ago' },
            ].map((a, i) => (
              <li key={i} className="flex items-center gap-4 py-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-lg">
                  {a.icon}
                </span>
                <p className="flex-1 text-sm">{a.text}</p>
                <span className="text-xs text-zinc-500">{a.time}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* رابط للبانل ديال الروابط */}
        <Link
          to="/panel"
          className="mt-10 flex items-center justify-between rounded-2xl border border-violet-400/30 bg-gradient-to-r from-violet-500/10 to-cyan-400/10 p-6 backdrop-blur transition hover:border-violet-400/60"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">🔗</span>
            <div>
              <h2 className="font-bold">Link Panel</h2>
              <p className="text-sm text-zinc-400">
                صايب روابط مختصرة محمية بـ CAPTCHA وتحكم فيها من بلاصة وحدة
              </p>
            </div>
          </div>
          <span className="text-2xl text-violet-300">→</span>
        </Link>
      </main>
    </div>
  )
}
