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
parameters.count = 100000
parameters.size = 0.01
parameters.radius = 5
parameters.branches = 3
parameters.spin = 1
parameters.randomness = 0.02
parameters.randomnessPower = 3

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

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3

    const radius = Math.random() * parameters.radius
    const spinAngle = radius * parameters.spin
    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2

    const randomX =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius

    const randomY =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius

    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius

    //   x
    particlesPositions[i3] =
      Math.cos(branchAngle + spinAngle) * radius + randomX
    //   y
    particlesPositions[i3 + 1] = randomY
    //   z
    particlesPositions[i3 + 2] =
      Math.sin(branchAngle + spinAngle) * radius + randomZ
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
  .name('star count')
  .min(100)
  .max(1000000)
  .step(100)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, 'size')
  .name('star size')
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .onFinishChange(generateGalaxy)

gui
  .add(parameters, 'radius')
  .name('galaxy size')
  .min(0.01)
  .max(20)
  .step(0.01)
  .onFinishChange(generateGalaxy)

gui
  .add(parameters, 'branches')
  .name('galaxy branches')
  .min(2)
  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy)

gui
  .add(parameters, 'spin')
  .name('galaxy spin')
  .min(-5)
  .max(5)
  .step(0.001)
  .onFinishChange(generateGalaxy)

gui
  .add(parameters, 'randomness')
  .name('randomness')
  .min(0)
  .max(2)
  .step(0.001)
  .onFinishChange(generateGalaxy)

gui
  .add(parameters, 'randomnessPower')
  .name('gravity')
  .min(1)
  .max(10)
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
