import L from 'react-on-lambda'

import { Tree } from '~/components/ui/tree'
import { Course as CourseType } from '~/entities/Course'

interface CourseProps {
	data: CourseType
}

export const Course = L(({ data }: CourseProps) => {
	return L.div(Tree({ data }))
})
