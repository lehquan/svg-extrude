import React, { Suspense } from 'react'
import {OrbitControls, Environment} from '@react-three/drei';
import { Canvas } from '@react-three/fiber'
import Lights from './components/Lights';
import DistortMesh from './components/DistortMesh';

const App = () => {
  return (
      <Suspense fallback={<span>loading...</span>}>
        <Canvas linear dpr={[1, 2]} gl={{ preserveDrawingBuffer: true }} camera={{ fov: 45, position: [0, 0, 10] }}>
          <color attach="background" args={['#1e2243']} />
          <Lights/>
          <Environment preset='night' />
          <OrbitControls />
          <DistortMesh/>
        </Canvas>
      </Suspense>
  )
}


export default App;
