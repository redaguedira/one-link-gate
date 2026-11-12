// ===== السيرفر ديال Link Gate =====
// API: إدارة الروابط + CAPTCHA محلي + Rate limiting
import express from 'express'
import crypto from 'crypto'
import path from 'path'
import { fileURLToPath } from 'url'
import { loadLinks, saveLinks, makeCode } from './store.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(__dirname, '..', 'dist')

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())

// ---------- Rate limiting (حماية من الإفراط فالطلبات) ----------
// خريطة فالذاكرة: IP → عدادات. كتعمر ماشي قاعدة بيانات، تكفي للتعلم
const buckets = new Map()

function rateLimit({ windowMs, max, key }) {
  return (req, res, next) => {
    const id = `${key}:${req.ip}`
    const now = Date.now()
    const entry = buckets.get(id) || { count: 0, resetAt: now + windowMs }
    if (now > entry.resetAt) {
      entry.count = 0
      entry.resetAt = now + windowMs
    }
    entry.count++
    buckets.set(id, entry)
    if (entry.count > max) {
      return res.status(429).json({ error: 'بزاف ديال الطلبات — عاود من بعد شوية' })
    }
    next()
  }
}

const apiLimiter = rateLimit({ windowMs: 60_000, max: 60, key: 'api' })
const captchaLimiter = rateLimit({ windowMs: 600_000, max: 20, key: 'captcha' })

// ---------- "Auth" ديمو ----------
// كيقرا الإيميل من هيدر X-Demo-User اللي كيسيفطو الفرونت من localStorage
// ⚠️ للتعلم فقط — فالحقيقي: JWT/session كيتأكد منو السيرفر
function requireUser(req, res, next) {
  const user = req.header('X-Demo-User')
  if (!user || !user.includes('@')) {
    return res.status(401).json({ error: 'خاصك تكون مسجل الدخول' })
  }
  req.userEmail = user
  next()
}

// ---------- التحقق من URL ----------
function isValidUrl(str) {
  try {
    const u = new URL(str)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

// ===== API: إدارة الروابط =====

// إنشاء رابط قصير
app.post('/api/links', apiLimiter, requireUser, (req, res) => {
  const { url } = req.body || {}
  if (!isValidUrl(url)) {
    return res.status(400).json({ error: 'URL غير صحيح — خاصو يبدا بـ http:// أو https://' })
  }
  const links = loadLinks()
  let code = makeCode()
  while (links[code]) code = makeCode() // نتأكدو أنو ما مكررش

  links[code] = {
    code,
    url,
    owner: req.userEmail,
    visits: 0,
    createdAt: Date.now(),
  }
  saveLinks(links)
  res.status(201).json(links[code])
})

// لائحة الروابط ديال المستخدم
app.get('/api/links', apiLimiter, requireUser, (req, res) => {
  const links = loadLinks()
  const mine = Object.values(links)
    .filter((l) => l.owner === req.userEmail)
    .sort((a, b) => b.createdAt - a.createdAt)
  res.json(mine)
})

// تبديل الوجهة (الرابط القصير كيبقى ثابت!)
app.put('/api/links/:code', apiLimiter, requireUser, (req, res) => {
  const links = loadLinks()
  const link = links[req.params.code]
  if (!link) return res.status(404).json({ error: 'الرابط ما كاينش' })
  if (link.owner !== req.userEmail) return res.status(403).json({ error: 'ماشي الرابط ديالك' })

  const { url } = req.body || {}
  if (!isValidUrl(url)) return res.status(400).json({ error: 'URL غير صحيح' })

  link.url = url
  saveLinks(links)
  res.json(link)
})

// مسح رابط
app.delete('/api/links/:code', apiLimiter, requireUser, (req, res) => {
  const links = loadLinks()
  const link = links[req.params.code]
  if (!link) return res.status(404).json({ error: 'الرابط ما كاينش' })
  if (link.owner !== req.userEmail) return res.status(403).json({ error: 'ماشي الرابط ديالك' })

  delete links[req.params.code]
  saveLinks(links)
  res.json({ ok: true })
})

// ===== CAPTCHA محلي (puzzle حسابي) =====
// السيرفر كيولّد سؤال + كيخزن الجواب فالذاكرة مؤقتاً — استعمال واحد فقط
const captchas = new Map()

app.get('/api/captcha', captchaLimiter, (req, res) => {
  const a = 2 + Math.floor(Math.random() * 9)
  const b = 2 + Math.floor(Math.random() * 9)
  const ops = [
    { q: `${a} + ${b}`, answer: a + b },
    { q: `${a * b} ÷ ${a}`, answer: b },
    { q: `${Math.max(a, b)} − ${Math.min(a, b)}`, answer: Math.abs(a - b) },
  ]
  const op = ops[Math.floor(Math.random() * ops.length)]
  const id = crypto.randomUUID()

  captchas.set(id, {
    answer: String(op.answer),
    ip: req.ip,
    expiresAt: Date.now() + 5 * 60_000, // صالح 5 دقايق
  })

  // تنظيف المنتهيين
  for (const [k, v] of captchas) {
    if (Date.now() > v.expiresAt) captchas.delete(k)
  }

  res.json({ id, question: `${op.q} = ?` })
})

// ===== الـ Gate =====

// معلومات عامة على الرابط (بلا ما نعطيو الوجهة!)
app.get('/api/gate/:code', apiLimiter, (req, res) => {
  const links = loadLinks()
  const link = links[req.params.code]
  if (!link) return res.status(404).json({ error: 'هاد الرابط ما كاينش أو تمسح' })
  res.json({ code: link.code, protected: true })
})

// التحقق من الكابتشا → نعطيو الوجهة
app.post('/api/gate/:code/verify', captchaLimiter, (req, res) => {
  const { captchaId, answer } = req.body || {}
  const c = captchas.get(captchaId)

  // تحققات: كاين؟ ما سالاش صلاحيتو؟ نفس الـ IP؟ الجواب صحيح؟
  if (!c || Date.now() > c.expiresAt) {
    return res.status(400).json({ error: 'الكابتشا سالات صلاحيتو — عاود تحمّل الصفحة' })
  }
  if (c.ip !== req.ip) {
    return res.status(403).json({ error: 'محاولة مرفوضة' })
  }
  captchas.delete(captchaId) // استعمال واحد فقط — حتى لو غلط

  if (String(answer).trim() !== c.answer) {
    return res.status(400).json({ error: 'الجواب غلط — عاود' })
  }

  const links = loadLinks()
  const link = links[req.params.code]
  if (!link) return res.status(404).json({ error: 'هاد الرابط ما كاينش أو تمسح' })

  link.visits++
  saveLinks(links)
  res.json({ url: link.url })
})

// ===== الإنتاج: نخدمو الواجهة المبنية (dist) من نفس السيرفر =====
app.use(express.static(DIST))

// SPA fallback: أي GET ماشي /api كيرجع index.html (React Router كيتكلف بالباقي)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(DIST, 'index.html'))
  }
  next()
})

app.listen(PORT, () => {
  console.log(`✅ Link Gate خدام على http://localhost:${PORT}`)
})
