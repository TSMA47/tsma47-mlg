import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useEffect, useState, useRef } from 'react'
import { 
  Environment, 
  OrbitControls,
  AccumulativeShadows,
  RandomizedLight,
  BakeShadows,
  useProgress,
} from '@react-three/drei'
import { EffectComposer, Bloom, SMAA } from '@react-three/postprocessing'
import { useToast } from "@/hooks/use-toast"
import { SocialLinks } from "@/components/social/social-links"
import * as THREE from 'three'
import type { Group, Object3D } from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

// Loading screen component
function LoadingScreen() {
  const { progress } = useProgress()
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90">
      <div className="text-center">
        <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-gray-400">{progress.toFixed(0)}% loaded</p>
      </div>
    </div>
  )
}

interface ModelProps {
  isSpinning: boolean;
}

function Model({ isSpinning }: ModelProps) {
  const [model, setModel] = useState<Group | null>(null)
  const modelRef = useRef<Group>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loader = new FBXLoader()
    const modelCache = new Map<string, Group>()

    const loadModel = async () => {
      try {
        // Check cache first
        const cachedModel = modelCache.get('/trump-skibidi-scientist-mech/source/Scientist Trump.fbx')
        if (cachedModel) {
          setModel(cachedModel.clone())
          return
        }

        const fbx = await loader.loadAsync('/trump-skibidi-scientist-mech/source/Scientist Trump.fbx')

        // Optimize materials and geometries
        fbx.traverse((obj: Object3D) => {
          if (obj instanceof THREE.Mesh) {
            // Enable frustum culling
            obj.frustumCulled = true

            // Optimize geometry
            if (obj.geometry) {
              obj.geometry.computeBoundingSphere()
              obj.geometry.computeBoundingBox()
            }

            // Set up materials for better performance
            if (obj.material instanceof THREE.MeshStandardMaterial) {
              if (obj.name.toLowerCase().includes('metal') || obj.name.toLowerCase().includes('mech')) {
                obj.material.metalness = 0.9
                obj.material.roughness = 0.1
                obj.material.envMapIntensity = 1.5
              } else if (obj.name.toLowerCase().includes('glass') || obj.name.toLowerCase().includes('lens')) {
                obj.material.transparent = true
                obj.material.opacity = 0.9
                obj.material.metalness = 1
                obj.material.roughness = 0
                obj.material.envMapIntensity = 1.5
              } else {
                obj.material.metalness = 0.1
                obj.material.roughness = 0.8
                obj.material.envMapIntensity = 0.5
              }
              obj.material.needsUpdate = true
            }
            obj.castShadow = true
            obj.receiveShadow = true
          }
        })

        // Optimize scale and position
        fbx.scale.set(0.003, 0.003, 0.003)
        fbx.position.set(0, -1, 0)
        fbx.rotation.set(0, Math.PI / 4, 0)

        // Cache the optimized model
        modelCache.set('/trump-skibidi-scientist-mech/source/Scientist Trump.fbx', fbx.clone())
        setModel(fbx)
      } catch (error) {
        console.error('Error loading model:', error)
        toast({
          title: "Error",
          description: "Failed to load 3D model",
          variant: "destructive"
        })
      }
    }

    loadModel()

    // Cleanup
    return () => {
      modelCache.clear()
    }
  }, [toast])

  useFrame((_, delta) => {
    if (isSpinning && modelRef.current) {
      modelRef.current.rotation.y += delta * 2
    }
  })

  return model ? (
    <primitive 
      ref={modelRef}
      object={model}
    />
  ) : null
}

export function TrumpModel() {
  const [isSpinning] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {/* Social Links Overlay */}
      <div className="absolute top-0 right-0 z-10 p-2">
        <SocialLinks />
      </div>

      <Canvas
        shadows
        camera={{ 
          position: [4, 2, 5], 
          fov: 45,
          near: 0.1,
          far: 100 
        }}
        gl={{ 
          antialias: false, // Disable antialiasing for better performance
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: true
        }}
        performance={{ min: 0.5 }} // Allow frame rate to drop for better loading
      >
        <color attach="background" args={[0x1a1a1a]} />

        <Suspense fallback={<LoadingScreen />}>
          <Model isSpinning={isSpinning} />

          <Environment
            preset="studio"
            background={false}
            blur={0.5}
          />

          <AccumulativeShadows
            position={[0, -1.5, 0]}
            scale={10}
            opacity={0.4}
            frames={100}
            temporal
            blend={100}
          >
            <RandomizedLight
              amount={8}
              position={[5, 5, -2]}
              intensity={1}
              ambient={0.5}
              bias={0.001}
            />
          </AccumulativeShadows>

          <EffectComposer>
            <Bloom
              intensity={1}
              luminanceThreshold={0.8}
              luminanceSmoothing={0.9}
            />
            <SMAA />
          </EffectComposer>

          <BakeShadows />
        </Suspense>

        <OrbitControls 
          minDistance={3}
          maxDistance={15}
          target={[0, 0, 0]}
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          makeDefault
          enablePan={false}
          enableZoom={true}
          domElement={containerRef.current || undefined}
        />

        <directionalLight
          castShadow
          position={[2, 4, 3]}
          intensity={2}
          shadow-mapSize={[1024, 1024]} // Reduced shadow map size for better performance
        />
        <directionalLight
          position={[-3, 2, -2]}
          intensity={1}
        />
        <ambientLight intensity={0.3} />
      </Canvas>
    </div>
  )
}