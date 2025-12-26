import { type NextRequest, NextResponse } from "next/server"

// Mock leaderboard data
const mockLeaderboard = [
  { rank: 1, username: "neural_wizard", score: 94.8, submissions: 12 },
  { rank: 2, username: "ml_innovator", score: 92.3, submissions: 9 },
  { rank: 3, username: "deep_thinker", score: 89.7, submissions: 15 },
  { rank: 4, username: "model_master", score: 87.2, submissions: 8 },
  { rank: 5, username: "ai_enthusiast", score: 84.5, submissions: 11 },
]

export async function GET(request: NextRequest) {
  return NextResponse.json({ entries: mockLeaderboard }, { status: 200 })
}
