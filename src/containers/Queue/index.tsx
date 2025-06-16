import React from 'react'
import { useStorage } from '~/hooks/useStorage'

export const Queue = () => {
	const [queue] = useStorage({ key: 'queue', initial: [] })

	return <div>Queue!!!</div>
}
