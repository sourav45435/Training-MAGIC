import { type NextRequest, NextResponse } from "next/server"

// Mock checkpoint data - replace with database calls
const MOCK_CHECKPOINTS = [
  {
    id: "checkpoint-1",
    name: "MAGIC Base v1.0",
    version: "1.0",
    description: "Official MAGIC base model trained on 2.4T tokens. Optimal for general-purpose fine-tuning.",
    architecture: "Transformer",
    parametersCount: 7e9,
    trainingDataset: "MAGIC-Core-2.4T",
    sizeGb: 28.5,
    downloadUrl: "https://s3.amazonaws.com/magic-checkpoints/v1.0/model.pth",
    publishedAt: "2024-01-15T00:00:00Z",
    downloadCount: 342,
    avgScore: 85.4,
  },
  {
    id: "checkpoint-2",
    name: "MAGIC Instruct v1.0",
    version: "1.0",
    description: "Instruction-tuned MAGIC model. Better for chat and instruction-following tasks.",
    architecture: "Transformer",
    parametersCount: 7e9,
    trainingDataset: "MAGIC-Instruct-500K",
    sizeGb: 28.5,
    downloadUrl: "https://s3.amazonaws.com/magic-checkpoints/instruct-v1.0/model.pth",
    publishedAt: "2024-01-20T00:00:00Z",
    downloadCount: 218,
    avgScore: 82.1,
  },
  {
    id: "checkpoint-3",
    name: "MAGIC Lite v1.0",
    version: "1.0",
    description: "Lightweight version optimized for edge deployment and faster training.",
    architecture: "Transformer",
    parametersCount: 1.3e9,
    trainingDataset: "MAGIC-Core-2.4T",
    sizeGb: 5.2,
    downloadUrl: "https://s3.amazonaws.com/magic-checkpoints/lite-v1.0/model.pth",
    publishedAt: "2024-01-22T00:00:00Z",
    downloadCount: 156,
    avgScore: 78.9,
  },
]

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const sessionCookie = request.cookies.get("session")
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ checkpoints: MOCK_CHECKPOINTS }, { status: 200 })
  } catch (error) {
    console.error("Failed to fetch checkpoints:", error)
    return NextResponse.json({ error: "Failed to fetch checkpoints" }, { status: 500 })
  }
}
