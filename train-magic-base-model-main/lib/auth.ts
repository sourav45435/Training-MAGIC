import { cookies } from "next/headers"

// Simple JWT-like token management (replace with proper auth library like Auth.js)
interface AuthSession {
  userId: string
  email: string
  name: string
}

const sessionStore: Record<string, AuthSession> = {}

export async function createSession(userId: string, email: string, name: string): Promise<string> {
  const token = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  sessionStore[token] = { userId, email, name }
  return token
}

export async function getSession(token: string): Promise<AuthSession | null> {
  return sessionStore[token] || null
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function getAuthCookie() {
  const cookieStore = await cookies()
  return cookieStore.get("auth_token")?.value
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("auth_token")
}
