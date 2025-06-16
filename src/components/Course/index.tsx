import { Tree } from '../ui/tree'
import { Course as CourseType } from '~/entities/Course'

interface CourseProps {
	course: CourseType
}

export const Course = ({ course }: CourseProps) => {
	return <Tree data={course}></Tree>
}
