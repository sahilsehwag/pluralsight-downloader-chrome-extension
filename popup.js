// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';


let speedPercent = document.getElementById('SpeedSlider');
let speedLabel = document.getElementById('label_slider');

let statusLabel = document.getElementById('label_Status');

let cpltModuleLabel = document.getElementById('label_Module');
let cpltVideoLabel = document.getElementById('label_Video');

chrome.storage.sync.get('Status', function(data) {
  statusLabel.innerHTML = `Status: ${data.Status}`;
});

chrome.storage.sync.get('Completion_Module', function(data) {
  cpltModuleLabel.innerHTML = `Complete(Module): ${data.Completion_Module}`;
});

chrome.storage.sync.get('Completion_Video', function(data) {
  cpltVideoLabel.innerHTML = `Complete(Video): ${data.Completion_Video}`;
});

chrome.storage.sync.get('speedPercent', function(data) {
  speedPercent.value = data.speedPercent;
  speedLabel.innerHTML = `Duration(0-100%): ${speedPercent.value}`;
});

speedPercent.onchange = function(element){
  chrome.storage.sync.set({speedPercent: speedPercent.value}, undefined);
  speedLabel.innerHTML = `Duration(0-100%): ${speedPercent.value}`;
}