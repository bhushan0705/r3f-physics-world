import React, { useMemo } from "react";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

export default function HillTerrain() {
  const width = 20;
  const height = 20;
  const segments = 50;

  // Generate height array
  const heights = useMemo(() => {
    const arr = [];
    for (let j = 0; j <= segments; j++) {
      for (let i = 0; i <= segments; i++) {
        const x = (i / segments - 0.5) * width;
        const y = (j / segments - 0.5) * height;
        const distanceFromCenter = Math.sqrt(x * x + y * y);
        arr.push(Math.max(0, 5 - distanceFromCenter * 0.5));
      }
    }
    return arr;
  }, []);

  // Create plane geometry
  const geometry = useMemo(() => {
    const geom = new THREE.PlaneGeometry(width, height, segments, segments);
    const position = geom.attributes.position;

    for (let i = 0; i < position.count; i++) {
      position.setZ(i, heights[i]);
    }

    geom.computeVertexNormals();
    return geom;
  }, [heights]);

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="green" />
      </mesh>
    </RigidBody>
  );
}
