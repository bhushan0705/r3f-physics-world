import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';

// You can use noise generation or a heightmap texture for more complex terrains
// For this example, let's create a simple bumpy terrain
const ProceduralTerrain = ({ size, segments, height }) => {
  const terrainGeometry = useMemo(() => {
   
    const planeGeometry = new THREE.PlaneGeometry(size, size, segments, segments);
    const positionAttribute = planeGeometry.attributes.position;
    
    // Simple noise effect to create bumps
    for (let i = 0; i < positionAttribute.count; i++) {

      const z = Math.random() * height; // Modify the Z coordinate
    //   console.log();
      
      positionAttribute.setZ(i, z);
    }
    
    planeGeometry.computeVertexNormals();
    return planeGeometry;
  }, [size, 2, height]);

    const texture = useLoader(THREE.TextureLoader, 'src/models/8k_earth_daymap.jpg');
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 2,  2);

  // Create a mesh from the geometry
  return (
    <mesh geometry={terrainGeometry} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial color="#32a852" />
    </mesh>
  );
};

export default ProceduralTerrain;
