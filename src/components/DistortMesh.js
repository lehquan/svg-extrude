import React, { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'

import svgImage from '../icon-greedy.svg'
const loaderSVGImage = new SVGLoader()
const SVGParams = {
  drawFillShapes: true,
  drawStrokes: true,
}

const DistortMesh = () => {
  const [shapes, setShapes] = useState([])
  const insideRef = useRef()
  const extrudeSettings = React.useMemo(
      () => ({
        steps: 2,
        depth: 4,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 0,
        bevelOffset: 0,
        bevelSegments: 1,
      }),
      [],
  )
  // sphere params
  const params = {
    radius: 1.0, // Default is 1.0
    widthSegments: 64, // Minimum value is 3, and the default is 8.
    heightSegments: 32, // Minimum value is 2, and the default is 6.
  }
  const geo = new THREE.SphereBufferGeometry(params.radius, params.widthSegments, params.heightSegments)

  //
  useEffect(async () => {
    const res = await loadSVG(svgImage, extrudeSettings)
    setShapes([res.children])
  }, [])

  // Rotate object inside realseed if needed
  useFrame(() => {
    if (insideRef.current) {
      insideRef.current.rotation.y = insideRef.current.rotation.x += 0.005
    }
  })

  //
  return(
      <mesh geometry={geo}>
        <MeshDistortMaterial
            color={new THREE.Color('#ED213A')}
            attach='material'
            distort={0.4} // Strength, 0 disables the effect (default=1)
            speed={ 2.0} // Speed
            transparent={true}
            opacity={.4}
            roughness={1}
            radius={2}
        />
        {/*Content inside*/}
        {shapes.map((shape, index) => {
          return (
              <group key={index}>
                <primitive
                    ref={insideRef}
                    object={shape[index]}
                    scale={0.1}
                    position={[0, 0, -0.5]}
                    rotation={[(Math.PI / 180) * -180, 0, 0]}
                >
                  <meshNormalMaterial attach='material' />
                </primitive>
              </group>
          )
        })}
      </mesh>
  )

}

/**
 * Make 3D shapes from SVG image.
 * @param url
 * @param extrudeSettings
 * @return {Promise<unknown>}
 */
const loadSVG = (url, extrudeSettings) => {
  return new Promise((resolve, reject) => {
    loaderSVGImage.load(url, function (data) {
      const paths = data.paths
      // Group that will contain all of our paths
      const svgGroup = new THREE.Group()

      for (let i = 0; i < paths.length; i++) {
        const path = paths[i]

        const fillColor = path.userData.style.fill
        if (SVGParams.drawFillShapes && fillColor !== undefined && fillColor !== 'none') {
          const shapes = SVGLoader.createShapes(path)

          for (let j = 0; j < shapes.length; j++) {
            const shape = shapes[j]
            // const geometry = new THREE.ShapeGeometry(shape) // Use this for 2D shape
            const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings) // Change to 3D shape
            const mesh = new THREE.Mesh(geometry, new THREE.MeshPhysicalMaterial())

            // Change pivot for object to center
            const center = new THREE.Vector3()
            mesh.geometry.computeBoundingBox()
            mesh.geometry.boundingBox.getCenter(center)
            mesh.geometry.center()
            mesh.position.copy(center)

            svgGroup.add(mesh)
          }
        }
      }
      resolve(svgGroup)
    })
  })
}

export default DistortMesh
