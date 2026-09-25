import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'

function MemoryObject() {
  const group = useRef(null)

  useFrame(({ clock, pointer }) => {
    if (!group.current) return
    group.current.rotation.x = Math.sin(clock.elapsedTime * 0.65) * 0.18 + pointer.y * 0.15
    group.current.rotation.y = clock.elapsedTime * 0.24 + pointer.x * 0.35
    group.current.position.y = Math.sin(clock.elapsedTime * 0.9) * 0.08
  })

  return (
    <group ref={group} scale={1.22}>
      <mesh castShadow>
        <dodecahedronGeometry args={[1.22, 0]} />
        <meshStandardMaterial color="#b9ad92" roughness={0.88} metalness={0.08} />
      </mesh>
      <mesh rotation={[0.5, 0.1, 0.78]}>
        <torusGeometry args={[1.55, 0.03, 12, 96]} />
        <meshStandardMaterial color="#7e1d1d" roughness={0.55} metalness={0.2} />
      </mesh>
      <mesh rotation={[1.4, -0.4, -0.2]}>
        <torusGeometry args={[1.82, 0.022, 12, 96]} />
        <meshStandardMaterial color="#d8cfb8" roughness={0.7} metalness={0.12} />
      </mesh>
    </group>
  )
}

function HeroRelic3D() {
  return (
    <Canvas camera={{ position: [0, 0, 4.05], fov: 38 }} dpr={[1, 1.6]}>
      <ambientLight intensity={1.4} />
      <directionalLight position={[3, 2, 4]} intensity={2.1} />
      <pointLight position={[-3, -1, 2]} intensity={1.4} color="#7e1d1d" />
      <MemoryObject />
    </Canvas>
  )
}

export default HeroRelic3D
