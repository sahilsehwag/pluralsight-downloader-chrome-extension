// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

function sendMessageToPopup(messageId, messageData) {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { target: "script", "message": messageId, "data": messageData });
  });
}


const onChange = () => {
  let speedPercent = document.getElementById('SpeedSlider');
  let speedLabel = document.getElementById('label_slider');
  let buttonEnable = document.getElementById('but_enable_slider');

  let statusLabel = document.getElementById('label_Status');

  let cpltModuleLabel = document.getElementById('label_Module');
  let cpltVideoLabel = document.getElementById('label_Video');



  chrome.storage.sync.get('Status', function (data) {
    statusLabel.innerHTML = `Status: ${data.Status}`;
  });

  chrome.storage.sync.get('Completion_Module', function (data) {
    cpltModuleLabel.innerHTML = `Complete(Module): ${data.Completion_Module}`;
  });

  chrome.storage.sync.get('Completion_Video', function (data) {
    cpltVideoLabel.innerHTML = `Complete(Video): ${data.Completion_Video}`;
  });

  chrome.storage.sync.get('speedPercent', function (data) {
    speedPercent.value = data.speedPercent;
    speedLabel.innerHTML = `Duration(0-100%): ${speedPercent.value}`;
  });

  chrome.storage.sync.get('EXTENSION_ENABLED', function (data) {
    buttonEnable.value = `Enabled: ${data.EXTENSION_ENABLED == true}`;
  });

  speedPercent.onchange = function (element) {
    chrome.storage.sync.set({ speedPercent: speedPercent.value }, undefined);
    speedLabel.innerHTML = `Duration(0-100x%): ${speedPercent.value}`;
  }

  buttonEnable.onclick = function (data) {
    chrome.storage.sync.get('EXTENSION_ENABLED', function (data) {
      // chrome.storage.sync.set({ EXTENSION_ENABLED: !(data.EXTENSION_ENABLED == true) }, undefined);
      // buttonEnable.value = `Enabled: ${data.EXTENSION_ENABLED}`;
      // chrome.tabs.sendMessage(activeTab.id, { "message": "enablechanged" })
      sendMessageToPopup("enablechanged", !data.EXTENSION_ENABLED);
    });
  }
}


chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		console.log(request);
		if (request.target != "popup") {
			return;
		}

		if (request.message === "enablechanged") {
			console.log({ "received msg": "Enable changed", "dataX": request.data });
      buttonEnable.value = `Enabled: ${request.data === true}`;
		}
	}
);



onChange();



// chrome.storage.onChanged.addListener((changes, areaName) => {
//   debugger;
//   onChange();
// });


