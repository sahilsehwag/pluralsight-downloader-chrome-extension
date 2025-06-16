import { pipe } from 'fp-ts/function'
import * as A from 'fp-ts/Array'
import * as T from 'fp-ts/Task'
import * as TO from 'fp-ts/TaskOption'
import { Predicate } from 'fp-ts/Predicate'

import { DownloadItem, Queue } from '~/entities/Store'
import { CourseEntity as CE, Course, updateStatus } from '~/entities/Course'

import { get, map } from '~/modules/store'

import { downloadFile } from '~/helpers/chrome'
import { mapCourse } from '~/modules/history'
import { getDelay } from '~/modules/settings'
import { Fn1 } from '~/types'

export const buildDownloadItem = ({
	course,
	videoIdx,
	sectionIdx,
	url,
	pathBuilder,
	type,
}: {
	course: Course
	videoIdx: number
	sectionIdx: number
	url: string
	pathBuilder: Fn1<any, string>
	type: DownloadItem['type']
}): DownloadItem => ({
	status: 'QUEUED',
	sectionIdx,
	videoIdx,
	type,

	courseId: CE.getId(course),

	url: url,
	filename: pathBuilder({ course, sectionIdx, videoIdx }),
})

// ==========================================

export const addToQueue = (items: DownloadItem[]) =>
	map('queue')(A.concat(items))

const filterQueue = (fn: Predicate<DownloadItem>) => map('queue')(A.filter(fn))

const mapItemInQueue = (item: DownloadItem) => fn =>
	map('queue')(
		A.map(other => (item.videoIdx === other.videoIdx ? fn(other) : other)),
	)

const findInQueue = (fn: Predicate<DownloadItem>) =>
	pipe(get('queue'), T.map(A.findFirst(fn)))

// ==========================================

// FIX: instead of index use id
const removeItemFromQueue = (item: DownloadItem) =>
	filterQueue(other => {
		return !(
			item.videoIdx === other.videoIdx &&
			item.sectionIdx === other.sectionIdx &&
			item.courseId === other.courseId &&
			item.type === other.type
		)
	})

const findNextInQueue = findInQueue(item => item.status === 'QUEUED')

const updateCourseStatus =
	status =>
	({ courseId, ...item }: DownloadItem) =>
		mapCourse(courseId)(updateStatus({ ...item, status }))

// handlers
const onComplete = (item: DownloadItem) =>
	pipe(
		T.of(item),
		T.tap(removeItemFromQueue),
		T.tap(updateCourseStatus('COMPLETED')),
	)

// TODO:
//const onFailed = (item: DownloadItem) => {}
//const onPause = (item: DownloadItem) => {}
//const onResume = (item: DownloadItem) => {}
//const onCancel = (item: DownloadItem) => {}

const downloadNextInQueue = pipe(
	findNextInQueue,
	TO.tapTask(downloadFile as any),
	TO.tapTask(onComplete),
)

// FIX:
export function startDownload() {
	return pipe(
		downloadNextInQueue,
		T.delay(10000),
		TO.flatMap(() => startDownload()),
	)
}
