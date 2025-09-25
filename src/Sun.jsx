import { Sphere } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import React from "react";

const Sun = () => {
  return (
    <>
    <ambientLight intensity={2} />
          <directionalLight position={[30, 40, 10]} castShadow />
      <RigidBody type="fixed" colliders={false}>
        {/* Sun Mesh */}
        <Sphere args={[2, 32, 32]} position={[30, 40, 10]}>
          <meshStandardMaterial
            color={"#ffcc00"}
            emissive={"#ffaa00"}
            emissiveIntensity={6}
          />
        </Sphere>
      </RigidBody>
    </>
  );
};

export default Sun;
