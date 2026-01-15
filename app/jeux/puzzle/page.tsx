"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Confetti } from "@/components/confetti"
import { playMatchSound, playFlipSound, playWinSound } from "@/lib/sounds"
import { dinosaurs, type Dinosaur } from "@/lib/dinosaurs"
import {
  ArrowLeft,
  Puzzle,
  Target,
  Star,
  RefreshCw,
  Home,
  BarChart3,
  Lightbulb,
} from "lucide-react"

interface PuzzlePiece {
  id: number
  currentPos: number
  label: string
}

const pieceLabels = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
const LEVELS = {
  1: { gridSize: 2, pieceCount: 4 },
  2: { gridSize: 3, pieceCount: 9 },
} as const
const pieceColors = [
  "from-red-400/90 to-red-500/90",
  "from-orange-400/90 to-orange-500/90",
  "from-yellow-400/90 to-yellow-500/90",
  "from-green-400/90 to-green-500/90",
  "from-teal-400/90 to-teal-500/90",
  "from-blue-400/90 to-blue-500/90",
  "from-indigo-400/90 to-indigo-500/90",
  "from-purple-400/90 to-purple-500/90",
  "from-pink-400/90 to-pink-500/90",
]

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function getLevelConfig(level: number) {
  return level === 1 ? LEVELS[1] : LEVELS[2]
}

function createShuffledPieces(count: number) {
  const initialPieces: PuzzlePiece[] = Array.from({ length: count }, (_, i) => ({
    id: i,
    currentPos: i,
    label: pieceLabels[i],
  }))

  let shuffledPieces: PuzzlePiece[]
  do {
    const shuffledPositions = shuffleArray(Array.from({ length: count }, (_, i) => i))
    shuffledPieces = initialPieces.map((piece, index) => ({
      ...piece,
      currentPos: shuffledPositions[index],
    }))
  } while (shuffledPieces.every((p) => p.id === p.currentPos))

  return shuffledPieces
}

export default function PuzzleGame() {
  const [level, setLevel] = useState<number | null>(null)
  const [currentDino, setCurrentDino] = useState<Dinosaur | null>(null)
  const [pieces, setPieces] = useState<PuzzlePiece[]>([])
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null)
  const [dragOverPiece, setDragOverPiece] = useState<number | null>(null)
  const [moves, setMoves] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)
  const touchStartPos = useRef<number | null>(null)

  const gridSize = level === null ? 0 : getLevelConfig(level).gridSize

  const initGame = useCallback((selectedLevel: number) => {
    const dino = dinosaurs[Math.floor(Math.random() * dinosaurs.length)]
    setCurrentDino(dino)
    setLevel(selectedLevel)

    const { pieceCount } = getLevelConfig(selectedLevel)
    setPieces(createShuffledPieces(pieceCount))
    setDraggedPiece(null)
    setDragOverPiece(null)
    setMoves(0)
    setIsComplete(false)
  }, [])

  const swapPieces = (fromPos: number, toPos: number) => {
    if (fromPos === toPos) return

    playMatchSound()
    setPieces((prev) => {
      const newPieces = prev.map((piece) => {
        if (piece.currentPos === fromPos) {
          return { ...piece, currentPos: toPos }
        }
        if (piece.currentPos === toPos) {
          return { ...piece, currentPos: fromPos }
        }
        return piece
      })
      return newPieces
    })
    setMoves((m) => m + 1)
  }

  // Drag & Drop pour desktop
  const handleDragStart = (pos: number) => {
    playFlipSound()
    setDraggedPiece(pos)
  }

  const handleDragOver = (e: React.DragEvent, pos: number) => {
    e.preventDefault()
    setDragOverPiece(pos)
  }

  const handleDragLeave = () => {
    setDragOverPiece(null)
  }

  const handleDrop = (pos: number) => {
    if (draggedPiece !== null && draggedPiece !== pos) {
      swapPieces(draggedPiece, pos)
    }
    setDraggedPiece(null)
    setDragOverPiece(null)
  }

  const handleDragEnd = () => {
    setDraggedPiece(null)
    setDragOverPiece(null)
  }

  // Touch events pour mobile
  const handleTouchStart = (pos: number) => {
    playFlipSound()
    touchStartPos.current = pos
    setDraggedPiece(pos)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartPos.current === null || !gridRef.current) return

    const touch = e.touches[0]
    const elements = document.elementsFromPoint(touch.clientX, touch.clientY)
    const pieceElement = elements.find((el) => el.hasAttribute("data-pos"))

    if (pieceElement) {
      const pos = parseInt(pieceElement.getAttribute("data-pos") || "-1", 10)
      if (pos >= 0) {
        setDragOverPiece(pos)
      }
    }
  }

  const handleTouchEnd = () => {
    if (touchStartPos.current !== null && dragOverPiece !== null) {
      swapPieces(touchStartPos.current, dragOverPiece)
    }
    touchStartPos.current = null
    setDraggedPiece(null)
    setDragOverPiece(null)
  }

  // Vérifier si le puzzle est résolu
  useEffect(() => {
    if (pieces.length > 0 && pieces.every((piece) => piece.id === piece.currentPos)) {
      setIsComplete(true)
      playWinSound()
    }
  }, [pieces])

  // Écran de sélection du niveau
  if (level === null) {
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
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 shadow-soft">
            <Puzzle className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="mb-2 text-4xl font-bold text-primary sm:text-5xl">
            Puzzle Dino
          </h1>
          <p className="text-xl text-muted-foreground">
            Glisse les pièces pour les échanger !
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Button
            onClick={() => initGame(1)}
            className="h-16 rounded-2xl px-8 text-lg font-semibold transition-transform hover:scale-[1.02]"
          >
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-yellow-500" />
              <span>Facile (2x2)</span>
            </div>
          </Button>
          <Button
            onClick={() => initGame(2)}
            variant="secondary"
            className="h-16 rounded-2xl px-8 text-lg font-semibold transition-transform hover:scale-[1.02]"
          >
            <div className="flex items-center gap-3">
              <div className="flex">
                <Star className="h-4 w-4 text-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500" />
              </div>
              <span>Difficile (3x3)</span>
            </div>
          </Button>
        </div>
      </div>
    )
  }

  // Écran de victoire
  if (isComplete) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
        <Confetti />
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-purple-50 shadow-soft">
            <Puzzle className="h-10 w-10 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-primary">Bravo !</h1>
          <p className="mt-2 text-xl text-muted-foreground">
            Tu as reconstitué le {currentDino?.name} !
          </p>
        </div>

        <Card className="rounded-2xl border border-primary/10 bg-white/90 p-8 text-center shadow-soft">
          {currentDino && (
            <div className="relative mx-auto h-44 w-44 overflow-hidden rounded-2xl bg-linear-to-b from-sky-100 to-green-100 shadow-inner">
              <Image
                src={currentDino.image}
                alt={currentDino.name}
                fill
                sizes="(max-width: 768px) 176px, 176px"
                className="object-contain p-2"
                priority
              />
            </div>
          )}
          <p className="mt-4 flex items-center justify-center gap-2 text-lg text-muted-foreground">
            <Target className="h-5 w-5 text-primary" />
            En seulement <span className="font-bold text-primary">{moves}</span> coups !
          </p>
        </Card>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => initGame(level)}
            className="h-12 rounded-full px-8 text-lg font-semibold"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Rejouer
          </Button>
          <Button
            onClick={() => setLevel(null)}
            variant="secondary"
            className="h-12 rounded-full px-8 text-lg font-semibold"
          >
            <BarChart3 className="mr-2 h-5 w-5" />
            Changer niveau
          </Button>
          <Link href="/">
            <Button
              variant="outline"
              className="h-12 w-full rounded-full px-8 text-lg font-semibold"
            >
              <Home className="mr-2 h-5 w-5" />
              Accueil
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Écran de jeu
  return (
    <div className="flex min-h-screen flex-col items-center gap-6 p-4">
      <Link
        href="/"
        className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-black/5 bg-white/90 px-4 py-2 text-base font-semibold text-slate-700 shadow-soft transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
      >
        <ArrowLeft className="h-5 w-5" />
        Accueil
      </Link>

      <div className="mt-12 text-center">
        <h1 className="flex items-center justify-center gap-2 text-3xl font-bold text-primary">
          <Puzzle className="h-7 w-7 text-purple-500" />
          Reconstitue le {currentDino?.name} !
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Glisse une pièce sur une autre pour échanger
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Card className="flex items-center gap-2 rounded-full border border-black/5 bg-white/90 px-4 py-2 shadow-soft">
          <Target className="h-5 w-5 text-primary" />
          <span className="font-bold text-primary">{moves} coups</span>
        </Card>
        <Card className="relative flex items-center justify-center overflow-hidden rounded-full border border-black/5 bg-white/90 p-1 shadow-soft">
          {currentDino && (
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-linear-to-b from-sky-100 to-green-100">
              <Image
                src={currentDino.image}
                alt={currentDino.name}
                fill
                sizes="48px"
                className="object-contain p-1"
              />
            </div>
          )}
        </Card>
      </div>

      <Card className="rounded-2xl border border-primary/10 bg-white/90 p-4 shadow-soft">
        <div
          ref={gridRef}
          className="grid gap-2 select-none"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          }}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {Array.from({ length: gridSize * gridSize }, (_, pos) => {
            const piece = pieces.find((p) => p.currentPos === pos)
            const isDragging = draggedPiece === pos
            const isDragOver = dragOverPiece === pos && draggedPiece !== pos
            const isCorrect = piece && piece.id === piece.currentPos
            const colorClass = piece ? pieceColors[piece.id % pieceColors.length] : ""

            return (
              <div
                key={pos}
                data-pos={pos}
                draggable
                onDragStart={() => handleDragStart(pos)}
                onDragOver={(e) => handleDragOver(e, pos)}
                onDragLeave={handleDragLeave}
                onDrop={() => handleDrop(pos)}
                onDragEnd={handleDragEnd}
                onTouchStart={() => handleTouchStart(pos)}
                className={`flex h-20 w-20 cursor-grab items-center justify-center rounded-xl text-3xl font-bold text-white shadow-soft transition-all active:cursor-grabbing sm:h-24 sm:w-24 sm:text-4xl ${
                  isDragging
                    ? "scale-105 opacity-60 ring-2 ring-primary"
                    : isDragOver
                      ? "scale-105 ring-2 ring-white bg-primary/40"
                      : isCorrect
                        ? "bg-green-500 ring-2 ring-green-200"
                        : `bg-linear-to-br ${colorClass}`
                } ${!isDragging && "hover:scale-105"}`}
              >
                {piece?.label}
              </div>
            )
          })}
        </div>
      </Card>

      <div className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Lightbulb className="h-4 w-4 text-yellow-500" />
        <p>Les pièces vertes sont au bon endroit !</p>
      </div>

      <Button
        onClick={() => initGame(level)}
        variant="outline"
        className="rounded-full"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Recommencer
      </Button>
    </div>
  )
}
