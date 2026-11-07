
let audioContext

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }

  return audioContext
}

const playTone = (frequency, duration, type = 'sine', volume = 0.15, delay = 0) => {
  const context = getAudioContext()
  const oscillator = context.createOscillator()
  const gain = context.createGain()

  oscillator.type = type
  oscillator.frequency.setValueAtTime(
    frequency,
    context.currentTime + delay
  )

  gain.gain.setValueAtTime(0.001, context.currentTime + delay)
  gain.gain.exponentialRampToValueAtTime(
    volume,
    context.currentTime + delay + 0.02
  )
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    context.currentTime + delay + duration
  )

  oscillator.connect(gain)
  gain.connect(context.destination)

  oscillator.start(context.currentTime + delay)
  oscillator.stop(context.currentTime + delay + duration + 0.05)
}

export const playCoinSound = () => {
  playTone(880, 0.12)
  playTone(1320, 0.18, 'sine', 0.12, 0.08)
}

export const playUnlockSound = () => {
  playTone(523, 0.2)
  playTone(659, 0.2, 'sine', 0.15, 0.18)
  playTone(784, 0.3, 'sine', 0.15, 0.36)
}

export const playVictorySound = () => {
  playTone(523, 0.25)
  playTone(659, 0.25, 'sine', 0.15, 0.2)
  playTone(784, 0.25, 'sine', 0.15, 0.4)
  playTone(1047, 0.5, 'sine', 0.18, 0.6)
}
