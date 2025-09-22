import { RigidBody } from '@react-three/rapier'
import {Noise} from 'noisejs' // ✅ Correct way
import { useEffect, useRef } from 'react'

export default function Mountain({ heightsRef }) {
  const mountainRef = useRef()
  const noise = new Noise(Math.random())

  useEffect(() => {
    const geom = mountainRef.current.geometry
    const pos = geom.attributes.position

    const localHeights = []

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const y = noise.perlin2(x * 0.1, z * 0.1) * 10
      pos.setY(i, y)
      localHeights.push({ x, z, y })
    }

    pos.needsUpdate = true
    geom.computeVertexNormals()

    if (heightsRef) heightsRef.current = localHeights
  }, [])

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <mesh ref={mountainRef} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50, 128, 128]} />
        <meshStandardMaterial color="brown" />
      </mesh>
    </RigidBody>
  )
}