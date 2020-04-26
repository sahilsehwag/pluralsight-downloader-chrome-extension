# Pluralsight Downloader Chrome Extension

Chrome Extension to download Pluralsight courses (_**BETA**_).

Author: **Sahil Sehwag**

## Inspiration and Why

This chrome extension is a clone of project [**Pluralsight Course Downloader**](https://github.com/vatz88/Pluralsight-Course-Downloader) by [**vatz88**](https://github.com/vatz88). 
<br><br>
The old extension stopped working because it was not being maintained, so I rewrote the extension. I will be **maintaining** this repository and will be adding more **features**. Currently this extension is in _**BETA**_ stage, so please any report issue that you find. It will help me and other people too.

## Installation

You can clone this repository, or download [**zip/tar.gz/.crx(chrome extension)**](https://github.com/sahilsehwag/pluralsight-downloader-chrome-extension/releases/tag/v0.3-alpha), and follow one of the ways mentioned below to install the extension.

_**NOTE**_: This README.md is the latest code in repository. The links mentioned above refers to the latest release. Since this extension is in BETA phase, therefore the API changes a lot.

* Follow this [guide](https://developer.chrome.com/extensions/getstarted#unpacked) to load extension in developer mode in Chrome browser. 
* Drag and drop the **.crx** file on chrome extension page (*In some cases this approach might not work*).

## Usage

**NOTE**: To start the download open a course on pluralsight and play any video from course. Now press `e` to enable the key bindings of extension and `c` to download the course.
	* Don't close the tab on which you started the course download
	* There is a time gap between each download to prevent the pluralsight from blocking the extension or to prevent account blocking/locking. The exact time may change over time, right now its around 30 seconds.

<!-- * `CTRL-e` - Enable/Disable the extension keyboard shortcuts(default is disabled). Key bindings mentioned below will worky only when the extension bindings are enabled. -->
* `e` - Enable/Disable the extension keyboard shortcuts(default is disabled). Key bindings mentioned below will worky only when the extension bindings are enabled.
<!-- * `CTRL-c` - Download the currently playing video's entire course. -->
* `c` - Download the currently playing video's entire course.
* `s` Stops the download process. **NOTE:** This will not stop the active downloads, instead further videos in the course will not be downloaded

## Known Issues

* Some old courses have videos with different resolution than the standard one, due to which these particular courses are not downloadable through extension. This issue will be fixed in the next release.

## Contributors

Contributors are welcomed.

---

## Changelog
* 0.1-alpha
	* Initial release
	* `s` to download the current video
	* `a` to download all the videos in queue starting from current video
* 0.2-alpha
	* Implemented the logic flow using json structure
	* Disabled the `s`
	* `a` will download the entire course, no matter the current video
	* Fixed the errors due to parsing inconsistencies.
* 0.3-beta (**Under progress...**)
	<!-- * Added `CTRL-e` to enable/disabled the extension bindings.
	* **NOTE:** Other bindings will only work when extension bindings are enabled, by default they are **disabled**.
	* Replaced `a` with `CTRL-c` to download the course. -->
	* Added `e` to enable/disabled the extension bindings.
	* **NOTE:** Other bindings will only work when extension bindings are enabled, by default they are **disabled**.
	* Replaced `a` with `c` to download the course.
	* Added `s` binding to stop the download process

---

## NOTE

Pluralsight _Terms of Use_ does not allow downloading / storing of the video.

Quoting from [www.pluralsight.com/terms](https://www.pluralsight.com/terms)

> Proprietary Materials may only be accessed through the Site, and not by or from any other site or means. The applicable License granted you by these Terms of Use is a right of access through the Site only, and does not grant to you any right to download or store any Proprietary Materials in any medium.
