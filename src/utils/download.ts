import { pipe } from 'fp-ts/function'
import * as A from 'fp-ts/Array'
import * as T from 'fp-ts/Task'

import {
	CourseEntity as CE,
	Course,
	SectionEntity as SE,
	Section,
	VideoEntity as VE,
	Video,
} from '~/entities'
import { DownloadItem } from '~/types'
import { buildVideoPath } from '~/helpers/path'

type SequenceWithDelay = <V>
	(delay: number) =>
	(tasks: T.Task<V>[]) =>
	T.Task<readonly V[]>

export const sequenceWithDelay: SequenceWithDelay = delay => tasks =>
	pipe(
		tasks,
		A.map(T.delay(delay)),
		T.sequenceSeqArray
	)

export const buildDownloadItem = ({
	course,
	videoIdx,
	sectionIdx,
	url,
	pathBuilder = buildVideoPath,
	section = CE.getSection(sectionIdx)(course),
	video = SE.getVideo(videoIdx)(section),
}: {
	course: Course;
	videoIdx: number;
	sectionIdx: number;
	url: string;
	pathBuilder?: any;
	section?: Section,
	video?: Video,
}): DownloadItem => ({
	status: 'PENDING',

	courseId:  CE.getId(course),
	sectionId: SE.getId(section),
	videoId:   VE.getId(video),

	url: url,
	filename: pathBuilder({ course, sectionIdx, videoIdx }),
})
