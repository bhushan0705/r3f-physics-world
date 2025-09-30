import React, { useMemo } from "react";
import * as THREE from "three";
import Grass from "./Grass";
// import Tree_small from "./Tree_small";
import { useLoader } from "@react-three/fiber";
// import WaterPound from "./WaterPond";
// import WaterPond from "./WaterPond";

const ProceduralTerrain = ({ size = 200, segments = 264, height = 2 }) => {
  // Hill parameters
  const hillCenter = new THREE.Vector2(10, -5);
  const hillRadius = 30;
  const hillBoost = 15;

  // Terrain geometry
  const terrainGeometry = useMemo(() => {
    const planeGeometry = new THREE.PlaneGeometry(size, size, segments, segments);
    const positionAttribute = planeGeometry.attributes.position;

    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);

      // Base terrain bumps
      let z =
        Math.sin(x * 0.2) * Math.cos(y * 0.2) * height +
        Math.sin(x * 0.5) * Math.cos(y * 0.5) * (height / 2);

      // Hill offset exactly same as in getHeightAt
      const dx = x - hillCenter.x + 40;
      const dy = y - hillCenter.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < hillRadius) {
        const factor = 1 - dist / hillRadius;
        z += hillBoost * factor;
      }

      positionAttribute.setZ(i, z);
    }

    planeGeometry.computeVertexNormals();
    return planeGeometry;
  }, [size, segments, height]);

  // Function to get terrain height at any (x, z)
  const getHeightAt = (x, z) => {
    let zHeight =
      Math.sin(x * 0.2) * Math.cos(z * 0.2) * height +
      Math.sin(x * 0.5) * Math.cos(z * 0.5) * (height / 2);

    const dx = x - hillCenter.x +40;
    const dz = z - hillCenter.y-10;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < hillRadius) {
      const factor = 1 - dist / hillRadius;
      zHeight += hillBoost * factor;
    }

    return zHeight;
  };

  const texture = useLoader(THREE.TextureLoader, '/coast_land_rocks_04_diff_1k.jpg');
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 2,  2);


  return (
    <>
      {/* Terrain mesh */}
      <mesh geometry={terrainGeometry} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial flatShading map={texture} />
      </mesh>

      {/* Grass on terrain */}
      <Grass width={size} depth={size} spacing={3} getHeightAt={getHeightAt} />
      {/* <Tree_small getHeightAt={getHeightAt}></Tree_small> */}

      {/* <WaterPond width={40} height={50} position={[0, 0, 0]} color="#fba905ff" getHeightAt={getHeightAt} /> */}
    </>
  );
};

export default ProceduralTerrain;
