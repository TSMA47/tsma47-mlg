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
    scene.background = new THREE.Color(0x1a1a1a) // Darker background to match reference

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75, // Wider FOV
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 1.5, 3) // Moved camera closer and slightly higher

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
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0
    containerRef.current.appendChild(renderer.domElement)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.minDistance = 1.5
    controls.maxDistance = 6
    controls.target.set(0, 0.75, 0)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0xffffff, 3)
    mainLight.position.set(5, 5, 5)
    mainLight.castShadow = true
    mainLight.shadow.mapSize.width = 2048
    mainLight.shadow.mapSize.height = 2048
    scene.add(mainLight)

    const rimLight = new THREE.DirectionalLight(0x00ffff, 2) // Cyan rim light
    rimLight.position.set(-5, 2, -5)
    scene.add(rimLight)

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
      '/trump-skibidi-scientist-mech/source/Scientist Trump.fbx',
      (fbx) => {
        fbx.scale.setScalar(1) // Increased scale significantly
        fbx.position.y = 0
        fbx.rotation.y = Math.PI / 4

        // Apply materials and textures to the model
        fbx.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true
            child.receiveShadow = true

            // Set default material first
            const defaultMaterial = new THREE.MeshStandardMaterial({
              map: loadTexture('/trump-skibidi-scientist-mech/textures/Body_D.png'),
              normalMap: loadTexture('/trump-skibidi-scientist-mech/textures/Body_N.png'),
              metalness: 0.3,
              roughness: 0.7
            })

            // Create specific materials for different parts
            const materials: { [key: string]: THREE.Material } = {
              metal: new THREE.MeshStandardMaterial({
                map: loadTexture('/trump-skibidi-scientist-mech/textures/metalwall_baseColor.png'),
                normalMap: loadTexture('/trump-skibidi-scientist-mech/textures/membrane normal.png'),
                metalness: 0.8,
                roughness: 0.2
              }),
              skin: new THREE.MeshStandardMaterial({
                map: loadTexture('/trump-skibidi-scientist-mech/textures/trumpskin_albedo.jpeg'),
                normalMap: loadTexture('/trump-skibidi-scientist-mech/textures/trumpskin_normals.jpeg'),
                metalness: 0.0,
                roughness: 0.9
              }),
              hair: new THREE.MeshStandardMaterial({
                map: loadTexture('/trump-skibidi-scientist-mech/textures/trumphair_albedo.jpeg'),
                normalMap: loadTexture('/trump-skibidi-scientist-mech/textures/trumphair_normals.jpeg'),
                metalness: 0.1,
                roughness: 0.8
              })
            }

            // Apply materials based on mesh names
            if (child.name.toLowerCase().includes('metal') || child.name.toLowerCase().includes('mech')) {
              child.material = materials.metal
            } else if (child.name.toLowerCase().includes('skin')) {
              child.material = materials.skin
            } else if (child.name.toLowerCase().includes('hair')) {
              child.material = materials.hair
            } else {
              child.material = defaultMaterial
            }
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

    // Add a ground plane with reflection
    const groundGeometry = new THREE.PlaneGeometry(10, 10)
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x111111,
      roughness: 0.1,
      metalness: 0.8,
      envMapIntensity: 1.0
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