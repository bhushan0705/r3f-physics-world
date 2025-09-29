import { RigidBody } from '@react-three/rapier'
import React, { useEffect, useRef, useState } from 'react'
import { Water } from 'three/examples/jsm/objects/Water.js'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

const WaterPond = () => {
  const waterRef = useRef()
  const [waterObj, setWaterObj] = useState(null)

  useEffect(() => {
    const geo = new THREE.PlaneGeometry(50, 120,100)
    const water = new Water(geo, {
      textureWidth: 51,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(
        'https://threejs.org/examples/textures/waternormals.jpg',
        (t) => { t.wrapS = t.wrapT = THREE.RepeatWrapping }
      ),
      sunColor: 0xffff00,      // yellow sun
      waterColor: 0x4169e1,    // royalblue
      distortionScale: 1.5,    // controls ripple strength
      fog: true,
    })
    water.rotation.x = -Math.PI / 2
    setWaterObj(water)
  }, [])

  // animate water
  useFrame((state, delta) => {
    if (waterObj) {
      waterObj.material.uniforms.time.value += 0.008
    }
  })

  return (
    <RigidBody type="fixed" position={[-8, 0, -2]}>
      <group ref={waterRef}>
        {waterObj && <primitive object={waterObj} />}
      </group>
    </RigidBody>
  )
}

export default WaterPond
