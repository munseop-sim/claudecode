import catImage from '../assets/images/cat.svg'
import { useAnimation } from '../hooks/useAnimation'
import '../styles/DancingCat.css'

function DancingCat() {
  const { isAnimating, animationSpeed, toggleAnimation, changeSpeed } = useAnimation()

  return (
    <div className="dancing-cat-container">
      <div className={`cat-wrapper ${isAnimating ? 'dancing' : ''}`}>
        <img
          src={catImage}
          alt="Dancing Cat"
          className="cat-image"
          style={{
            animationDuration: `${2 / animationSpeed}s`
          }}
        />
      </div>

      <div className="controls">
        <button
          onClick={toggleAnimation}
          className="dance-button"
        >
          {isAnimating ? '⏸️ Stop Dancing' : '🎵 Start Dancing'}
        </button>

        <div className="speed-controls">
          <label htmlFor="speed-slider">Speed: {animationSpeed.toFixed(1)}x</label>
          <input
            id="speed-slider"
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={animationSpeed}
            onChange={(e) => changeSpeed(parseFloat(e.target.value))}
            className="speed-slider"
          />
        </div>

        <p className="keyboard-hint">💡 Press <kbd>Space</kbd> to toggle dancing!</p>
      </div>
    </div>
  )
}

export default DancingCat