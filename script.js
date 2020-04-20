// ============================================
// variables
// ============================================
const appName = 'Pluralsight'
const deliminator = '. '
const extension = 'mp4'

let count        = 0
let isSequential = true

const videoIdParamName = 'clipId'

const courseNameSelector = '.course-title__title .course-title__link'
const authorNameSelector = '.course-title__subtitle .course-title__link'

const sectionNameSelector        = '.module-header__title'
const currentSectionSelector     = '.is-current-module'
const sectionIndexSelector       = currentSectionSelector + ' ' + '.module-progress__text'
const currentSectionNameSelector = currentSectionSelector + ' ' + sectionNameSelector

const videoNameSelector        = '.content-item span.u-truncate'
const currentVideoNameSelector = '.is-current' + videoNameSelector

const currentSectionVideosSelector = currentSectionSelector + ' ' + videoNameSelector

const nextSelector = 'div[data-text*="Next"] button'
const playSelector = 'div[data-text*="Play"] button'

// link to get the actual video URL
const viewclipURL = 'https://app.pluralsight.com/video/clips/v3/viewclip'



// ============================================
// miscellanous
// ============================================
const log = (message, type='STATUS') => {
	console.log('[' + appName + ']:[' + type + ']:' + ' ' + message)
}

const nameToFilename = name => name.replace(/[\/:?><]/g, ' ').trim()
const getText        = selector => nameToFilename($(selector).text())
const getLastText    = selector => nameToFilename($(selector).last().text())



// ============================================
// utilities
// ============================================
const getVideoID = _ => (new URLSearchParams(window.location.search)).get(videoIdParamName)

const getVideoURL = async () => {
	const response = await fetch(viewclipURL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			clipId: getVideoID(),
			mediaType: "mp4",
			quality: "1280x720",
			online: true,
			boundedContext: "course",
			versionId: "",
		}),
	})

	const json = await response.json()
	return json.urls[0].url
}


const pauseVideo    = _ => $(playSelector).click();
const playNextVideo = _ => $(nextSelector).click();

const getCourseName = _ => getText(courseNameSelector)
const getAuthorName = _ => getText(authorNameSelector)

const getSectionName      = _ => getText(currentSectionNameSelector)
const getSectionIndex     = _ => getText(sectionIndexSelector)
const getLastSectionName  = _ => getLastText(sectionNameSelector)

const getVideoName     = _ => getText(currentVideoNameSelector)
const getLastVideoName = _ => getLastText(videoNameSelector)

const getVideoIndex    = currentVideoName => {
	return $(currentSectionVideosSelector)
			.map((index, element) =>  nameToFilename($(element).text()) === currentVideoName ? index : undefined)
			.filter(value => value !== undefined)[0]
}


const getDirectoryName = (sectionIndex, sectionName) => nameToFilename(`${sectionIndex}${deliminator}${sectionName}`)
const getFileName      = (videoIndex, videoName) => nameToFilename(`${videoIndex+1}${deliminator}${videoName}`)


const getFilePath = async _ => {
	const courseName = getCourseName();
	const authorName = getAuthorName();

	const sectionName          = getSectionName()
	const sectionIndex         = getSectionIndex()
	const sectionDirectoryName = getDirectoryName(sectionIndex, sectionName)

	const videoName  = getVideoName()
	const videoIndex = getVideoIndex(videoName)
	const fileName   = getFileName(videoIndex, videoName)

	const filePath = `${appName}/${courseName} By ${authorName}/${sectionDirectoryName}/${fileName}.${extension}`
	return filePath.replace(/(\r\n|\n|\r)/gm, "");
}

const downloadVideo = async _ => {
	const link     = await getVideoURL();
	const filePath = await getFilePath();

	log('Downloading... ' + filePath)

	chrome.runtime.sendMessage({
			action: 'download',
			link: link,
			filename: filePath
		},
		(response) => log(response.actionStatus)
	);
}

const downloadVideos = async _ => {
	const link     = await getVideoURL();
	const filePath = await getFilePath();

	const sectionName     = getSectionName()
	const lastSectionName = getLastSectionName()

	const videoName     = getVideoName()
	const lastVideoName = getLastVideoName()

	const downloadTimeout = 30000;
	const pauseTimeout    = 8000;

	log('Downloading... ' + filePath)

	chrome.runtime.sendMessage({
			action: isSequential ? 'download-sync': 'download',
			link: link,
			filename: filePath
		},
		(response) => {
			log(response.actionStatus)

			if (sectionName === lastSectionName && videoName === lastVideoName)
				log('Download Finished', 'SUCCESS')
			else {
				playNextVideo()
				setTimeout(pauseVideo, isSequential ? pauseTimeout / 2 : pauseTimeout);
				setTimeout(downloadVideos, isSequential ? downloadTimeout / 3 :  downloadTimeout);
			}
		}
	);
}



// main-function
$(() => {
	$(document).keypress(async (e) => {
		if (e.which === 115 || e.which === 83) {
			// keypress `s`
			log('Extracting.... video information', 'STATUS');

			await downloadVideo();
		} else if (e.which === 97 || e.which === 65) {
			// keypress `a`
			log('Extracting.... course information', 'STATUS');

			count = 0;
			await downloadVideos();
		}
	});
});
