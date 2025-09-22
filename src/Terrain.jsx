import React, { useRef } from 'react'
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { RigidBody } from '@react-three/rapier'
import { Plane } from '@react-three/drei'

const Terrain = () => {
  const meshRef = useRef()

  // Load heightmap & texture (put inside public/textures)
  const heightMap = useLoader(THREE.TextureLoader, 'src/models/8k_earth_daymap.jpg')
  const grassTexture = useLoader(THREE.TextureLoader, 'src/models/grass_bermuda_01_alpha_2k.png')

  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping
  grassTexture.repeat.set(2, 2)

  return (
    <RigidBody rotation-x={-Math.PI/2} receiveShadow type='fixed' colliders="ball">
      <Plane args={[700, 700, 600, 100,200]}>
        <meshStandardMaterial map={grassTexture} displacementMap={heightMap} displacementScale={10} ></meshStandardMaterial>
      </Plane>
    </RigidBody>
  )
}

export default Terrain
