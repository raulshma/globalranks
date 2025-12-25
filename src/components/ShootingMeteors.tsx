import { Canvas, useFrame } from "@react-three/fiber"
import { useRef, useState, useMemo } from "react"
import * as THREE from "three"
import { extend } from "@react-three/fiber"
import { shaderMaterial } from "@react-three/drei"
import { useTheme } from "./theme-provider"

// Meteor streak shader - creates a smooth gradient from head to tail
const MeteorStreakMaterial = shaderMaterial(
    {
        uHeadColor: new THREE.Color('#ffffff'),
        uTailColor: new THREE.Color('#fbbf24'),
    },
    // Vertex
    `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    // Fragment
    `
        uniform vec3 uHeadColor;
        uniform vec3 uTailColor;
        varying vec2 vUv;
        
        void main() {
            // vUv.x goes 0 (left/tail) to 1 (right/head)
            float t = vUv.x;
            
            // Color: interpolate from tail color to head color, then to white at tip
            vec3 color = mix(uTailColor, uHeadColor, smoothstep(0.0, 0.8, t));
            color = mix(color, vec3(1.0), smoothstep(0.85, 1.0, t)); // White hot tip
            
            // Alpha: fade out at the tail, solid at head
            float alpha = smoothstep(0.0, 0.3, t);
            
            // Soft edges on top/bottom (vUv.y is 0-1 across width)
            float edgeFade = 1.0 - pow(abs(vUv.y - 0.5) * 2.0, 2.0);
            alpha *= edgeFade;
            
            gl_FragColor = vec4(color, alpha * 0.9);
        }
    `
)

extend({ MeteorStreakMaterial })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            meteorStreakMaterial: any
        }
    }
}

type MeteorData = {
    id: number
    x: number
    y: number
    z: number
    speed: number
    angle: number
    length: number
    width: number
}

function Meteor({ data, onComplete }: { data: MeteorData, onComplete: (id: number) => void }) {
    const groupRef = useRef<THREE.Group>(null!)
    const { theme } = useTheme()

    const isDark = theme === 'dark' || !theme
    const headColor = useMemo(() => new THREE.Color('#ffffff'), [])
    const tailColor = useMemo(() => new THREE.Color(isDark ? '#fbbf24' : '#f59e0b'), [isDark])

    useFrame((_, delta) => {
        if (!groupRef.current) return

        groupRef.current.position.x += Math.cos(data.angle) * data.speed * delta
        groupRef.current.position.y += Math.sin(data.angle) * data.speed * delta

        if (groupRef.current.position.y < -15 || groupRef.current.position.x > 25) {
            onComplete(data.id)
        }
    })

    return (
        <group ref={groupRef} position={[data.x, data.y, data.z]} rotation={[0, 0, data.angle]}>
            {/* Single continuous streak using plane with gradient shader */}
            <mesh position={[-data.length / 2, 0, 0]}>
                <planeGeometry args={[data.length, data.width]} />
                {/* @ts-ignore */}
                <meteorStreakMaterial
                    transparent
                    depthWrite={false}
                    side={THREE.DoubleSide}
                    uHeadColor={headColor}
                    uTailColor={tailColor}
                />
            </mesh>
        </group>
    )
}

function MeteorSpawner() {
    const [meteors, setMeteors] = useState<MeteorData[]>([])
    const meteorIdCounter = useRef(0)
    const nextSpawnTime = useRef(0)

    useFrame((state) => {
        const time = state.clock.elapsedTime

        if (time > nextSpawnTime.current) {
            const id = meteorIdCounter.current++

            const startX = -12 + Math.random() * 18
            const startY = 10 + Math.random() * 6

            const angle = -Math.PI / 4 + (Math.random() * 0.15 - 0.075)

            const newMeteor: MeteorData = {
                id,
                x: startX,
                y: startY,
                z: Math.random() * 0.3,
                speed: 2 + Math.random() * 1, // 2-3 speed
                angle: angle,
                length: 1.5 + Math.random() * 1, // Long streak
                width: 0.03 + Math.random() * 0.02 // Thin streak
            }

            setMeteors(prev => [...prev, newMeteor])
            nextSpawnTime.current = time + 2 + Math.random() * 4
        }
    })

    const handleComplete = (id: number) => {
        setMeteors(prev => prev.filter(m => m.id !== id))
    }

    return (
        <>
            {meteors.map(m => (
                <Meteor key={m.id} data={m} onComplete={handleComplete} />
            ))}
        </>
    )
}

export function ShootingMeteors() {
    return (
        <div className="fixed inset-0 z-50 pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, 10], fov: 45 }}
                gl={{ alpha: true, antialias: true }}
                style={{ pointerEvents: 'none' }}
            >
                <MeteorSpawner />
            </Canvas>
        </div>
    )
}
