import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Euler, FogExp2, Color } from 'three';
import { Text, Sky, Stars, Float, Billboard, RoundedBox } from '@react-three/drei';

// --- Movement Hook ---
export function usePlayerControls() {
  const keys = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
}

// --- Player Component ---
export function Player({ stage }: { stage: string }) {
  const { camera } = useThree();
  const keys = usePlayerControls();
  const direction = useRef(new Vector3());
  const speed = 0.25;

  useEffect(() => {
    // Reset position when stage changes
    camera.position.set(0, 1.6, 0);
    camera.rotation.set(0, 0, 0);
  }, [stage, camera]);

  useFrame(() => {
    direction.current.set(0, 0, 0);

    if (keys.current['w']) direction.current.z -= 1;
    if (keys.current['s']) direction.current.z += 1;
    if (keys.current['a']) direction.current.x -= 1;
    if (keys.current['d']) direction.current.x += 1;

    if (direction.current.lengthSq() > 0) {
      direction.current.normalize();
      const camEuler = new Euler().setFromQuaternion(camera.quaternion, 'YXZ');
      const moveVector = direction.current.clone().applyEuler(new Euler(0, camEuler.y, 0));
      camera.position.addScaledVector(moveVector, speed);
    }
    
    camera.position.y = 1.6;

    // Boundaries
    camera.position.x = Math.max(-15, Math.min(15, camera.position.x));
    camera.position.z = Math.max(-150, Math.min(15, camera.position.z));
  });

  return null;
}

// --- Environment Components ---
function Tree({ position, scale = 1, leafColor = "#2d4c1e", trunkColor = "#4a3018", isNiebla = false }: { position: [number, number, number], scale?: number, leafColor?: string, trunkColor?: string, isNiebla?: boolean }) {
  return (
    <group position={position} scale={isNiebla ? scale * 1.5 : scale}>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={isNiebla ? [0.6, 1.2, 3] : [0.4, 0.6, 3]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>
      {isNiebla ? (
        <>
          <mesh position={[0, 4.5, 0]}>
            <sphereGeometry args={[2.5, 12, 12]} />
            <meshStandardMaterial color={leafColor} roughness={0.9} />
          </mesh>
          <mesh position={[1.5, 5, 0]}>
            <sphereGeometry args={[2, 12, 12]} />
            <meshStandardMaterial color={leafColor} roughness={0.9} />
          </mesh>
          <mesh position={[-1.5, 4.8, 0]}>
            <sphereGeometry args={[2.2, 12, 12]} />
            <meshStandardMaterial color={leafColor} roughness={0.9} />
          </mesh>
          <mesh position={[0, 6.5, 0]}>
            <sphereGeometry args={[1.8, 12, 12]} />
            <meshStandardMaterial color={leafColor} roughness={0.9} />
          </mesh>
        </>
      ) : (
        <>
          <mesh position={[0, 3, 0]}>
            <coneGeometry args={[2.5, 5, 8]} />
            <meshStandardMaterial color={leafColor} roughness={0.8} />
          </mesh>
          <mesh position={[0, 5, 0]}>
            <coneGeometry args={[1.8, 4, 8]} />
            <meshStandardMaterial color={leafColor} roughness={0.8} />
          </mesh>
        </>
      )}
    </group>
  );
}

function Bush({ position, scale = 1, color = "#3a5f27" }: { position: [number, number, number], scale?: number, color?: string }) {
  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[1.2, 7, 7]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}

function Flower({ position, color, isNiebla = false }: { position: [number, number, number], color: string, isNiebla?: boolean }) {
  if (isNiebla) {
    return (
      <group position={position}>
        <mesh position={[0, 0.3, 0]}>
          <coneGeometry args={[0.3, 0.3, 8]} />
          <meshBasicMaterial color="#ffea7a" toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 0.3]} />
          <meshStandardMaterial color="#618991" />
        </mesh>
      </group>
    );
  }
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.2, 5, 5]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.2]} />
        <meshStandardMaterial color="#2d4c1e" />
      </mesh>
    </group>
  );
}

function Firefly({ position }: { position: [number, number, number] }) {
  const ref = useRef<any>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y += Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.005;
      ref.current.position.x += Math.cos(state.clock.elapsedTime * 1.5 + position[2]) * 0.005;
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.08, 4, 4]} />
      <meshBasicMaterial color="#ffca4a" toneMapped={false} />
    </mesh>
  );
}

export function Environment({ stage }: { stage: string }) {
  const { scene } = useThree();

  useEffect(() => {
    if (stage === 'NIEBLA') {
      scene.fog = new FogExp2(0x172e42, 0.035);
      scene.background = new Color(0x172e42);
    } else if (stage === 'EXPLORACION') {
      scene.fog = new FogExp2(0xffe4c4, 0.015);
      scene.background = new Color(0xffe4c4);
    } else {
      scene.fog = new FogExp2(0x87ceeb, 0.005);
      scene.background = new Color(0x87ceeb);
    }
  }, [stage, scene]);

  const pathColor = stage === 'NIEBLA' ? "#122a36" : "#e8c327"; 
  const grassColor = stage === 'NIEBLA' ? "#183f47" : "#5cb827"; 
  const treeLeafColor = stage === 'NIEBLA' ? "#1f4860" : "#4caf50";
  const trunkColor = stage === 'NIEBLA' ? "#0f1c24" : "#4a3018";
  const bushColor = stage === 'NIEBLA' ? "#1a3b4a" : "#3a5f27";

  return (
    <>
      <ambientLight intensity={stage === 'NIEBLA' ? 0.35 : 0.7} color={stage === 'NIEBLA' ? "#4581a3" : "#ffffff"} />
      <directionalLight 
        position={stage === 'NIEBLA' ? [0, 50, -80] : [20, 30, 10]} 
        intensity={stage === 'CLARIDAD' ? 1.5 : stage === 'EXPLORACION' ? 1.2 : stage === 'NIEBLA' ? 0.8 : 0.8} 
        color={stage === 'EXPLORACION' ? "#ffeedd" : stage === 'NIEBLA' ? "#8fccf2" : "#ffffff"}
      />
      
      {stage === 'NIEBLA' && (
        <>
          {/* Moon */}
          <Billboard position={[0, 40, -100]}>
            <mesh>
              <circleGeometry args={[12, 32]} />
              <meshBasicMaterial color="#ffffff" toneMapped={false} />
            </mesh>
            <mesh position={[2, 2, 0.1]}>
               <circleGeometry args={[11, 32]} />
               <meshBasicMaterial color="#172e42" toneMapped={false} />
            </mesh>
          </Billboard>
          {/* Stars */}
          <Stars radius={100} depth={50} count={2000} factor={3} saturation={0} fade speed={0.5} />
          {/* Fireflies */}
          {[...Array(100)].map((_, i) => (
             <Firefly 
                key={i} 
                position={[
                   (Math.random() - 0.5) * 50, 
                   0.5 + Math.random() * 10, 
                   -Math.random() * 140
                ]} 
             />
          ))}
        </>
      )}

      {stage === 'CLARIDAD' && (
        <>
          <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={0.5} />
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        </>
      )}

      {/* Mountains */}
      <mesh position={[-40, -5, -100]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[50, 60, 16]} />
        <meshStandardMaterial color={stage === 'NIEBLA' ? "#142d38" : "#3a7a3a"} roughness={1} />
      </mesh>
      <mesh position={[40, -5, -120]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[60, 80, 16]} />
        <meshStandardMaterial color={stage === 'NIEBLA' ? "#10232e" : "#2a5a2a"} roughness={1} />
      </mesh>
      <mesh position={[0, -5, -150]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[80, 100, 16]} />
        <meshStandardMaterial color={stage === 'NIEBLA' ? "#183340" : "#4a8a4a"} roughness={1} />
      </mesh>

      {/* Main Ground (Grass) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, -50]}>
        <planeGeometry args={[300, 300]} />
        <meshStandardMaterial color={grassColor} roughness={1} />
      </mesh>

      {/* River */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, -30]}>
        <planeGeometry args={[300, 15]} />
        <meshStandardMaterial color={stage === 'NIEBLA' ? "#28607a" : "#85c1e9"} roughness={0.1} transparent opacity={0.8} />
      </mesh>

      {/* The Path (Yellow Brick Road) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -10]}>
        <planeGeometry args={[8, 35]} />
        <meshStandardMaterial color={pathColor} roughness={0.8} />
      </mesh>
      
      {/* Bridge over River */}
      <mesh rotation={[-Math.PI / 2 + 0.1, 0, 0]} position={[0, 0.5, -26]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color={stage === 'NIEBLA' ? "#1b2a30" : "#d4a017"} roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2 - 0.1, 0, 0]} position={[0, 0.5, -34]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color={stage === 'NIEBLA' ? "#1b2a30" : "#d4a017"} roughness={0.9} />
      </mesh>

      {/* Segment 2 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -85]}>
        <planeGeometry args={[8, 95]} />
        <meshStandardMaterial color={pathColor} roughness={0.8} />
      </mesh>

      {/* Trees, Bushes, and Flowers */}
      {[...Array(60)].map((_, i) => {
        const z = -5 - (i * 2.5);
        if (z > -35 && z < -25) return null; // Skip river area

        const xOffset = 6 + Math.random() * 20;
        const x = i % 2 === 0 ? xOffset : -xOffset;
        const type = Math.random();
        const scale = 0.8 + Math.random() * 0.8;

        if (type > 0.6) {
          return <Tree key={i} position={[x, 0, z]} scale={scale} leafColor={treeLeafColor} trunkColor={trunkColor} isNiebla={stage === 'NIEBLA'} />;
        } else if (type > 0.3) {
          return <Bush key={i} position={[x, 0.5, z]} scale={scale} color={bushColor} />;
        } else {
          const flowerColor = Math.random() > 0.5 ? "#ff4444" : "#ffffff";
          return <Flower key={i} position={[x * 0.7, 0, z]} color={stage === 'NIEBLA' ? "#3e803e" : flowerColor} />;
        }
      })}
    </>
  );
}

// --- Interactive Signpost ---
export function Signpost({ position, text, onClick }: { position: [number, number, number], text: string, onClick: () => void }) {
  return (
    <group position={position} onClick={onClick}>
      <Billboard>
        <RoundedBox args={[6, 2, 0.2]} radius={0.2} smoothness={4}>
          <meshStandardMaterial color="#8b4513" />
        </RoundedBox>
        <Text
          position={[0, 0, 0.15]}
          fontSize={0.4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={5.5}
          textAlign="center"
        >
          {text}
        </Text>
      </Billboard>
      {/* Post */}
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 4]} />
        <meshStandardMaterial color="#5d2e0a" />
      </mesh>
    </group>
  );
}

// --- Floating Cards in World (Coin style) ---
export function WorldCard({ position, content, onClick }: { position: [number, number, number], content: string, onClick: () => void }) {
  return (
    <Float speed={3} rotationIntensity={1} floatIntensity={2}>
      <group position={position} onClick={onClick}>
        <Billboard>
          <mesh position={[0, 0, -0.05]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[1.6, 1.6, 0.1, 32]} />
            <meshStandardMaterial color="#ffd700" metalness={0.3} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[1.4, 1.4, 0.12, 32]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <Text
            position={[0, 0, 0.1]}
            fontSize={0.2}
            color="#334155"
            anchorX="center"
            anchorY="middle"
            maxWidth={2.2}
            textAlign="center"
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff"
          >
            {content}
          </Text>
        </Billboard>
      </group>
    </Float>
  );
}
