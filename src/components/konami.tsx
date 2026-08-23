'use client'

import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import clsx from 'clsx'

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

const KEY_LABELS: Record<string, string> = {
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
  b: 'B',
  a: 'A',
}

function triggerEasterEgg() {
  console.log('🎉 KONAMI CODE ACTIVATED! 🎉')
  
  const duration = 3000
  const end = Date.now() + duration

  const frame = () => {
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'],
      zIndex: 9999
    })
    confetti({
      particleCount: 7,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'],
      zIndex: 9999
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  }
  
  frame()
}

export default function Konami() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let input: string[] = []
    let timeout: NodeJS.Timeout

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore modifier keys that might break the sequence (like Shift for capital A/B)
      if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') {
        return
      }

      // Ignore if user is typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return
      }

      const expectedKey = KONAMI_CODE[input.length]

      if (e.key.toLowerCase() === expectedKey.toLowerCase()) {
        input.push(e.key)
        setProgress(input.length)

        if (input.length === KONAMI_CODE.length) {
          triggerEasterEgg()
          input = []
          
          // Clear progress after a few seconds so the success message dismisses
          clearTimeout(timeout)
          timeout = setTimeout(() => setProgress(0), 3000)
        }
      } else {
        // If they mess up, check if the key they pressed is the start of a new sequence
        if (e.key.toLowerCase() === KONAMI_CODE[0].toLowerCase()) {
          input = [e.key]
          setProgress(1)
        } else {
          input = []
          setProgress(0)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      clearTimeout(timeout)
    }
  }, [])

  // Only show the hint if they've at least hit Up Up Down Down
  if (progress < 4) return null

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="rounded-xl border border-cyan-500/20 bg-slate-950/95 p-4 shadow-2xl shadow-cyan-500/10 backdrop-blur-md">
        {progress === KONAMI_CODE.length ? (
          <div className="flex h-8 items-center justify-center font-mono font-bold text-green-400">
            Cheat Code Activated! 🚀
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-slate-400">Secret sequence detected:</span>
            <div className="flex items-center gap-1.5">
              {KONAMI_CODE.map((key, index) => {
                const isPressed = index < progress
                const isNext = index === progress
                
                return (
                  <kbd
                    key={index}
                    className={clsx(
                      "flex h-7 min-w-[28px] items-center justify-center rounded border px-1.5 font-sans text-sm font-semibold transition-all duration-200",
                      isPressed && "border-cyan-500/50 bg-cyan-500/10 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]",
                      isNext && "animate-pulse border-slate-500 bg-slate-800 text-slate-200 scale-110",
                      !isPressed && !isNext && "border-slate-800 bg-slate-900 text-slate-600"
                    )}
                  >
                    {KEY_LABELS[key]}
                  </kbd>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
