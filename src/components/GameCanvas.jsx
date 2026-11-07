
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

function GameCanvas({ onCoinCollected, onWin }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#87ceeb')

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 5, 10)
    camera.lookAt(0, 0, 0)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
    scene.add(ambientLight)

    const sunlight = new THREE.DirectionalLight(0xffffff, 2)
    sunlight.position.set(5, 10, 5)
    scene.add(sunlight)

    // Temporary island ground
    const groundGeometry = new THREE.CylinderGeometry(5, 5, 0.5, 64)
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: '#55a630',
    })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.position.y = -0.25
    scene.add(ground)

    // Load Palm Tree Model
const loader = new GLTFLoader()

let playerModel = null

let chestModel = null

let collectedCoinCount = 0
let chestUnlocked = false

let gameWon = false

let coinModels = []


const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
}

const handleKeyDown = (event) => {
  if (event.key in keys) {
    keys[event.key] = true
  }
}

const handleKeyUp = (event) => {
  if (event.key in keys) {
    keys[event.key] = false
  }
}

window.addEventListener('keydown', handleKeyDown)
window.addEventListener('keyup', handleKeyUp)

const loadModel = (modelPath, position, targetHeight = 2.5) => {
  loader.load(
    modelPath,
    (gltf) => {
      const model = gltf.scene

      // Calculate original dimensions
      const box = new THREE.Box3().setFromObject(model)
      const size = box.getSize(new THREE.Vector3())

      // Normalize model size
      const maxDimension = Math.max(size.x, size.y, size.z)
      model.scale.setScalar(targetHeight / maxDimension)

      // Calculate scaled dimensions
      const scaledBox = new THREE.Box3().setFromObject(model)
      const center = scaledBox.getCenter(new THREE.Vector3())

      // Position model
      model.position.set(
        position.x - center.x,
        position.y - scaledBox.min.y,
        position.z - center.z
      )

      scene.add(model)

     if (modelPath === '/models/player-character.glb') {
  playerModel = model
}

if (modelPath === '/models/treasure-chest.glb') {
  chestModel = model
}

if (modelPath === '/models/gold-coin.glb') {
  coinModels.push(model)
}

    },
    undefined,
    (error) => {
      console.error(`Model loading failed: ${modelPath}`, error)
    }
  )
}


loadModel('/models/environment/palm-01.glb', { x: 0, y: 0, z: 0 })
loadModel('/models/environment/palm-02.glb', { x: -2.5, y: 0, z: 0 })

// Load Rock Models
loadModel('/models/environment/rock-01.glb', { x: 2, y: 0, z: 1 }, 1.2)

loadModel('/models/environment/rock-02.glb', { x: -2, y: 0, z: -1 }, 1)

loadModel('/models/environment/rock-03.glb', { x: 1, y: 0, z: -2 }, 1.5)

// Load Grass and Bush Models
loadModel('/models/environment/grass-01.glb', { x: -3, y: 0, z: 2 }, 0.8)
loadModel('/models/environment/grass-02.glb', { x: 3, y: 0, z: -1 }, 1)
loadModel('/models/environment/bush-01.glb', { x: -3, y: 0, z: -2 }, 1.2)
loadModel('/models/environment/bush-02.glb', { x: 2.5, y: 0, z: -2.5 }, 1.5)

// Load Treasure Models
loadModel('/models/treasure-chest.glb', { x: 0, y: 0, z: -3 }, 1.5)
// Load Multiple Coins
loadModel('/models/gold-coin.glb', { x: 2, y: 0, z: 2 }, 0.8)
loadModel('/models/gold-coin.glb', { x: -3, y: 0, z: 3 }, 0.8)
loadModel('/models/gold-coin.glb', { x: 3, y: 0, z: -2 }, 0.8)

// Load Player Character
loadModel('/models/player-character.glb', { x: 0, y: 0, z: 1 }, 1.5)

    // Animation
    let animationId

    const moveSpeed = 0.08

    const cameraOffset = new THREE.Vector3(0, 7, 12)
const desiredCameraPosition = new THREE.Vector3()

const animate = () => {
  animationId = requestAnimationFrame(animate)

  if (playerModel) {
  if (keys.w || keys.ArrowUp) {
    playerModel.position.z -= moveSpeed
    playerModel.rotation.y = Math.PI
  }

  if (keys.s || keys.ArrowDown) {
    playerModel.position.z += moveSpeed
    playerModel.rotation.y = 0
  }

  if (keys.a || keys.ArrowLeft) {
    playerModel.position.x -= moveSpeed
    playerModel.rotation.y = -Math.PI / 2
  }

  if (keys.d || keys.ArrowRight) {
    playerModel.position.x += moveSpeed
    playerModel.rotation.y = Math.PI / 2
  }

  // Keep player inside the island
  playerModel.position.x = THREE.MathUtils.clamp(
    playerModel.position.x,
    -3.5,
    3.5
  )

  playerModel.position.z = THREE.MathUtils.clamp(
    playerModel.position.z,
    -3.5,
    3.5
  )

  // Smooth Camera Follow
  desiredCameraPosition
    .copy(playerModel.position)
    .add(cameraOffset)

  camera.position.lerp(desiredCameraPosition, 0.08)
  camera.lookAt(playerModel.position)
}

if (playerModel) {
  for (let i = coinModels.length - 1; i >= 0; i--) {
    const coin = coinModels[i]

    coin.rotation.y += 0.03

    const distance = playerModel.position.distanceTo(
      coin.position
    )

    if (distance < 1.2) {
      scene.remove(coin)
      coinModels.splice(i, 1)

      onCoinCollected()

collectedCoinCount++

if (collectedCoinCount >= 3) {
  chestUnlocked = true
  console.log('Treasure Chest Unlocked!')
}

console.log('Coin collected!')
    }
  }
}

// Check Treasure Chest
if (playerModel && chestModel && chestUnlocked && !gameWon) {
  const chestDistance = playerModel.position.distanceTo(
    chestModel.position
  )

  if (chestDistance < 1.2) {
    gameWon = true
    onWin()
    console.log('You Won!')
  }
}

  renderer.render(scene, camera)
}

animate()

    // Responsive canvas
    const handleResize = () => {
      const width = mount.clientWidth
      const height = mount.clientHeight

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      groundGeometry.dispose()
      groundMaterial.dispose()

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={mountRef} className="game-canvas" />
}

export default GameCanvas
