import { component$, useStore, useStyles$ } from '@builder.io/qwik';
import { QwikCity, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import globalStyles from './global.css?inline';
import Main from './components/Main'

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCity> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Dont remove the `<head>` and `<body>` elements.
   */
  useStyles$(globalStyles);

  // true is dark and false is light
  const store = useStore({theme: false})

  return (
    <QwikCity>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body lang="en">
        <canvas class="webgl"></canvas>
        <Main mode={store.theme}/>
        <RouterOutlet />
        <ServiceWorkerRegister />
        <button id="theme_button" onClick$={() => {
          if (store.theme) {
            store.theme = false
            document.documentElement.style.setProperty('--text-color', '#132a4f')
            document.documentElement.style.setProperty('--theme-color', '#fff')
            document.documentElement.style.setProperty('--highlight-color', 'rgb(255, 226, 146)')
          } else {
            store.theme = true
            document.documentElement.style.setProperty('--text-color', '#fff')
            document.documentElement.style.setProperty('--theme-color', '#132a4f')
            document.documentElement.style.setProperty('--highlight-color', 'rgb(237, 192, 67)')
          }
        }}>{store.theme? "Light" : "Dark"} theme</button>
        <script>
        import * as THREE from 'three'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load("textures/gradients/3.jpg")
gradientTexture.magFilter = THREE.NearestFilter

const particlesCount = 1000
const positions = new Float32Array(particlesCount * 3)

for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * (sizes.width / sizes.height) * 2
    positions[i * 3 + 1] = (Math.random() - 0.5) * (sizes.width / sizes.height) * 2
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

const particlesTexture = textureLoader.load("/images/particle/1.png")

const particlesMaterial = new THREE.PointsMaterial({
    alphaMap: particlesTexture,
    alphaTest: 0.01,
    transparent: true,
    size: 0.05,
    sizeAttenuation: true,
    vertexColors: true,
})

particlesMaterial.depthWrite = false
particlesMaterial.blending = THREE.AdditiveBlending


const particles = new THREE.Points(particlesGeometry, particlesMaterial)

scene.add(particles)



const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener("mousemove", (event) => {
    cursor.x = (event.clientX / sizes.width) - 0.5
    cursor.y = (event.clientY / sizes.height) - 0.5
})

// lights

const directionalLight = new THREE.DirectionalLight("#ffffff", 1)
directionalLight.position.set(1, 1, 0)

scene.add(directionalLight)

window.addEventListener('resize', () =>
{
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

const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
})

/**
 * Animate
 */
const clock = new THREE.Clock()

let previousTime = 0

const tick = () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // canvas scroll

    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x)  * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y)  * deltaTime

     // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
        </script>
      </body>
    </QwikCity>
  )
})
