import { Tree } from '~/components/ui/tree'
import { useStorage } from '~/hooks/useStorage'

export const History = () => {
	const [courses, setCourses] = useStorage({
		key: 'history',
		initial: [],
	})

	return (
		<div className="overflow-scroll h-full">
			{courses.map((course, idx) => (
				<Tree data={course} key={course.id} idx={idx} />
			))}
		</div>
	)
}
