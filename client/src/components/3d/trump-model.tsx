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
    scene.background = new THREE.Color(0x1a1a1a)

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.00001,
      0.1
    )
    camera.position.set(0, 0.00005, 0.0002)

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
    controls.minDistance = 0.0001
    controls.maxDistance = 0.0004
    controls.target.set(0, 0.00003, 0)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(0.0005, 0.0005, 0.0005)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    scene.add(directionalLight)

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3)
    fillLight.position.set(-0.0005, 0, -0.0005)
    scene.add(fillLight)

    // Texture loader with error handling
    const textureLoader = new THREE.TextureLoader()
    const loadTexture = (path: string) => {
      return textureLoader.load(
        path,
        undefined,
        undefined,
        (error) => {
          console.error('Error loading texture:', error)
          toast({
            title: "Error",
            description: `Failed to load texture: ${path}`,
            variant: "destructive"
          })
        }
      )
    }

    // Materials setup
    const materials = {
      metal: new THREE.MeshStandardMaterial({
        map: loadTexture('/trump-skibidi-scientist-mech/textures/metalwall_baseColor.png'),
        normalMap: loadTexture('/trump-skibidi-scientist-mech/textures/metal normal.png'),
        metalness: 0.9,
        roughness: 0.1,
        envMapIntensity: 1.0
      }),
      body: new THREE.MeshStandardMaterial({
        map: loadTexture('/trump-skibidi-scientist-mech/textures/Body_D.png'),
        normalMap: loadTexture('/trump-skibidi-scientist-mech/textures/Body_N.png'),
        metalness: 0.3,
        roughness: 0.7
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
      }),
      mechanic: new THREE.MeshStandardMaterial({
        map: loadTexture('/trump-skibidi-scientist-mech/textures/mechanic_head_color.jpg'),
        normalMap: loadTexture('/trump-skibidi-scientist-mech/textures/mechanic_head_normal.jpeg'),
        metalness: 0.7,
        roughness: 0.3
      })
    }

    // Create environment map for reflections
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256)
    const cubeCamera = new THREE.CubeCamera(0.00001, 0.1, cubeRenderTarget)
    scene.background = new THREE.Color(0x1a1a1a)

    // Load Model
    const loader = new FBXLoader()
    loader.load(
      '/trump-skibidi-scientist-mech/source/Scientist Trump.fbx',
      (fbx) => {
        fbx.scale.setScalar(0.00000003)
        fbx.position.y = 0
        fbx.rotation.y = Math.PI / 4

        fbx.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true
            child.receiveShadow = true

            // Apply materials based on mesh names
            const name = child.name.toLowerCase()
            if (name.includes('metal') || name.includes('mech')) {
              child.material = materials.metal
              // Add environment mapping for reflective surfaces
              child.material.envMap = cubeRenderTarget.texture
              child.material.envMapIntensity = 1.0
            } else if (name.includes('skin') || name.includes('face')) {
              child.material = materials.skin
            } else if (name.includes('hair')) {
              child.material = materials.hair
            } else if (name.includes('mechanic')) {
              child.material = materials.mechanic
              child.material.envMap = cubeRenderTarget.texture
              child.material.envMapIntensity = 0.8
            } else {
              child.material = materials.body
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

    // Add a ground plane
    const groundGeometry = new THREE.PlaneGeometry(0.0004, 0.0004)
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
    function animate() {
      requestAnimationFrame(animate)

      // Update environment map for reflections
      cubeCamera.update(renderer, scene)

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
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose())
          } else if (object.material) {
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