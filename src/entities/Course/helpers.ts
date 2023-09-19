import { pipe } from 'fp-ts/function'
import * as A from 'fp-ts/Array'
// FIX: 
//import { guard } from 'fp-ts-std/Function'

import { CourseEntity as CE, Course } from '~/entities/Course'
import { DownloadStatus } from '~/entities/Store'

import { allEq, anyEq } from '~/utils'

//const getStatus = guard<DownloadStatus[], DownloadStatus>([
//  [allEq('COMPLETED'), () => 'COMPLETED'],
//  [anyEq('FAILED'),    () => 'FAILED'],
//])

const getStatus = (statuses: DownloadStatus[]): DownloadStatus => {
  if (allEq('COMPLETED')(statuses))
    return 'COMPLETED'
  else if (anyEq('FAILED')(statuses))
    return 'FAILED'
  return 'PENDING'
}

const updateSectionStatus = (sectionIdx: number) => (course: Course): Course => pipe(
  course,
  // @ts-ignore
  CE.getStatusesInSection(sectionIdx),
  getStatus,
  // @ts-ignore
  status => CE.setSectionStatus(sectionIdx)(status)(course),
)

// @ts-ignore
const updateCourseStatus = (course: Course): Course => pipe(
  course,
  CE.getStatusesInCourse,
  getStatus,
  status => CE.setStatus(status)(course),
)

export const updateStatus = ({ sectionIdx, videoIdx, status }) =>
  (course: Course) => pipe(
    course, // @ts-ignore
    CE.setVideoStatus(sectionIdx, videoIdx)(status),
    updateSectionStatus(sectionIdx),
    updateCourseStatus,
  )

export const findCourse = courseId =>
  A.findFirst<Course>(course => CE.getId(course) === courseId)
