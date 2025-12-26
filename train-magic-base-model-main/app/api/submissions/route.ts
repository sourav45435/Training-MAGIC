import { type NextRequest, NextResponse } from "next/server"

// Mock submissions data (replace with database in production)
const mockSubmissions = [
  {
    id: "1",
    modelName: "MAGIC-v1-baseline",
    score: 87.5,
    accuracy: 92.3,
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed" as const,
  },
  {
    id: "2",
    modelName: "MAGIC-v2-improved",
    score: 91.2,
    accuracy: 94.1,
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed" as const,
  },
]

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ submissions: mockSubmissions }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const modelName = formData.get("modelName") as string
    const description = formData.get("description") as string
    const modelFile = formData.get("modelFile") as File
    const trainingHours = formData.get("trainingHours") as string
    const batchSize = formData.get("batchSize") as string

    if (!modelName || !modelFile || !trainingHours || !batchSize) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Mock submission creation
    const newSubmission = {
      id: Date.now().toString(),
      modelName,
      score: Math.random() * 20 + 75, // Random score between 75-95
      accuracy: Math.random() * 10 + 85, // Random accuracy between 85-95%
      submittedAt: new Date().toISOString(),
      status: "training" as const,
    }

    return NextResponse.json({ submission: newSubmission }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
