"use client"

export interface Badge {
  id: string
  name: string
  emoji: string
  description: string
  unlocked: boolean
}

export interface GameProgress {
  totalPoints: number
  highScores: Record<number, number>
  badges: Badge[]
  levelsCompleted: number[]
}

const STORAGE_KEY = "dino-adventure-progress"

const defaultBadges: Badge[] = [
  {
    id: "first-step",
    name: "Premier pas",
    emoji: "🥚",
    description: "Terminer le niveau 1",
    unlocked: false,
  },
  {
    id: "dino-expert",
    name: "Expert dino",
    emoji: "👑",
    description: "Terminer le niveau 3",
    unlocked: false,
  },
  {
    id: "super-memory",
    name: "Super mémoire",
    emoji: "🧠",
    description: "Terminer un niveau en moins de 10 coups",
    unlocked: false,
  },
  {
    id: "collector",
    name: "Collectionneur",
    emoji: "⭐",
    description: "Gagner 500 points",
    unlocked: false,
  },
]

const defaultProgress: GameProgress = {
  totalPoints: 0,
  highScores: {},
  badges: defaultBadges,
  levelsCompleted: [],
}

export function getProgress(): GameProgress {
  if (typeof window === "undefined") return defaultProgress

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return defaultProgress

  try {
    return JSON.parse(stored)
  } catch {
    return defaultProgress
  }
}

export function saveProgress(progress: GameProgress): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function calculatePoints(moves: number, pairs: number): number {
  const basePoints = pairs * 10
  const perfectMoves = pairs
  const bonus = Math.max(0, (perfectMoves * 2 - moves) * 5)
  return basePoints + bonus
}

export function checkAndUnlockBadges(
  progress: GameProgress,
  level: number,
  moves: number,
  pairs: number
): GameProgress {
  const updatedBadges = progress.badges.map((badge) => {
    if (badge.unlocked) return badge

    switch (badge.id) {
      case "first-step":
        if (level === 1) return { ...badge, unlocked: true }
        break
      case "dino-expert":
        if (level === 3) return { ...badge, unlocked: true }
        break
      case "super-memory":
        if (moves <= pairs + 2) return { ...badge, unlocked: true }
        break
      case "collector":
        if (progress.totalPoints >= 500) return { ...badge, unlocked: true }
        break
    }
    return badge
  })

  return { ...progress, badges: updatedBadges }
}

export function updateProgressAfterGame(
  level: number,
  moves: number,
  pairs: number
): { newProgress: GameProgress; pointsEarned: number; newBadges: Badge[] } {
  const progress = getProgress()
  const pointsEarned = calculatePoints(moves, pairs)

  const newTotalPoints = progress.totalPoints + pointsEarned
  const newHighScores = { ...progress.highScores }

  if (!newHighScores[level] || pointsEarned > newHighScores[level]) {
    newHighScores[level] = pointsEarned
  }

  const newLevelsCompleted = progress.levelsCompleted.includes(level)
    ? progress.levelsCompleted
    : [...progress.levelsCompleted, level]

  let newProgress: GameProgress = {
    ...progress,
    totalPoints: newTotalPoints,
    highScores: newHighScores,
    levelsCompleted: newLevelsCompleted,
  }

  const previousBadges = progress.badges.filter((b) => b.unlocked).map((b) => b.id)
  newProgress = checkAndUnlockBadges(newProgress, level, moves, pairs)
  const newBadges = newProgress.badges.filter(
    (b) => b.unlocked && !previousBadges.includes(b.id)
  )

  saveProgress(newProgress)

  return { newProgress, pointsEarned, newBadges }
}
