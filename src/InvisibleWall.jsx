import { RigidBody, CuboidCollider } from '@react-three/rapier';
import ProceduralTerrain from './ProceduralTerrain';

const InvisibleWall = ({ size = 30, wallHeight = 5 }) => {
  const halfSize = size / 2;

  return (
    <>
      {/* Floor */}
      <RigidBody type="fixed" colliders="trimesh">
        <ProceduralTerrain size={size} segments={50} height={5} />
      </RigidBody>

      {/* Invisible walls */}
      {/* Front wall */}
      <RigidBody type="fixed">
        <CuboidCollider args={[halfSize, wallHeight / 2, 0.1]} position={[0, wallHeight / 2, -halfSize]} />
      </RigidBody>

      {/* Back wall */}
      <RigidBody type="fixed">
        <CuboidCollider args={[halfSize, wallHeight / 2, 0.1]} position={[0, wallHeight / 2, halfSize]} />
      </RigidBody>

      {/* Left wall */}
      <RigidBody type="fixed">
        <CuboidCollider args={[0.1, wallHeight / 2, halfSize]} position={[-halfSize, wallHeight / 2, 0]} />
      </RigidBody>

      {/* Right wall */}
      <RigidBody type="fixed">
        <CuboidCollider args={[0.1, wallHeight / 2, halfSize]} position={[halfSize, wallHeight / 2, 0]} />
      </RigidBody>
    </>
  );
};


export default InvisibleWall;
