import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 300 })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Galaxy
 */
const parameters = {}
parameters.count = 1000
parameters.size = 0.02

let particlesGeometry = null
let particlesMaterial = null
let stars = null

const generateGalaxy = () => {
  // Destroy existing galaxy to replace with new one when doing tweaks
  if (stars !== null) {
    particlesGeometry.dispose()
    particlesMaterial.dispose()
    scene.remove(stars)
  }

  /**
   * Geometry
   */
  particlesGeometry = new THREE.BufferGeometry()
  const particlesPositions = new Float32Array(parameters.count * 3)

  for (let i = 0; i < parameters.count * 3; i++) {
    const i3 = i * 3
    //   x
    particlesPositions[i3] = Math.random() - 0.5
    //   y
    particlesPositions[i3 + 1] = Math.random() - 0.5
    //   z
    particlesPositions[i3 + 2] = Math.random() - 0.5
  }

  particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(particlesPositions, 3)
  )

  /**
   * Material
   */
  particlesMaterial = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  /**
   * Points
   */
  stars = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(stars)
}

generateGalaxy()

/**
 * GUI Tweaks
 */
gui
  .add(parameters, 'count')
  .min(100)
  .max(1000000)
  .step(100)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, 'size')
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .onFinishChange(generateGalaxy)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
