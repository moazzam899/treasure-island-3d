
import GameCanvas from './components/GameCanvas'
import './App.css'

function App() {
  return (
    <main className="game-container">
      <header className="game-header">
        <h1>Treasure Island</h1>
        <p>Explore the island. Find the hidden treasure!</p>
      </header>

      <section className="game-area">
        <GameCanvas />
      </section>
    </main>
  )
}

export default App
