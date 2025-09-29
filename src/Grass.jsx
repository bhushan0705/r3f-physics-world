// import { useGLTF } from "@react-three/drei";
// import { Object3D } from "three";
// import React, { useMemo, useRef, useEffect } from "react";
// import { useFrame } from "@react-three/fiber";

// function seededRandom(seed) {
//   let x = Math.sin(seed) * 10000;
//   return x - Math.floor(x);
// }

// const Grass = ({ width = 150, depth = 100, density = 99000, getHeightAt }) => {
//   const { scene } = useGLTF("/models/grass_medium_01_1k.gltf");
//   const meshRef = useRef();
//   const dummy = useMemo(() => new Object3D(), []);

//   const total = density;

//   // store base positions & rotations so animation can build on them
//   const baseData = useMemo(() => {
//     const arr = [];
//     for (let i = 0; i < total; i++) {
//       const seed = i;
//       const x = seededRandom(seed) * width - width / 2;
//       const z = seededRandom(seed + 1) * depth - depth / 2;
//       const y = getHeightAt ? getHeightAt(x, z) : 0;
//       const rotY = seededRandom(seed + 2) * Math.PI * 2;

//       arr.push({ x, y, z, rotY });
//     }
//     return arr;
//   }, [total, width, depth, getHeightAt]);

//   useFrame(({ clock }) => {
//     const t = clock.getElapsedTime();

//     for (let i = 0; i < total; i++) {
//       const { x, y, z, rotY } = baseData[i];

//       // wind effect: sway rotation with sine wave + small per-instance offset
//       const sway = Math.sin(t * 2 + i * 0.1) * 0.2; // adjust speed & amplitude

//       dummy.position.set(x, y, z);
//       dummy.rotation.set(0, rotY + sway, 0); // sway in Y axis
//       dummy.scale.set(10, 10, 10);

//       dummy.updateMatrix();
//       meshRef.current.setMatrixAt(i, dummy.matrix);
//     }

//     meshRef.current.instanceMatrix.needsUpdate = true;
//   });

//   return (
//     <instancedMesh
//       ref={meshRef}
//       args={[scene.children[0].geometry, scene.children[0].material, total]}
//     />
//   );
// };

// export default Grass;




import { useGLTF } from "@react-three/drei";
import { Object3D } from "three";
import React, { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

function seededRandom(seed) {
  let x = Math.sin(seed) * 100;
  return x - Math.floor(x);
}

// Grass chunk component
const GrassChunk = ({ chunkX, chunkZ, size, maxDensity, getHeightAt, camera }) => {
  const { scene } = useGLTF("/models/grass_medium_01_1k.gltf");
  // const { scene } = useGLTF("/models/tree_small_02_1k.gltf");
  const meshRef = useRef();
  const dummy = useMemo(() => new Object3D(), []);

  // Precompute base positions
  const baseData = useMemo(() => {
    const arr = [];
    for (let i = 0; i < maxDensity; i++) {
      const seed = i;
      const x = seededRandom(seed) * size - size / 2 + chunkX;
      const z = seededRandom(seed + 1) * size - size / 2 + chunkZ;
      const y = getHeightAt ? getHeightAt(x, z) : 0;
      const rotY = seededRandom(seed + 2) * Math.PI * 2;
      arr.push({ x, y, z, rotY });
    }
    return arr;
  }, [chunkX, chunkZ, size, maxDensity, getHeightAt]);

  const swayOffsets = useMemo(() => baseData.map((_, i) => seededRandom(i) * Math.PI * 2), [baseData]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const distance = Math.sqrt(
      (chunkX - camera.position.x) ** 2 + 
      (chunkZ - camera.position.z) ** 2
    );

    // Dynamic density based on distance
    let visibleCount;
    if (distance < 30) visibleCount = Math.floor(maxDensity);          // full density
    else if (distance < 50) visibleCount = Math.floor(maxDensity * 0.5); // 50%
    else visibleCount = Math.floor(maxDensity * 0.2);                  // 20%

    const step = 1; // animate all visible instances

    for (let i = 0; i < visibleCount; i += step) {
      const { x, y, z, rotY } = baseData[i];
      const sway = Math.sin(t * 2 + swayOffsets[i]) * 0.2;

      dummy.position.set(x, y, z);
      dummy.rotation.set(0, rotY + sway, 0);
      dummy.scale.set(10, 10, 10);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.count = visibleCount;
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[scene.children[0].geometry, scene.children[0].material, maxDensity]}
      castShadow
      receiveShadow
    />
  );
};

// Main Grass field
const Grass = ({ width = 150, depth = 100, chunkSize = 30, maxDensity = 2000, getHeightAt }) => {
  const { camera } = useThree();

  const chunks = useMemo(() => {
    const arr = [];
    const cols = Math.ceil(width / chunkSize);
    const rows = Math.ceil(depth / chunkSize);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const chunkX = i * chunkSize - width / 2 + chunkSize / 2;
        const chunkZ = j * chunkSize - depth / 2 + chunkSize / 2;
        arr.push({ chunkX, chunkZ });
      }
    }
    return arr;
  }, [width, depth, chunkSize]);

  return (
    <>
      {chunks.map(({ chunkX, chunkZ }, idx) => (
        <GrassChunk
          key={idx}
          chunkX={chunkX}
          chunkZ={chunkZ}
          size={chunkSize}
          maxDensity={maxDensity}
          getHeightAt={getHeightAt}
          camera={camera}
        />
      ))}
    </>
  );
};

export default Grass;
