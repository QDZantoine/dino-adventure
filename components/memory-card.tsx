"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import type { Dinosaur } from "@/lib/dinosaurs"
import { HelpCircle } from "lucide-react"

interface MemoryCardProps {
  dinosaur: Dinosaur
  isFlipped: boolean
  isMatched: boolean
  onClick: () => void
  disabled: boolean
}

export function MemoryCard({
  dinosaur,
  isFlipped,
  isMatched,
  onClick,
  disabled,
}: MemoryCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isMatched}
      className={cn(
        "relative aspect-square w-full cursor-pointer transition-all duration-300",
        "transform-gpu perspective-1000",
        isMatched && "scale-95 opacity-70",
        disabled && !isMatched && "cursor-not-allowed"
      )}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center rounded-2xl border-4 p-1 transition-all duration-500",
          "shadow-lg overflow-hidden",
          isFlipped || isMatched
            ? "rotate-y-0 bg-gradient-to-b from-sky-50 to-green-50 border-primary"
            : "rotate-y-180 bg-gradient-to-br from-primary to-accent border-primary/50"
        )}
        style={{
          backfaceVisibility: "hidden",
          transform: isFlipped || isMatched ? "rotateY(0deg)" : "rotateY(180deg)",
        }}
      >
        {(isFlipped || isMatched) && (
          <div className="relative h-full w-full animate-in zoom-in duration-300">
            <Image
              src={dinosaur.image}
              alt={dinosaur.name}
              fill
              sizes="(max-width: 768px) 100px, 120px"
              className="object-contain p-1"
            />
          </div>
        )}
      </div>
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center rounded-2xl border-4 transition-all duration-500",
          "bg-gradient-to-br from-primary via-accent to-secondary border-primary/50 shadow-lg"
        )}
        style={{
          backfaceVisibility: "hidden",
          transform: isFlipped || isMatched ? "rotateY(-180deg)" : "rotateY(0deg)",
        }}
      >
        <HelpCircle className="h-10 w-10 text-white drop-shadow-lg sm:h-12 sm:w-12" />
      </div>
    </button>
  )
}
