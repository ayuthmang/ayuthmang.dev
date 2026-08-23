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
  // A single, elegant burst of confetti
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.6 },
    colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'],
    zIndex: 9999,
    disableForReducedMotion: true,
  })
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

        clearTimeout(timeout)
        if (input.length === KONAMI_CODE.length) {
          triggerEasterEgg()
          input = []
          
          // Clear progress after a few seconds so the success message dismisses
          timeout = setTimeout(() => setProgress(0), 3000)
        } else {
          // Auto-dismiss if they stop typing for 5 seconds
          timeout = setTimeout(() => {
            input = []
            setProgress(0)
          }, 5000)
        }
      } else {
        // If they mess up, check if the key they pressed is the start of a new sequence
        clearTimeout(timeout)
        if (e.key.toLowerCase() === KONAMI_CODE[0].toLowerCase()) {
          input = [e.key]
          setProgress(1)
          timeout = setTimeout(() => {
            input = []
            setProgress(0)
          }, 5000)
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
    <>
      <style>{`
        @keyframes konami-shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
      <div className="fixed bottom-6 right-6 z-[9999] animate-in slide-in-from-bottom-5 fade-in duration-300">
        <div className="relative overflow-hidden rounded-xl border border-cyan-500/20 bg-slate-950/95 p-4 shadow-2xl shadow-cyan-500/10 backdrop-blur-md">
          {progress === KONAMI_CODE.length ? (
            <div className="flex h-8 items-center justify-center font-mono font-bold text-green-400">
              Cheat Code Activated! 🚀
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-slate-400">Secret sequence detected:</span>
              <div className="flex items-center gap-1.5 pb-1">
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
              {/* Timeout Progress Bar */}
              <div 
                key={progress} 
                className="absolute bottom-0 left-0 h-[3px] bg-cyan-500" 
                style={{ animation: 'konami-shrink 5s linear forwards' }} 
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
