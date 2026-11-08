
import GameCanvas from './components/GameCanvas'
import './App.css'
import { useState, useRef } from 'react'

function App() {
  const [score, setScore] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  const movementRef = useRef(null)

  const pressControl = (key) => {
    movementRef.current?.(key, true)
  }

  const releaseControl = (key) => {
    movementRef.current?.(key, false)
  }

  const handleRestart = () => {
    window.location.reload()
  }

  return (
    <main className="game-container">

      {!gameStarted ? (
        <section className="start-screen">

          <nav className="landing-nav">
            <div className="brand">
              <span className="brand-icon">✦</span>
              TREASURE ISLAND
            </div>
            <span className="nav-label">3D ADVENTURE</span>
          </nav>

          <div className="landing-content">

            <div className="hero-eyebrow">
              <span></span>
              THE ADVENTURE BEGINS HERE
              <span></span>
            </div>

            <h1>
              TREASURE
              <span>ISLAND</span>
            </h1>

            <p className="start-description">
              Beyond the wild jungle lies a forgotten treasure.
              Explore the mysterious island, collect golden coins
              and uncover its hidden secrets.
            </p>

            <button
              className="play-button"
              onClick={() => setGameStarted(true)}
            >
              <span>▶</span>
              BEGIN ADVENTURE
              <span>→</span>
            </button>

            <div className="hero-note">
              NO MAP. NO LIMITS. JUST ADVENTURE.
            </div>

          </div>

          <div className="adventure-guide">

            <div className="guide-heading">
              <span>YOUR ADVENTURE GUIDE</span>
              <span>01 — 03</span>
            </div>

            <div className="guide-grid">

              <div className="guide-card">
                <div className="guide-icon">⌨</div>
                <div>
                  <span className="guide-number">01 / EXPLORE</span>
                  <h3>Move Around</h3>
                  <p>Use WASD or arrow keys to explore.</p>
                </div>
              </div>

              <div className="guide-card">
                <div className="guide-icon">◈</div>
                <div>
                  <span className="guide-number">02 / COLLECT</span>
                  <h3>Find Golden Coins</h3>
                  <p>Discover all 3 hidden golden coins.</p>
                </div>
              </div>

              <div className="guide-card">
                <div className="guide-icon">♜</div>
                <div>
                  <span className="guide-number">03 / CONQUER</span>
                  <h3>Claim The Treasure</h3>
                  <p>Unlock the chest and win the adventure.</p>
                </div>
              </div>

            </div>
          </div>

          <footer className="landing-footer">
            <span>AN UNFORGETTABLE JOURNEY AWAITS</span>
            <span>© TREASURE ISLAND</span>
          </footer>

        </section>

      ) : (
        <section className="game-screen">

          <header className="game-header">

            <div className="brand">
              <span className="brand-icon">✦</span>
              TREASURE ISLAND
            </div>

            <div className="game-header-center">
              <span>THE LOST ISLAND</span>
              <p>Explore. Discover. Conquer.</p>
            </div>

            <div className="game-level">
              <span>LEVEL</span>
              <strong>01</strong>
            </div>

          </header>

          <div className="game-hud">

            <div className="hud-card">
              <span className="hud-label">YOUR SCORE</span>
              <strong>{score.toString().padStart(2, '0')}</strong>
            </div>

            <div className="coin-progress">

              <div className="coin-progress-heading">
                <span>TREASURE COINS</span>
                <strong>{score} / 3</strong>
              </div>

              <div className="coin-progress-track">
                {[0, 1, 2].map((coin) => (
                  <span
                    key={coin}
                    className={score > coin ? 'coin-active' : ''}
                  />
                ))}
              </div>

            </div>

            <div className="hud-status">
              <span className="status-dot"></span>
              {score >= 3 ? 'CHEST UNLOCKED' : 'EXPLORING'}
            </div>

          </div>

          {score >= 3 && !gameWon && (
            <div className="chest-status">
              ✦ TREASURE UNLOCKED — FIND THE CHEST!
            </div>
          )}

          <section className="game-area">
            <GameCanvas
              onCoinCollected={() => setScore((prev) => prev + 1)}
              onWin={() => setGameWon(true)}
              movementRef={movementRef}
            />
          </section>

          <div className="game-bottom">
            <span>WASD / ARROW KEYS TO MOVE</span>
            <span>COLLECT ALL 3 COINS TO UNLOCK THE TREASURE</span>
          </div>

          <div className="mobile-controls">

            <button
              onPointerDown={(e) => {
                e.preventDefault()
                pressControl('ArrowUp')
              }}
              onPointerUp={() => releaseControl('ArrowUp')}
              onPointerLeave={() => releaseControl('ArrowUp')}
              onPointerCancel={() => releaseControl('ArrowUp')}
            >▲</button>

            <div className="horizontal-controls">

              <button
                onPointerDown={(e) => {
                  e.preventDefault()
                  pressControl('ArrowLeft')
                }}
                onPointerUp={() => releaseControl('ArrowLeft')}
                onPointerLeave={() => releaseControl('ArrowLeft')}
                onPointerCancel={() => releaseControl('ArrowLeft')}
              >◀</button>

              <button
                onPointerDown={(e) => {
                  e.preventDefault()
                  pressControl('ArrowDown')
                }}
                onPointerUp={() => releaseControl('ArrowDown')}
                onPointerLeave={() => releaseControl('ArrowDown')}
                onPointerCancel={() => releaseControl('ArrowDown')}
              >▼</button>

              <button
                onPointerDown={(e) => {
                  e.preventDefault()
                  pressControl('ArrowRight')
                }}
                onPointerUp={() => releaseControl('ArrowRight')}
                onPointerLeave={() => releaseControl('ArrowRight')}
                onPointerCancel={() => releaseControl('ArrowRight')}
              >▶</button>

            </div>
          </div>

          {gameWon && (
            <div className="victory-overlay">

              <div className="victory-card">

                <div className="victory-symbol">♛</div>

                <span className="victory-eyebrow">
                  LEGENDARY DISCOVERY
                </span>

                <h2>YOU FOUND IT!</h2>

                <p>
                  The legendary treasure is finally yours.
                  Your adventure will be remembered.
                </p>

                <div className="final-score">
                  <span>FINAL SCORE</span>
                  <strong>{score} / 3</strong>
                </div>

                <button onClick={handleRestart}>
                  ↻ PLAY AGAIN
                </button>

              </div>
            </div>
          )}

        </section>
      )}

    </main>
  )
}

export default App
