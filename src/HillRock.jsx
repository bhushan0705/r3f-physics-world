import { useGLTF } from '@react-three/drei'
import { MeshCollider, RigidBody } from '@react-three/rapier'
import React from 'react'
const HillRock = () => {
  const { scene } = useGLTF('/boulder_01_1k.gltf') // no need to add "public/"

  // Rocks data: position + scale (kept exactly as your code)
  const rocks = [
    { position: [-35, 10.4, 5], scale: 2 },
    { position: [-30, 10.4, 5], scale: 5 },
    { position: [-35, 9, -1], scale: 3 },
    { position: [-55, 3, 6], scale: 3 },
    { position: [-43, 3, 20], scale: 3 },
    { position: [-49, 0, -13], scale: 3 },
    { position: [-20, 10, 2], scale: 5 },
    { position: [30, -4, 45], scale: 7 },
    { position: [30, -0.5, 45], scale: 7, rotation: [0, Math.PI / 2, 0] },
    { position: [-15, 2, -4], scale: 5 },
  ]

  return (
    <>
      {rocks.map((rock, i) => (
        <RigidBody
          key={i}
          type="fixed"
          colliders={false}
          position={rock.position}
        >
          <MeshCollider type="trimesh">
            <primitive object={scene.clone()} scale={rock.scale}   rotation={rock.rotation} />
          </MeshCollider>
        </RigidBody>
      ))}
    </>
  )
}

export default HillRock
