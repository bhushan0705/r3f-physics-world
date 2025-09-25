import { useGLTF } from '@react-three/drei'
import { MeshCollider, RigidBody } from '@react-three/rapier'
import React from 'react'

const BigTree = () => {

    const {scene} = useGLTF('public/models/island_tree_02_1k.gltf');

  return (
    <>
    <RigidBody type='fixed' colliders={false} position={[-29,15.2,5]}>
        <MeshCollider type={'trimesh'} >
            <primitive object={scene} scale={3} >
              {/* <meshStandardMaterial color={'pink'}></meshStandardMaterial> */}
            </primitive>
        </MeshCollider>
    </RigidBody>
    </>
  )
}

export default BigTree;