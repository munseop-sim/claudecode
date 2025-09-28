import { useState, useCallback, useEffect } from 'react'

export function useAnimation(initialState = false) {
  const [isAnimating, setIsAnimating] = useState(initialState)
  const [animationSpeed, setAnimationSpeed] = useState(1)

  const toggleAnimation = useCallback(() => {
    setIsAnimating(prev => !prev)
  }, [])

  const startAnimation = useCallback(() => {
    setIsAnimating(true)
  }, [])

  const stopAnimation = useCallback(() => {
    setIsAnimating(false)
  }, [])

  const changeSpeed = useCallback((speed) => {
    setAnimationSpeed(Math.max(0.1, Math.min(3, speed)))
  }, [])

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === 'Space') {
        event.preventDefault()
        toggleAnimation()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [toggleAnimation])

  return {
    isAnimating,
    animationSpeed,
    toggleAnimation,
    startAnimation,
    stopAnimation,
    changeSpeed
  }
}