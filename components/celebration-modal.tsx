"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Confetti } from "@/components/confetti"
import type { Badge } from "@/lib/game-store"
import { Star, Target, RefreshCw, Home, Trophy, PartyPopper } from "lucide-react"

interface CelebrationModalProps {
  points: number
  moves: number
  newBadges: Badge[]
  onClose: () => void
  onReplay: () => void
  onHome: () => void
}

export function CelebrationModal({
  points,
  moves,
  newBadges,
  onClose,
  onReplay,
  onHome,
}: CelebrationModalProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <Confetti />
      <DialogContent className="max-w-sm rounded-3xl border-4 border-primary bg-gradient-to-b from-yellow-50 via-white to-green-50 p-6 shadow-soft-lg">
        <DialogHeader className="items-center">
          <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 animate-bounce shadow-soft">
            <PartyPopper className="h-10 w-10 text-white" />
          </div>
          <DialogTitle className="text-center text-3xl font-black text-primary">
            Bravo !
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-5">
          {/* Points earned */}
          <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-yellow-100 to-orange-100 px-6 py-4 shadow-soft">
            <Star className="h-8 w-8 fill-yellow-400 text-yellow-400 animate-star-spin" />
            <span className="text-3xl font-black text-primary">+{points}</span>
            <span className="text-lg font-semibold text-muted-foreground">points</span>
          </div>

          {/* Moves count */}
          <div className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
            <Target className="h-6 w-6 text-primary" />
            <span>{moves} coups</span>
          </div>

          {/* New badges */}
          {newBadges.length > 0 && (
            <div className="w-full rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 p-5 shadow-soft">
              <div className="mb-3 flex items-center justify-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <p className="text-lg font-bold text-primary">
                  Nouveau badge !
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                {newBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="flex flex-col items-center gap-2 animate-in zoom-in duration-500"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-soft">
                      <span className="text-4xl">{badge.emoji}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-700">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-2 flex w-full flex-col gap-3">
            <Button
              onClick={onReplay}
              className="touch-target-lg h-16 w-full rounded-full text-xl font-bold shadow-soft transition-transform hover:scale-105"
            >
              <RefreshCw className="mr-2 h-6 w-6" />
              Rejouer
            </Button>
            <Button
              onClick={onHome}
              variant="secondary"
              className="touch-target-lg h-16 w-full rounded-full text-xl font-bold shadow-soft transition-transform hover:scale-105"
            >
              <Home className="mr-2 h-6 w-6" />
              Menu
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
