# Pluralsight Downloader Chrome Extension

Chrome Extension to download Pluralsight courses

Author: **Sahil Sehwag**

## Inspiration and Why

This chrome extension is a clone of project [**Pluralsight Course Downloader**](https://github.com/vatz88/Pluralsight-Course-Downloader) by [**vatz88**](https://github.com/vatz88). 
<br><br>
The old extension stopped working because of the changes in entire Pluralsight strcuture. Along with this there were some issues in that project. So I rewrote the extension, but the interface was initially same (`s`, `a`). In future the interface might change drastically. Another reason is that I will be maintaing this repository and will probably add more features.

## Installation

You can clone this repository, or download zip/tar.gz/.crx(chrome extension) from [here](https://github.com/sahilsehwag/pluralsight-downloader-chrome-extension/releases/tag/v0.2-alpha)

Follow this [guide](https://developer.chrome.com/extensions/getstarted#unpacked) to load extension in developer mode in Chrome browser.

## Usage

Press `a` key after playing any video from the course to download the entire course with the same directory structure(both video and section names).

## Changelog
* 0.1-alpha
	* Initial release
	* `s` to download the current video
	* `a` to download all the videos in queue starting from current video
* 0.2-alpha
	* Implemented the logic flow using json structure
	* Disabled the `s`
	* `a` will download the entire course, no matter the current video
	* Fixed the errors due to parsing inconsisitencies.

## Known Issues

## Contributors

Contributors are welcomed to add new features or/and maintain this repository.

---

## NOTE

Pluralsight _Terms of Use_ does not allow downloading / storing of the video.

Quoting from [www.pluralsight.com/terms](https://www.pluralsight.com/terms)

> Proprietary Materials may only be accessed through the Site, and not by or from any other site or means. The applicable License granted you by these Terms of Use is a right of access through the Site only, and does not grant to you any right to download or store any Proprietary Materials in any medium.
