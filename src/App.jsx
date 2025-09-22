// import { Canvas } from '@react-three/fiber'
// import { Physics } from '@react-three/rapier'
// import { Suspense } from 'react'
// import Project1 from './Project1'
// import './App.css'
// import Project2 from './Project2'
// import Mountain from './Terrain'


// function App() {
//   return (
//    <Canvas shadows camera={{ position: [0, 15, 15], fov: 75 }}>

//       <ambientLight intensity={1} />
//       <directionalLight position={[3, 2, 1]} castShadow />

//       <Suspense >
//         <Physics>
//           {/* <Project1 /> */}
//           <Project2></Project2>
//         {/* <Mountain></Mountain> */}
//         </Physics>
//       </Suspense>
//     </Canvas>
//   )
// }

// export default App



import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Suspense } from 'react';
import Project2 from './Project2';
import './App.css';
import HillTerrain from './HillTerrain';

function App() {
  return (
    <Canvas shadows camera={{ position: [0, 15, 15], fov: 75 }}>
      <ambientLight intensity={1} />
      <directionalLight position={[3, 2, 1]} castShadow />
      <Suspense>
        <Physics>
          {/* <HillTerrain></HillTerrain> */}
          <Project2 />
        </Physics>
      </Suspense>
    </Canvas>
  );
}

export default App;