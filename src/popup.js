// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict'

let speedPercent = document.getElementById('SpeedSlider')
let speedLabel = document.getElementById('label_slider')

let statusLabel = document.getElementById('label_Status')

let titleLabel = document.getElementById('label_Title')
let cpltModuleLabel = document.getElementById('label_Module')
let cpltVideoLabel = document.getElementById('label_Video')
let addedCourseCntLabel = document.getElementById('label_AddedCourseCnt')

let maxDuration = document.getElementById('MaxDuration')
let btnApply = document.getElementById('btnApply')

let btnSkip = document.getElementById('btnSkip')
let btnStop = document.getElementById('btnStop')
let btnDwnAll = document.getElementById('btnDwnAll')
let btnDwnCur = document.getElementById('btnDwnCur')
let btnAddCourse = document.getElementById('btnAddCourse')

let secondaryLanguage = document.getElementById('SecondaryLanguage')
let btnApplySecondaryLanguage = document.getElementById('btnApplySecondaryLanguage')

let isAlwaysLeadingZero = document.getElementById('isAlwaysLeadingZero')
let btnApplyLeadingZero = document.getElementById('btnApplyLeadingZero')

let courseType = document.getElementById('CourseType');
let btnApplyCourseType = document.getElementById('btnApplyCourseType')

chrome.storage.sync.get('courseType', function(data) {
	courseType.value = data.courseType !== undefined ? data.courseType : 'Latest'
})

chrome.storage.sync.get('isAlwaysLeadingZero', function(data) {
	isAlwaysLeadingZero.value = data.secondaryLanguage !== undefined ? data.isAlwaysLeadingZero : 'false'
})

chrome.storage.sync.get('isAlwaysLeadingZero', function(data) {
	isAlwaysLeadingZero.value = data.secondaryLanguage !== undefined ? data.isAlwaysLeadingZero : 'false'
})

chrome.storage.sync.get('secondaryLanguage', function(data) {
	secondaryLanguage.value = data.secondaryLanguage !== undefined ? data.secondaryLanguage : 'none'
})

chrome.storage.sync.get('Status', function(data) {
	statusLabel.innerHTML = data.Status
})

chrome.storage.sync.get('CourseTitle', function(data) {
	titleLabel.innerHTML = data.CourseTitle
})

chrome.storage.sync.get('Completion_Module', function(data) {
	cpltModuleLabel.innerHTML = `${data.Completion_Module[0]}/${data.Completion_Module[1]}`
})

chrome.storage.sync.get('Completion_Video', function(data) {
	cpltVideoLabel.innerHTML = `${data.Completion_Video[0]}/${data.Completion_Video[1]}`
})

chrome.storage.sync.get('speedPercent', function(data) {
	speedPercent.value = data.speedPercent
	speedLabel.innerHTML = speedPercent.value
})

chrome.storage.sync.get('maxDuration', function(data) {
	maxDuration.value = data.maxDuration
})

chrome.storage.sync.get('AddedCourseCount', function(data) {
	addedCourseCntLabel.innerHTML = data.AddedCourseCount
})

btnApplyCourseType.onclick = function() {
	chrome.storage.sync.set({ courseType: courseType.value }, undefined)
}

btnApplyLeadingZero.onclick = function() {
	chrome.storage.sync.set({ isAlwaysLeadingZero: isAlwaysLeadingZero.value }, undefined)
}

btnApplySecondaryLanguage.onclick = function() {
	chrome.storage.sync.set({ secondaryLanguage: secondaryLanguage.value }, undefined)
}

speedPercent.onchange = function(element) {
	chrome.storage.sync.set({ speedPercent: speedPercent.value }, undefined)
	speedLabel.innerHTML = speedPercent.value
}

btnApply.onclick = function() {
	chrome.storage.sync.set({ maxDuration: maxDuration.value }, undefined)
}

btnSkip.onclick = function() {
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {
			btnCmd: {
				cmd: 'Skip',
				state: true,
			},
		})
	})
}

btnStop.onclick = function() {
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {
			btnCmd: {
				cmd: 'Stop',
				state: true,
			},
		})
	})
}

btnDwnAll.onclick = function() {
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {
			btnCmd: {
				cmd: 'DwnAll',
				state: true,
			},
		})
	})
}

btnDwnCur.onclick = function() {
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {
			btnCmd: {
				cmd: 'DwnCur',
				state: true,
			},
		})
	})
}

btnAddCourse.onclick = function() {
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {
			btnCmd: {
				cmd: 'AddCourse',
				state: true,
			},
		})
	})
}

chrome.runtime.onMessage.addListener(message => {
	if (typeof message !== 'object') {
		return false
	}

	if (message.Status) {
		statusLabel.innerHTML = message.Status
		chrome.storage.sync.set({ Status: `${message.Status}` }, undefined)
	}

	if (message.CourseTitle) {
		titleLabel.innerHTML = message.CourseTitle
		chrome.storage.sync.set({ CourseTitle: message.CourseTitle }, undefined)
	}

	if (message.Completion_Module) {
		cpltModuleLabel.innerHTML = `${message.Completion_Module[0]}/${message.Completion_Module[1]}`
		chrome.storage.sync.set({ Completion_Module: message.Completion_Module }, undefined)
	}

	if (message.Completion_Video) {
		cpltVideoLabel.innerHTML = `${message.Completion_Video[0]}/${message.Completion_Video[1]}`
		chrome.storage.sync.set({ Completion_Video: message.Completion_Video }, undefined)
	}

	if (message.AddedCourseCount >= 0) {
		addedCourseCntLabel.innerHTML = `${message.AddedCourseCount}`
		chrome.storage.sync.set({ AddedCourseCount: message.AddedCourseCount }, undefined)
	}
})
