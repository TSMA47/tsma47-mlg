import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect } from 'react'
import { 
  Environment, 
  OrbitControls, 
  useGLTF,
  AccumulativeShadows,
  RandomizedLight,
  ContactShadows,
  BakeShadows,
} from '@react-three/drei'
import { EffectComposer, Bloom, SMAA } from '@react-three/postprocessing'
import { useToast } from "@/hooks/use-toast"

function Model() {
  const { scene } = useGLTF('/trump-skibidi-scientist-mech/source/Scientist Trump.fbx')
  const { toast } = useToast()

  useEffect(() => {
    scene.traverse((obj: any) => {
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
  }, [scene])

  return (
    <primitive 
      object={scene} 
      scale={0.003} 
      position={[0, -1, 0]} 
      rotation={[0, Math.PI / 4, 0]} 
    />
  )
}

export function TrumpModel() {
  return (
    <div className="w-full h-full">
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
          <Model />

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
    </div>
  )
}