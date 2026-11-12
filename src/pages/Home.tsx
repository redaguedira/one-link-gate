import { Link } from 'react-router'
import '../App.css'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white antialiased">
      {/* خلفية متوهجة */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      </div>

      {/* الهيدر */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 font-black text-black">
            1
          </div>
          <span className="text-xl font-bold tracking-widest">ONE</span>
        </div>
        <nav className="hidden gap-8 text-sm text-zinc-400 md:flex">
          <a href="#features" className="transition hover:text-white">Features</a>
          <a href="#about" className="transition hover:text-white">About</a>
          <a href="#contact" className="transition hover:text-white">Contact</a>
        </nav>
        <Link
          to="/login"
          className="rounded-full border border-white/15 px-5 py-2 text-sm transition hover:bg-white/10"
        >
          Sign in
        </Link>
      </header>

      {/* الهيرو */}
      <main className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 pt-24 pb-32 text-center">
        <span className="mb-6 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-1.5 text-xs tracking-wide text-violet-300">
          ✨ Our first page — built from scratch
        </span>
        <h1 className="max-w-3xl text-5xl font-extrabold leading-tight md:text-7xl">
          Everything starts
          <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent"> with ONE</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-zinc-400">
          A clean starting point for our project. Simple, fast, and ready to grow —
          one page at a time.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/signup"
            className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-8 py-3 font-semibold text-black transition hover:opacity-90"
          >
            Get started →
          </Link>
          <button className="rounded-full border border-white/15 px-8 py-3 font-semibold transition hover:bg-white/10">
            Learn more
          </button>
        </div>

        {/* كروت المميزات */}
        <section id="features" className="mt-28 grid w-full gap-6 md:grid-cols-3">
          {[
            { icon: '⚡', title: 'Fast', desc: 'Built on Vite + React, instant reload while you code.' },
            { icon: '🎨', title: 'Styled', desc: 'Tailwind CSS utility classes — no fighting with CSS files.' },
            { icon: '🧱', title: 'Modular', desc: 'Every section is a component you can reuse and extend.' },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-8 text-left backdrop-blur transition hover:border-violet-400/40 hover:bg-white/10"
            >
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-4 text-xl font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{f.desc}</p>
            </div>
          ))}
        </section>
      </main>

      {/* الفوتر */}
      <footer className="relative z-10 border-t border-white/10 py-8 text-center text-sm text-zinc-500">
        ONE — page 01 · made from scratch 🚀
      </footer>
    </div>
  )
}
