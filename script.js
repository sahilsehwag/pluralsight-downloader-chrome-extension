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

				console.log(filePath)
				log(`Downloading ${filePath}`)

				await downloadVideo(videoURL, filePath);
				await sleep(30000);
			}
		}
	} catch (error) {
		log(error, 'ERROR')
		return error;
	}
};




// main-function
$(() => {
	$(document).keypress(async (e) => {
		if (e.which === 115 || e.which === 83) {
			// KEYPRESS `s`

		} else if (e.which === 97 || e.which === 65) {
			// KEYPRESS `a`
			const courseJSON = JSON
								.parse($(window.__NEXT_DATA__).text())
								.props
								.pageProps
								.tableOfContents;
			await downloadCourse(courseJSON);
		}
	});
});
