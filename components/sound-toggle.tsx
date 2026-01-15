"use client"

import { useState, useEffect } from "react"
import { isSoundEnabled, toggleSound } from "@/lib/sounds"
import { Volume2, VolumeX } from "lucide-react"

export function SoundToggle() {
  const [soundOn, setSoundOn] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setSoundOn(isSoundEnabled())
  }, [])

  const handleToggle = () => {
    const newState = toggleSound()
    setSoundOn(newState)
  }

  if (!mounted) return null

  return (
    <button
      onClick={handleToggle}
      className={`touch-target flex h-14 w-14 items-center justify-center rounded-full shadow-soft transition-all hover:scale-110 active:scale-95 ${
        soundOn
          ? "bg-gradient-to-br from-green-400 to-emerald-500"
          : "bg-gradient-to-br from-gray-300 to-gray-400"
      }`}
      title={soundOn ? "Couper le son" : "Activer le son"}
      aria-label={soundOn ? "Couper le son" : "Activer le son"}
    >
      {soundOn ? (
        <Volume2 className="h-7 w-7 text-white" />
      ) : (
        <VolumeX className="h-7 w-7 text-white" />
      )}
    </button>
  )
}
