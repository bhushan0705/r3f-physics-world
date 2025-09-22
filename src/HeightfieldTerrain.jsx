// import React, { useMemo } from "react";
// import { useLoader } from "@react-three/fiber";
// import * as THREE from "three";
// import { RigidBody, HeightfieldCollider } from "@react-three/rapier";

// const PHYS_RES = 512;
// const VIS_RES = 512;
// const TERRAIN_SCALE = { x: 700, y: 40, z: 700 }; // World scale

// export default function HeightfieldTerrain({ heightmapUrl, textureUrl }) {
//   // Load heightmap and color texture
//   const heightTex = useLoader(THREE.TextureLoader, heightmapUrl);
//   const colorTex = useLoader(THREE.TextureLoader, textureUrl);

//   colorTex.wrapS = colorTex.wrapT = THREE.RepeatWrapping;
//   colorTex.repeat.set(2, 2);

//   // Extract height data from heightmap image
//   const heightData = useMemo(() => {
//     if (!heightTex.image) return null;

//     const img = heightTex.image;
//     const canvas = document.createElement("canvas");
//     canvas.width = img.width;
//     canvas.height = img.height;
//     const ctx = canvas.getContext("2d");
//     ctx.drawImage(img, 0, 0);
//     const data = ctx.getImageData(0, 0, img.width, img.height).data;

//     const heights = new Float32Array((PHYS_RES + 1) * (PHYS_RES + 1));

//     for (let j = 0; j <= PHYS_RES; j++) {
//       const v = j / PHYS_RES;
//       const py = Math.floor(v * (img.height - 1));
//       for (let i = 0; i <= PHYS_RES; i++) {
//         const u = i / PHYS_RES;
//         const px = Math.floor(u * (img.width - 1));
//         const idx = (py * img.width + px) * 4;
//         const r = data[idx];
//         const g = data[idx + 1];
//         const b = data[idx + 2];
//         const brightness = (r + g + b) / (3 * 255); // Normalize 0..1
//         heights[j * (PHYS_RES + 1) + i] = brightness; // Store in flat array
//       }
//     }

//     return { heights, width: PHYS_RES, height: PHYS_RES };
//   }, [heightTex]);

//   if (!heightData) return null;

//   // Rapier heightfield collider args
//   const hfArgs = [
//     heightData.width,
//     heightData.height,
//     Array.from(heightData.heights).map((v) => v * TERRAIN_SCALE.y), // scaled heights
//     { x: TERRAIN_SCALE.x / heightData.width, y: 1, z: TERRAIN_SCALE.z / heightData.height },
//   ];

//   // Helper: get height at any (x, z) in world space
//   const getHeightAt = (x, z) => {
//     const col = Math.floor(((x + TERRAIN_SCALE.x / 2) / TERRAIN_SCALE.x) * PHYS_RES);
//     const row = Math.floor(((z + TERRAIN_SCALE.z / 2) / TERRAIN_SCALE.z) * PHYS_RES);
//     const idx = THREE.MathUtils.clamp(row * (PHYS_RES + 1) + col, 0, heightData.heights.length - 1);
//     return heightData.heights[idx] * TERRAIN_SCALE.y;
//   };

//   return (
//     <>
//       {/* Physics Terrain */}
//       <RigidBody type="fixed" colliders={false} position={[0,0,0]}>
//         <HeightfieldCollider args={hfArgs} />
//       </RigidBody>

//       {/* Visual Mesh Terrain */}
//       {/* <mesh rotation-x={-Math.PI / 2} receiveShadow> */}
//   <mesh position={[0, 0, 0]} rotation-x={-Math.PI / 2} receiveShadow > 

//         <planeGeometry args={[TERRAIN_SCALE.x, TERRAIN_SCALE.z, VIS_RES, VIS_RES]} />
//         <meshStandardMaterial
//           map={colorTex}
//           displacementMap={heightTex}
//           displacementScale={2 } // adjust mesh height visually
//           metalness={0}
//           roughness={1}
//         />
//       </mesh>

//       {/* Expose helper for other objects */}
//       <primitive object={{ getHeightAt }} attach="userData" />
//     </>
//   );
// }



// --- HeightfieldTerrain.jsx ---
import { useLoader } from "@react-three/fiber";
import { RigidBody, HeightfieldCollider } from "@react-three/rapier";
import React, { useMemo, forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";

// Physics aur visual resolution constants
const PHYS_RES = 128; // Physics ke liye grid size
const VIS_RES = 512;  // Visual mesh resolution
const TERRAIN_SCALE = { x: 700, y: 4, z: 700 }; // Terrain ka world scale

// ForwardRef ka use kiya taaki parent se getHeightAt function access ho sake
export const HeightfieldTerrain = forwardRef(({ heightmapUrl, textureUrl }, ref) => {
  // Heightmap aur color texture load kar rahe hai
  const heightTex = useLoader(THREE.TextureLoader, heightmapUrl);
  const colorTex = useLoader(THREE.TextureLoader, textureUrl);

  colorTex.wrapS = colorTex.wrapT = THREE.RepeatWrapping;
  colorTex.repeat.set(2, 2);

  // Heightmap se height data nikal rahe hai
  const heightData = useMemo(() => {
    if (!heightTex.image) return null;

    const img = heightTex.image;
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, img.width, img.height).data;

    // Height ko 0..1 normalize kar ke store kar rahe hai
    const heights = new Float32Array((PHYS_RES + 1) * (PHYS_RES + 1));
    for (let j = 0; j <= PHYS_RES; j++) {
      const v = j / PHYS_RES;
      const py = Math.floor(v * (img.height - 1));
      for (let i = 0; i <= PHYS_RES; i++) {
        const u = i / PHYS_RES;
        const px = Math.floor(u * (img.width - 1));
        const idx = (py * img.width + px) * 4;
        const r = data[idx], g = data[idx + 1], b = data[idx + 2];
        const brightness = (r + g + b) / (3 * 255);
        heights[j * (PHYS_RES + 1) + i] = brightness;
      }
    }

    return { heights, width: PHYS_RES, height: PHYS_RES };
  }, [heightTex]);

  // Parent component ko expose karne ke liye getHeightAt function
  useImperativeHandle(ref, () => ({
    getHeightAt: (x, z) => {
      if (!heightData) return 0;
      const col = Math.floor(((x + TERRAIN_SCALE.x / 2) / TERRAIN_SCALE.x) * PHYS_RES);
      const row = Math.floor(((z + TERRAIN_SCALE.z / 2) / TERRAIN_SCALE.z) * PHYS_RES);
      const idx = THREE.MathUtils.clamp(row * (PHYS_RES + 1) + col, 0, heightData.heights.length - 1);
      return heightData.heights[idx] * TERRAIN_SCALE.y;
    }
  }));

  if (!heightData) return null;

  // Heightfield collider args
  const hfArgs = [
    heightData.width,
    heightData.height,
    Array.from(heightData.heights).map((v) => v * TERRAIN_SCALE.y),
    {
      x: TERRAIN_SCALE.x / heightData.width,
      y: TERRAIN_SCALE.y, // collider ka vertical scale
      z: TERRAIN_SCALE.z / heightData.height
    }
  ];

  return (
    <>
      {/* Physics terrain */}
      <RigidBody type="fixed" colliders={false}>
        <HeightfieldCollider args={hfArgs} />
      </RigidBody>

      {/* Visual mesh */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[TERRAIN_SCALE.x, TERRAIN_SCALE.z, VIS_RES, VIS_RES]} />
        <meshStandardMaterial
          map={colorTex}
          displacementMap={heightTex}
          displacementScale={TERRAIN_SCALE.y} // Mesh ka visible height
          metalness={0}
          roughness={1}
        />
      </mesh>
    </>
  );
});
