// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';


let speedPercent = document.getElementById('SpeedSlider');
let speedLabel = document.getElementById('label_slider');

let statusLabel = document.getElementById('label_Status');

let cpltModuleLabel = document.getElementById('label_Module');
let cpltVideoLabel = document.getElementById('label_Video');

let maxDuration = document.getElementById('MaxDuration');
let btnApply = document.getElementById('btnApply');

let btnSkip = document.getElementById('btnSkip');
let btnStop = document.getElementById('btnStop');
let btnDwnAll = document.getElementById('btnDwnAll');
let btnDwnCur = document.getElementById('btnDwnCur');
let btnDwnAppend = document.getElementById('btnDwnAppend');


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

chrome.storage.sync.get('maxDuration', function (data) {
  maxDuration.value = data.maxDuration;
});


speedPercent.onchange = function (element) {
  chrome.storage.sync.set({ speedPercent: speedPercent.value }, undefined);
  speedLabel.innerHTML = `Duration(0-100%): ${speedPercent.value}`;
}

btnApply.onclick = function () {
  chrome.storage.sync.set({ maxDuration: maxDuration.value }, undefined);
}

let toggleSkip = false;
btnSkip.onclick = function () {
  toggleSkip = !toggleSkip;
  chrome.storage.sync.set({ btnSkip: toggleSkip }, undefined);
}

var toggleStop = false;
btnStop.onclick = function () {
  toggleStop = !toggleStop;
  chrome.storage.sync.set({ btnStop: toggleStop }, undefined);
}

var toggleDwnAll = false;
btnDwnAll.onclick = function () {
  toggleDwnAll = !toggleDwnAll;
  chrome.storage.sync.set({ btnDwnAll: toggleDwnAll }, undefined);
}

var toggleDwnCur = false;
btnDwnCur.onclick = function () {
  toggleDwnCur = !toggleDwnCur;
  chrome.storage.sync.set({ btnDwnCur: toggleDwnCur }, undefined);
}

btnDwnAppend.onclick = function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id,
      {
        btnCmd: {
          cmd: 'DwnAppend',
          state: true
        }
      },
      function (response) {
      });
  });
}


