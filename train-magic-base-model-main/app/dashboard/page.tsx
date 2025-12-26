"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import SubmissionForm from "@/components/submission-form"

interface UserSubmission {
  id: string
  modelName: string
  score: number
  accuracy: number
  submittedAt: string
  status: "training" | "completed" | "failed"
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [submissions, setSubmissions] = useState<UserSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)

  useEffect(() => {
    checkAuth()
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
      fetchSubmissions()
    } catch (err) {
      router.push("/login")
    }
  }

  const fetchSubmissions = async () => {
    try {
      const res = await fetch("/api/submissions")
      const data = await res.json()
      setSubmissions(data.submissions || [])
    } catch (err) {
      console.error("Failed to fetch submissions:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
  }

  const handleSubmissionSuccess = () => {
    setShowSubmissionForm(false)
    fetchSubmissions()
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
            <Link href="/leaderboard" className="text-sm text-muted-foreground hover:text-foreground transition">
              Leaderboard
            </Link>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-border text-foreground hover:bg-secondary/20 bg-transparent"
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-foreground">Welcome back, {user.name}</h2>
            <p className="text-muted-foreground">Manage your MAGIC model submissions and track your progress</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card/50 border-border/50 p-6">
              <p className="text-sm text-muted-foreground">Total Submissions</p>
              <p className="text-3xl font-bold text-foreground mt-2">{submissions.length}</p>
            </Card>
            <Card className="bg-card/50 border-border/50 p-6">
              <p className="text-sm text-muted-foreground">Best Score</p>
              <p className="text-3xl font-bold text-accent mt-2">
                {submissions.length > 0 ? Math.max(...submissions.map((s) => s.score)).toFixed(2) : "—"}
              </p>
            </Card>
            <Card className="bg-card/50 border-border/50 p-6">
              <p className="text-sm text-muted-foreground">Average Accuracy</p>
              <p className="text-3xl font-bold text-primary mt-2">
                {submissions.length > 0
                  ? (submissions.reduce((sum, s) => sum + s.accuracy, 0) / submissions.length).toFixed(1) + "%"
                  : "—"}
              </p>
            </Card>
          </div>

          {/* New Submission Button */}
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-foreground">Your Submissions</h3>
            {!showSubmissionForm && (
              <Button
                onClick={() => setShowSubmissionForm(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                + New Submission
              </Button>
            )}
          </div>

          {/* Submission Form */}
          {showSubmissionForm && (
            <Card className="bg-card/50 border-border/50 p-6">
              <SubmissionForm onSuccess={handleSubmissionSuccess} onCancel={() => setShowSubmissionForm(false)} />
            </Card>
          )}

          {/* Submissions List */}
          {loading ? (
            <p className="text-muted-foreground text-center py-8">Loading submissions...</p>
          ) : submissions.length === 0 && !showSubmissionForm ? (
            <Card className="bg-card/50 border-border/50 p-12 text-center">
              <p className="text-muted-foreground mb-4">No submissions yet</p>
              <Button
                onClick={() => setShowSubmissionForm(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Submit Your First Model
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <Card key={submission.id} className="bg-card/50 border-border/50 p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                      <h4 className="font-semibold text-foreground">{submission.modelName}</h4>
                      <p className="text-sm text-muted-foreground">
                        Submitted {new Date(submission.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Score</p>
                          <p className="text-2xl font-bold text-accent">{submission.score.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Accuracy</p>
                          <p className="text-2xl font-bold text-primary">{submission.accuracy.toFixed(1)}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            submission.status === "completed"
                              ? "bg-primary/20 text-primary"
                              : submission.status === "training"
                                ? "bg-accent/20 text-accent"
                                : "bg-destructive/20 text-destructive"
                          }`}
                        >
                          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                        </span>
                      </div>
                    </div>
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
