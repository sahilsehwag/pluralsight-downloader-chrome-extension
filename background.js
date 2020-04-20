flag = false;
filename = '';
let listenerInstance = undefined;

// It's already assumed, that when using this function, we're in sync. download
// mode, which implies that no more than one download is present, thus no need to
// to check for the finished download ID
var onChangeFactory = responseCb => ({ state }) => {
  if (state && state.current === "complete" && state.previous === "in_progress") {
    chrome.downloads.onChanged.removeListener(listenerInstance);
    responseCb({ actionStatus: "File downloaded successfully" });
  }
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'download' || request.action === 'download-sync') {
    filename = request.filename;
    flag = true;
    try {
      chrome.downloads.download({
        url: request.link,
      });

      if (request.action === "download-sync") {
        listenerInstance = onChangeFactory(sendResponse)
        chrome.downloads.onChanged.addListener(listenerInstance);
        // This is used to send the response asynchronously,
        // check: https://developer.chrome.com/extensions/messaging
        return true;
      } else {
        sendResponse({
          actionStatus: 'File: ' + filename + ' downloaded'
        });
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  }
});

chrome.downloads.onDeterminingFilename.addListener(function (item, suggest) {
  if (flag) {
    flag = false;
    suggest({
      filename: filename
    });
  }
});
