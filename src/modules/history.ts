import { pipe } from 'fp-ts/function'
import * as A from 'fp-ts/Array'
import * as O from 'fp-ts/Option'
import * as T from 'fp-ts/Task'

import { get, set } from '~/modules/store'
import { CourseEntity as CE, Course, findCourse } from '~/entities/Course'
import { Fn1 } from '~/types'

const getCourses = get('history')
const setCourses = set('history')

export const mapCourses = (fn: Fn1<Course[], Course[]>) =>
	pipe(getCourses, T.map(fn), T.flatMap(setCourses))

export const mapCourse = courseId => (fn: Fn1<Course, Course>) =>
	mapCourses(A.map(course => (course.id === courseId ? fn(course) : course)))

// TODO: instead of Course[] should be map of courseId and course
export const addCourse = (course: Course) =>
	mapCourses(courses =>
		pipe(
			courses,
			findCourse(CE.getId(course)),
			O.match(
				() => [...courses, course],
				() => courses,
			),
		),
	)
