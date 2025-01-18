import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useEffect, useState, useRef } from 'react'
import { 
  Environment, 
  OrbitControls, 
  AccumulativeShadows,
  RandomizedLight,
  BakeShadows,
} from '@react-three/drei'
import { EffectComposer, Bloom, SMAA } from '@react-three/postprocessing'
import { useToast } from "@/hooks/use-toast"
import { SocialLinks } from "@/components/social/social-links"
import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

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
            obj.castShadow = true
            obj.receiveShadow = true

            if (obj.name.toLowerCase().includes('metal') || obj.name.toLowerCase().includes('mech')) {
              obj.material.metalness = 0.9
              obj.material.roughness = 0.1
              obj.material.envMapIntensity = 2.5
              obj.material.needsUpdate = true
            }

            if (obj.name.toLowerCase().includes('glass') || obj.name.toLowerCase().includes('lens')) {
              obj.material.transparent = true
              obj.material.opacity = 0.9
              obj.material.metalness = 1
              obj.material.roughness = 0
              obj.material.envMapIntensity = 3
              obj.material.needsUpdate = true
            }

            if (obj.name.toLowerCase().includes('face') || obj.name.toLowerCase().includes('skin')) {
              obj.material.metalness = 0.1
              obj.material.roughness = 0.8
              obj.material.envMapIntensity = 0.5
              obj.material.needsUpdate = true
            }
          }
        })

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
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true
        }}
      >
        <color attach="background" args={[0x1a1a1a]} />

        <Suspense fallback={null}>
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
    </div>
  )
}