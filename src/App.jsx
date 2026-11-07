import { useState } from 'react'
import GameCanvas from './components/GameCanvas'
import './App.css'

function App() {
  const [score, setScore] = useState(0)
  const [gameWon, setGameWon] = useState(false)

  const handleRestart = () => {
    window.location.reload()
  }

  return (
    <main className="game-container">
      <header className="game-header">
        <h1>Treasure Island</h1>
        <p>Explore the island. Find the hidden treasure!</p>
      </header>

      <div className="score-display">
        Score: {score}
      </div>

      {score >= 3 && !gameWon && (
        <div className="chest-status">
          Treasure Chest Unlocked! Find the chest!
        </div>
      )}

      <section className="game-area">
        <GameCanvas
          onCoinCollected={() => setScore((prev) => prev + 1)}
          onWin={() => setGameWon(true)}
        />
      </section>

      {gameWon && (
        <div className="victory-overlay">
          <div className="victory-card">
            <h2>Congratulations!</h2>
            <p>You found the hidden treasure!</p>
            <p>Final Score: {score}</p>

            <button onClick={handleRestart}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

export default App