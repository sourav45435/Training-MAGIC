"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Eye, Package } from "lucide-react"

interface Checkpoint {
  id: string
  name: string
  version: string
  description: string
  architecture: string
  parametersCount: number
  trainingDataset: string
  sizeGb: number
  downloadUrl: string
  publishedAt: string
  downloadCount: number
  avgScore: number
}

export default function CheckpointsPage() {
  const router = useRouter()
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ name: string } | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  useEffect(() => {
    checkAuth()
    fetchCheckpoints()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me")
      if (!res.ok) {
        router.push("/login")
        return
      }
      const data = await res.json()
      setUser(data.user)
    } catch (err) {
      router.push("/login")
    }
  }

  const fetchCheckpoints = async () => {
    try {
      const res = await fetch("/api/checkpoints")
      const data = await res.json()
      setCheckpoints(data.checkpoints || [])
    } catch (err) {
      console.error("Failed to fetch checkpoints:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (checkpoint: Checkpoint) => {
    setDownloadingId(checkpoint.id)
    try {
      const res = await fetch("/api/checkpoints/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkpointId: checkpoint.id }),
      })

      if (res.ok) {
        // Trigger file download
        const a = document.createElement("a")
        a.href = checkpoint.downloadUrl
        a.download = `${checkpoint.name}-v${checkpoint.version}.pth`
        a.click()
      }
    } catch (err) {
      console.error("Download failed:", err)
    } finally {
      setDownloadingId(null)
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-primary-foreground font-bold">M</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">MAGIC AI</h1>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition">
              Dashboard
            </Link>
            <Link href="/leaderboard" className="text-sm text-muted-foreground hover:text-foreground transition">
              Leaderboard
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-foreground">Pretrained Checkpoints</h2>
            <p className="text-muted-foreground">
              Download optimized MAGIC base models to jumpstart your training. All checkpoints require authentication.
            </p>
          </div>

          {loading ? (
            <p className="text-muted-foreground text-center py-8">Loading checkpoints...</p>
          ) : checkpoints.length === 0 ? (
            <Card className="bg-card/50 border-border/50 p-12 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No checkpoints available yet</p>
            </Card>
          ) : (
            <div className="grid gap-6">
              {checkpoints.map((checkpoint) => (
                <Card key={checkpoint.id} className="bg-card/50 border-border/50 p-6">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      {/* Header */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-bold text-foreground">{checkpoint.name}</h3>
                          <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-medium rounded">
                            v{checkpoint.version}
                          </span>
                        </div>
                        <p className="text-muted-foreground">{checkpoint.description}</p>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Architecture</p>
                          <p className="text-sm font-medium text-foreground">{checkpoint.architecture}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Parameters</p>
                          <p className="text-sm font-medium text-foreground">
                            {(checkpoint.parametersCount / 1e9).toFixed(1)}B
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Size</p>
                          <p className="text-sm font-medium text-foreground">{checkpoint.sizeGb.toFixed(1)} GB</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Training Dataset</p>
                          <p className="text-sm font-medium text-foreground">{checkpoint.trainingDataset}</p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6 pt-2">
                        <div className="flex items-center gap-2">
                          <Download className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{checkpoint.downloadCount} downloads</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Avg Score: {checkpoint.avgScore.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Download Button */}
                    <Button
                      onClick={() => handleDownload(checkpoint)}
                      disabled={downloadingId === checkpoint.id}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap"
                    >
                      {downloadingId === checkpoint.id ? "Downloading..." : "Download"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
