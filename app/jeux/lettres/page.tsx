"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Confetti } from "@/components/confetti"
import { dinoForQuiz, type Dinosaur } from "@/lib/dinosaurs"
import { playMatchSound, playMismatchSound, playWinSound, playFlipSound } from "@/lib/sounds"
import {
  ArrowLeft,
  Star,
  Type,
  Trophy,
  ThumbsUp,
  Sparkles,
  Dumbbell,
  RefreshCw,
  Home,
  Check,
  X,
} from "lucide-react"

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

function getRandomLetters(correctLetter: string, count: number): string[] {
  const otherLetters = alphabet.filter((l) => l !== correctLetter)
  const shuffled = shuffleArray(otherLetters)
  const selected = shuffled.slice(0, count - 1)
  return shuffleArray([correctLetter, ...selected])
}

const letterColors = [
  "from-red-400/90 to-orange-500/90",
  "from-green-400/90 to-emerald-500/90",
  "from-blue-400/90 to-cyan-500/90",
  "from-purple-400/90 to-pink-500/90",
]

export default function LettresGame() {
  const [dinosaurs, setDinosaurs] = useState<Dinosaur[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [letters, setLetters] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  const totalQuestions = 8

  const initGame = useCallback(() => {
    const shuffled = shuffleArray(dinoForQuiz).slice(0, totalQuestions)
    setDinosaurs(shuffled)
    setCurrentIndex(0)
    setScore(0)
    setShowResult(false)
    setSelectedLetter(null)
    setIsCorrect(false)
    setGameOver(false)

    if (shuffled.length > 0) {
      const firstLetter = shuffled[0].name.charAt(0).toUpperCase()
      setLetters(getRandomLetters(firstLetter, 4))
    }
  }, [])

  useEffect(() => {
    initGame()
  }, [initGame])

  const currentDino = dinosaurs[currentIndex]
  const correctLetter = currentDino?.name.charAt(0).toUpperCase()

  const handleLetterClick = (letter: string) => {
    if (showResult) return

    playFlipSound()
    setSelectedLetter(letter)
    const correct = letter === correctLetter
    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      setScore((s) => s + 1)
      setTimeout(() => playMatchSound(), 200)
    } else {
      setTimeout(() => playMismatchSound(), 200)
    }

    setTimeout(() => {
      if (currentIndex < dinosaurs.length - 1) {
        const nextIndex = currentIndex + 1
        setCurrentIndex(nextIndex)
        const nextLetter = dinosaurs[nextIndex].name.charAt(0).toUpperCase()
        setLetters(getRandomLetters(nextLetter, 4))
        setShowResult(false)
        setSelectedLetter(null)
        setIsCorrect(false)
      } else {
        setGameOver(true)
        playWinSound()
      }
    }, 1500)
  }

  if (dinosaurs.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-xl font-semibold text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  if (gameOver) {
    const percentage = Math.round((score / totalQuestions) * 100)
    let message = ""
    let IconComponent = Trophy

    if (percentage >= 80) {
      message = "Super ! Tu connais bien tes lettres !"
      IconComponent = Trophy
    } else if (percentage >= 60) {
      message = "Très bien ! Continue comme ça !"
      IconComponent = Sparkles
    } else if (percentage >= 40) {
      message = "Pas mal ! Tu progresses !"
      IconComponent = ThumbsUp
    } else {
      message = "Continue à t'entraîner !"
      IconComponent = Dumbbell
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-8">
        <Confetti />
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-blue-50 shadow-soft">
            <IconComponent className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-5xl font-black text-primary">Bravo !</h1>
          <p className="mt-3 text-xl font-medium text-muted-foreground">{message}</p>
        </div>

        <Card className="rounded-2xl border border-primary/10 bg-white/90 p-8 text-center shadow-soft">
          <p className="text-lg font-semibold text-muted-foreground">Ton score</p>
          <p className="text-6xl font-black text-primary">
            {score}/{totalQuestions}
          </p>
          <div className="mt-5">
            <Progress value={percentage} className="h-4" />
          </div>
        </Card>

        <div className="flex w-full max-w-sm flex-col gap-4">
          <Button
            onClick={initGame}
            className="touch-target-lg h-14 rounded-full text-lg font-bold shadow-soft transition-transform hover:scale-[1.02]"
          >
            <RefreshCw className="mr-3 h-6 w-6" />
            Rejouer
          </Button>
          <Link href="/">
            <Button
              variant="secondary"
              className="touch-target-lg h-14 w-full rounded-full text-lg font-bold shadow-soft transition-transform hover:scale-[1.02]"
            >
              <Home className="mr-3 h-6 w-6" />
              Accueil
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-6">
      {/* Back button */}
      <Link
        href="/"
        className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-black/5 bg-white/90 px-4 py-2 text-base font-semibold text-slate-700 shadow-soft transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="hidden sm:inline">Accueil</span>
      </Link>

      {/* Title */}
      <div className="mb-6 mt-16 text-center sm:mt-12">
        <h1 className="flex items-center justify-center gap-3 text-2xl font-black text-primary sm:text-3xl md:text-4xl">
          <Type className="h-8 w-8 text-blue-500 sm:h-10 sm:w-10" />
          <span>Trouve la lettre !</span>
        </h1>
        <p className="mt-2 text-lg font-medium text-muted-foreground">
          Quelle est la première lettre ?
        </p>
      </div>

      {/* Score and progress indicators */}
      <div className="mb-4 flex w-full max-w-lg items-center justify-between gap-4">
        <div className="flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-4 py-2 shadow-soft">
          <Star className="h-6 w-6 text-yellow-500" />
          <span className="text-lg font-bold text-primary">{score}</span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-black/5 bg-white px-4 py-2 shadow-soft">
          <span className="text-base font-semibold text-slate-600">
            {currentIndex + 1}
          </span>
          <span className="text-base text-slate-400">/</span>
          <span className="text-base font-semibold text-slate-600">
            {totalQuestions}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <Progress
        value={((currentIndex + 1) / totalQuestions) * 100}
        className="mb-6 h-4 w-full max-w-lg"
      />

      {/* Dinosaur card */}
      <Card
        className={`mb-6 w-full max-w-lg rounded-2xl border p-6 text-center shadow-soft transition-all sm:p-8 ${
          showResult && isCorrect
            ? "border-green-200 bg-green-50/60"
            : showResult && !isCorrect
              ? "border-red-200 bg-red-50/60"
              : "border-primary/10 bg-white/90"
        }`}
      >
        {currentDino && (
          <div className="relative mx-auto h-52 w-52 overflow-hidden rounded-2xl bg-linear-to-b from-sky-100 to-green-100 shadow-inner sm:h-56 sm:w-56">
            <Image
              src={currentDino.image}
              alt={currentDino.name}
              fill
              sizes="(max-width: 768px) 208px, 224px"
              className="object-contain p-3"
              priority
            />
          </div>
        )}
        <h2 className="mt-5 text-4xl font-black text-slate-800 sm:text-5xl">
          {showResult ? (
            <span>
              <span className="text-primary">{correctLetter}</span>
              {currentDino?.name.slice(1)}
            </span>
          ) : (
            <span>
              <span className="text-primary text-5xl sm:text-6xl">?</span>
              {currentDino?.name.slice(1)}
            </span>
          )}
        </h2>
      </Card>

      {/* Result feedback */}
      {showResult && (
        <div
          className={`mb-6 flex items-center gap-3 rounded-full border px-6 py-3 text-lg font-semibold animate-in zoom-in shadow-soft ${
            isCorrect
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {isCorrect ? (
            <>
              <Check className="h-5 w-5 text-green-600" />
              <span>Bravo !</span>
            </>
          ) : (
            <>
              <X className="h-5 w-5 text-red-600" />
              <span>C&apos;était {correctLetter}</span>
            </>
          )}
        </div>
      )}

      {/* Letter buttons */}
      <div className="grid grid-cols-2 gap-5">
        {letters.map((letter, index) => {
          const isSelected = selectedLetter === letter
          const isCorrectLetter = letter === correctLetter
          const showCorrect = showResult && isCorrectLetter
          const showWrong = showResult && isSelected && !isCorrectLetter

          return (
            <button
              key={`${letter}-${index}`}
              onClick={() => handleLetterClick(letter)}
              disabled={showResult}
              className={`touch-target-lg flex h-24 w-24 items-center justify-center rounded-2xl text-4xl font-black text-white shadow-soft transition-all sm:h-28 sm:w-28 sm:text-5xl ${
                showCorrect
                  ? "scale-105 bg-green-500 ring-2 ring-green-200 shadow-md"
                  : showWrong
                    ? "scale-95 bg-red-500 opacity-70"
                    : `bg-linear-to-br ${letterColors[index]} hover:shadow-md`
              } ${showResult && !showCorrect && !showWrong && "opacity-50"}`}
            >
              {letter}
            </button>
          )
        })}
      </div>
    </div>
  )
}
