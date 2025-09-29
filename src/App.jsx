
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Suspense } from 'react';
import Project2 from './Project2';
import './App.css';

function App() {

  return (
    <Canvas shadows camera={{ position: [0, 30, 15], fov:60 }} background={"#7cccecff"}>
      <fog attach="fog" args={['#a0c4ff', 10, 100]} />
      <Suspense>
        <Physics>
          <Project2 />
        </Physics>
      </Suspense>
    </Canvas>
  );
}

export default App;