import { useEffect, useState } from 'react'
import { flow, pipe } from 'fp-ts/lib/function'

import { get, set } from 'utils/chrome'
import { getModuleCompletionStatus, getVideoCompletionStatus } from './helpers'

import {
	COURSE_TYPE_X_LABEL,
	FIELD_X_LABEL,
	FIELD_X_KEY as KEYS,
	STATUS_X_LABEL,
	COURSE_TYPES,
} from 'constants/index'

const {
	MODULES_COMPLETED,
	VIDEOS_COMPLETED,
	COURSE_TITLE,
	COURSE_TYPE,
	COURSES_ADDED,
	STATUS,
} = KEYS

export const Status = () => {
	const [status, setStatus] = useState(STATUS_X_LABEL.READY)
	const [courseTitle, setCourseTitle] = useState('-')
	const [coursesAdded, setCoursesAdded] = useState(0)
	const [courseType, setCourseType] = useState(COURSE_TYPES.NEW)
	const [modulesStatus, setModulesStatus] = useState('-')
	const [videosStatus, setVideosStatus] = useState('-')

	useEffect(() => {
		get(STATUS).then(setStatus)
		get(COURSE_TITLE).then(setCourseTitle)
		get(COURSES_ADDED).then(setCoursesAdded)
		get(COURSE_TYPE).then(setCourseType)
		get(MODULES_COMPLETED).then(
			flow(getModuleCompletionStatus, setModulesStatus),
		)
		get(VIDEOS_COMPLETED).then(flow(getVideoCompletionStatus, setVideosStatus))
	}, [])

	useEffect(() => {
		chrome.runtime.onMessage.addListener(message => {
			if (typeof message !== 'object') {
				return false
			}

			const status = message[STATUS]
			const title = message[COURSE_TITLE]
			const coursesAdded = message[COURSES_ADDED]
			const modulesCompleted = message[MODULES_COMPLETED]
			const videosCompleted = message[VIDEOS_COMPLETED]

			if (status) {
				set(STATUS, status)
				setStatus(status)
			}

			if (title) {
				setCourseTitle(title)
				setStatus(status)
				set(COURSE_TITLE, title)
			}

			if (coursesAdded >= 0) {
				set(COURSES_ADDED, coursesAdded)
				setCoursesAdded(coursesAdded)
			}

			if (modulesCompleted) {
				set(MODULES_COMPLETED, modulesCompleted)
				pipe(modulesCompleted, getModuleCompletionStatus, setModulesStatus)
			}

			if (videosCompleted) {
				set(VIDEOS_COMPLETED, videosCompleted)
				pipe(videosCompleted, getVideoCompletionStatus, setVideosStatus)
			}
		})
	}, [])

	const handleCourseTypeChange = e => {
		setCourseType(e.target.value)
		set(COURSE_TYPE, e.target.value)
	}

	return (
		<div className="status">
			<div className="extension-status">
				<label className="status__label">
					{FIELD_X_LABEL.STATUS}:
					<span id="label_Status" className="status__value">
						{status}{' '}
					</span>
				</label>
				<svg className="status__active disabled">
					<circle cx="8" cy="8" r="8" stroke="none" strokeWidth="3" />
				</svg>
			</div>
			<hr />
			<div className="download-status">
				<label className="course-name">
					{FIELD_X_LABEL.COURSE_TITLE}:{' '}
					<span id="label_Title">{courseTitle}</span>
				</label>
				<label className="completed-modules">
					{FIELD_X_LABEL.MODULES_COMPLETED}:{' '}
					<span id="label_Module">{modulesStatus}</span>
				</label>
				<label className="completed-videos">
					{FIELD_X_LABEL.VIDEOS_COMPLETED}:{' '}
					<span id="label_Video">{videosStatus}</span>
				</label>
				<label className="added-courses">
					{FIELD_X_LABEL.COURSES_ADDED}:{' '}
					<span id="label_AddedCourseCnt">{coursesAdded}</span>
				</label>
				<div className="courseType">
					<label className="coursetype__label">
						{FIELD_X_LABEL.COURSE_TYPE}:{' '}
					</label>
					<select
						id="CourseType"
						name="Course Type"
						className="CourseType__select"
						value={courseType}
						onChange={handleCourseTypeChange}
					>
						<option value={COURSE_TYPES.NEW}>{COURSE_TYPE_X_LABEL.NEW}</option>
						<option value={COURSE_TYPES.OLD}>{COURSE_TYPE_X_LABEL.OLD}</option>
					</select>
				</div>
			</div>
		</div>
	)
}
