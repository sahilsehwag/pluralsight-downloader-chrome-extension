/*global chrome*/
import { useEffect } from 'react'
import './App.scss'

export const App = () => {
	useEffect(() => {
		// Copyright 2018 The Chromium Authors. All rights reserved.
		// Use of this source code is governed by a BSD-style license that can be
		// found in the LICENSE file.
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

		let courseType = document.getElementById('CourseType')
		let btnApplyCourseType = document.getElementById('btnApplyCourseType')

		chrome.storage.sync.get('courseType', function (data) {
			courseType.value = data.courseType !== undefined ? data.courseType : 'Latest'
		})

		chrome.storage.sync.get('isAlwaysLeadingZero', function (data) {
			isAlwaysLeadingZero.value = data.secondaryLanguage !== undefined ? data.isAlwaysLeadingZero : 'false'
		})

		chrome.storage.sync.get('isAlwaysLeadingZero', function (data) {
			isAlwaysLeadingZero.value = data.secondaryLanguage !== undefined ? data.isAlwaysLeadingZero : 'false'
		})

		chrome.storage.sync.get('secondaryLanguage', function (data) {
			secondaryLanguage.value = data.secondaryLanguage !== undefined ? data.secondaryLanguage : 'none'
		})

		chrome.storage.sync.get('Status', function (data) {
			statusLabel.innerHTML = data.Status
		})

		chrome.storage.sync.get('CourseTitle', function (data) {
			titleLabel.innerHTML = data.CourseTitle
		})

		chrome.storage.sync.get('Completion_Module', function (data) {
			cpltModuleLabel.innerHTML = `${data.Completion_Module[0]}/${data.Completion_Module[1]}`
		})

		chrome.storage.sync.get('Completion_Video', function (data) {
			cpltVideoLabel.innerHTML = `${data.Completion_Video[0]}/${data.Completion_Video[1]}`
		})

		chrome.storage.sync.get('speedPercent', function (data) {
			speedPercent.value = data.speedPercent
			speedLabel.innerHTML = speedPercent.value
		})

		chrome.storage.sync.get('maxDuration', function (data) {
			maxDuration.value = data.maxDuration
		})

		chrome.storage.sync.get('AddedCourseCount', function (data) {
			addedCourseCntLabel.innerHTML = data.AddedCourseCount
		})

		btnApplyCourseType.onclick = function () {
			chrome.storage.sync.set({ courseType: courseType.value }, undefined)
		}

		btnApplyLeadingZero.onclick = function () {
			chrome.storage.sync.set({ isAlwaysLeadingZero: isAlwaysLeadingZero.value }, undefined)
		}

		btnApplySecondaryLanguage.onclick = function () {
			chrome.storage.sync.set({ secondaryLanguage: secondaryLanguage.value }, undefined)
		}

		speedPercent.onchange = function () {
			chrome.storage.sync.set({ speedPercent: speedPercent.value }, undefined)
			speedLabel.innerHTML = speedPercent.value
		}

		btnApply.onclick = function () {
			chrome.storage.sync.set({ maxDuration: maxDuration.value }, undefined)
		}

		btnSkip.onclick = function () {
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {
					btnCmd: {
						cmd: 'Skip',
						state: true,
					},
				})
			})
		}

		btnStop.onclick = function () {
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {
					btnCmd: {
						cmd: 'Stop',
						state: true,
					},
				})
			})
		}

		btnDwnAll.onclick = function () {
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {
					btnCmd: {
						cmd: 'DwnAll',
						state: true,
					},
				})
			})
		}

		btnDwnCur.onclick = function () {
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {
					btnCmd: {
						cmd: 'DwnCur',
						state: true,
					},
				})
			})
		}

		btnAddCourse.onclick = function () {
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
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
	}, [])

	return (
		<main>
			<section className="coursetype">
				<label className="coursetype__label">Course Type:</label>
				<select id="CourseType" name="Course Type" className="CourseType__select">
					<option value="Latest">Latest</option>
					<option value="Old">Old</option>
				</select>
				<button id="btnApplyCourseType" className="CourseType__submit">
					Apply
				</button>
			</section>
			<section className="status">
				<label className="status__label">
					STATUS:
					<span id="label_Status" className="status__value">
						Ready
					</span>
				</label>
				<svg className="status__active disabled">
					<circle cx="8" cy="8" r="8" stroke="none" strokeWidth="3" />
				</svg>
			</section>
			<section className="course-information">
				<label className="course-name">
					{' '}
					Course: <span id="label_Title">NA</span>{' '}
				</label>
				<label className="completed-modules">
					{' '}
					Modules: <span id="label_Module">0/0</span>{' '}
				</label>
				<label className="completed-videos">
					{' '}
					Videos: <span id="label_Video">0/0</span>{' '}
				</label>
				<label className="added-courses">
					{' '}
					Added Courses: <span id="label_AddedCourseCnt">0</span>{' '}
				</label>
			</section>
			<section className="controls">
				<section className="time">
					<section className="delay">
						<label className="delay__label">
							Duration:
							<span id="label_slider" className="delay__value"></span>s
						</label>
						<input type="range" id="SpeedSlider" className="delay__slider" name="Speed Slider" min="0" max="100" />
					</section>
					<section className="max-duration">
						<label id="label_maxduration" className="max-duration__label">
							Max Duration(sec):
						</label>
						<div>
							<input
								type="number"
								min="0"
								id="MaxDuration"
								className="max-duration__input"
								name="Max Duration"
								defaultValue="0"
								style={{ width: '6em' }}
							/>
							<button id="btnApply" className="max-duration__submit">
								Apply
							</button>
						</div>
					</section>
				</section>
				<section className="leadingzero">
					<section className="leading-zero">
						<label id="label_LeadingZeroText" className="leading-zero__label">
							{' '}
							Leading Zero:{' '}
						</label>
						<select id="isAlwaysLeadingZero" name="Is Always Leading Zero" className="always-leading-zero__select">
							<option value="false">10 files or more</option>
							<option value="true">Always</option>
						</select>
					</section>
					<button id="btnApplyLeadingZero" className="leading-zero__submit">
						Apply
					</button>
				</section>
				<section className="subtitle">
					<section className="primary-subtitle">
						<label id="label_PrimaryLanguage" className="primary-subtitle__label">
							Primary Language:
						</label>
						<select id="PrimaryLanguage" name="Primary language" className="primary-subtitle__select">
							<option value="en">English</option>
						</select>
					</section>
					<section className="secondary-subtitle">
						<label id="label_SecondaryLanguage" className="secondary-subtitle__label-">
							Secondary Language:
						</label>
						<select id="SecondaryLanguage" name="Secondary language" className="secondary-subtitle__select">
							<option value="none">None</option>
							<option value="af">Afrikaans</option>
							<option value="sq">Albanian</option>
							<option value="am">Amharic</option>
							<option value="ar">Arabic</option>
							<option value="hy">Armenian</option>
							<option value="az">Azeerbaijani</option>
							<option value="eu">Basque</option>
							<option value="be">Belarusian</option>
							<option value="bn">Bengali</option>
							<option value="bs">Bosnian</option>
							<option value="bg">Bulgarian</option>
							<option value="ca">Catalan</option>
							<option value="ceb">Cebuano</option>
							<option value="zh-CN">Chinese (Simplified)</option>
							<option value="zh-TW">Chinese (Traditional)</option>
							<option value="co">Corsican</option>
							<option value="hr">Croatian</option>
							<option value="cs">Czech</option>
							<option value="da">Danish</option>
							<option value="nl">Dutch</option>
							<option value="eo">Esperanto</option>
							<option value="et">Estonian</option>
							<option value="fi">Finnish</option>
							<option value="fr">French</option>
							<option value="fy">Frisian</option>
							<option value="gl">Galician</option>
							<option value="ka">Georgian</option>
							<option value="de">German</option>
							<option value="el">Greek</option>
							<option value="gu">Gujarati</option>
							<option value="ht">Haitian Creole</option>
							<option value="ha">Hausa</option>
							<option value="haw">Hawaiian</option>
							<option value="iw">Hebrew</option>
							<option value="hi">Hindi</option>
							<option value="hmn">Hmong</option>
							<option value="hu">Hungarian</option>
							<option value="is">Icelandic</option>
							<option value="ig">Igbo</option>
							<option value="id">Indonesian</option>
							<option value="ga">Irish</option>
							<option value="it">Italian</option>
							<option value="ja">Japanese</option>
							<option value="jw">Javanese</option>
							<option value="kn">Kannada</option>
							<option value="kk">Kazakh</option>
							<option value="km">Khmer</option>
							<option value="ko">Korean</option>
							<option value="ku">Kurdish</option>
							<option value="ky">Kyrgyz</option>
							<option value="lo">Lao</option>
							<option value="la">Latin</option>
							<option value="lv">Latvian</option>
							<option value="lt">Lithuanian</option>
							<option value="lb">Luxembourgish</option>
							<option value="mk">Macedonian</option>
							<option value="mg">Malagasy</option>
							<option value="ms">Malay</option>
							<option value="ml">Malayalam</option>
							<option value="mt">Maltese</option>
							<option value="mi">Maori</option>
							<option value="mr">Marathi</option>
							<option value="mn">Mongolian</option>
							<option value="my">Myanmar (Burmese)</option>
							<option value="ne">Nepali</option>
							<option value="no">Norwegian</option>
							<option value="ny">Nyanja (Chichewa)</option>
							<option value="ps">Pashto</option>
							<option value="fa">Persian</option>
							<option value="pl">Polish</option>
							<option value="pt">Portuguese (Portugal, Brazil)</option>
							<option value="pa">Punjabi</option>
							<option value="ro">Romanian</option>
							<option value="ru">Russian</option>
							<option value="sm">Samoan</option>
							<option value="gd">Scots Gaelic</option>
							<option value="sr">Serbian</option>
							<option value="st">Sesotho</option>
							<option value="sn">Shona</option>
							<option value="sd">Sindhi</option>
							<option value="si">Sinhala (Sinhalese)</option>
							<option value="sk">Slovak</option>
							<option value="sl">Slovenian</option>
							<option value="so">Somali</option>
							<option value="es">Spanish</option>
							<option value="su">Sundanese</option>
							<option value="sw">Swahili</option>
							<option value="sv">Swedish</option>
							<option value="tl">Tagalog (Filipino)</option>
							<option value="tg">Tajik</option>
							<option value="ta">Tamil</option>
							<option value="te">Telugu</option>
							<option value="th">Thai</option>
							<option value="tr">Turkish</option>
							<option value="uk">Ukrainian</option>
							<option value="ur">Urdu</option>
							<option value="uz">Uzbek</option>
							<option value="vi">Vietnamese</option>
							<option value="cy">Welsh</option>
							<option value="xh">Xhosa</option>
							<option value="yi">Yiddish</option>
							<option value="yo">Yoruba</option>
							<option value="zu">Zulu</option>
						</select>
					</section>
					<button id="btnApplySecondaryLanguage" className="subtitle__submit">
						Apply
					</button>
				</section>
			</section>
			<section className="download">
				<button id="btnDwnAll" className="download__all" title="Download All">
					<svg xmlns="http://www.w3.org/2000/svg">
						<g>
							<path
								id="svg_1"
								d="m11.2,16.6c0.4,0.5 1.2,0.5 1.6,0l6,-6.3c0.5,-0.5 0,-1.3 -0.8,-1.3l-4,0c0,0 0.2,-4.6 0,-7c-0.1,-1.1 -0.9,-2 -2,-2c-1.1,0 -1.9,0.9 -2,2c-0.2,2.3 0,7 0,7l-4,0c-0.8,0 -1.3,0.8 -0.8,1.4l6,6.2z"
							/>
							<path
								id="svg_2"
								d="m19.25641,20.50641l-14,0c-1.1,0 -2,0.9 -2,2l0,0c0,0.6 0.4,1 1,1l16,0c0.6,0 1,-0.4 1,-1l0,0c0,-1.1 -0.9,-2 -2,-2z"
							/>
							<path
								id="svg_3"
								d="m19.192308,17.269231l-14,0c-1.1,0 -2,0.9 -2,2l0,0c0,0.6 0.4,1 1,1l16,0c0.6,0 1,-0.4 1,-1l0,0c0,-1.1 -0.9,-2 -2,-2z"
							/>
						</g>
					</svg>
				</button>
				<button id="btnDwnCur" className="download__current" title="Download Current">
					<svg version="1.1" xmlns="http://www.w3.org/2000/svg">
						<g id="info" />
						<g id="icons">
							<g id="save">
								<path d="M11.2,16.6c0.4,0.5,1.2,0.5,1.6,0l6-6.3C19.3,9.8,18.8,9,18,9h-4c0,0,0.2-4.6,0-7c-0.1-1.1-0.9-2-2-2c-1.1,0-1.9,0.9-2,2    c-0.2,2.3,0,7,0,7H6c-0.8,0-1.3,0.8-0.8,1.4L11.2,16.6z" />
								<path d="M19,19H5c-1.1,0-2,0.9-2,2v0c0,0.6,0.4,1,1,1h16c0.6,0,1-0.4,1-1v0C21,19.9,20.1,19,19,19z" />
							</g>
						</g>
					</svg>
				</button>
				<button id="btnAddCourse" className="download__add-course" title="Add Course">
					<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
						<path d="M38 26H26v12h-4V26H10v-4h12V10h4v12h12v4z" />
						<path d="M0 0h48v48H0z" fill="none" />
					</svg>
				</button>
				<button id="btnSkip" className="download__skip-video" title="Skip">
					<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path d="M16,12a1,1,0,0,1-.47.85l-8,5A1,1,0,0,1,7,18a.91.91,0,0,1-.48-.13A1,1,0,0,1,6,17V7a1,1,0,0,1,1.53-.85l8,5A1,1,0,0,1,16,12Z" />
						<rect height="12" width="2" x="17" y="6" />
					</svg>
				</button>
				<button id="btnStop" className="download__stop" title="Stop">
					<svg
						baseProfile="tiny"
						height="24px"
						id="Layer_1"
						version="1.2"
						viewBox="0 0 24 24"
						width="24px"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g>
							<path d="M16,6H8C6.9,6,6,6.9,6,8v8c0,1.1,0.9,2,2,2h8c1.1,0,2-0.9,2-2V8C18,6.9,17.1,6,16,6z" />
						</g>
					</svg>
				</button>
			</section>
			<section className="links">
				<a className="links__pluralsight" href="https://app.pluralsight.com/"></a>
				<a className="links__github" href="https://github.com/sahilsehwag/pluralsight-downloader-chrome-extension">
					<svg
						enableBackground="new -1163 1657.697 56.693 56.693"
						height="56.693px"
						id="Layer_1"
						version="1.1"
						viewBox="-1163 1657.697 56.693 56.693"
						width="56.693px"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g>
							<path
								clipRule="evenodd"
								d="M-1134.6598,1662.9163c-13.601,0-24.63,11.0267-24.63,24.6299   c0,10.8821,7.0573,20.1144,16.8435,23.3713c1.2308,0.2279,1.6829-0.5345,1.6829-1.1849c0-0.587-0.0227-2.5276-0.0334-4.5857   c-6.8521,1.4901-8.2979-2.906-8.2979-2.906c-1.1205-2.8467-2.7347-3.6039-2.7347-3.6039   c-2.2349-1.5287,0.1685-1.4972,0.1685-1.4972c2.473,0.1737,3.7755,2.5385,3.7755,2.5385c2.1967,3.7651,5.7618,2.6765,7.1675,2.0472   c0.2211-1.5917,0.8591-2.6786,1.5637-3.2936c-5.4707-0.6226-11.2218-2.7347-11.2218-12.1722c0-2.6888,0.9623-4.8861,2.538-6.611   c-0.2557-0.6206-1.0989-3.1255,0.2386-6.5183c0,0,2.0684-0.6616,6.7747,2.525c1.9648-0.5458,4.0719-0.8195,6.165-0.829   c2.093,0.0095,4.2017,0.2832,6.17,0.829c4.7012-3.1866,6.7665-2.525,6.7665-2.525c1.3406,3.3928,0.4974,5.8977,0.2417,6.5183   c1.5793,1.7249,2.5348,3.9221,2.5348,6.611c0,9.4602-5.7618,11.5428-11.2465,12.1527c0.8834,0.7644,1.6704,2.2632,1.6704,4.561   c0,3.2955-0.0282,5.9479-0.0282,6.7592c0,0.6556,0.4432,1.4236,1.6915,1.1818c9.7812-3.2605,16.8296-12.4896,16.8296-23.3682   C-1110.0299,1673.943-1121.0574,1662.9163-1134.6598,1662.9163z"
								fillRule="evenodd"
							/>
							<path d="M-1149.9611,1698.2793c-0.0542,0.1227-0.2469,0.1593-0.4222,0.0753c-0.1788-0.0804-0.2788-0.2473-0.2211-0.37   c0.053-0.126,0.2457-0.161,0.4242-0.0769C-1150.0013,1697.9882-1149.8993,1698.1566-1149.9611,1698.2793L-1149.9611,1698.2793z    M-1150.2642,1698.0547" />
							<path d="M-1148.9634,1699.3922c-0.1174,0.1086-0.3473,0.0581-0.5031-0.1139c-0.1613-0.1718-0.1912-0.4016-0.072-0.5118   c0.1211-0.1088,0.3438-0.0579,0.505,0.1139C-1148.8721,1699.0541-1148.8407,1699.2819-1148.9634,1699.3922L-1148.9634,1699.3922z    M-1149.1984,1699.14" />
							<path d="M-1147.9922,1700.8105c-0.151,0.1051-0.3979,0.0067-0.5505-0.2123c-0.151-0.2191-0.151-0.4819,0.0035-0.5872   c0.1526-0.1051,0.396-0.0104,0.5505,0.2068C-1147.8381,1700.4406-1147.8381,1700.7034-1147.9922,1700.8105L-1147.9922,1700.8105z    M-1147.9922,1700.8105" />
							<path d="M-1146.6619,1702.1812c-0.1351,0.1489-0.4227,0.1086-0.6329-0.0945c-0.2155-0.1984-0.2753-0.4803-0.1403-0.6293   c0.1371-0.149,0.4263-0.1072,0.6381,0.0944C-1146.5831,1701.7501-1146.5182,1702.0337-1146.6619,1702.1812L-1146.6619,1702.1812z    M-1146.6619,1702.1812" />
							<path d="M-1144.8265,1702.9769c-0.0597,0.1927-0.3365,0.2804-0.6154,0.1984c-0.2788-0.0845-0.4608-0.3103-0.4047-0.5051   c0.0577-0.1943,0.3361-0.2855,0.6169-0.1979C-1144.9512,1702.5563-1144.7688,1702.7805-1144.8265,1702.9769L-1144.8265,1702.9769z    M-1144.8265,1702.9769" />
							<path d="M-1142.8107,1703.1243c0.0067,0.2031-0.2299,0.3716-0.5226,0.3752c-0.2944,0.0067-0.533-0.1577-0.5361-0.3577   c0-0.2052,0.2313-0.3717,0.5258-0.3768C-1143.0509,1702.7594-1142.8107,1702.9227-1142.8107,1703.1243L-1142.8107,1703.1243z    M-1142.8107,1703.1243" />
							<path d="M-1140.9351,1702.8052c0.035,0.198-0.1686,0.4015-0.4594,0.4557c-0.2859,0.0526-0.5504-0.0701-0.587-0.2665   c-0.0354-0.2031,0.1716-0.4066,0.4573-0.4592C-1141.233,1702.4846-1140.9722,1702.6036-1140.9351,1702.8052L-1140.9351,1702.8052z    M-1140.9351,1702.8052" />
						</g>
					</svg>
				</a>
				<a className="links__support"></a>
			</section>
		</main>
	)
}
