import { pipe, flow, apply } from 'fp-ts/function'
import * as A from 'fp-ts/Array'
import * as RA from 'fp-ts/ReadonlyArray'
import * as TE from 'fp-ts/TaskEither'

import { tap } from '~/utils'

import { downloadFile } from '~/helpers/chrome'

import { addToQueue, buildDownloadItem } from '~/modules/queue'
import {
  buildExercisesPath,
  buildPlaylistFilePath,
  buildVideoPath,
  buildSubtitlePath,
} from './helpers'

import {
  CourseEntity as CE,
  SectionEntity as SE,
  VideoEntity as VE,
  Course,
  Section,
} from '~/entities/Course'

import { logError } from '~/modules/logging'

// TODO: make this generic ie config based
import { fetchExcerciseFilesURL, fetchVideoURL, getSubtitleURL } from '~/configs/platform/pluralsight/service'

const getPlaylistFileContent = ({ course }: { course: Course }) => pipe(
  CE.getSections(course),
  A.mapWithIndex((sectionIdx, section: Section) =>
    pipe(
      SE.getVideos(section),
      A.mapWithIndex((videoIdx, video) =>
        buildVideoPath({ course, sectionIdx, videoIdx, video }),
      ),
    )),
  A.flatten,
  paths => paths.join('\n'),
)

// TODO: instead of fetching video url here, fetching when it's the video's turn to download
const getDownloadItemsFromVideo = ({ course, sectionIdx, videoIdx, video }) => pipe(
  TE.Do,
  TE.let('videoId',   ()  => VE.getId(video)),
  TE.let('videoIdx',  ()  => videoIdx),
  TE.let('versionId', ()  => VE.getVersionId(video)),
  TE.let('sUrl',      (_) => getSubtitleURL(_)),
  TE.bind('vUrl',     (_) => fetchVideoURL(_)),

  TE.map(({ vUrl, sUrl }) => [
    buildDownloadItem({ url: vUrl, course, sectionIdx, videoIdx, type: 'VIDEO',    pathBuilder: buildVideoPath }),
    buildDownloadItem({ url: sUrl, course, sectionIdx, videoIdx, type: 'SUBTITLE', pathBuilder: buildSubtitlePath }),
  ]),
)

// FIX: one failed url fetch will cause entire thing not to run
const getDownloadItemsFromSection = ({
  course,
  sectionIdx,
  section = CE.getSection(sectionIdx)(course),
}: {
  course: Course,
  sectionIdx: number,
  section?: Section
}) => pipe(
  SE.getVideos(section),
  A.mapWithIndex((videoIdx, video) =>
    getDownloadItemsFromVideo({ course, sectionIdx, videoIdx, video })),
  TE.sequenceArray,
  TE.map(RA.flatten),
  TE.map(RA.toArray),
)

const getDownloadItemsFromCourse = (course: Course) => pipe(
  CE.getSections(course),
  A.mapWithIndex((sectionIdx, section) =>
    getDownloadItemsFromSection({ course, sectionIdx, section })),
  TE.sequenceArray,
  TE.map(RA.flatten),
  TE.map(RA.toArray),
)

const savePlaylistContentToFile = ({ playlistFileContent, filename }) =>
  pipe(
    new Blob([playlistFileContent], {
      type: 'audio/x-mpegurl',
    }),
    window.URL.createObjectURL,
    url => downloadFile({ url, filename }),
  )

// ================================================================================

export const downloadPlaylistFile = (course: Course) => pipe(
  TE.Do,
  TE.let('filename',            () => buildPlaylistFilePath({ course })),
  TE.let('playlistFileContent', () => getPlaylistFileContent({ course })),

  TE.flatMapTask(savePlaylistContentToFile),
)

export const downloadExcerciseFiles = (course: Course) => pipe(
  TE.Do,
  TE.let('courseId', ()  => CE.getId(course)),
  TE.let('filename', ()  => buildExercisesPath({ course })),
  TE.bind('url',     (_) => fetchExcerciseFilesURL(_)),

  TE.flatMapTask(downloadFile),
)

export const addSectionToQueue = flow(
  getDownloadItemsFromSection,
  TE.flatMapTask(addToQueue),
  TE.mapError(
    tap(logError)
  ),
)

export const addCourseToQueue = flow(
  getDownloadItemsFromCourse,
  TE.flatMapTask(addToQueue),
  TE.mapError(
    tap(logError)
  ),
)

export const downloadCourse = (course: Course) => pipe(
  [downloadExcerciseFiles, downloadPlaylistFile, addCourseToQueue],
  A.map(apply(course)),
  TE.sequenceArray,
)

//export const addVideoToQueue = flow()

//export const cancelVideoDownload = (item: DownloadItem) => {}
//export const cancelSectionDownload = (item: DownloadItem) => {}
//export const cancelCourseDownload = (item: DownloadItem) => {}

//export const pauseVideoDownload = (item: DownloadItem) => {}
//export const pauseSectionDownload = (item: DownloadItem) => {}
//export const pauseCourseDownload = (item: DownloadItem) => {}

//export const resumeVideoDownload = (item: DownloadItem) => {}
//export const resumeSectionDownload = (item: DownloadItem) => {}
//export const resumeCourseDownload = (item: DownloadItem) => {}

//export const updateVideoProgress = (item: DownloadItem) => {}
//export const updateSectionProgress = () => {}
//export const updateCourseProgress = () => {}

//export const playVideo = () => {}
//export const showVideoInFolder = () => {}
//export const showSectionInFolder = () => {}
//export const showCourseInFolder = () => {}

//export const deleteVideo = () => {}
//export const deleteSection = () => {}
//export const deleteCourse = () => {}

//export const redownloadVideo = () => {}
//export const redownloadSection = () => {}
//export const redownloadCourse = () => {}
