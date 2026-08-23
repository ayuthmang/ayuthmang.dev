'use client'

import { useEffect } from 'react'
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
  useEffect(() => {
    let input: string[] = []

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

      const newKey = e.key
      input = [...input, newKey]
      
      // Keep only the last N keys
      if (input.length > KONAMI_CODE.length) {
        input.shift()
      }

      // Check if it matches exactly
      const isMatch =
        input.length === KONAMI_CODE.length &&
        input.every(
          (key, index) => key.toLowerCase() === KONAMI_CODE[index].toLowerCase()
        )

      if (isMatch) {
        triggerEasterEgg()
        input = [] // Reset after success
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return null
}
