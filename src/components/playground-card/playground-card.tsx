'use client'

import React from 'react'
import styles from './playground-card.module.css'

const BURST_EMOJIS = ['✨', '🎉', '⚡', '💖', '🔥', '🫧']

interface Burst {
  id: number
  emoji: string
  offsetX: number
}

export function PlaygroundCard() {
  return (
    <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-3">
      <SpinToy />
      <BoopCounter />
      <ShimmerToy />
    </div>
  )
}

function SpinToy() {
  const [degrees, setDegrees] = React.useState(0)

  return (
    <ToyTile label="Click to spin">
      <button
        type="button"
        aria-label="Spin the atom"
        onClick={() => setDegrees((d) => d + 360)}
        className="cursor-pointer text-4xl transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1.2)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
        style={{ transform: `rotate(${degrees}deg)` }}
      >
        ⚛️
      </button>
    </ToyTile>
  )
}

function BoopCounter() {
  const [boops, setBoops] = React.useState(0)
  const [bursts, setBursts] = React.useState<Burst[]>([])
  const nextId = React.useRef(0)

  const boop = () => {
    setBoops((b) => b + 1)
    const id = nextId.current++
    const burst: Burst = {
      id,
      emoji: BURST_EMOJIS[id % BURST_EMOJIS.length],
      offsetX: Math.round(Math.random() * 40 - 20),
    }
    setBursts((prev) => [...prev, burst])
    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== id))
    }, 700)
  }

  return (
    <ToyTile label={`Boops: ${boops}`}>
      <div className="relative">
        {bursts.map((burst) => (
          <span
            key={burst.id}
            aria-hidden="true"
            className={styles.burst}
            style={{ left: `calc(50% + ${burst.offsetX}px)` }}
          >
            {burst.emoji}
          </span>
        ))}
        <button
          type="button"
          aria-label="Boop!"
          onClick={boop}
          className="cursor-pointer text-4xl transition-transform duration-100 active:scale-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
        >
          🐽
        </button>
      </div>
    </ToyTile>
  )
}

function ShimmerToy() {
  return (
    <ToyTile label="Hover me">
      <span className={`${styles.shimmer} text-2xl font-bold`}>CSS!</span>
    </ToyTile>
  )
}

function ToyTile({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-gray-100 p-4 dark:bg-gray-800">
      {children}
      <span className="text-base tabular-nums">{label}</span>
    </div>
  )
}

export default PlaygroundCard
