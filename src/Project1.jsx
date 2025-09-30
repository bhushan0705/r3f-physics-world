// import { Box, OrbitControls, useAnimations, useGLTF } from '@react-three/drei'
// import { useFrame, useLoader } from '@react-three/fiber'
// import { RigidBody } from '@react-three/rapier'
// import { useEffect, useRef } from 'react'
// import * as THREE from "three"
// // import { log } from 'three/src/nodes/TSL.js'

// export default function Project1() {
//   const playerRef = useRef()
//   const keysPressed = useRef({})
//   const modelRef = useRef()

//   // Listen for key events
//   // useEffect(() => {
//   //   const handleKeyDown = (e) => {
//   //     keysPressed.current[e.key.toLowerCase()] = true
//   //   }
//   //   const handleKeyUp = (e) => {
//   //     keysPressed.current[e.key.toLowerCase()] = false
//   //   }

//   //   window.addEventListener('keydown', handleKeyDown)
//   //   window.addEventListener('keyup', handleKeyUp)

//   //   return () => {
//   //     window.removeEventListener('keydown', handleKeyDown)
//   //     window.removeEventListener('keyup', handleKeyUp)
//   //   }
//   // }, [])


//         // soldier 
//     // Load soldier model
//    const { scene, animations } = useGLTF('src/models/Soldier.glb')
//     // const { actions, mixer } = useAnimations(animations, modelRef)

//   // // Move box each frame
//   // useFrame((state, delta) => {
//   //   if (!playerRef.current) return
//   //   const speed = 0.1
//   //   const vel = { x: 0, y: 0, z: 0 }
//   //   if (keysPressed.current['w'] || keysPressed.current['arrowup']) vel.z -= 2  *speed
//   //   if (keysPressed.current['s'] || keysPressed.current['arrowdown']) vel.z += 2 * delta
//   //   if (keysPressed.current['a'] || keysPressed.current['arrowleft']) vel.x -= 2 * delta
//   //   if (keysPressed.current['d'] || keysPressed.current['arrowright']) vel.x += 2 * delta

//   //  // Apply velocity to rigidbody (Rapier)
//   //   playerRef.current.setLinvel(vel, true)

//   //   // Rotate model to movement direction
//   //   if (vel.x !== 0 || vel.z !== 0) {
//   //     const angle = Math.atan2(vel.x, vel.z)
//   //     const rotation = new THREE.Quaternion()
//   //     rotation.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle)
//   //     modelRef.current.quaternion.slerp(rotation, 0.2) // smooth rotation
//   //   }
//   //    // Animation blending
//   //   const moving = vel.x !== 0 || vel.z !== 0
//   //   if (moving) {
//   //     if (actions['Walk'] && !actions['Walk'].isRunning()) {
//   //       actions['Idle']?.stop()
//   //       actions['Walk']?.play()
//   //     }
//   //   } else {
//   //     if (actions['Idle'] && !actions['Idle'].isRunning()) {
//   //       actions['Walk']?.stop()
//   //       actions['Idle']?.play()
//   //     }
//   //   }

//   //   mixer.update(delta)
//   // })




//   return (
//     <>
//       <OrbitControls />

//       {/* Player Box */}
//       <RigidBody ref={playerRef} position={[0,0.1,0]} colliders="cuboid" >
//           <primitive object={scene} scale={1} />
//       </RigidBody>

//       <RigidBody>
//         <Box args={[1, 1, 1]} position={[2, 5, 0]} castShadow>
//           <meshStandardMaterial color="orange" />
//         </Box>
//       </RigidBody>

//       {/* Ground */}
//       <RigidBody type="fixed">
//         <mesh receiveShadow position={[0, 0, 0]}>
//           <boxGeometry args={[10, 1, 10]} />
//           <meshStandardMaterial color="green"  />
//         </mesh>
//       </RigidBody>
//     </>
//   )
// }
