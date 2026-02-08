import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const GRID_COLOR = 0x00ff88
const GRID_OPACITY = 0.06
const PARTICLE_COUNT = 80
const PARTICLE_OPACITY = 0.3

export function GridBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000)
    camera.position.set(0, 0, 50)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Grid lines
    const gridGroup = new THREE.Group()

    const lineMaterial = new THREE.LineBasicMaterial({
      color: GRID_COLOR,
      opacity: GRID_OPACITY,
      transparent: true,
    })

    const gridSize = 100
    const gridStep = 5

    for (let i = -gridSize; i <= gridSize; i += gridStep) {
      // Horizontal
      const hGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-gridSize, i, 0),
        new THREE.Vector3(gridSize, i, 0),
      ])
      gridGroup.add(new THREE.Line(hGeom, lineMaterial))

      // Vertical
      const vGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(i, -gridSize, 0),
        new THREE.Vector3(i, gridSize, 0),
      ])
      gridGroup.add(new THREE.Line(vGeom, lineMaterial))
    }

    gridGroup.rotation.x = Math.PI * 0.35
    gridGroup.position.y = -15
    scene.add(gridGroup)

    // Floating particles
    const particleGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const velocities = new Float32Array(PARTICLE_COUNT * 3)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30
      velocities[i * 3] = (Math.random() - 0.5) * 0.02
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02
      velocities[i * 3 + 2] = 0
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const particleMaterial = new THREE.PointsMaterial({
      color: GRID_COLOR,
      size: 0.3,
      opacity: PARTICLE_OPACITY,
      transparent: true,
      sizeAttenuation: true,
    })

    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    // Mouse tracking
    let mouseX = 0
    let mouseY = 0

    function onMouseMove(e: MouseEvent) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }

    window.addEventListener('mousemove', onMouseMove)

    // Animation loop
    let animationId: number

    function animate() {
      animationId = requestAnimationFrame(animate)

      // Subtle camera movement following mouse
      camera.position.x += (mouseX * 3 - camera.position.x) * 0.02
      camera.position.y += (-mouseY * 3 - camera.position.y) * 0.02
      camera.lookAt(0, 0, 0)

      // Animate particles
      const pos = particleGeometry.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pos.array[i * 3] += velocities[i * 3]
        pos.array[i * 3 + 1] += velocities[i * 3 + 1]

        // Wrap around
        if (pos.array[i * 3] > 40) pos.array[i * 3] = -40
        if (pos.array[i * 3] < -40) pos.array[i * 3] = 40
        if (pos.array[i * 3 + 1] > 30) pos.array[i * 3 + 1] = -30
        if (pos.array[i * 3 + 1] < -30) pos.array[i * 3 + 1] = 30
      }
      pos.needsUpdate = true

      renderer.render(scene, camera)
    }

    animate()

    // Resize handler
    function onResize() {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }

    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(animationId)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  )
}
