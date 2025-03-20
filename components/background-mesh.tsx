"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function BackgroundMesh() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = resolvedTheme === "dark"

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base background with user-specified colors */}
      <div className={`absolute inset-0 ${isDark ? "bg-[#0a0a0a]" : "bg-[#ffedd5]"}`} />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      {/* First blob - top right */}
      <div
        className={`absolute top-[10%] right-[15%] w-[30vw] h-[30vw] max-w-[500px] max-h-[500px] rounded-full blur-3xl ${
          isDark ? "bg-[#3b0764] opacity-30" : "bg-[#ea580c] opacity-20"
        }`}
        style={{ animation: "float 15s ease-in-out infinite" }}
      />

      {/* Second blob - bottom left */}
      <div
        className={`absolute bottom-[20%] left-[10%] w-[25vw] h-[25vw] max-w-[400px] max-h-[400px] rounded-full blur-3xl ${
          isDark ? "bg-[#1e1b4b] opacity-30" : "bg-[#fb923c] opacity-20"
        }`}
        style={{ animation: "float 18s ease-in-out infinite reverse" }}
      />

      {/* Third blob - middle */}
      <div
        className={`absolute top-[40%] left-[30%] w-[20vw] h-[20vw] max-w-[300px] max-h-[300px] rounded-full blur-3xl ${
          isDark ? "bg-[#0f172a] opacity-30" : "bg-[#fdba74] opacity-20"
        }`}
        style={{ animation: "float 20s ease-in-out infinite 2s" }}
      />

      {/* Gradient overlay for depth */}
      <div
        className={`absolute inset-0 ${
          isDark
            ? "bg-gradient-to-br from-[#3b0764]/10 via-transparent to-[#0a0a0a]/30"
            : "bg-gradient-to-br from-[#ffedd5]/10 via-transparent to-[#ea580c]/10"
        }`}
      />

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black/30 dark:to-black/50" />
    </div>
  )
}

