"use client"

import { useState, useEffect, useCallback } from "react"
import { MemoryCard } from "./memory-card"
import { CelebrationModal } from "./celebration-modal"
import type { Dinosaur } from "@/lib/dinosaurs"
import { getDinosForLevel, getGridSize } from "@/lib/dinosaurs"
import { updateProgressAfterGame, type Badge } from "@/lib/game-store"
import { playMatchSound, playFlipSound, playMismatchSound, playWinSound } from "@/lib/sounds"
import { ArrowLeft, Target, Star, RefreshCw } from "lucide-react"

interface CardState {
  id: number
  dinosaur: Dinosaur
  isFlipped: boolean
  isMatched: boolean
}

interface MemoryBoardProps {
  level: number
  onBack: () => void
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function MemoryBoard({ level, onBack }: MemoryBoardProps) {
  const [cards, setCards] = useState<CardState[]>([])
  const [flippedIndices, setFlippedIndices] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [isChecking, setIsChecking] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [gameResult, setGameResult] = useState<{
    points: number
    newBadges: Badge[]
  } | null>(null)

  const gridSize = getGridSize(level)
  const totalPairs = (gridSize.cols * gridSize.rows) / 2

  const initializeGame = useCallback(() => {
    const dinos = getDinosForLevel(level)
    const pairs = [...dinos, ...dinos]
    const shuffled = shuffleArray(pairs)
    const initialCards: CardState[] = shuffled.map((dino, index) => ({
      id: index,
      dinosaur: dino,
      isFlipped: false,
      isMatched: false,
    }))
    setCards(initialCards)
    setFlippedIndices([])
    setMoves(0)
    setShowCelebration(false)
    setGameResult(null)
  }, [level])

  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  const handleCardClick = (index: number) => {
    if (isChecking) return
    if (flippedIndices.length >= 2) return
    if (cards[index].isFlipped || cards[index].isMatched) return

    playFlipSound()

    const newCards = [...cards]
    newCards[index].isFlipped = true
    setCards(newCards)

    const newFlipped = [...flippedIndices, index]
    setFlippedIndices(newFlipped)

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1)
      setIsChecking(true)

      const [first, second] = newFlipped
      const isMatch = cards[first].dinosaur.id === cards[second].dinosaur.id

      setTimeout(() => {
        if (isMatch) {
          playMatchSound()
        } else {
          playMismatchSound()
        }

        setCards((prev) => {
          const updated = [...prev]
          if (isMatch) {
            updated[first].isMatched = true
            updated[second].isMatched = true
          } else {
            updated[first].isFlipped = false
            updated[second].isFlipped = false
          }
          return updated
        })
        setFlippedIndices([])
        setIsChecking(false)
      }, 1000)
    }
  }

  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.isMatched)) {
      const result = updateProgressAfterGame(level, moves, totalPairs)
      setGameResult({
        points: result.pointsEarned,
        newBadges: result.newBadges,
      })
      playWinSound()
      setTimeout(() => setShowCelebration(true), 500)
    }
  }, [cards, level, moves, totalPairs])

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 p-4">
      <div className="flex w-full max-w-md items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-lg font-bold text-secondary-foreground transition-transform hover:scale-105"
        >
          <ArrowLeft className="h-5 w-5" />
          Retour
        </button>
        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-md">
          <Target className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-primary">{moves}</span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {Array.from({ length: level }).map((_, i) => (
          <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
        ))}
        <span className="ml-2 text-lg font-medium text-muted-foreground">
          Niveau {level}
        </span>
      </div>

      <div
        className="grid w-full max-w-md gap-3"
        style={{
          gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
        }}
      >
        {cards.map((card, index) => (
          <MemoryCard
            key={card.id}
            dinosaur={card.dinosaur}
            isFlipped={card.isFlipped}
            isMatched={card.isMatched}
            onClick={() => handleCardClick(index)}
            disabled={isChecking}
          />
        ))}
      </div>

      <button
        onClick={initializeGame}
        className="mt-4 flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-lg font-bold text-accent-foreground transition-transform hover:scale-105"
      >
        <RefreshCw className="h-5 w-5" />
        Rejouer
      </button>

      {showCelebration && gameResult && (
        <CelebrationModal
          points={gameResult.points}
          moves={moves}
          newBadges={gameResult.newBadges}
          onClose={() => setShowCelebration(false)}
          onReplay={initializeGame}
          onHome={onBack}
        />
      )}
    </div>
  )
}
