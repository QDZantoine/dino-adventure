"use client"

import confetti from "canvas-confetti"
import { useEffect } from "react"

interface ConfettiProps {
  trigger?: boolean
}

export function Confetti({ trigger = true }: ConfettiProps) {
  useEffect(() => {
    if (!trigger) return

    const duration = 3000
    const end = Date.now() + duration

    const colors = ["#22c55e", "#eab308", "#f97316", "#8b5cf6", "#ec4899"]

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    // Burst initial
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors,
    })

    frame()
  }, [trigger])

  return null
}

export function fireConfetti() {
  const colors = ["#22c55e", "#eab308", "#f97316", "#8b5cf6", "#ec4899"]

  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors,
  })

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    })
  }, 200)

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    })
  }, 400)
}
