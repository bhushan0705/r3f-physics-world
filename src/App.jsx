
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Suspense } from 'react';
import Project2 from './Project2';
import './App.css';

function App() {

  return (
    <Canvas shadows camera={{ position: [0, 15, 15], fov: 75 }} background={"#87CEEB"}>
      <Suspense>
        <Physics>
          <Project2 />
        </Physics>
      </Suspense>
    </Canvas>
  );
}

export default App;