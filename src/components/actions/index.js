import { sendAction } from 'helpers'
import { DownloadIcon, DownloadAllIcon, AddIcon, StopIcon, SkipIcon } from 'icons'

const handleSkip = () => sendAction('skip')
const handleStop = () => sendAction('stop')
const handleAdd = () => sendAction('addCourse')
const handleDownload = () => sendAction('downloadCurrent')
const handleDownloadAll = () => sendAction('downloadAll')

export const Actions = () => (
	<div className="controls">
		<button id="btnDwnAll" className="download__all" title="Download All" onClick={handleDownloadAll}>
			<DownloadAllIcon />
		</button>
		<button id="btnDwnCur" className="download__current" title="Download Current" onClick={handleDownload}>
			<DownloadIcon />
		</button>
		<button id="btnAddCourse" className="download__add-course" title="Add Course" onClick={handleAdd}>
			<AddIcon />
		</button>
		<button id="btnSkip" className="download__skip-video" title="Skip" onClick={handleSkip}>
			<SkipIcon />
		</button>
		<button id="btnStop" className="download__stop" title="Stop" onClick={handleStop}>
			<StopIcon />
		</button>
	</div>
)
