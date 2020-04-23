const appName = "Pluralsight";
const deliminator = ". ";
const extension = "mp4";

// link to get the actual video URL
const viewclipURL = "https://app.pluralsight.com/video/clips/v3/viewclip";

const nameToFilename = (name) => name.replace(/[\/:?><]/g, " ").trim();
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const log = (message, type = "STATUS") =>
  console.log("[" + appName + "]:[" + type + "]:" + " " + message);

const getDirectoryName = (sectionIndex, sectionName) =>
  nameToFilename(`${sectionIndex + 1}${deliminator}${sectionName}`);
const getFileName = (videoIndex, videoName) =>
  nameToFilename(`${videoIndex + 1}${deliminator}${videoName}`);

const getVideoURL = async (clipId) => {
  try {
    const response = await fetch(viewclipURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clipId: clipId,
        mediaType: "mp4",
        quality: "1280x720",
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
  sectionName,
  sectionIndex,
  videoName,
  videoIndex
) => {
  try {
    const sectionDirectoryName = getDirectoryName(sectionIndex, sectionName);
    const fileName = getFileName(videoIndex, videoName);

    const filePath = `${appName}/${courseName} By ${authorName}/${sectionDirectoryName}/${fileName}.${extension}`;
    return filePath.replace(/(\r\n|\n|\r)/gm, "");
  } catch (error) {
    return error;
  }
};

const downloadVideo = async (link, filePath) => {
  try {
    log("Downloading... " + filePath);
    chrome.runtime.sendMessage(
      {
        action: "download",
        link: link,
        filename: filePath,
      },
      (response) => log(response.actionStatus)
    );
  } catch (error) {
    return error;
  }
};

const downloadCourse = async (courseContent) => {
  try {
    const { modules, title: courseName, authors } = courseContent;
    const authorName = authors[0].displayName;

    for (let sectionIndex = 0; sectionIndex < modules.length; sectionIndex++) {
      const section = modules[sectionIndex];
      const { title: sectionName, contentItems: sectionItems } = section;

      for (let videoIndex = 0; videoIndex < sectionItems.length; videoIndex++) {
        const { id, title: videoName } = sectionItems[videoIndex];

        const link = await getVideoURL(id);
        const filePath = await getFilePath(
          courseName,
          authorName,
          sectionName,
          sectionIndex,
          videoName,
          videoIndex
        );

        await downloadVideo(link, filePath);
        await sleep(30000);
      }
    }
  } catch (error) {
    console.error("ERROR: ", error);
    return error;
  }
};

// main-function
$(() => {
  $(document).keypress(async (e) => {
    if (e.which === 115 || e.which === 83) {
      // keypress `s`
      log("Extracting.... video information", "STATUS");

      //await downloadVideo();
    } else if (e.which === 97 || e.which === 65) {
      // keypress `a`
      log("Extracting.... course information", "STATUS");

      let courseContent = JSON.parse($(window.__NEXT_DATA__).text()).props
        .pageProps.tableOfContents;
      await downloadCourse(courseContent);
    }
  });
});
