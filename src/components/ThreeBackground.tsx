import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Environment, Torus, Cylinder, Sphere, Cone, Box, Icosahedron, Octahedron, Dodecahedron, Tetrahedron } from "@react-three/drei"
import { useRef, useMemo } from "react"
import * as THREE from "three"

function Particles() {
  const pointsRef = useRef<THREE.Points>(null!)
  
  // Clean, minimal particles
  const particlesCount = 70
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3)
    for(let i = 0; i < particlesCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12 - 4
    }
    return pos
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.03
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.01
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#22c55e"
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  )
}

function CoinStack({ position }: { position: [number, number, number] }) {
  const group = useRef<THREE.Group>(null!)
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.5
  })
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8} floatingRange={[-0.1, 0.1]}>
      <group position={position} rotation={[0.5, 0.5, 0]} ref={group}>
        {[0, 1, 2].map((i) => (
            <Cylinder key={i} args={[0.6, 0.6, 0.1, 32]} position={[i * 0.1 - 0.1, i * 0.12, i * 0.05]} rotation={[0, i * 0.5, 0]}>
            <meshPhysicalMaterial color="#fbbf24" metalness={0.8} roughness={0.2} clearcoat={1} />
            </Cylinder>
        ))}
      </group>
    </Float>
  )
}

function NatureSymbol({ position }: { position: [number, number, number] }) {
    const group = useRef<THREE.Group>(null!)
    useFrame((state) => {
      if (group.current) {
        group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
      }
    })
    return (
      <Float speed={1} rotationIntensity={0.8} floatIntensity={0.5}>
        <group position={position} rotation={[0, 0, 0.2]} ref={group}>
          <Cone args={[0.7, 1.5, 6]} position={[0, 0.5, 0]}>
            <meshPhysicalMaterial color="#4ade80" roughness={0.2} transmission={0.6} thickness={1} transparent opacity={0.8} />
          </Cone>
          <Cylinder args={[0.15, 0.2, 0.8, 8]} position={[0, -0.6, 0]}>
             <meshStandardMaterial color="#78350f" roughness={0.8} />
          </Cylinder>
        </group>
      </Float>
    )
}

function InnovationSymbol({ position }: { position: [number, number, number] }) {
    const ringsRef = useRef<THREE.Group>(null!)
    useFrame((state, delta) => {
        if (ringsRef.current) {
            ringsRef.current.rotation.x += delta * 0.2
            ringsRef.current.rotation.y += delta * 0.3
        }
    })
    return (
      <Float speed={2} rotationIntensity={1.5} floatIntensity={0.5}>
        <group position={position}>
            <Sphere args={[0.4, 32, 32]}>
                <meshPhysicalMaterial color="#0ea5e9" metalness={0.5} roughness={0.1} emissive="#0284c7" emissiveIntensity={0.5} />
            </Sphere>
            <group ref={ringsRef}>
                {[0, 1, 2].map((i) => (
                    <Torus key={i} args={[0.9, 0.04, 16, 64]} rotation={[i * 0.8 + 1.5, i * 0.8, 0]}>
                        <meshPhysicalMaterial color="#bae6fd" metalness={0.8} roughness={0.1} transparent opacity={0.6} />
                    </Torus>
                ))}
            </group>
        </group>
      </Float>
    )
}

function HealthSymbol({ position }: { position: [number, number, number] }) {
    const group = useRef<THREE.Group>(null!)
    useFrame((state, delta) => {
        if (group.current) group.current.rotation.z += delta * 0.2
    })
    return (
        <Float speed={1.2} rotationIntensity={0.6} floatIntensity={0.5}>
            <group position={position} ref={group}>
                {/* Abstract Molecule / Organic Shape */}
                <Sphere args={[0.4, 16, 16]} position={[0, 0, 0]}>
                    <meshPhysicalMaterial color="#f43f5e" roughness={0.1} metalness={0.1} transmission={0.2} />
                </Sphere>
                <Sphere args={[0.3, 16, 16]} position={[0.4, 0.4, 0]}>
                    <meshPhysicalMaterial color="#fb7185" roughness={0.1} metalness={0.1} transmission={0.2} />
                </Sphere>
                 <Sphere args={[0.3, 16, 16]} position={[-0.4, 0.4, 0]}>
                    <meshPhysicalMaterial color="#fb7185" roughness={0.1} metalness={0.1} transmission={0.2} />
                </Sphere>
                 <Sphere args={[0.25, 16, 16]} position={[0, -0.5, 0.2]}>
                    <meshPhysicalMaterial color="#fda4af" roughness={0.1} metalness={0.1} transmission={0.2} />
                </Sphere>
            </group>
        </Float>
    )
}

function EducationSymbol({ position }: { position: [number, number, number] }) {
    const group = useRef<THREE.Group>(null!)
    useFrame((state, delta) => {
        if(group.current) group.current.rotation.y += delta * 0.1
    })
    return (
        <Float speed={0.9} rotationIntensity={0.4} floatIntensity={0.4}>
            <group position={position} rotation={[0.4, 0.2, 0]} ref={group}>
                {/* Book Cover */}
                <Box args={[1, 1.4, 0.2]}>
                    <meshPhysicalMaterial color="#4f46e5" metalness={0.4} roughness={0.4} />
                </Box>
                {/* Pages */}
                <Box args={[0.9, 1.3, 0.15]} position={[0.08, 0, 0]}>
                    <meshStandardMaterial color="#f8fafc" />
                </Box>
            </group>
        </Float>
    )
}

function InfrastructureSymbol({ position }: { position: [number, number, number] }) {
    const group = useRef<THREE.Group>(null!)
    useFrame((state, delta) => {
        if(group.current) group.current.rotation.y -= delta * 0.15
    })
    return (
        <Float speed={0.7} rotationIntensity={0.3} floatIntensity={0.3}>
            <group position={position} ref={group}>
                 {/* Abstract Building Blocks */}
                 <Box args={[0.6, 1.2, 0.6]} position={[0, 0, 0]}>
                     <meshPhysicalMaterial color="#94a3b8" metalness={0.6} roughness={0.2} transmission={0.1} />
                 </Box>
                 <Box args={[0.5, 0.8, 0.5]} position={[0.4, -0.2, 0.2]}>
                     <meshPhysicalMaterial color="#cbd5e1" metalness={0.5} roughness={0.3} />
                 </Box>
            </group>
        </Float>
    )
}

function PeaceSymbol({ position }: { position: [number, number, number] }) {
    const mesh = useRef<THREE.Mesh>(null!)
    useFrame((state, delta) => {
        if(mesh.current) {
            mesh.current.rotation.y += delta * 0.2
            mesh.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.1
        }
    })
    return (
        <Float speed={0.8} rotationIntensity={0.4} floatIntensity={0.6}>
             <group position={position}>
                {/* Shield-like Shape (Flattened Icosahedron) */}
                <Icosahedron args={[0.8, 0]} scale={[1, 1.2, 0.3]} ref={mesh}>
                     <meshPhysicalMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} clearcoat={1} />
                </Icosahedron>
             </group>
        </Float>
    )
}

function FreedomSymbol({ position }: { position: [number, number, number] }) {
    const group = useRef<THREE.Group>(null!)
    useFrame((state) => {
        if(group.current) {
            // Gentle flap or sway
            group.current.rotation.z = -0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.1
        }
    })
    return (
        <Float speed={1.1} rotationIntensity={0.7} floatIntensity={0.6}>
            <group position={position} rotation={[0, 0, -0.5]} ref={group}>
                {/* Wing Shape */}
                {[0, 1, 2].map(i => (
                    <Cone key={i} args={[0.2 - i*0.05, 1.5 - i*0.3, 4]} position={[i*0.4, i*0.2, 0]} rotation={[0, 0, -0.4 + i*0.1]}>
                        <meshPhysicalMaterial color="#22d3ee" transmission={0.4} transparent opacity={0.7} />
                    </Cone>
                 ))}
            </group>
        </Float>
    )
}

function SportsSymbol({ position }: { position: [number, number, number] }) {
    const ringRef = useRef<THREE.Mesh>(null!)
    useFrame((state, delta) => {
        if (ringRef.current) {
            ringRef.current.rotation.z += delta * 2
        }
    })
    return (
      <Float speed={1.5} rotationIntensity={1} floatIntensity={0.8}>
        <group position={position}>
          {/* Pawn / Trophy abstract shape */}
          <Cylinder args={[0.2, 0.4, 0.6, 16]} position={[0, -0.4, 0]}>
               <meshStandardMaterial color="#f97316" metalness={0.4} roughness={0.4} />
          </Cylinder>
          <Sphere args={[0.35, 32, 32]} position={[0, 0.3, 0]}>
               <meshPhysicalMaterial color="#fb923c" metalness={0.2} roughness={0.2} clearcoat={0.5} />
          </Sphere>
          {/* Ring for motion */}
          <Torus ref={ringRef} args={[0.6, 0.05, 16, 32]} rotation={[Math.PI / 3, 0, 0]}>
              <meshStandardMaterial color="#fdba74" />
          </Torus>
        </group>
      </Float>
    )
}

function TechSymbol({ position }: { position: [number, number, number] }) {
    const outerRef = useRef<THREE.Mesh>(null!)
    const innerRef = useRef<THREE.Mesh>(null!)
    
    useFrame((state, delta) => {
        if(outerRef.current) outerRef.current.rotation.y += delta * 0.5
        if(innerRef.current) innerRef.current.rotation.y -= delta * 0.5
    })

    return (
      <Float speed={2} rotationIntensity={2} floatIntensity={0.5}>
        <group position={position}>
          <Octahedron ref={outerRef} args={[0.7, 0]} rotation={[0, 0.5, 0]}>
             <meshPhysicalMaterial color="#8b5cf6" metalness={0.9} roughness={0.1} wireframe={true} />
          </Octahedron>
          <Octahedron ref={innerRef} args={[0.5, 0]} rotation={[0, 0.5, 0]}>
              <meshPhysicalMaterial color="#a78bfa" metalness={0.8} roughness={0.2} />
          </Octahedron>
        </group>
      </Float>
    )
}

function LawSymbol({ position }: { position: [number, number, number] }) {
    const group = useRef<THREE.Group>(null!)
    useFrame((state, delta) => {
        if (group.current) group.current.rotation.y += delta * 0.2
    })
    return (
      <Float speed={0.6} rotationIntensity={0.2} floatIntensity={0.4}>
        <group position={position} ref={group}>
          {/* Pillar */}
          <Box args={[0.8, 0.1, 0.8]} position={[0, -0.6, 0]}>
               <meshStandardMaterial color="#d97706" />
          </Box>
          <Cylinder args={[0.25, 0.25, 1.2, 16]} position={[0, 0, 0]}>
               <meshStandardMaterial color="#f59e0b" roughness={0.5} />
          </Cylinder>
          <Box args={[0.7, 0.1, 0.7]} position={[0, 0.65, 0]}>
               <meshStandardMaterial color="#d97706" />
          </Box>
        </group>
      </Float>
    )
}

function EnergySymbol({ position }: { position: [number, number, number] }) {
    const crystalRef = useRef<THREE.Mesh>(null!)
    const ringRef = useRef<THREE.Mesh>(null!)
    
    useFrame((state, delta) => {
        if(crystalRef.current) {
            crystalRef.current.rotation.x += delta * 0.5
            crystalRef.current.rotation.z += delta * 0.5
        }
        if(ringRef.current) {
            ringRef.current.rotation.x -= delta * 1
            ringRef.current.rotation.y += delta * 0.5
        }
    })

    return (
      <Float speed={2.5} rotationIntensity={3} floatIntensity={1}>
        <group position={position}>
          {/* Glowing Crystal */}
          <Tetrahedron ref={crystalRef} args={[0.8, 0]}>
             <meshPhysicalMaterial color="#facc15" emissive="#fde047" emissiveIntensity={0.8} metalness={0.8} roughness={0.1} />
          </Tetrahedron>
          {/* Floating rings */}
          <Torus ref={ringRef} args={[1.2, 0.02, 16, 64]} rotation={[Math.PI / 4, 0, 0]}>
             <meshStandardMaterial color="#eab308" transparent opacity={0.5} />
          </Torus>
        </group>
      </Float>
    )
}

function TravelSymbol({ position }: { position: [number, number, number] }) {
    const globeRef = useRef<THREE.Mesh>(null!)
    const orbitRef = useRef<THREE.Mesh>(null!)

    useFrame((state, delta) => {
        if(globeRef.current) globeRef.current.rotation.y += delta * 0.2
        if(orbitRef.current) orbitRef.current.rotation.z -= delta * 0.3
    })

    return (
      <Float speed={0.8} rotationIntensity={0.4} floatIntensity={0.4}>
        <group position={position}>
           {/* Globe abstraction */}
           <Dodecahedron ref={globeRef} args={[0.6, 0]}>
               <meshPhysicalMaterial color="#14b8a6" metalness={0.4} roughness={0.2} />
           </Dodecahedron>
           {/* Orbital path */}
           <Torus ref={orbitRef} args={[0.9, 0.03, 16, 64]} rotation={[0.5, 0.5, 0]}>
               <meshStandardMaterial color="#5eead4" />
           </Torus>
           {/* Small moon/satellite */}
           <Sphere args={[0.1, 16, 16]} position={[0.9, 0.2, 0]}>
               <meshStandardMaterial color="#ccfbf1" />
           </Sphere>
        </group>
      </Float>
    )
}

function MediaSymbol({ position }: { position: [number, number, number] }) {
    const signal1 = useRef<THREE.Mesh>(null!)
    const signal2 = useRef<THREE.Mesh>(null!)
    
    useFrame((state) => {
        const time = state.clock.elapsedTime
        if(signal1.current) signal1.current.scale.setScalar(1 + Math.sin(time * 3) * 0.1)
        if(signal2.current) signal2.current.scale.setScalar(1 + Math.sin(time * 3 + 1) * 0.1)
    })

    return (
      <Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.6}>
        <group position={position} rotation={[0, 0, 0.3]}>
           {/* Microphone / Broadcast shape */}
           <Cylinder args={[0.2, 0.2, 0.8, 16]} position={[0, 0, 0]}>
               <meshStandardMaterial color="#64748b" metalness={0.6} />
           </Cylinder>
           <Sphere args={[0.3, 16, 16]} position={[0, 0.5, 0]}>
               <meshPhysicalMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
           </Sphere>
           {/* Signal Waves */}
           <Torus ref={signal1} args={[0.5, 0.03, 16, 32]} position={[0, 0.5, 0]} rotation={[Math.PI/2, 0, 0]}>
               <meshStandardMaterial color="#cbd5e1" transparent opacity={0.6} />
           </Torus>
           <Torus ref={signal2} args={[0.8, 0.03, 16, 32]} position={[0, 0.5, 0]} rotation={[Math.PI/2, 0, 0]}>
               <meshStandardMaterial color="#cbd5e1" transparent opacity={0.4} />
           </Torus>
        </group>
      </Float>
    )
}

function ParallaxGroup({ children }: { children: React.ReactNode }) {
    const group = useRef<THREE.Group>(null!)
    useFrame((state) => {
        if(group.current) {
            // Gentle parallax based on mouse position
            // Mouse x/y are from -1 to 1
            const targetX = state.mouse.x * 0.5
            const targetY = state.mouse.y * 0.5
            
            // Smoothly interpolate current rotation to target
            group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetY, 0.05)
            group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetX, 0.05)
        }
    })
    return <group ref={group}>{children}</group>
}

export function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none opacity-80">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -5, -10]} intensity={0.5} color="#22c55e" />
        
        <ParallaxGroup>
            {/* Economy - Top Left */}
            <CoinStack position={[-5, 3, -2]} />
            
            {/* Innovation - Top Right */}
            <InnovationSymbol position={[5, 2.5, -3]} />
            
            {/* Environment - Bottom Left */}
            <NatureSymbol position={[-4, -3, -1]} />
            
            {/* Health - Center Left */}
            <HealthSymbol position={[-2, 0, -5]} />
            
            {/* Education - Bottom Right */}
            <EducationSymbol position={[4, -3, -2]} />
            
            {/* Infrastructure - Top Center-Right */}
            <InfrastructureSymbol position={[2, 4, -4]} />
            
            {/* Peace - Far Left */}
            <PeaceSymbol position={[-7, -1, -6]} />
            
            {/* Freedom - Far Right */}
            <FreedomSymbol position={[7, 0, -5]} />
            
            {/* Sports - Bottom Center */}
            <SportsSymbol position={[0, -3.5, -4]} />

            {/* Tech - Top Far Left */}
            <TechSymbol position={[-3, 5, -5]} />

            {/* Law - Right Side */}
            <LawSymbol position={[6, -2, -3]} />
            
            {/* Energy - High Center */}
            <EnergySymbol position={[0, 6, -6]} />

            {/* Travel - Center Right */}
            <TravelSymbol position={[3.5, 0.5, -4]} />

            {/* Media - Bottom Far Left */}
            <MediaSymbol position={[-6, -4, -3]} />
            
            <Particles />
        </ParallaxGroup>

        <Environment preset="city" blur={1} />
      </Canvas>
    </div>
  )
}
