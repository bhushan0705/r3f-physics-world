import { useGLTF } from "@react-three/drei";
import { Object3D } from "three";
import React, { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const Grass = ({ width = 150, depth = 100, density = 99000, getHeightAt }) => {
  const { scene } = useGLTF("/models/grass_medium_01_1k.gltf");
  const meshRef = useRef();
  const dummy = useMemo(() => new Object3D(), []);

  const total = density;

  // store base positions & rotations so animation can build on them
  const baseData = useMemo(() => {
    const arr = [];
    for (let i = 0; i < total; i++) {
      const seed = i;
      const x = seededRandom(seed) * width - width / 2;
      const z = seededRandom(seed + 1) * depth - depth / 2;
      const y = getHeightAt ? getHeightAt(x, z) : 0;
      const rotY = seededRandom(seed + 2) * Math.PI * 2;

      arr.push({ x, y, z, rotY });
    }
    return arr;
  }, [total, width, depth, getHeightAt]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    for (let i = 0; i < total; i++) {
      const { x, y, z, rotY } = baseData[i];

      // wind effect: sway rotation with sine wave + small per-instance offset
      const sway = Math.sin(t * 2 + i * 0.1) * 0.2; // adjust speed & amplitude

      dummy.position.set(x, y, z);
      dummy.rotation.set(0, rotY + sway, 0); // sway in Y axis
      dummy.scale.set(10, 10, 10);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[scene.children[0].geometry, scene.children[0].material, total]}
    />
  );
};

export default Grass;
