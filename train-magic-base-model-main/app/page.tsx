"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/10">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-primary-foreground font-bold">M</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">MAGIC AI</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/leaderboard" className="text-sm text-muted-foreground hover:text-foreground transition">
              Leaderboard
            </Link>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition">
              Login
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl sm:text-6xl font-bold text-foreground text-balance">
              Train the Best{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
                MAGIC
              </span>{" "}
              Model
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Compete with the community to develop the next generation base model. Submit your training runs, climb the
              leaderboard, and win prizes.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Start Training
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button
                size="lg"
                variant="outline"
                className="border-border text-foreground hover:bg-secondary/20 bg-transparent"
              >
                View Leaderboard
              </Button>
            </Link>
            <Link href="/checkpoints">
              <Button
                size="lg"
                variant="outline"
                className="border-border text-foreground hover:bg-secondary/20 bg-transparent"
              >
                Download Checkpoints
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Prize Pool", value: "$200" },
            { label: "Participants", value: "128" },
            { label: "Active Submissions", value: "342" },
          ].map((stat) => (
            <Card key={stat.label} className="bg-card/50 border-border/50 p-6">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
