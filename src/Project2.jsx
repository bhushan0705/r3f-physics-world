import { Box, OrbitControls, Sphere, useAnimations, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { CapsuleCollider, CuboidCollider, MeshCollider, RigidBody } from '@react-three/rapier';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import ProceduralTerrain from './ProceduralTerrain';
import InvisibleWall from './InvisibleWall';
import { MoonRock } from './MoonRock';
import Grass from './Grass';
import Tree_small from './Tree_small';
import BigTree from './BigTree';
import HillRock from './HillRock';
import Sun from './Sun';

const Project2 = () => {
  const { scene, animations } = useGLTF('src/models/Soldier.glb');
  const { actions, mixer } = useAnimations(animations, scene);
  

  const keysPressed = useRef({});
  const playerRef = useRef();
  const sceneRef = useRef();

  // Keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => { keysPressed.current[e.key.toLowerCase()] = true; };
    const handleKeyUp = (e) => { keysPressed.current[e.key.toLowerCase()] = false; };
    // const handleKeyJump = (e) => { keysPressed.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    // window.addEventListener('space', handleKeyJump)
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      // window.removeEventListener('space', handleKeyJump);
    };
  }, []);

  // Soldier movement
  useFrame((state, delta) => {
    if (!playerRef.current || !sceneRef.current) return;

    // const speed = 0.1;
    const speed = 0.2;
    const rotationSpeed = 0.05;
    const vel = { x: 0, y: 0, z: 0 };
    

    const rotY = sceneRef.current.rotation.y;
    const forward = new THREE.Vector3(Math.sin(rotY), 0, Math.cos(rotY));
    // const jump = 5
    // console.log(forward);
    
    if (keysPressed.current['w'] || keysPressed.current['arrowup']) {
      vel.x -= forward.x * speed;
      vel.z -= forward.z * speed;
    }
    if (keysPressed.current['s'] || keysPressed.current['arrowdown']) {
      vel.x += forward.x * speed;
      vel.z += forward.z * speed;
    }
    if (keysPressed.current['a'] || keysPressed.current['arrowleft']) {
      sceneRef.current.rotation.y += rotationSpeed;
    }
    if (keysPressed.current['d'] || keysPressed.current['arrowright']) {
      sceneRef.current.rotation.y -= rotationSpeed;
    }
    if (keysPressed.current[' ']) {
      const linvel = playerRef.current.linvel() // current velocity
      if (Math.abs(linvel.y) < 0.05) {
        playerRef.current.applyImpulse({ x: 0, y: 5, z: 0 }, true)
      }
    }

    const isMoving = vel.x !== 0 || vel.z !== 0;
    // playerRef.current.setLinvel(vel, true);

    if (isMoving) {
      actions['Walk']?.play();
      actions['Walk']?.setEffectiveTimeScale(speed * 4);
      actions['Idle']?.stop();
    } else {
      actions['Walk']?.stop();
      actions['Idle']?.play();
    }

    mixer.update(delta);

    const newPos = playerRef.current.translation();
    playerRef.current.setTranslation(
      { x: newPos.x + vel.x, y: newPos.y, z: newPos.z + vel.z },
      true
    );

    
playerRef.current.setLinvel(vel, true);

  });

  // Camera follow
  useFrame((state) => {
    if (!sceneRef.current) return;
    const soldierPos = new THREE.Vector3();
    sceneRef.current.getWorldPosition(soldierPos);
    const soldierRot = sceneRef.current.rotation.y;

    const distance = 8;
    const height = 3;
    const offsetX = -Math.sin(soldierRot) * distance/1.5;
    const offsetZ = -Math.cos(soldierRot) * distance/1.5;

    const cameraPos = new THREE.Vector3(
      soldierPos.x - offsetX + -1,
      soldierPos.y + height + 0.6,
      soldierPos.z - offsetZ
    );

    state.camera.position.lerp(cameraPos, 0.06);
    state.camera.lookAt(soldierPos.x, soldierPos.y + 2, soldierPos.z);
  });

  return (
    <>
      <OrbitControls />

      {/* Soldier */}
<RigidBody
 gravityScale={10}
  ref={playerRef}
  colliders={false}
  type="dynamic"
  mass={100}
  position={[50, 10, 10]} // spawn above terrain
  enabledRotations={[false, false, false]}
>
  <CapsuleCollider args={[0.5, 1.8]} position={[0, 0.9, 0]} />
  <primitive object={scene} scale={2} position={[0, -1.2, 0]} ref={sceneRef} />
</RigidBody>


<RigidBody position={[1,5,1]}>
  <Sphere>
    <meshStandardMaterial color={'red'}></meshStandardMaterial>
  </Sphere>
</RigidBody>


{/* <InvisibleWall></InvisibleWall> */}



            {/* Terrain with physics collision */}
      <RigidBody type="fixed" colliders={false}>
        {/* <ProceduralTerrain size={30} segments={5} height={5} /> */}
        <MeshCollider type="trimesh">
          <ProceduralTerrain />
    {/* <MoonRock></MoonRock> */}
        </MeshCollider>
      </RigidBody>


{/* <MoonRock/> */}
{/* <Grass></Grass> */}
{/* <Tree_small></Tree_small> */}
{/* <MoonRock></MoonRock> */}
<BigTree></BigTree>
<HillRock></HillRock>
{/* <InvisibleWall></InvisibleWall> */}
<Sun></Sun>

    </>
  );
};

export default Project2;
