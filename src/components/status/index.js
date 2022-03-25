import { useEffect, useState } from 'react'
import { get, set } from 'utils'

export const Status = () => {
	const [extensionStatus, setExtensionStatus] = useState('READY')
	const [courseStatus, setCourseStatus] = useState('NA')
	const [modulesStatus, setModulesStatus] = useState('0/0')
	const [videosStatus, setVideosStatus] = useState('0/0')
	const [addedCoursesStatus, setAddedCoursesStatus] = useState('0')
	const [courseType, setCourseType] = useState('LATEST')

	useEffect(() => {
		get('extensionStatus', data => setExtensionStatus(data.extensionStatus))
		get('courseTitle', data => setCourseStatus(data.courseTitle))
		get('modulesCompleted', data => setModulesStatus(`${data.modulesCompleted[0]}/${data.modulesCompleted[1]}`))
		get('videosCompleted', data => setVideosStatus(`${data.videosCompleted[0]}/${data.videosCompleted[1]}`))
		get('noOfCoursesAdded', data => setAddedCoursesStatus(data.noOfCoursesAdded))
		get('courseType', data => setCourseType(data.courseType !== undefined ? data.courseType : 'LATEST'))
	}, [])

	useEffect(() => {
		chrome.runtime.onMessage.addListener(message => {
			if (typeof message !== 'object') {
				return false
			}

			if (message.extensionStatus) {
				set({ extensionStatus: `${message.extensionStatus}` }, undefined)
				setExtensionStatus(message.extensionStatus)
			}

			if (message.courseTitle) {
				set({ courseTitle: message.courseTitle }, undefined)
				setCourseStatus(message.courseTitle)
			}

			if (message.modulesCompleted) {
				set({ modulesCompleted: message.modulesCompleted }, undefined)
				setModulesStatus(`${message.modulesCompleted[0]}/${message.modulesCompleted[1]}`)
			}

			if (message.videosCompleted) {
				set({ videosCompleted: message.videosCompleted }, undefined)
				setVideosStatus(`${message.videosCompleted[0]}/${message.videosCompleted[1]}`)
			}

			if (message.noOfCoursesAdded >= 0) {
				set({ noOfCoursesAdded: message.noOfCoursesAdded }, undefined)
				setAddedCoursesStatus(message.noOfCoursesAdded)
			}
		})
	}, [])

	const handleCourseTypeChange = e => {
		setCourseType(e.target.value)
		set({ courseType: e.target.value }, undefined)
	}

	return (
		<div className="status">
			<div className="extension-status">
				<label className="status__label">
					STATUS:
					<span id="label_Status" className="status__value">
						{extensionStatus}
					</span>
				</label>
				<svg className="status__active disabled">
					<circle cx="8" cy="8" r="8" stroke="none" strokeWidth="3" />
				</svg>
			</div>
			<div className="download-status">
				<label className="course-name">
					Course: <span id="label_Title">{courseStatus}</span>
				</label>
				<label className="completed-modules">
					Modules: <span id="label_Module">{modulesStatus}</span>
				</label>
				<label className="completed-videos">
					Videos: <span id="label_Video">{videosStatus}</span>
				</label>
				<label className="added-courses">
					Added Courses: <span id="label_AddedCourseCnt">{addedCoursesStatus}</span>
				</label>
				<div className="courseType">
					<label className="coursetype__label">Course Type:</label>
					<select
						id="CourseType"
						name="Course Type"
						className="CourseType__select"
						value={courseType}
						onChange={handleCourseTypeChange}
					>
						<option value="Latest">Latest</option>
						<option value="Old">Old</option>
					</select>
				</div>
			</div>
		</div>
	)
}
