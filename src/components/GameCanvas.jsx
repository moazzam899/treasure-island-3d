
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

import {
  playCoinSound,
  playUnlockSound,
  playVictorySound
} from '../utils/sounds'

function GameCanvas({ onCoinCollected, onWin, movementRef }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#87ceeb')

    // Camera
    // const camera = new THREE.PerspectiveCamera(
    //   60,
    //   mount.clientWidth / mount.clientHeight,
    //   0.1,
    //   1000
    // )

    const getCameraFov = () => {
  return window.innerWidth <= 900 ? 65 : 60
}

const camera = new THREE.PerspectiveCamera(
  getCameraFov(),
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

let playerBaseY = 0
let walkTime = 0

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

const setMovementKey = (key, pressed) => {
  keys[key] = pressed
}

if (movementRef) {
  movementRef.current = setMovementKey
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

      if (modelPath === '/models/player-character.glb') {
  console.log(
    'Player animations:',
    gltf.animations.map((animation) => animation.name)
  )
}

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
  playerBaseY = model.position.y

  console.log('PLAYER MODEL:', model)
  console.log('PLAYER CHILDREN:', model.children)

  model.traverse((child) => {
    console.log(
      'Object:',
      child.name,
      '| Type:',
      child.type
    )
  })
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

    // const cameraOffset = new THREE.Vector3(0, 7, 12)

    const cameraOffset = new THREE.Vector3(0, 6, 9)
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

  

  // Procedural Walking Animation
const isMoving =
  keys.w || keys.a || keys.s || keys.d ||
  keys.ArrowUp || keys.ArrowDown ||
  keys.ArrowLeft || keys.ArrowRight

if (isMoving) {
  walkTime += 0.25
  playerModel.position.y = playerBaseY + Math.abs(Math.sin(walkTime)) * 0.25
} else {
  walkTime = 0
  playerModel.position.y = playerBaseY
}

  // Smooth Camera Follow
  desiredCameraPosition.set(
  playerModel.position.x + cameraOffset.x,
  playerBaseY + cameraOffset.y,
  playerModel.position.z + cameraOffset.z
)

camera.position.lerp(desiredCameraPosition, 0.08)

camera.lookAt(
  playerModel.position.x,
  playerBaseY,
  playerModel.position.z
)
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

playCoinSound()

onCoinCollected()
collectedCoinCount++

if (collectedCoinCount >= 3) {
  chestUnlocked = true
  playUnlockSound()
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
    playVictorySound()
    onWin()
    console.log('You Won!')
  }
}

  renderer.render(scene, camera)
}

animate()

    // Responsive canvas
    // const handleResize = () => {
    //   const width = mount.clientWidth
    //   const height = mount.clientHeight

    //   camera.aspect = width / height
    //   camera.updateProjectionMatrix()
    //   renderer.setSize(width, height)
    // }

    const handleResize = () => {
  const width = mount.clientWidth
  const height = mount.clientHeight

  camera.aspect = width / height
  camera.fov = getCameraFov()

  camera.updateProjectionMatrix()

  renderer.setSize(width, height)
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
  )
}

    window.addEventListener('resize', handleResize)

    // Cleanup
    // return () => {
    //   cancelAnimationFrame(animationId)
    //   window.removeEventListener('resize', handleResize)
    //   renderer.dispose()
    //   groundGeometry.dispose()
    //   groundMaterial.dispose()

    //   if (mount.contains(renderer.domElement)) {
    //     mount.removeChild(renderer.domElement)
    //   }
    // }

    return () => {
  cancelAnimationFrame(animationId)

  window.removeEventListener('resize', handleResize)
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)

  if (movementRef) {
    movementRef.current = null
  }

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
