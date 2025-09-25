import { useGLTF } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { MeshCollider, RigidBody } from '@react-three/rapier';
import React, { useMemo } from 'react';
import * as THREE from 'three'

// 🔹 Deterministic random (so trees don't move on refresh)
function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function Tree_small({ getHeightAt }) {
  const { scene } = useGLTF('/models/tree_small_02_1k.gltf');

  const number = 5;        // number of trees
  const wild = 150;        // spread width
  const depth = 40;        // spread depth

  const positions = useMemo(() => {
    const arr = [];
    for (let i = 0; i < number; i++) {
      const x = seededRandom(i) * wild - wild / 2;
      const z = seededRandom(i + 1) * depth - depth / 2;

      // 🔹 Align tree with terrain height if provided
      const y = getHeightAt ? getHeightAt(x, z) : 0;

      const rotY = seededRandom(i + 2) * Math.PI * 2;
      arr.push([x, y, z, rotY]);
    }
    return arr;
  }, [number, wild, depth, getHeightAt]);

  const texture = useLoader(THREE.Loader,'public/coast_land_rocks_04_diff_1k.jpg')

  return (
    <>
      {positions.map(([x, y, z, rotY], i) => (
        <RigidBody 
          key={i} 
          type="fixed" 
          colliders={false} 
          position={[x, y, z]} 
          rotation={[0, rotY, 0]}
        >
          {/* 🔹 Use hull instead of trimesh to avoid WASM crash */}
          <MeshCollider type="hull">
            <primitive object={scene.clone()} scale={2.5} />
          </MeshCollider>
        </RigidBody>
      ))}
    </>
  );
}

export default Tree_small;
