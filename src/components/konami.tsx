'use client'

import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'

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
      <div className="rounded-lg border border-cyan-500/30 bg-slate-900/90 px-4 py-3 text-sm font-mono text-cyan-400 shadow-lg shadow-cyan-500/20 backdrop-blur-md">
        {progress === KONAMI_CODE.length ? (
          <span className="font-bold text-green-400">Cheat Code Activated! 🚀</span>
        ) : (
          <span className="flex items-center gap-2">
            <span className="animate-pulse">_</span>
            Secret sequence: {progress}/{KONAMI_CODE.length}
          </span>
        )}
      </div>
    </div>
  )
}
