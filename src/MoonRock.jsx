import { RigidBody, MeshCollider } from "@react-three/rapier";
import { useGLTF } from "@react-three/drei";

export function MoonRock() {
  const { scene } = useGLTF("/moon_rock_01_1k.gltf");

  let number = 10;
  const position = Array.from({length:number},(_,i)=>{
 // Simple formula to spread rocks
    const x = (i * 7 + 3) % 30;  // pseudo-random-ish x
    const z = (i * 5 + 2) % 30;  // pseudo-random-ish z
    const y = 1;                  // ground height
    return [x, y, z];
  })

  return (
    <>
      {/* Rock 1 (static obstacle) */}
      <RigidBody type="fixed" colliders={false} position={[9,2,0]}>
        <MeshCollider type="hull">
          <primitive object={scene.clone()} scale={25} />
        </MeshCollider>
      </RigidBody>

      {/* Rock 2 (static obstacle) */}
      <RigidBody type="fixed" colliders={false} position={[12, 1, 10]}>
        <MeshCollider type="hull">
          <primitive object={scene.clone()} scale={25} />
        </MeshCollider>
      </RigidBody>
    </>
  );
}
