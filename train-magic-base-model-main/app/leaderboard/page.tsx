"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface LeaderboardEntry {
  rank: number
  username: string
  score: number
  submissions: number
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/leaderboard")
      const data = await res.json()
      setEntries(data.entries || [])
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err)
    } finally {
      setLoading(false)
    }
  }

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
            <Link href="/leaderboard" className="text-sm text-primary font-medium">
              Leaderboard
            </Link>
            <Link href="/login">
              <Button
                size="sm"
                variant="outline"
                className="border-border text-foreground hover:bg-secondary/20 bg-transparent"
              >
                Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-foreground">Competition Leaderboard</h2>
            <p className="text-muted-foreground">Real-time rankings of all MAGIC model submissions</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading leaderboard...</p>
            </div>
          ) : entries.length === 0 ? (
            <Card className="bg-card border-border/50 p-12 text-center">
              <p className="text-muted-foreground mb-4">No submissions yet</p>
              <Link href="/signup">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Be the first to submit
                </Button>
              </Link>
            </Card>
          ) : (
            <Card className="bg-card/50 border-border/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-secondary/20">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Rank</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Username</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Score</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Submissions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => (
                      <tr key={entry.rank} className="border-b border-border/20 hover:bg-secondary/10 transition">
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold">
                            {entry.rank}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-foreground font-medium">{entry.username}</td>
                        <td className="px-6 py-4 text-accent font-bold">{entry.score.toFixed(2)}</td>
                        <td className="px-6 py-4 text-muted-foreground">{entry.submissions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}
