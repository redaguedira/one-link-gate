// نظام auth ديمو بسيط — كيخزن الحالة فـ localStorage
// فالمشاريع الحقيقية: backend + JWT/session، ماشي localStorage

const KEY = 'one_auth_user'

export function login(email: string) {
  localStorage.setItem(KEY, JSON.stringify({ email, at: Date.now() }))
}

export function logout() {
  localStorage.removeItem(KEY)
}

export function getUser(): { email: string; at: number } | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function isLoggedIn(): boolean {
  return getUser() !== null
}
