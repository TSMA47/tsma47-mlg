import { Canvas, extend, useFrame } from '@react-three/fiber'
import { Suspense, useEffect, useState, useRef } from 'react'
import { 
  Environment, 
  OrbitControls,
  AccumulativeShadows,
  RandomizedLight,
  BakeShadows,
  useProgress,
  Html,
} from '@react-three/drei'
import { EffectComposer, Bloom, SMAA } from '@react-three/postprocessing'
import { useToast } from "@/hooks/use-toast"
import { SocialLinks } from "@/components/social/social-links"
import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { Cannabis, TrendingUp } from 'lucide-react'

// Extend THREE.Group for R3F
extend({ Group: THREE.Group })

// Global model cache
const modelCache = new Map<string, THREE.Group>()

// MLG Overlay Component
function MLGOverlay() {
  return (
    <Html fullscreen>
      <div className="pointer-events-none w-full h-full">
        {/* Sniper Scope */}
        <div className="absolute inset-0 border-[16px] border-black rounded-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[2px] h-full bg-red-500/50" />
            <div className="absolute w-full h-[2px] bg-red-500/50" />
          </div>
        </div>

        {/* MLG Elements */}
        <div className="absolute top-4 left-4">
          <Cannabis className="w-8 h-8 text-green-500 animate-spin" />
        </div>

        {/* Trump Memecoin Chart */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 p-2 rounded-lg backdrop-blur-sm">
          <div className="flex items-center gap-1 text-green-400 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span className="font-bold">TSMA47 🚀</span>
          </div>
          <div className="w-32 h-16 mt-1 border border-green-500/30 rounded relative overflow-hidden">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="absolute bottom-0 bg-green-500/20"
                style={{
                  left: `${i * 10}%`,
                  height: `${Math.random() * 100}%`,
                  width: '3px'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </Html>
  )
}

// Loading screen component with progress
function LoadingScreen() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="text-center bg-black/80 p-4 rounded-lg backdrop-blur-sm">
        <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-gray-400">Loading Model: {progress.toFixed(0)}%</p>
      </div>
    </Html>
  )
}

interface ModelProps {
  isSpinning: boolean;
}

function Model({ isSpinning }: ModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [model, setModel] = useState<THREE.Group | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loader = new FBXLoader()
    const modelPath = '/trump-skibidi-scientist-mech/source/Scientist Trump.fbx'

    const loadModel = async () => {
      try {
        // Check cache first
        if (modelCache.has(modelPath)) {
          console.log('Using cached model')
          setModel(modelCache.get(modelPath)!.clone())
          return
        }

        console.log('Loading model from disk')
        const fbx = await loader.loadAsync(modelPath)

        // Optimize the model
        fbx.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            // Enable frustum culling
            obj.frustumCulled = true

            // Optimize geometry
            if (obj.geometry) {
              obj.geometry.computeBoundingSphere()
              obj.geometry.computeBoundingBox()
            }

            // Set up optimized materials
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

            // Optimize shadows
            obj.castShadow = true
            obj.receiveShadow = true
          }
        })

        // Scale and position
        fbx.scale.set(0.003, 0.003, 0.003)
        fbx.position.set(0, -1, 0)
        fbx.rotation.set(0, Math.PI / 4, 0)

        // Cache the model
        modelCache.set(modelPath, fbx.clone())
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
      if (model) {
        model.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose()
            if (Array.isArray(obj.material)) {
              obj.material.forEach(material => material.dispose())
            } else {
              obj.material.dispose()
            }
          }
        })
      }
    }
  }, [toast])

  useFrame((_, delta) => {
    if (isSpinning && groupRef.current) {
      groupRef.current.rotation.y += delta * 2
    }
  })

  if (!model) return null

  return (
    <group ref={groupRef}>
      <primitive object={model} />
    </group>
  )
}

export function TrumpModel() {
  const [isSpinning] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <div className="absolute top-4 right-4 z-[100]">
        <SocialLinks />
      </div>

      <div ref={containerRef} className="w-full h-full relative">
        <Canvas
          shadows
          camera={{ 
            position: [4, 2, 5], 
            fov: 45,
            near: 0.1,
            far: 100 
          }}
          gl={{ 
            antialias: false,
            alpha: true,
            powerPreference: "high-performance",
            preserveDrawingBuffer: true,
            logarithmicDepthBuffer: true
          }}
          style={{ position: 'relative', zIndex: 1 }}
          className="pointer-events-auto"
        >
          <color attach="background" args={[0x1a1a1a]} />

          <Suspense fallback={<LoadingScreen />}>
            <Model isSpinning={isSpinning} />
            <MLGOverlay />

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
          />

          <directionalLight
            castShadow
            position={[2, 4, 3]}
            intensity={2}
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight
            position={[-3, 2, -2]}
            intensity={1}
          />
          <ambientLight intensity={0.3} />
        </Canvas>
      </div>
    </>
  )
}