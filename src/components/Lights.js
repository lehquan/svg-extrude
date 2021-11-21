import React, { useRef } from 'react'

const Lights = React.memo(() => {
	const lights = useRef()

	//
	return (
		<group ref={lights}>
			<ambientLight intensity={0.5} color={0xfae7e7} />
			<directionalLight position={[10, 10, 5]} intensity={2.5} />
			<directionalLight position={[0, 10, 5]} intensity={1} />
			<pointLight position={[0, -10, 5]} intensity={1} />
		</group>
	)
})

export default Lights
