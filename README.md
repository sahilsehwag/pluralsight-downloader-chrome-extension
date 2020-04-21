# Pluralsight Downloader Chrome Extension

Chrome Extension to download Pluralsight courses

Author: **Sahil Sehwag**

## Inspiration and Why

This chrome extension is a clone of project [**Pluralsight Course Downloader**](https://github.com/vatz88/Pluralsight-Course-Downloader) by [**vatz88**](https://github.com/vatz88). 
<br><br>
The old extension stopped working because of the changes in entire Pluralsight strcuture. Along with this there were some issues in that project. So I rewrote the extension, but interface is exactly same (`s`, `a`). Another reason is that I will be maintaing this repository and will probably add more features.

## Installation

Clone the repository to your system or download it as [.tar.gz](https://github.com/vatz88/Pluralsight-Course-Downloader/tarball/master).

Follow this [guide](https://developer.chrome.com/extensions/getstarted#unpacked) to load extension in developer mode in Chrome browser.

## Usage

Hit the `s` key while watching the video on pluralsight and it'll be downloaded and organized in folder with appropriate file name!

Hit the `a` key while watching the video on pluralsight and it'll be downloaded and organized in folder with appropriate file name! Subsequent videos in queue will automatically download after some seconds. **Note:** After pressing `a` don't interupt the course player, the extension will automatically play the next video and start the download and so on.

## Known Issues

* **Not Fixed** When you open a course from the main page, the download will not work because of the URL. This will be fixed in next version(in few days). For now to fix it click the video again, and now `s` and `a` can be used.
* **Fixed** In some courses(due to lack of author name on top), the filenames of download were not correct. Its been fixed, so take the latest code.


## Contributors

Contributors are welcomed to add new features or/and maintain this repository.

---

## NOTE

Pluralsight _Terms of Use_ does not allow downloading / storing of the video.

Quoting from [www.pluralsight.com/terms](https://www.pluralsight.com/terms)

> Proprietary Materials may only be accessed through the Site, and not by or from any other site or means. The applicable License granted you by these Terms of Use is a right of access through the Site only, and does not grant to you any right to download or store any Proprietary Materials in any medium.
