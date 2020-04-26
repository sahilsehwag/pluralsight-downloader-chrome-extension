// =================================================================
// START:VARIABLES
// =================================================================
const APPNAME        = 'PluralsightCourseDownloader'
const ROOT_DIRECTORY = 'PluralsightCourseDownloader'

const INVALID_CHARACTERS = /[\/:?><]/g
const DELIMINATOR        = '.'
const EXTENSION          = 'mp4'
const DEFAULT_QUALITY    = "1280x720"

// videoURL to get the actual video URL
const viewclipURL = "https://app.pluralsight.com/video/clips/v3/viewclip";

// STATE variables
let EXTENSION_ENABLED = false
let CONTINUE_DOWNLOAD = true
// =================================================================
// END:VARIABLES
// =================================================================




// ====================================================================
// START:UTILITIES
// ====================================================================
const sleep = ms =>
	new Promise((resolve) => setTimeout(resolve, ms));

const log = (message, type="STATUS") =>
	console.log(`[${APPNAME}]:[${type}]: ${message}`);


const removeInvalidCharacters = name =>
	name
		.replace(INVALID_CHARACTERS, " ")
		.trim();
// ====================================================================
// END:UTILITIES
// ====================================================================



const getDirectoryName = (sectionIndex, sectionName) =>
	removeInvalidCharacters(`${sectionIndex + 1}${DELIMINATOR} ${sectionName}`);

const getFileName = (videoIndex, videoName) =>
	removeInvalidCharacters(`${videoIndex + 1}${DELIMINATOR} ${videoName}`);


const getVideoURL = async (videoId) => {
	try {
		const response = await fetch(viewclipURL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				clipId: videoId,
				mediaType: EXTENSION,
				quality: DEFAULT_QUALITY,
				online: true,
				boundedContext: "course",
				versionId: "",
			}),
		});

		const json = await response.json();
		return json.urls[0].url;

	} catch (error) {
		return error;
	}
};


const getFilePath = async (
	courseName,
	authorName,
	sectionIndex,
	sectionName,
	videoIndex,
	videoName,
) => {
	try {
		const rootDirectory    = ROOT_DIRECTORY
		const courseDirectory  = `${courseName} By ${authorName}`.trim()
		const sectionDirectory = getDirectoryName(sectionIndex, sectionName);
		const fileName         = getFileName(videoIndex, videoName);

		const filePath = `${rootDirectory}/${courseDirectory}/${sectionDirectory}/${fileName}.${EXTENSION}`;

		return filePath.replace(/(\r\n|\n|\r)/gm, "");
	} catch (error) {
		return error;
	}
};


const downloadVideo = async (videoURL, filePath) => {
	try {
		chrome.runtime.sendMessage({
				action: "download",
				videoURL: videoURL,
				filePath: filePath,
			},
			(response) => log(response.actionStatus)
		);
	} catch (error) {
		return error;
	}
};


const downloadCourse = async (courseJSON) => {
	try {
		const {
			id: courseId,
			title: courseName,
			authors,
			modules: sections,
		} = courseJSON;

		const authorName = authors[0].displayName;

		for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
			const {
				id: sectionId,
				title: sectionName,
				contentItems: sectionItems,
			} = sections[sectionIndex];

			for (let videoIndex = 0; videoIndex < sectionItems.length; videoIndex++) {
				if (CONTINUE_DOWNLOAD) {
					const {
						id: videoId,
						title: videoName,
					} = sectionItems[videoIndex];

					const videoURL = await getVideoURL(videoId);
					const filePath = await getFilePath(
						removeInvalidCharacters(courseName),
						removeInvalidCharacters(authorName),
						sectionIndex,
						removeInvalidCharacters(sectionName),
						videoIndex,
						removeInvalidCharacters(videoName),
					);

					log(`Downloading ${filePath} ...`)

					await downloadVideo(videoURL, filePath);
					await sleep(30000);
				}else {
					CONTINUE_DOWNLOAD = !CONTINUE_DOWNLOAD
					log('Downloading stopped!!!')
					return
				}
			}
		}
		log('Downloading completed!!!')
	} catch (error) {
		log(error, 'ERROR')
		return error;
	}
};




// main-function
$(() => {
	$(document).keypress(async (e) => {
		if (
			// e.ctrlKey &&
			(e.which === 101 || e.which === 69)
		){
			// KEYPRESS `CTRL-e`
			// Enable/Disabled extension bindings
			!EXTENSION_ENABLED ? log('Enabled the extension bindings.') : log('Disabled the extension bindings.')
			EXTENSION_ENABLED = !EXTENSION_ENABLED

		}else if (
			EXTENSION_ENABLED &&
			// e.ctrlKey &&
			(e.which === 115 || e.which === 83)
		){
			// KEYPRESS `s`
			// Stops the download the process, it won't stop the current download, it will abort the download of further videos
			log('Stopping the download process...')
			CONTINUE_DOWNLOAD = false

		}else if (
			EXTENSION_ENABLED &&
			// e.ctrlKey &&
			(e.which === 118 || e.which === 86)
		 ){
			// KEYPRESS `CTRL-v`
			// Download current video

		} else if (
			EXTENSION_ENABLED &&
			// e.ctrlKey &&
			(e.which === 99 || e.which === 67)
		){
			// KEYPRESS `CTRL-c`
			// Download the entire course
			log('Downloading course...')
			log('Fetiching course information...')

			if (EXTENSION_ENABLED) {
				const courseJSON = JSON
									.parse($(window.__NEXT_DATA__).text())
									.props
									.pageProps
									.tableOfContents;
				await downloadCourse(courseJSON);
			}
		}
	});
});
