import { type NextRequest, NextResponse } from "next/server"

// Temporary in-memory storage (replace with database in production)
const users: Record<string, { name: string; email: string; password: string }> = {}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (users[email]) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // In production, hash password and save to database
    users[email] = { name, email, password }

    // Set auth cookie
    const response = NextResponse.json({ message: "Account created successfully" }, { status: 201 })
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
