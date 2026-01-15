"use client"

import { useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { getProgress, type GameProgress } from "@/lib/game-store"
import { SoundToggle } from "@/components/sound-toggle"
import { Brain, Beef, Leaf, Puzzle, Type, Star, ChevronRight } from "lucide-react"

interface Game {
  id: string
  title: string
  icon: ReactNode
  description: string
  href: string
  color: string
  bgColor: string
}

const games: Game[] = [
  {
    id: "memory",
    title: "Dino Memory",
    icon: <Brain className="h-10 w-10 text-emerald-600" />,
    description: "Trouve les paires de dinosaures !",
    href: "/jeux/memory",
    color: "from-emerald-400/70 to-emerald-500/70",
    bgColor: "bg-emerald-50",
  },
  {
    id: "dino-quiz",
    title: "Carnivore ou Herbivore ?",
    icon: (
      <div className="flex items-center gap-1">
        <Beef className="h-7 w-7 text-orange-500" />
        <Leaf className="h-7 w-7 text-green-500" />
      </div>
    ),
    description: "Devine ce que mange chaque dinosaure !",
    href: "/jeux/dino-quiz",
    color: "from-orange-400/70 to-red-500/70",
    bgColor: "bg-orange-50",
  },
  {
    id: "puzzle",
    title: "Puzzle Dino",
    icon: <Puzzle className="h-10 w-10 text-purple-600" />,
    description: "Glisse les pièces pour reconstituer le dinosaure !",
    href: "/jeux/puzzle",
    color: "from-purple-400/70 to-pink-500/70",
    bgColor: "bg-purple-50",
  },
  {
    id: "lettres",
    title: "Trouve la lettre",
    icon: <Type className="h-10 w-10 text-blue-600" />,
    description: "Trouve la première lettre du nom du dinosaure !",
    href: "/jeux/lettres",
    color: "from-blue-400/70 to-indigo-500/70",
    bgColor: "bg-blue-50",
  },
]

export default function Home() {
  const [progress, setProgress] = useState<GameProgress | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setProgress(getProgress())
    setMounted(true)
  }, [])

  const totalPoints = progress?.totalPoints || 0
  const unlockedBadges = progress?.badges.filter((b) => b.unlocked) || []

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-6 sm:py-10">
      {/* Sound Toggle */}
      <div className="absolute right-4 top-4 z-10">
        <SoundToggle />
      </div>

      {/* Header with mascot */}
      <div className="mb-8 text-center">
        {/* Mascot dino */}
        <div className="relative mx-auto mb-4 h-28 w-28 animate-float sm:h-36 sm:w-36">
          <Image
            src="/illustration/t-rex.png"
            alt="Mascotte dinosaure"
            fill
            className="object-contain drop-shadow-lg"
            priority
          />
        </div>

        <h1 className="mb-3 text-4xl font-black tracking-tight text-primary sm:text-5xl md:text-6xl">
          Dino Aventure
        </h1>
        <p className="text-lg font-medium text-muted-foreground sm:text-xl">
          Apprends en t&apos;amusant avec les dinosaures !
        </p>
      </div>

      {/* Points Card - animated */}
      {mounted && totalPoints > 0 && (
        <Card className="mb-8 flex items-center gap-4 rounded-2xl border border-yellow-100 bg-white/80 px-6 py-4 shadow-soft backdrop-blur">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50">
            <Star className="h-6 w-6 text-yellow-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-600">Mes points</p>
            <p className="text-3xl font-black text-primary">{totalPoints}</p>
          </div>
          {unlockedBadges.length > 0 && (
            <div className="rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-700">
              {unlockedBadges.length} badges
            </div>
          )}
        </Card>
      )}

      {/* Games Grid */}
      <div className="w-full max-w-lg">
        <p className="mb-5 text-center text-xl font-bold text-gray-700">
          Choisis un jeu
        </p>
        <div className="flex flex-col gap-5">
          {games.map((game, index) => (
            <Link
              key={game.id}
              href={game.href}
              className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Card
                className={`card-interactive cursor-pointer overflow-hidden rounded-2xl border border-transparent bg-linear-to-r ${game.color} p-1 shadow-soft transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-soft-lg`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-4 rounded-[18px] bg-white/90 px-5 py-4 shadow-sm ring-1 ring-black/5">
                  {/* Icon container */}
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white shadow-soft transition-transform group-hover:scale-105">
                    {game.icon}
                  </div>

                  {/* Text content */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-extrabold text-slate-800 sm:text-2xl">
                      {game.title}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-slate-600 sm:text-base">
                      {game.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-sm transition-all group-hover:bg-primary group-hover:shadow-md">
                    <ChevronRight className="h-6 w-6 text-slate-400 transition-all group-hover:translate-x-0.5 group-hover:text-white" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-10 text-center">
        <p className="text-base font-medium text-muted-foreground">
          Pour les petits explorateurs de 3-5 ans
        </p>
      </div>
    </div>
  )
}
