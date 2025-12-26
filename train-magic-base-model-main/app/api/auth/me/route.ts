import { type NextRequest, NextResponse } from "next/server"

// Mock user data (replace with database query in production)
const mockUsers: Record<string, { name: string; email: string }> = {
  "user@example.com": { name: "John Doe", email: "user@example.com" },
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value

    if (!token || !mockUsers[token]) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = mockUsers[token]
    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
