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


const DOWNLOAD_TIMEOUT = 3000
let DURATION_PERCENT = 10		// percent max 100

// videoURL to get the actual video URL
const viewclipURL = "https://app.pluralsight.com/video/clips/v3/viewclip";
const subsURL = "https://app.pluralsight.com/transcript/api/v1/caption/webvtt"

// STATE variables
let EXTENSION_ENABLED = false
let CONTINUE_DOWNLOAD = false

let CURRENT_SLEEP = null;

// =================================================================
// END:VARIABLES
// =================================================================




// ====================================================================
// START:UTILITIES
// ====================================================================
// const sleep = ms =>
// 	new Promise((resolve) => setTimeout(resolve, ms));

const sleep = (millis, throwOnAborted = false) => {
	let timeout_id;
	let rejector;
	const prom = new Promise((resolve, reject) => {

		rejector = throwOnAborted ? reject : (_) => resolve();

		timeout_id = setTimeout(() => {
			resolve();
		}, millis);
	});
	prom.abort = () => {
		clearTimeout(timeout_id);
		rejector('aborted');
	};
	return prom;
}


const downloadFile = (link, filePath) => {
	return new Promise((resolve, _) => {
		chrome.runtime.sendMessage({
			action: "download-sync",
			link: link,
			filePath: filePath,
		}, (response) => resolve(response));
	});
};

const readSharedValue = async (name) =>
	new Promise((resolve, _) => chrome.storage.sync.get(name, data => data == null ? resolve() : resolve(data[name])));

const readSpeed = () => readSharedValue('speedPercent');

const readMaxDuration = () => readSharedValue('maxDuration');

const readAppendSession = () => readSharedValue('appendSession');

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



const getPlaylistPath = (
	courseName,
	authorName,
) => {
	try {
		return (getCourseRootPath(courseName, authorName)) + "\\playlist.m3u8";
	} catch (error) {
		return error;
	}
};

const getExercisePath = (
	courseName,
	authorName,
) => {
	try {
		return (getCourseRootPath(courseName, authorName)) + "\\exercise.zip";
	} catch (error) {
		return error;
	}
};

const getCourseRootPath = (
	courseName,
	authorName,
) => {
	try {
		const rootDirectory = ROOT_DIRECTORY
		const courseDirectory = (
			authorName !== undefined ?
				`${courseName} By ${authorName}`.trim() :
				`${courseName}`.trim()
		);

		return `${rootDirectory}\\${courseDirectory}`.replace(/(\r\n|\n|\r)/gm, "");
	} catch (error) {
		return error;
	}
};

const getFilePath = (
	courseName,
	authorName,
	sectionIndex,
	sectionName,
	videoIndex,
	videoName,
	extension,
	forPlaylist = false
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

		let filePath = `${sectionDirectory}\\${fileName}.${extension}`;
		if (!forPlaylist) {
			let courseRootPath = getCourseRootPath(courseName, authorName);
			filePath = `${courseRootPath}\\${filePath}`;
		}


		return filePath.replace(/(\r\n|\n|\r)/gm, "");
	} catch (error) {
		return error;
	}
};

const downloadVideo = async (videoURL, filePath) => {
	try {
		await downloadFile(videoURL, filePath);
		log(response.actionStatus);
	} catch (error) {
		return error;
	}
};

const downloadSubs = async (subsURL, filePath) => {
	try {
		await downloadFile(subsURL, filePath);
		log(response.actionStatus);
	} catch (error) {
		return error;
	}
};


const printTimeStats = async (courseJSON, startingVideoId) => {
	let stat = await getTimeStats(courseJSON, startingVideoId);

	let friendlyTtl = new Date(stat.timeTotal * 1000).toISOString().substr(11, 8);
	let friendlyTfn = new Date(stat.timeFromNow * 1000).toISOString().substr(11, 8);
	let friendlyTfnDl = new Date(stat.timeDownloading * 1000).toISOString().substr(11, 8);


	console.log(`Total course time: ${friendlyTtl}`);
	console.log(`Time remaining: ${friendlyTfn}`);
	console.log(`Time remaining downloading: ${friendlyTfnDl}`);
}

const getTimeStats = async (courseJSON, startingVideoId) => {
	let timeFromNow = 0;
	let timeTotal = 0;
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


		for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
			const {
				id: sectionId,
				title: sectionName,
				contentItems: sectionItems,
			} = sections[sectionIndex];


			for (let videoIndex = 0; videoIndex < sectionItems.length; videoIndex++) {
				if (!CONTINUE_DOWNLOAD) {
					CONTINUE_DOWNLOAD = false
					log('Downloading stopped!!!')
					return
				}

				const {
					id: videoId,
					title: videoName,
					version: versionId,
					duration,
				} = sectionItems[videoIndex];

				timeTotal += duration;

				if (!startToggle) {
					if (videoId == startingVideoId) {
						startToggle = true;
					}
				}

				if (!startToggle) {
					continue;
				}

				timeFromNow += duration;

			}
		}


	} catch (error) {
		log(error, 'ERROR')
		return error;
	}

	const speed = await readSpeed();

	let timeDownloading = (speed / 100) * timeFromNow;

	return { timeFromNow, timeTotal, timeDownloading };
}


const downloadPlaylist = async (courseJSON) => {
	try {
		const {
			id: courseId,
			title: courseName,
			authors,
			modules: sections,
		} = courseJSON;

		let playlistLines = [];

		const authorName = authors[0].displayName != undefined ? authors[0].displayName : authors[0].authorHandle;
		if (authorName == undefined)
			authorName = "noName";


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
					version: versionId,
					duration,
				} = sectionItems[videoIndex];

				const filePath = getFilePath(
					removeInvalidCharacters(courseName),
					removeInvalidCharacters(authorName),
					sectionIndex,
					removeInvalidCharacters(sectionName),
					videoIndex,
					removeInvalidCharacters(videoName),
					`${EXTENSION}`,
					true
				);

				playlistLines.push(filePath);
			}
		}

		let playlistText = playlistLines.join("\n");
		let playlistPath = getPlaylistPath(removeInvalidCharacters(courseName), removeInvalidCharacters(authorName));

		await downloadPlaylistText(playlistText, playlistPath);
	} catch (error) {
		log(error, 'ERROR')
		chrome.storage.sync.set({ Status: "Stopped" }, undefined);
		return error;
	}
}

const downloadPlaylistText = async (playlistText, path) => {
	let playlistBlob = new Blob([playlistText], {
		type: 'audio/x-mpegurl'
	});

	var url = window.URL.createObjectURL(playlistBlob);
	await downloadFile(url, path);
}


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

		// store the download failed file information to try again after done
		let to_download_again = []

		for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
			const {
				id: sectionId,
				title: sectionName,
				contentItems: sectionItems,
			} = sections[sectionIndex];

			log(`==================== "${sectionName}" ====================`, 'INFO')

			for (let videoIndex = 0; videoIndex < sectionItems.length; videoIndex++) {
				if (!CONTINUE_DOWNLOAD) {
					CONTINUE_DOWNLOAD = false
					log('Downloading stopped!!!')
					return
				}

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

				await printTimeStats(courseJSON, videoId);

				const filePath = getFilePath(
					removeInvalidCharacters(courseName),
					removeInvalidCharacters(authorName),
					sectionIndex,
					removeInvalidCharacters(sectionName),
					videoIndex,
					removeInvalidCharacters(videoName),
					`${EXTENSION}`
				);

				const filePath_subs = getFilePath(
					removeInvalidCharacters(courseName),
					removeInvalidCharacters(authorName),
					sectionIndex,
					removeInvalidCharacters(sectionName),
					videoIndex,
					removeInvalidCharacters(videoName),
					`${EXTENSION_SUBS}`
				);

				log(`Downloading... "${videoName}"`, 'DOWNLOAD')
				chrome.storage.sync.set({ Status: "Downloading..." }, undefined);

				let exceptionId = 0
				try {
					const subsURL = await getSubtitleURL(videoId, versionId);
					await downloadSubs(subsURL, filePath_subs);

					exceptionId = 1

					// force exception for validation 
					// supposed to download video clip in retry section..
					//throw 'testException'

					const videoURL = await getVideoURL(videoId);
					downloadVideo(videoURL, filePath);
				}
				catch (error) {
					to_download_again.push({
						expId: exceptionId,
						videoId: videoId,
						verId: versionId,
						filePath: filePath,
						filePath_subs: filePath_subs,
						duration: duration
					})
					continue
				}

				// Progress Informaton Update on Storage
				chrome.storage.sync.set({ Completion_Module: `${sectionIndex + 1}/${sections.length}` }, undefined);
				chrome.storage.sync.set({ Completion_Video: `${videoIndex + 1}/${sectionItems.length}` }, undefined);

				// So we dont even want to sleep if we are gonna cancel this run anyways.... 
				if (!CONTINUE_DOWNLOAD) {
					continue;
				}

				chrome.storage.sync.set({ Status: "Waiting..." }, undefined);

				let speed = await readSpeed();
				let maxDuration = await readMaxDuration();
				// Sleep for minimum duration btw the time with percent and the max duration time
				if (maxDuration != 0) {
					CURRENT_SLEEP = sleep(Math.min(duration * 10 * speed, maxDuration * 1000));
					await CURRENT_SLEEP;
				}
				else
				// Sleep for duration based on a constant updated by speedPercent from extesion browser
				{

					CURRENT_SLEEP = sleep(Math.max(duration * 10 * speed, DOWNLOAD_TIMEOUT));
					await CURRENT_SLEEP;
				}
			}
		}

		chrome.storage.sync.set({ Status: "Retry..." }, undefined);
		for (let i = to_download_again.length - 1; i >= 0; i--) {
			let fileInfo = to_download_again.shift()
			if (fileInfo.expId === 0) {
				const subsURL = await getSubtitleURL(fileInfo.videoId, fileInfo.verId);
				await downloadSubs(subsURL, fileInfo.filePath_subs);
			}
			const videoURL = await getVideoURL(fileInfo.videoId);
			downloadVideo(videoURL, fileInfo.filePath);

			let speed = await readSpeed();
			CURRENT_SLEEP = sleep(Math.max(fileInfo.duration * 10 * speed, DOWNLOAD_TIMEOUT));
			await CURRENT_SLEEP;

		}
	}
	catch (error) {
		log(error, 'ERROR')
		chrome.storage.sync.set({ Status: "Errored" }, undefined);
		return error;
	}

	log('Downloading finished!!!')
	confirm("Downloading finished");

	if (CONTINUE_DOWNLOAD)
		chrome.storage.sync.set({ Status: "Finished" }, undefined);

	else
		chrome.storage.sync.set({ Status: "Cancelled" }, undefined);

	CONTINUE_DOWNLOAD = false
};

chrome.storage.onChanged.addListener(function (changes, namespace) {
	for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
		if (key == 'btnSkip') {
			CURRENT_SLEEP?.abort();
		}
		if (key == 'btnStop') {
			CONTINUE_DOWNLOAD = false;
		}

		if (key == 'btnAppend') {
			if (!CONTINUE_DOWNLOAD) {
				log("Not on downloading")
				return;
			}
			var e = $.Event('keypress');
			e.which = 96; // Character 'a'
			$(document).trigger(e);
		}

		if (key == 'btnDwnAll') {
			if (CONTINUE_DOWNLOAD)
				return;

			EXTENSION_ENABLED = true;
			var e = $.Event('keypress');
			e.which = 99; // Character 'c'
			$(document).trigger(e);
		}

		if (key == 'btnDwnCur') {
			if (CONTINUE_DOWNLOAD)
				return;

			EXTENSION_ENABLED = true;
			var e = $.Event('keypress');
			e.which = 86; // Character 'v'
			$(document).trigger(e);
		}

	}
});

// chrome.runtime.onMessage.addListener (function (request, sender, sendResponse) {
//     alert("Contents Of Text File = " + request.fileData);
// });


chrome.runtime.onMessage.addListener(message => {
	if (typeof message !== 'object') {
		return false
	}

	if (message.btnCmd) {
		var e = $.Event('keypress');
		EXTENSION_ENABLED = true

		if (message.btnCmd.cmd === 'DwnAppend') {
			// if (!CONTINUE_DOWNLOAD) {
			// 	log("Not on downloading")
			// 	return;
			// }
			
			e.which = 96; // Character 'a'
		}
		$(document).trigger(e);
	}
})


const downloadExerciseFiles = async (courseJSON) => {
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

		let exerciseLinkJson = await (await fetch(`https://app.pluralsight.com/learner/user/courses/${courseId}/exercise-files-url`)).json();

		let targetPath = getExercisePath(removeInvalidCharacters(courseName), removeInvalidCharacters(authorName));

		await downloadFile(exerciseLinkJson.exerciseFilesUrl, targetPath);

	} catch (error) {
		log(error, 'ERROR')
	}

};

let jsonCnt = 0

// main-function
$(() => {
	$(document).keypress(async (e) => {
		console.log(`Keypress: ${e.which}`);

		const cmdToggleEnabled = (e.which === 101 || e.which === 69);
		const cmdStopDownload = e.which === 115 || e.which === 83;
		const cmdDownloadAll = e.which === 99 || e.which === 67; // Download the entire course | key: c
		const cmdDownloadFromNowOn = e.which === 86 || e.which === 118; //key: v
		const cmdPlaylist = e.which == 112 || e.which == 80; // p
		const cmdExerciseFiles = e.which == 120 || e.which == 88; // x
		const cmdTime = e.which == 116 || e.which == 84;
		const cmdAppendSession = e.which == 96 || e.which == 65; // a append session.

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
			CURRENT_SLEEP?.abort();
			return;
		}
		if (cmdAppendSession) {

		}
		if (cmdExerciseFiles
			|| cmdPlaylist
			|| cmdDownloadAll
			|| cmdDownloadFromNowOn
			|| cmdTime
			|| cmdAppendSession
		) {
			log('Downloading course ' + (cmdDownloadAll ? 'from the beginning' : 'from now on') + ' ...')
			log('Fetching course information...')

			const courseJSON = JSON
				.parse($(window.__NEXT_DATA__).text())
				.props
				.pageProps
				.tableOfContents;
			if (cmdAppendSession) {
				// if(!CONTINUE_DOWNLOAD)
				// 	return

				log('Append course')
				let sessions = []
			    //let appended = await readAppendSession()
				chrome.storage.local.get('appendSession', (data) =>{
					if(data.appendSession)
						sessions.push.apply(sessions, data.appendSession)

					courseJSON.id = jsonCnt++
					sessions.push(courseJSON)
					// let newAppend = data.appendSession
					// newAppend.push(courseJSON)
					chrome.storage.local.set({ appendSession: sessions }, undefined)
				})
				
				return
			}

			if (cmdDownloadAll || cmdDownloadFromNowOn) {
				log('Downloading course ' + (cmdDownloadAll ? 'from the beginning' : 'from now on') + ' ...')
				log('Fetching course information...')

				CONTINUE_DOWNLOAD = true;
				let startingVideoId = cmdDownloadFromNowOn ? getCurrentVideoId() : null;
				if (!cmdDownloadFromNowOn) {
					await downloadPlaylist(courseJSON);
					// you can skip the waiting for exercise download to complete
					CURRENT_SLEEP = downloadExerciseFiles(courseJSON);
					await CURRENT_SLEEP
				}

				await downloadCourse(courseJSON, startingVideoId);
			}
			else {
				if (cmdPlaylist) {
					await downloadPlaylist(courseJSON);
					return;
				}

				if (cmdExerciseFiles) {
					CURRENT_SLEEP = downloadExerciseFiles(courseJSON);
					await CURRENT_SLEEP
					return;
				}

				if (cmdTime) {
					await printTimeStats(courseJSON, getCurrentVideoId());
					return;
				}
			}
		}
	});
});
