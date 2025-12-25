import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSettings } from './settings-provider'
import { cn } from '@/lib/utils'

interface MeteorState {
  id: number
  top: number
  left: number
  delay: number
  duration: number
  isExploding: boolean
  explosionProgress: number
  tailLength: number
}

interface ExplosionParticle {
  id: number
  meteorId: number
  x: number
  y: number
  angle: number
  speed: number
  size: number
}

const Meteor = ({
  meteor,
  onAnimationComplete,
  onExplode,
  explosionChance,
  className,
}: {
  meteor: MeteorState
  onAnimationComplete: (id: number) => void
  onExplode: (id: number, x: number, y: number) => void
  explosionChance: number
  className?: string
}) => {
  const [hasExploded, setHasExploded] = useState(false)

  // Dynamic tail style based on settings - MUST be before any early returns
  const tailStyle = useMemo(() => ({
    '--tail-length': `${meteor.tailLength}px`,
  } as React.CSSProperties), [meteor.tailLength])

  useEffect(() => {
    // Random chance to explode during the journey
    const shouldExplode = Math.random() < explosionChance
    if (shouldExplode) {
      // Explode at a random point during the animation (between 20% and 80% of the journey)
      const explosionTiming = meteor.delay * 1000 + (meteor.duration * 1000 * (0.2 + Math.random() * 0.6))
      const timer = setTimeout(() => {
        setHasExploded(true)
        // Calculate approximate position at explosion time
        const progress = (0.2 + Math.random() * 0.6)
        const startX = (meteor.left / 100) * window.innerWidth
        const startY = (meteor.top / 100) * window.innerHeight
        // Meteor moves diagonally down-right at 215 degrees
        const distance = progress * 1500
        const angle = (215 * Math.PI) / 180
        const explosionX = startX + Math.cos(angle) * distance
        const explosionY = startY - Math.sin(angle) * distance
        onExplode(meteor.id, explosionX, explosionY)
      }, explosionTiming)
      return () => clearTimeout(timer)
    }
  }, [meteor, onExplode, explosionChance])

  if (hasExploded) {
    return null
  }

  return (
    <motion.span
      key={'meteor' + meteor.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        'animate-meteor-effect absolute h-1 w-1 rounded-[9999px] bg-white shadow-[0_0_0_1px_#ffffff50] rotate-[15deg]',
        "before:absolute before:top-1/2 before:h-px before:w-(--tail-length,200px) before:-translate-y-[50%] before:transform before:bg-linear-to-r before:from-white before:to-transparent before:content-['']",
        className,
      )}
      style={{
        top: `${meteor.top}vh`,
        left: `${meteor.left}vw`,
        animationDelay: `${meteor.delay}s`,
        animationDuration: `${meteor.duration}s`,
        ...tailStyle,
      }}
      onAnimationIteration={() => onAnimationComplete(meteor.id)}
    />
  )
}

interface ExplosionGlow {
  id: number
  meteorId: number
  x: number
  y: number
}

const ExplosionEffect = ({
  particles,
  glows,
  onComplete,
}: {
  particles: Array<ExplosionParticle>
  glows: Array<ExplosionGlow>
  onComplete: (meteorId: number) => void
}) => {
  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => {
        onComplete(particles[0].meteorId)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [particles, onComplete])

  return (
    <>
      {/* Central glow burst effect */}
      {glows.map((glow) => (
        <motion.div
          key={`glow-${glow.id}`}
          initial={{
            x: glow.x,
            y: glow.y,
            scale: 0.2,
            opacity: 1,
          }}
          animate={{
            scale: 3,
            opacity: 0,
          }}
          transition={{
            duration: 0.5,
            ease: 'easeOut',
          }}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 40,
            height: 40,
            marginLeft: -20,
            marginTop: -20,
            background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.6) 30%, rgba(200,220,255,0.3) 60%, transparent 100%)',
            boxShadow: '0 0 30px 15px rgba(255, 255, 255, 0.6), 0 0 60px 30px rgba(200, 220, 255, 0.4), 0 0 100px 50px rgba(150, 180, 255, 0.2)',
          }}
        />
      ))}
      {/* Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: particle.x,
            y: particle.y,
            scale: 1,
            opacity: 1,
          }}
          animate={{
            x: particle.x + Math.cos(particle.angle) * particle.speed * 100,
            y: particle.y + Math.sin(particle.angle) * particle.speed * 100,
            scale: 0,
            opacity: 0,
          }}
          transition={{
            duration: 0.6,
            ease: 'easeOut',
          }}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{
            width: particle.size,
            height: particle.size,
            boxShadow: '0 0 8px 3px rgba(255, 255, 255, 0.9), 0 0 16px 6px rgba(200, 220, 255, 0.5)',
          }}
        />
      ))}
    </>
  )
}

export const ShootingMeteors = ({
  className,
}: {
  className?: string
}) => {
  const { settings } = useSettings()
  const meteorSettings = settings.meteors

  // Return null if meteors are disabled
  if (!meteorSettings.enabled) {
    return null
  }

  const meteorCount = meteorSettings.count

  const generateMeteor = useCallback((id: number, initialDelay = 0): MeteorState => {
    const delayRange = meteorSettings.maxDelay - meteorSettings.minDelay
    const durationRange = meteorSettings.maxDuration - meteorSettings.minDuration
    
    return {
      id,
      top: Math.floor(Math.random() * 30) - 20, // -20 to 10 vh (start above or near top)
      left: Math.floor(Math.random() * 80) + 10, // 10 to 90 vw
      delay: initialDelay + meteorSettings.minDelay + Math.random() * delayRange,
      duration: meteorSettings.minDuration + Math.random() * durationRange,
      isExploding: false,
      explosionProgress: 0,
      tailLength: meteorSettings.tailLength,
    }
  }, [meteorSettings.minDelay, meteorSettings.maxDelay, meteorSettings.minDuration, meteorSettings.maxDuration, meteorSettings.tailLength])

  const [meteors, setMeteors] = useState<Array<MeteorState>>(() =>
    Array.from({ length: meteorCount }, (_, idx) => generateMeteor(idx, idx * 3))
  )
  const [explosions, setExplosions] = useState<Array<ExplosionParticle>>([])
  const [explosionGlows, setExplosionGlows] = useState<Array<ExplosionGlow>>([])
  const [meteorIdCounter, setMeteorIdCounter] = useState(meteorCount)

  // Re-generate meteors when count changes
  useEffect(() => {
    setMeteors(Array.from({ length: meteorCount }, (_, idx) => generateMeteor(idx + meteorIdCounter, idx * 3)))
    setMeteorIdCounter((prev) => prev + meteorCount)
  }, [meteorCount])

  const handleAnimationComplete = useCallback((id: number) => {
    // Replace the completed meteor with a new one at a random position
    setMeteors((prev) =>
      prev.map((m) =>
        m.id === id ? generateMeteor(meteorIdCounter, 0) : m
      )
    )
    setMeteorIdCounter((prev) => prev + 1)
  }, [generateMeteor, meteorIdCounter])

  const handleExplode = useCallback((meteorId: number, x: number, y: number) => {
    // Create explosion particles
    const particleCount = 8 + Math.floor(Math.random() * 8) // 8-15 particles
    const newParticles: Array<ExplosionParticle> = Array.from({ length: particleCount }, (_, i) => ({
      id: Date.now() + i,
      meteorId,
      x,
      y,
      angle: (Math.PI * 2 * i) / particleCount + Math.random() * 0.5,
      speed: 0.5 + Math.random() * 1.5,
      size: 2 + Math.random() * 4,
    }))
    setExplosions((prev) => [...prev, ...newParticles])

    // Create central glow effect
    const newGlow: ExplosionGlow = {
      id: Date.now(),
      meteorId,
      x,
      y,
    }
    setExplosionGlows((prev) => [...prev, newGlow])

    // Remove the exploded meteor and spawn a new one
    setMeteors((prev) =>
      prev.map((m) =>
        m.id === meteorId ? generateMeteor(meteorIdCounter, 1 + Math.random() * 3) : m
      )
    )
    setMeteorIdCounter((prev) => prev + 1)
  }, [generateMeteor, meteorIdCounter])

  const handleExplosionComplete = useCallback((meteorId: number) => {
    setExplosions((prev) => prev.filter((p) => p.meteorId !== meteorId))
    setExplosionGlows((prev) => prev.filter((g) => g.meteorId !== meteorId))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full h-full"
      >
        <AnimatePresence mode="popLayout">
          {meteors.map((meteor) => (
            <Meteor
              key={meteor.id}
              meteor={meteor}
              onAnimationComplete={handleAnimationComplete}
              onExplode={handleExplode}
              explosionChance={meteorSettings.explosionChance}
              className={className}
            />
          ))}
        </AnimatePresence>
        <ExplosionEffect
          particles={explosions}
          glows={explosionGlows}
          onComplete={handleExplosionComplete}
        />
      </motion.div>
    </div>
  )
}
