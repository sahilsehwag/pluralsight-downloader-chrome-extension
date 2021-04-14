// =================================================================
// START:VARIABLES
// =================================================================

const APPNAME = 'PluralsightCourseDownloader'
const ROOT_DIRECTORY = 'PluralsightCourseDownloader'

const INVALID_CHARACTERS = /[\/:?><]/g
const DELIMINATOR = '.'
const EXTENSION = 'mp4'
const EXTENSION_SUBS = 'smi'

const qualities = ["1280x720", "1024x768"]
const DEFAULT_QUALITY = qualities[0]

const DOWNLOAD_TIMEOUT = 5000
let DURATION_PERCENT = 10		// percent max 100
let DURATION_MAX = 0			// duration max 0 (infinity)


// videoURL to get the actual video URL
const viewclipURL = "https://app.pluralsight.com/video/clips/v3/viewclip";
const subsURL = "https://app.pluralsight.com/transcript/api/v1/caption/webvtt"

// STATE variables
let EXTENSION_ENABLED = false
let CONTINUE_DOWNLOAD = true
let DOWNLOADING = false
var delayProm;

// =================================================================
// END:VARIABLES
// =================================================================




// ====================================================================
// START:UTILITIES
// ====================================================================
const sleep = ms =>
	new Promise((resolve) => setTimeout(resolve, ms));

// singleton delay promise
function delay( millis ) {
		let timeout_id;
		let resolver;
		delayProm = new Promise((resolve, reject) => {
			resolver = resolve;
		  timeout_id = setTimeout(() => {
			resolve();	//실행완료
		  }, millis);
		});
		
		delayProm.cancel = () => {
		  clearTimeout( timeout_id );
		  resolver();
		};

		return delayProm;
	  }

const log = (message, type = "STATUS") =>
	console.log(`[${APPNAME}]:[${type}]: ${message}`);


const removeInvalidCharacters = name =>
	name.replace(INVALID_CHARACTERS, " ")
		.trim();

const getCurrentVideoId = () => {
	const vIdMatch = location.search.match("clipId=?([0-9a-f-]*)");
	return vIdMatch ? vIdMatch[1] : null;
}

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

const getSubtitleURL = async (videoId, versionId) => {

	return subsURL + "/" + videoId + "/" + versionId + "/en/";
}

const getFilePath = async (
	courseName,
	authorName,
	sectionIndex,
	sectionName,
	videoIndex,
	videoName,
	extension
) => {
	try {
		const rootDirectory = ROOT_DIRECTORY
		const courseDirectory = (
			authorName !== undefined ?
				`${courseName} By ${authorName}`.trim() :
				`${courseName}`.trim()
		)
		const sectionDirectory = getDirectoryName(sectionIndex, sectionName);
		const fileName = getFileName(videoIndex, videoName);

		const filePath = `${rootDirectory}\\${courseDirectory}\\${sectionDirectory}\\${fileName}.${extension}`;


		return filePath.replace(/(\r\n|\n|\r)/gm, "");
	} catch (error) {
		return error;
	}
};


const downloadVideo = async (videoURL, filePath) => {
	try {
		chrome.runtime.sendMessage({
			action: "download-sync",
			link: videoURL,
			filePath: filePath,
		},
			(response) => log(response.actionStatus)
		);

	} catch (error) {
		return error;
	}
};

const downloadSubs = async (subsURL, filePath) => {
	try {
		chrome.runtime.sendMessage({
			action: "download-sync",
			link: subsURL,
			filePath: filePath,
		},
			(response) => log(response.actionStatus)
		);
	} catch (error) {
		return error;
	}
};


const getStorageValue = () => {
	try {
		chrome.storage.sync.get('speedPercent', function (data) {
			DURATION_PERCENT = data.speedPercent;
		});
	
		chrome.storage.sync.get('maxDuration', function (data) {
			DURATION_MAX = data.maxDuration;
		});
	} catch (error) {
		log(error, 'ERROR')
	}
	
};


const downloadCourse = async (courseJSON, startingVideoId) => {
	try {
		const {
			id: courseId,
			title: courseName,
			authors,
			modules: sections,
		} = courseJSON;

		const authorName = authors[0].displayName != undefined ? authors[0].displayName : authors[0].authorHandle;
		if (authorName == undefined)
			authorName = "noName";

		// download all videos when no startid was given
		let startToggle = startingVideoId == null || startingVideoId == '';

		log(`#################### "${courseName} By ${authorName}" ####################`, 'INFO')

		for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
			const {
				id: sectionId,
				title: sectionName,
				contentItems: sectionItems,
			} = sections[sectionIndex];

			log(`==================== "${sectionName}" ====================`, 'INFO')

			for (let videoIndex = 0; videoIndex < sectionItems.length; videoIndex++) {
				if (CONTINUE_DOWNLOAD) {
					const {
						id: videoId,
						title: videoName,
						version: versionId,
						duration,
					} = sectionItems[videoIndex];

					if (!startToggle) {
						if (videoId == startingVideoId) {
							startToggle = true;
						}
					}

					if (!startToggle) {
						console.log(`Skipping [${videoId}] ${videoName}`);
						continue;
					}
					
					console.log(`Downloading [${videoId}] ${videoName}`);

					const filePath = await getFilePath(
						removeInvalidCharacters(courseName),
						removeInvalidCharacters(authorName),
						sectionIndex,
						removeInvalidCharacters(sectionName),
						videoIndex,
						removeInvalidCharacters(videoName),
						`${EXTENSION}`
					);

					const filePath_subs = await getFilePath(
						removeInvalidCharacters(courseName),
						removeInvalidCharacters(authorName),
						sectionIndex,
						removeInvalidCharacters(sectionName),
						videoIndex,
						removeInvalidCharacters(videoName),
						`${EXTENSION_SUBS}`
					);


					getStorageValue();


					const videoURL = await getVideoURL(videoId);
					const subsURL = await getSubtitleURL(videoId, versionId);

					log(`Downloading... "${videoName}"`, 'DOWNLOAD')



					chrome.storage.sync.set({ Status: "Downloading..." }, undefined);
					await downloadVideo(videoURL, filePath);

					// Progress Informaton Update on Storage
					chrome.storage.sync.set({ Completion_Module: `${sectionIndex + 1}/${sections.length}` }, undefined);
					chrome.storage.sync.set({ Completion_Video: `${videoIndex + 1}/${sectionItems.length}` }, undefined);

					
					await sleep(DOWNLOAD_TIMEOUT);
					await downloadSubs(subsURL, filePath_subs);

					chrome.storage.sync.set({Status: "Waiting..."}, undefined);
					
					// Sleep for minimum duration btw the time with percent and the max duration time
					if(DURATION_MAX != 0)
						await delay(Math.min(duration*10*DURATION_PERCENT - DOWNLOAD_TIMEOUT, DURATION_MAX*1000 - DOWNLOAD_TIMEOUT));
					else
					// // Sleep for duration based on a constant updated by speedPercent from extesion browser
						await delay(Math.max(duration*10*DURATION_PERCENT - DOWNLOAD_TIMEOUT,DOWNLOAD_TIMEOUT));

					} else {
						CONTINUE_DOWNLOAD = false
						DOWNLOADING = false
						log('Downloading stopped!!!')
						return

				}
			}
		}
		DOWNLOADING = false
		log('Downloading finished!!!')
		confirm("Downloading finished");

		if (CONTINUE_DOWNLOAD)
			chrome.storage.sync.set({ Status: "Finished" }, undefined);

		else
			chrome.storage.sync.set({ Status: "Cancelled" }, undefined);

	} catch (error) {
		log(error, 'ERROR')
		chrome.storage.sync.set({ Status: "Stopped" }, undefined);
		return error;
	}
};

chrome.storage.onChanged.addListener(function (changes, namespace) {
	for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
		if(key == 'btnSkip' && delayProm !== undefined)
		{
			delayProm.cancel();
		}
		if(key == 'btnStop')
		{
			CONTINUE_DOWNLOAD = false;
		}

		if(key == 'btnDwnAll')
		{
			EXTENSION_ENABLED = true;
			var e = $.Event('keypress');
			e.which = 99; // Character 'c'
			$(document).trigger(e);
		}

		if(key == 'btnDwnCur')
		{
			EXTENSION_ENABLED = true;
			var e = $.Event('keypress');
			e.which = 86; // Character 'v'
			$(document).trigger(e);
		}

	}
  });

  
// main-function
$(() => {
	$(document).keypress(async (e) => {

		const cmdToggleEnabled = (e.which === 101 || e.which === 69);
		const cmdStopDownload = e.which === 115 || e.which === 83;
		const cmdDownloadAll = e.which === 99 || e.which === 67; // Download the entire course | key: c
		const cmdDownloadFromNowOn = e.which === 86 || e.which === 118; //key: v

		if (cmdToggleEnabled) {

			// KEYPRESS `CTRL-e`
			// Enable/Disabled extension bindings
			!EXTENSION_ENABLED ? log('Enabled the extension bindings.') : log('Disabled the extension bindings.')
			EXTENSION_ENABLED = !EXTENSION_ENABLED
			return;
		}


		if (!EXTENSION_ENABLED) {
			return;
		}
		if (cmdStopDownload) {

			// KEYPRESS `s`
			// Stops the download the process, it won't stop the current download, it will abort the download of further videos
			log('Stopping the download process...')
			CONTINUE_DOWNLOAD = false;
			return;

		}

		if (cmdDownloadAll || cmdDownloadFromNowOn) {
			log('Downloading course ' + (cmdDownloadAll ? 'from the beginning' : 'from now on') + ' ...')
			log('Fetching course information...')

			CONTINUE_DOWNLOAD = true;
			DOWNLOADING = true;

			const courseJSON = JSON
				.parse($(window.__NEXT_DATA__).text())
				.props
				.pageProps
				.tableOfContents;

			let startingVideoId = cmdDownloadFromNowOn ? getCurrentVideoId() : null;
			await downloadCourse(courseJSON, startingVideoId);

		}
	});
});
