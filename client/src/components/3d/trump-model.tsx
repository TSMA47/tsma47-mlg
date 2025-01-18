import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { useToast } from "@/hooks/use-toast"

export function TrumpModel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf8f9fa)

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 1.5, 3)

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    )
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    containerRef.current.appendChild(renderer.domElement)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.minDistance = 2
    controls.maxDistance = 10
    controls.target.set(0, 1, 0)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    scene.add(directionalLight)

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3)
    fillLight.position.set(-5, 0, -5)
    scene.add(fillLight)

    // Texture loader
    const textureLoader = new THREE.TextureLoader()
    const loadTexture = (path: string) => {
      return textureLoader.load(path, 
        undefined,
        undefined,
        (error) => console.error('Error loading texture:', error)
      )
    }

    // Load Model
    const loader = new FBXLoader()
    loader.load(
      '/source/Scientist Trump.fbx',
      (fbx) => {
        // Scale and position the model
        fbx.scale.setScalar(0.01)
        fbx.position.y = 0
        fbx.rotation.y = Math.PI / 4

        // Apply textures to the model
        fbx.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Enable shadows
            child.castShadow = true
            child.receiveShadow = true

            // Apply basic materials with textures
            const material = new THREE.MeshPhongMaterial({
              map: loadTexture('/textures/Body_D.png'),
              normalMap: loadTexture('/textures/Body_N.png'),
              shininess: 50
            })
            child.material = material
          }
        })

        scene.add(fbx)
        setIsLoading(false)
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total) * 100, '%')
      },
      (error) => {
        console.error('Error loading model:', error)
        toast({
          title: "Error",
          description: "Failed to load 3D model. Please try refreshing the page.",
          variant: "destructive"
        })
      }
    )

    // Add a ground plane
    const groundGeometry = new THREE.PlaneGeometry(10, 10)
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xeeeeee,
      roughness: 0.8,
      metalness: 0.2
    })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    // Animation Loop
    let frameId: number
    function animate() {
      frameId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    function handleResize() {
      if (!containerRef.current) return

      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(frameId)
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          if (object.material instanceof THREE.Material) {
            object.material.dispose()
          }
        }
      })
      renderer.dispose()
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="text-lg font-medium">Loading 3D Model...</div>
        </div>
      )}
    </div>
  )
}