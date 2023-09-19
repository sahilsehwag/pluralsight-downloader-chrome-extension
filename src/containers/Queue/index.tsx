import L from 'react-on-lambda'

import { useStorage } from '~/hooks/useStorage';

export const Queue = L(() => {
  const [queue] = useStorage({ key: 'queue', initial: [] })

	return L.div('Queue!!!')
})
