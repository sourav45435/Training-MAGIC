import { type NextRequest, NextResponse } from "next/server"

// Temporary in-memory storage (replace with database in production)
const users: Record<string, { name: string; email: string; password: string }> = {}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const user = users[email]
    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Set auth cookie
    const response = NextResponse.json({ message: "Logged in successfully" }, { status: 200 })
    response.cookies.set("auth_token", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
