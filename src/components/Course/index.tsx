import L from 'react-on-lambda'

import { Tree } from '~/components/ui/tree';
//import { Tree } from '~/components/Tree';

export const Course = L(
	({ data }) => {
		return L.div(
      Tree({ data })
		)
	}
)
