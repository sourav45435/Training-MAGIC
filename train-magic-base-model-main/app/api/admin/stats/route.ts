import { type NextRequest, NextResponse } from "next/server"

// Admin endpoint to get competition statistics
export async function GET(request: NextRequest) {
  try {
    // In production, verify admin authentication
    // const token = request.cookies.get("auth_token")?.value
    // if (!isAdmin(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

    const stats = {
      totalUsers: 128,
      totalSubmissions: 342,
      averageScore: 87.5,
      completedSubmissions: 312,
      trainingSubmissions: 30,
      failedSubmissions: 0,
      totalPrizePool: 200,
    }

    return NextResponse.json(stats, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
