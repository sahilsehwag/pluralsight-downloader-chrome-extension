import $ from 'jquery'

import { get, sleep, removeInvalidCharacters, log } from 'utils'

import {
	parseCurrentVideoId,
	fetchVideoURL,
	downloadVideo,
	getFilePath,
	downloadSubs,
	fetchSubtitleURL,
	downloadPlaylist,
	downloadExerciseFiles,
} from 'helpers'

import {
	VIDEO_EXTENSIONS,
	SUBTITLE_EXTENSIONS,
	DOWNLOAD_TIMEOUT,
	ACTION_X_KEY,
	FIELD_X_KEY,
	BG_ACTIONS,
} from 'constants/index'

const EXTENSION = VIDEO_EXTENSIONS[0]
const EXTENSION_SUBS = SUBTITLE_EXTENSIONS[0]

main()

// This needs to be an export due to typescript implementation limitation of needing '--isolatedModules' tsconfig
export function main() {
	//// =================================================================
	//// START:VARIABLES
	//// =================================================================
  //
	//// STATE variables
	//let EXTENSION_ENABLED = false
	//let CONTINUE_DOWNLOAD = false
  //
	//let CURRENT_SLEEP = null
	//let CURRENT_INTERVAL = null
  //
	//// =================================================================
	//// END:VARIABLES
	//// =================================================================
  //
	//// ====================================================================
	//// START:UTILITIES
	//// ====================================================================
  //
	//const updateWaitStats = timeStat => {
	//  try {
	//    return asyncInterval(writeTimeStat, timeStat)
	//  } catch (e) {
	//    console.log(e)
	//  }
	//}
  //
	//const writeTimeStat = msStat => {
	//  let toSec = new Date(msStat).toISOString().slice(14, -5)
	//  chrome.runtime.sendMessage({ extensionStatus: `Waiting... ${toSec}` })
	//}
  //
	//const asyncInterval = (callback, msClear, msInterval = 1000) => {
	//  let rejector
	//  let interval
	//  const prom = new Promise(resolove => {
	//    rejector = () => resolove()
	//    interval = setInterval(() => {
	//      if (msClear > 0) callback(msClear)
	//      else {
	//        rejector()
	//        clearInterval(interval)
	//      }
	//      msClear -= msInterval
	//    }, msInterval)
	//  })
  //
	//  prom.abort = () => {
	//    clearInterval(interval)
	//    rejector()
	//  }
	//  return prom
	//}
  //
	//const readIsLeadingZeroAlways = async () => {
	//  let isAlwaysLeadingZero = await get(FIELD_X_KEY.LEADING_ZERO)
	//  if (isAlwaysLeadingZero === 'true') {
	//    return true
	//  }
	//  return false
	//}
  //
	//// ====================================================================
	//// END:UTILITIES
	//// ====================================================================
  //
	//let video_to_download = []
  //
	//const getCourseStats = async (courseJSON, startingVideoId) => {
	//  let timeFromNow = 0
	//  let timeTotal = 0
	//  try {
	//    const { authors, modules: sections } = courseJSON
  //
	//    let authorName =
	//      authors[0].displayName != null
	//        ? authors[0].displayName
	//        : authors[0].authorHandle
	//    if (authorName == null) authorName = 'noName'
  //
	//    // download all videos when no startid was given
	//    let startToggle = startingVideoId == null || startingVideoId === ''
  //
	//    video_to_download = []
  //
	//    for (
	//      let sectionIndex = 0;
	//      sectionIndex < sections.length;
	//      sectionIndex++
	//    ) {
	//      const { contentItems: sectionItems } = sections[sectionIndex]
  //
	//      for (
	//        let videoIndex = 0;
	//        videoIndex < sectionItems.length;
	//        videoIndex++
	//      ) {
	//        if (!CONTINUE_DOWNLOAD) {
	//          CONTINUE_DOWNLOAD = false
	//          log('Downloading stopped!!!')
	//          return
	//        }
  //
	//        const { id: videoId, duration } = sectionItems[videoIndex]
  //
	//        timeTotal += duration
  //
	//        if (!startToggle) {
	//          if (videoId === startingVideoId) {
	//            startToggle = true
	//          }
	//        }
  //
	//        if (!startToggle) {
	//          continue
	//        }
  //
	//        video_to_download.push(videoId)
  //
	//        timeFromNow += duration
	//      }
	//    }
  //
	//    chrome.runtime.sendMessage({
	//      action: BG_ACTIONS.BADGE,
	//      payload: {
	//        text: `${video_to_download.length}`,
	//      },
	//    })
	//  } catch (error) {
	//    log(error, 'ERROR')
	//    return error
	//  }
  //
	//  const speed = get(FIELD_X_KEY.DOWNLOAD_DELAY)
  //
	//  let timeDownloading = (speed / 100) * timeFromNow
  //
	//  return { timeFromNow, timeTotal, timeDownloading }
	//}
  //
	//const printTimeStats = async (courseJSON, startingVideoId) => {
	//  const stat = await getCourseStats(courseJSON, startingVideoId)
  //
	//  const friendlyTtl = new Date(stat.timeTotal * 1000)
	//    .toISOString()
	//    .substr(11, 8)
	//  const friendlyTfn = new Date(stat.timeFromNow * 1000)
	//    .toISOString()
	//    .substr(11, 8)
	//  const friendlyTfnDl = new Date(stat.timeDownloading * 1000)
	//    .toISOString()
	//    .substr(11, 8)
  //
	//  console.log(`Total course time: ${friendlyTtl}`)
	//  console.log(`Time remaining: ${friendlyTfn}`)
	//  console.log(`Time remaining downloading: ${friendlyTfnDl}`)
	//}
  //
	//function removeDownloadItem(item) {
	//  if (!video_to_download.includes(item)) return
  //
	//  var idx = video_to_download.indexOf(item)
	//  video_to_download.splice(idx, 1)
  //
	//  chrome.runtime.sendMessage({
	//    action: BG_ACTIONS.BADGE,
	//    payload: {
	//      text: `${video_to_download.length}`,
	//    },
	//  })
	//}
  //
	//const downloadCourse = async (courseJSON, startingVideoId) => {
	//  try {
	//    const { title: courseName, authors, modules: sections } = courseJSON
  //
	//    let authorName =
	//      authors[0].displayName != null
	//        ? authors[0].displayName
	//        : authors[0].authorHandle
	//    if (authorName == null) authorName = 'noName'
  //
	//    // download all videos when no startid was given
	//    let startToggle = startingVideoId == null || startingVideoId === ''
  //
	//    log(
	//      `#################### "${courseName} By ${authorName}" ####################`,
	//      'INFO',
	//    )
  //
	//    // store the download failed file information to try again after done
	//    let to_download_again = []
	//    await getCourseStats(courseJSON, startingVideoId)
  //
	//    chrome.runtime.sendMessage({ courseTitle: courseName })
  //
	//    for (
	//      let sectionIndex = 0;
	//      sectionIndex < sections.length;
	//      sectionIndex++
	//    ) {
	//      const { title: sectionName, contentItems: sectionItems } =
	//        sections[sectionIndex]
  //
	//      log(
	//        `==================== "${sectionName}" ====================`,
	//        'INFO',
	//      )
  //
	//      for (
	//        let videoIndex = 0;
	//        videoIndex < sectionItems.length;
	//        videoIndex++
	//      ) {
	//        if (!CONTINUE_DOWNLOAD) {
	//          log('Downloading stopped!!!')
	//          return
	//        }
  //
	//        const {
	//          id: videoId,
	//          title: videoName,
	//          version: versionId,
	//          duration,
	//        } = sectionItems[videoIndex]
  //
	//        if (!startToggle) {
	//          if (videoId === startingVideoId) {
	//            startToggle = true
	//          }
	//        }
  //
	//        if (!startToggle) {
	//          console.log(`Skipping [${videoId}] ${videoName}`)
	//          continue
	//        }
  //
	//        console.log(`Downloading [${videoId}] ${videoName}`)
  //
	//        const isLeadingZeroAlways = await readIsLeadingZeroAlways()
	//        const filePath = getFilePath(
	//          removeInvalidCharacters(courseName),
	//          removeInvalidCharacters(authorName),
	//          sectionIndex,
	//          removeInvalidCharacters(sectionName),
	//          videoIndex,
	//          removeInvalidCharacters(videoName),
	//          `${EXTENSION}`,
	//          isLeadingZeroAlways || sectionItems.length > 9,
	//        )
  //
	//        const filePath_subs = getFilePath(
	//          removeInvalidCharacters(courseName),
	//          removeInvalidCharacters(authorName),
	//          sectionIndex,
	//          removeInvalidCharacters(sectionName),
	//          videoIndex,
	//          removeInvalidCharacters(videoName),
	//          `${EXTENSION_SUBS}`,
	//          isLeadingZeroAlways || sectionItems.length > 9,
	//        )
  //
	//        const extensionIndex = filePath_subs.lastIndexOf(`.${EXTENSION_SUBS}`)
	//        const filePathNoExt_subs = filePath_subs.substring(0, extensionIndex)
  //
	//        log(`Downloading... "${videoName}"`, 'DOWNLOAD')
	//        chrome.runtime.sendMessage({ extensionStatus: 'Downloading...' })
  //
	//        let exceptionId = 0
	//        try {
	//          if (versionId) {
	//            const subsURL = await fetchSubtitleURL(videoId, versionId)
	//            await downloadSubs(subsURL, filePath_subs)
	//            // Secondary language logic
	//            const secondaryLangCode = await get(
	//              FIELD_X_KEY.SECONDARY_LANGUAGE,
	//            )
	//            if (
	//              secondaryLangCode !== null &&
	//              secondaryLangCode !== undefined &&
	//              secondaryLangCode !== '' &&
	//              secondaryLangCode !== 'none'
	//            ) {
	//              const langSubsUrl = await fetchSubtitleURL(
	//                videoId,
	//                versionId,
	//                secondaryLangCode,
	//              )
	//              const filePath_subsLang = `${filePathNoExt_subs}.${secondaryLangCode}.vtt`
	//              await downloadSubs(langSubsUrl, filePath_subsLang)
	//            }
	//          }
  //
	//          //Index to descriminate subs or video
	//          exceptionId = 1
  //
	//          const videoURL = await fetchVideoURL(videoId)
	//          downloadVideo(videoURL, filePath)
	//        } catch (error) {
	//          to_download_again.push({
	//            expId: exceptionId,
	//            videoId: videoId,
	//            verId: versionId,
	//            filePath: filePath,
	//            filePath_subs: filePath_subs,
	//            duration: duration,
	//          })
  //
	//          continue
	//        }
  //
	//        // Progress Informaton Update on Storage
	//        chrome.runtime.sendMessage({
	//          modulesCompleted: [sectionIndex + 1, sections.length],
	//          videosCompleted: [videoIndex + 1, sectionItems.length],
	//          extensionStatus: 'Downloading...',
	//        })
	//        removeDownloadItem(videoId)
  //
	//        // So we dont even want to sleep if we are gonna cancel this run anyways....
	//        if (!CONTINUE_DOWNLOAD) {
	//          continue
	//        }
  //
	//        chrome.runtime.sendMessage({ extensionStatus: 'Waiting...' })
  //
	//        let speed = await get(FIELD_X_KEY.DOWNLOAD_DELAY)
	//        let maxDuration = await get(FIELD_X_KEY.MAX_DELAY)
	//        // Sleep for minimum duration btw the time with percent and the max duration time
	//        if (maxDuration !== 0) {
	//          log(
	//            `maxDuration: ${maxDuration} duration: ${duration} speed: ${speed}`,
	//            'INFO',
	//          )
	//          maxDuration = Math.floor(
	//            Math.random() * (maxDuration - Number(speed)) + Number(speed),
	//          )
	//          CURRENT_INTERVAL = updateWaitStats(maxDuration * 1000)
	//          CURRENT_SLEEP = sleep(maxDuration * 1000)
	//          // CURRENT_INTERVAL = updateWaitStats(Math.min(duration * 10 * speed, maxDuration * 1000))
	//          // CURRENT_SLEEP = sleep(Math.min(duration * 10 * speed, maxDuration * 1000))
	//          log(`Sleeping for ${maxDuration} seconds...`, 'INFO')
	//          await CURRENT_SLEEP
	//          CURRENT_INTERVAL.abort()
	//        }
	//        // Sleep for duration based on a constant updated by speedPercent from extesion browser
	//        else {
	//          CURRENT_INTERVAL = updateWaitStats(
	//            Math.max(duration * 10 * speed, DOWNLOAD_TIMEOUT),
	//          )
	//          CURRENT_SLEEP = sleep(
	//            Math.max(duration * 10 * speed, DOWNLOAD_TIMEOUT),
	//          )
	//          await CURRENT_SLEEP
	//          CURRENT_INTERVAL.abort()
	//        }
	//      }
	//    }
  //
	//    chrome.runtime.sendMessage({ extensionStatus: 'Retry...' })
	//    for (let i = to_download_again.length - 1; i >= 0; i--) {
	//      chrome.runtime.sendMessage({
	//        action: 'badge',
	//        text: `${to_download_again.length}`,
	//      })
  //
	//      let fileInfo = to_download_again.shift()
	//      if (fileInfo.expId === 0) {
	//        const subsURL = await fetchSubtitleURL(
	//          fileInfo.videoId,
	//          fileInfo.verId,
	//        )
	//        await downloadSubs(subsURL, fileInfo.filePath_subs)
	//        // Secondary language logic
	//        const extensionIndex = fileInfo.filePath_subs.lastIndexOf(
	//          `.${EXTENSION_SUBS}`,
	//        )
	//        const filePathNoExt_subs = fileInfo.filePath_subs.substring(
	//          0,
	//          extensionIndex,
	//        )
	//        const secondaryLangCode = await get(FIELD_X_KEY.SECONDARY_LANGUAGE)
	//        if (
	//          secondaryLangCode !== null &&
	//          secondaryLangCode != null &&
	//          secondaryLangCode !== '' &&
	//          secondaryLangCode !== 'none'
	//        ) {
	//          const langSubsUrl = await fetchSubtitleURL(
	//            fileInfo.videoId,
	//            fileInfo.versionId,
	//            secondaryLangCode,
	//          )
	//          const filePath_subsLang = `${filePathNoExt_subs}.${secondaryLangCode}.vtt`
	//          await downloadSubs(langSubsUrl, filePath_subsLang)
	//        }
	//      }
	//      const videoURL = await fetchVideoURL(fileInfo.videoId)
	//      downloadVideo(videoURL, fileInfo.filePath)
  //
	//      let speed = await get(FIELD_X_KEY.DOWNLOAD_DELAY)
	//      CURRENT_INTERVAL = updateWaitStats(
	//        Math.max(fileInfo.duration * 10 * speed, DOWNLOAD_TIMEOUT),
	//      )
	//      CURRENT_SLEEP = sleep(
	//        Math.max(fileInfo.duration * 10 * speed, DOWNLOAD_TIMEOUT),
	//      )
	//      await CURRENT_SLEEP
	//      CURRENT_INTERVAL.abort()
	//    }
	//  } catch (error) {
	//    log(error, 'ERROR')
	//    chrome.runtime.sendMessage({ extensionStatus: 'Errored' })
	//    return error
	//  } finally {
	//    if (CONTINUE_DOWNLOAD)
	//      chrome.runtime.sendMessage({ extensionStatus: 'Finished' })
	//    else chrome.runtime.sendMessage({ extensionStatus: 'Cancelled' })
  //
	//    log('Downloading finished!!!')
	//    //confirm("Downloading finished");
  //
	//    video_to_download = []
	//    chrome.runtime.sendMessage({ action: 'badge', text: `` })
  //
	//    CONTINUE_DOWNLOAD = false
	//  }
	//}
  //
	//chrome.runtime.onMessage.addListener(message => {
	//  if (typeof message !== 'object') {
	//    return false
	//  }
  //
	//  if (message.action) {
	//    var e = $.Event('keypress')
	//    EXTENSION_ENABLED = true
  //
	//    if (message.action.cmd === ACTION_X_KEY.DOWNLOAD_ALL) {
	//      if (CONTINUE_DOWNLOAD) return
  //
	//      EXTENSION_ENABLED = true
	//      e.which = 99 // Character 'a'
	//    } else if (message.action.cmd === ACTION_X_KEY.DOWNLOAD_CURRENT) {
	//      if (CONTINUE_DOWNLOAD) return
  //
	//      EXTENSION_ENABLED = true
	//      e.which = 86 // Character 'a'
	//    } else if (message.action.cmd === ACTION_X_KEY.ADD_COURSE) {
	//      // must be in downlonding state in advance
	//      // if (!CONTINUE_DOWNLOAD)
	//      // 	return;
  //
	//      e.which = 96 // Character 'a'
	//    } else if (message.action.cmd === ACTION_X_KEY.SKIP_VIDEO) {
	//      CURRENT_SLEEP?.abort()
	//      return
	//    } else if (message.action.cmd === ACTION_X_KEY.STOP_DOWNLOAD) {
	//      CONTINUE_DOWNLOAD = false
	//      e.which = 115 // Character 's'
	//    }
  //
	//    $(document).trigger(e)
	//  }
	//})
  //
	//// main-function
	//$(() => {
	//  $(document).keypress(async e => {
	//    console.log(`Keypress: ${e.which}`)
  //
	//    const cmdToggleEnabled = e.which === 101 || e.which === 69
	//    const cmdStopDownload = e.which === 115 || e.which === 83
	//    const cmdDownloadAll = e.which === 99 || e.which === 67 // Download the entire course | key: c
	//    const cmdDownloadFromNowOn = e.which === 86 || e.which === 118 //key: v
	//    const cmdPlaylist = e.which === 112 || e.which === 80 // p
	//    const cmdExerciseFiles = e.which === 120 || e.which === 88 // x
	//    const cmdTime = e.which === 116 || e.which === 84
	//    const cmdAddCourse = e.which === 96 || e.which === 65 // add course
  //
	//    if (cmdToggleEnabled) {
	//      // Enable/Disabled extension bindings
	//      !EXTENSION_ENABLED
	//        ? log('Enabled the extension bindings.')
	//        : log('Disabled the extension bindings.')
	//      EXTENSION_ENABLED = !EXTENSION_ENABLED
	//      return
	//    }
  //
	//    if (!EXTENSION_ENABLED) {
	//      return
	//    }
	//    if (cmdStopDownload) {
	//      // KEYPRESS `s`
	//      // Stops the download the process, it won't stop the current download, it will abort the download of further videos
	//      log('Stopping the download process...')
	//      CONTINUE_DOWNLOAD = false
	//      CURRENT_SLEEP?.abort()
  //
	//      chrome.runtime.sendMessage({
	//        courseTitle: '',
	//        modulesCompleted: [0, 0],
	//        videosCompleted: [0, 0],
	//        extensionStatus: 'Ready...',
	//      })
  //
	//      return
	//    }
	//    if (
	//      cmdExerciseFiles ||
	//      cmdPlaylist ||
	//      cmdDownloadAll ||
	//      cmdDownloadFromNowOn ||
	//      cmdTime ||
	//      cmdAddCourse
	//    ) {
	//      log(
	//        'Downloading course ' +
	//          (cmdDownloadAll ? 'from the beginning' : 'from now on') +
	//          ' ...',
	//      )
	//      log('Fetching course information...')
  //
	//      const courseJSON = JSON.parse($(window.__NEXT_DATA__).text()).props
	//        .pageProps.tableOfContents
  //
	//      if (cmdAddCourse) {
	//        log('Add Course')
	//        let addedCourses = []
	//        chrome.storage.local.get('addedCourses', data => {
	//          if (data.addedCourses)
	//            addedCourses.push.apply(addedCourses, data.addedCourses)
  //
	//          courseJSON.startingVideoId = null
	//          addedCourses.push(courseJSON)
	//          chrome.storage.local.set({ addedCourses: addedCourses })
  //
	//          chrome.runtime.sendMessage({
	//            noOfCoursesAdded: addedCourses.length,
	//          })
	//        })
	//        return
	//      }
  //
	//      if (cmdDownloadAll || cmdDownloadFromNowOn) {
	//        log(
	//          'Downloading course ' +
	//            (cmdDownloadAll ? 'from the beginning' : 'from now on') +
	//            ' ...',
	//        )
	//        log('Fetching course information...')
  //
	//        CONTINUE_DOWNLOAD = true
	//        let startingVideoId = cmdDownloadFromNowOn
	//          ? parseCurrentVideoId()
	//          : null
	//        if (!cmdDownloadFromNowOn) {
	//          chrome.runtime.sendMessage({ extensionStatus: 'Downloading...' })
	//          await downloadPlaylist(courseJSON)
	//          // you can skip the waiting for exercise download to complete
	//          CURRENT_SLEEP = downloadExerciseFiles(courseJSON)
	//          await CURRENT_SLEEP
	//        }
  //
	//        await downloadCourse(courseJSON, startingVideoId)
  //
	//        // eslint-disable-next-line
	//        while (true) {
	//          let nextCourse = await new Promise(resolve =>
	//            chrome.storage.local.get('addedCourses', data => {
	//              if (!data) resolve()
	//              else {
	//                let courses = data['addedCourses']
	//                let dwnCourse = courses.shift()
	//                chrome.storage.local.set({ addedCourses: courses })
  //
	//                chrome.runtime.sendMessage({
	//                  noOfCoursesAdded: courses.length,
	//                })
	//                resolve(dwnCourse)
	//              }
	//            }),
	//          )
	//          if (!nextCourse) {
	//            chrome.runtime.sendMessage({ noOfCoursesAdded: 0 })
	//            break
	//          }
  //
	//          log(`Download course : ${nextCourse.title}`)
  //
	//          CONTINUE_DOWNLOAD = true
	//          await downloadPlaylist(nextCourse)
	//          // you can skip the waiting for exercise download to complete
	//          CURRENT_SLEEP = downloadExerciseFiles(nextCourse)
	//          await CURRENT_SLEEP
	//          await downloadCourse(nextCourse, null)
	//        }
	//      } else {
	//        if (cmdPlaylist) {
	//          chrome.runtime.sendMessage({ extensionStatus: 'Downloading...' })
	//          await downloadPlaylist(courseJSON)
	//          return
	//        }
  //
	//        if (cmdExerciseFiles) {
	//          chrome.runtime.sendMessage({ extensionStatus: 'Downloading...' })
  //
	//          CURRENT_SLEEP = downloadExerciseFiles(courseJSON)
	//          await CURRENT_SLEEP
	//          return
	//        }
	//        if (cmdTime) {
	//          await printTimeStats(courseJSON, parseCurrentVideoId())
	//          return
	//        }
	//      }
	//    }
	//  })
	//})
}
