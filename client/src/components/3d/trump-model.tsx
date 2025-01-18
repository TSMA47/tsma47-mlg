import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useEffect, useState, useRef } from 'react'
import { 
  Environment, 
  OrbitControls, 
  AccumulativeShadows,
  RandomizedLight,
  ContactShadows,
  BakeShadows,
} from '@react-three/drei'
import { EffectComposer, Bloom, SMAA } from '@react-three/postprocessing'
import { useToast } from "@/hooks/use-toast"
import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ModelProps {
  isSpinning: boolean;
}

function Model({ isSpinning }: ModelProps) {
  const [model, setModel] = useState<THREE.Group | null>(null)
  const modelRef = useRef<THREE.Group>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loader = new FBXLoader()
    loader.load(
      '/trump-skibidi-scientist-mech/source/Scientist Trump.fbx',
      (fbx) => {
        fbx.traverse((obj: any) => {
          if (obj.isMesh) {
            // Enable shadows for all meshes
            obj.castShadow = true
            obj.receiveShadow = true

            // Enhance metallic parts with chrome-like finish
            if (obj.name.toLowerCase().includes('metal') || obj.name.toLowerCase().includes('mech')) {
              obj.material.metalness = 0.9
              obj.material.roughness = 0.1
              obj.material.envMapIntensity = 2.5
              obj.material.needsUpdate = true
            }

            // Glass or transparent parts
            if (obj.name.toLowerCase().includes('glass') || obj.name.toLowerCase().includes('lens')) {
              obj.material.transparent = true
              obj.material.opacity = 0.9
              obj.material.metalness = 1
              obj.material.roughness = 0
              obj.material.envMapIntensity = 3
              obj.material.needsUpdate = true
            }

            // Face and skin materials
            if (obj.name.toLowerCase().includes('face') || obj.name.toLowerCase().includes('skin')) {
              obj.material.metalness = 0.1
              obj.material.roughness = 0.8
              obj.material.envMapIntensity = 0.5
              obj.material.needsUpdate = true
            }
          }
        })

        // Add the model to the scene
        fbx.scale.set(0.003, 0.003, 0.003)
        fbx.position.set(0, -1, 0)
        fbx.rotation.set(0, Math.PI / 4, 0)
        setModel(fbx)
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total) * 100, '%')
      },
      (error) => {
        console.error('Error loading model:', error)
        toast({
          title: "Error",
          description: "Failed to load 3D model",
          variant: "destructive"
        })
      }
    )
  }, [toast])

  // Animation loop for spinning
  useFrame((_, delta) => {
    if (isSpinning && modelRef.current) {
      modelRef.current.rotation.y += delta * 2 // Adjust speed by changing multiplier
    }
  })

  return model ? (
    <primitive 
      ref={modelRef}
      object={model}
    />
  ) : null
}

function ControlPanel({ onSpin }: { onSpin: () => void }) {
  return (
    <Card className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-4 flex gap-2">
      <Button onClick={onSpin} variant="outline">
        Spin Model
      </Button>
    </Card>
  )
}

export function TrumpModel() {
  const [isSpinning, setIsSpinning] = useState(false)

  const handleSpin = () => {
    setIsSpinning(prev => !prev)
  }

  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        camera={{ 
          position: [4, 2, 5], 
          fov: 45,
          near: 0.1,
          far: 100 
        }}
        gl={{ 
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true
        }}
      >
        <color attach="background" args={[0x1a1a1a]} />

        <Suspense fallback={null}>
          <Model isSpinning={isSpinning} />

          {/* High-quality environment lighting */}
          <Environment
            preset="studio"
            background={false}
            blur={0.5}
          />

          {/* Ground shadows for better grounding */}
          <ContactShadows
            position={[0, -1.5, 0]}
            scale={10}
            blur={2}
            far={3}
            opacity={0.6}
          />

          {/* Accumulative shadows for realism */}
          <AccumulativeShadows
            position={[0, -1.5, 0]}
            scale={10}
            opacity={0.8}
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

          {/* Post-processing effects */}
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

        {/* Camera controls */}
        <OrbitControls 
          minDistance={3}
          maxDistance={15}
          target={[0, 0, 0]}
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
        />

        {/* Three-point lighting setup */}
        <directionalLight
          castShadow
          position={[2, 4, 3]}
          intensity={2}
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
        />
        <directionalLight
          position={[-3, 2, -2]}
          intensity={1}
        />
        <directionalLight
          position={[3, -1, -2]}
          intensity={0.5}
          color="#4444ff"
        />
        <ambientLight intensity={0.3} />
      </Canvas>
      <ControlPanel onSpin={handleSpin} />
    </div>
  )
}