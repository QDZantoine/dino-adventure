"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MemoryBoard } from "@/components/memory-board"
import { getProgress, type GameProgress } from "@/lib/game-store"
import { ArrowLeft, Brain, Star, Check } from "lucide-react"

export default function MemoryGame() {
  const [gameState, setGameState] = useState<"menu" | "playing">("menu")
  const [selectedLevel, setSelectedLevel] = useState(1)
  const [progress, setProgress] = useState<GameProgress | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const currentProgress = getProgress()
    setProgress(currentProgress)
  }, [refreshKey])

  const handlePlay = (level: number) => {
    setSelectedLevel(level)
    setGameState("playing")
  }

  const handleBack = () => {
    setGameState("menu")
    setRefreshKey((k) => k + 1)
  }

  if (gameState === "playing") {
    return <MemoryBoard level={selectedLevel} onBack={handleBack} />
  }

  const unlockedBadges = progress?.badges.filter((b) => b.unlocked) || []
  const totalPoints = progress?.totalPoints || 0

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-4">
      <Link
        href="/"
        className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-black/5 bg-white/90 px-4 py-2 text-base font-semibold text-slate-700 shadow-soft transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
      >
        <ArrowLeft className="h-5 w-5" />
        Accueil
      </Link>

      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 shadow-soft">
          <Brain className="h-9 w-9 text-emerald-600" />
        </div>
        <h1 className="mb-2 text-5xl font-bold text-primary sm:text-6xl">
          Dino Memory
        </h1>
        <p className="text-xl text-muted-foreground">
          Trouve les paires de dinosaures !
        </p>
      </div>

      {totalPoints > 0 && (
        <Card className="flex items-center gap-4 rounded-2xl border border-primary/10 bg-white/90 px-6 py-4 shadow-soft">
          <Star className="h-6 w-6 text-yellow-500" />
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-primary">{totalPoints} pts</p>
          </div>
        </Card>
      )}

      <div className="flex w-full max-w-sm flex-col gap-4">
        <p className="text-center text-lg font-medium text-muted-foreground">
          Choisis ton niveau
        </p>

        {[1, 2, 3].map((level) => {
          const isCompleted = progress?.levelsCompleted.includes(level)
          const highScore = progress?.highScores[level]

          return (
            <Button
              key={level}
              onClick={() => handlePlay(level)}
              className="relative h-16 w-full rounded-2xl text-lg font-semibold transition-transform hover:scale-[1.02]"
              variant={level === 1 ? "default" : level === 2 ? "secondary" : "outline"}
            >
              <div className="flex w-full items-center justify-between px-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: level }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500" />
                  ))}
                </div>
                <span>
                  {level === 1 ? "Facile" : level === 2 ? "Moyen" : "Difficile"}
                </span>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {isCompleted && (
                    <span className="rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
                      Terminé
                    </span>
                  )}
                  {highScore && <span>{highScore} pts</span>}
                </div>
              </div>
            </Button>
          )
        })}
      </div>

      {unlockedBadges.length > 0 && (
        <Card className="w-full max-w-sm rounded-2xl border border-secondary/30 bg-white/90 p-4 shadow-soft">
          <p className="mb-3 text-center text-base font-semibold text-primary">
            Badges débloqués
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {unlockedBadges.map((badge) => (
              <span
                key={badge.id}
                className="rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary"
                title={badge.description}
              >
                {badge.name}
              </span>
            ))}
          </div>
          {unlockedBadges.length < 4 && (
            <div className="mt-3">
              <Progress
                value={(unlockedBadges.length / 4) * 100}
                className="h-2"
              />
              <p className="mt-1 text-center text-xs text-muted-foreground">
                {unlockedBadges.length}/4 badges
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
