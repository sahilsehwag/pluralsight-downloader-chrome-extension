import { useState, useEffect, useCallback } from 'react'
import { get, set } from 'utils'

import { LOCALE_X_LANGUAGE } from 'constants/locales'

export const Settings = () => {
	const [isAlwaysLeadingZero, setIsAlwaysLeadingZero] = useState(false)
	const [secondaryLanguage, setSecondaryLanguage] = useState('none')
	const [speedPercent, setsSpeedPercent] = useState('')
	const [maxDuration, setsMaxDuration] = useState('')

	useEffect(() => {
		get('isAlwaysLeadingZero', function (data) {
			setIsAlwaysLeadingZero(data.isAlwaysLeadingZero !== undefined ? data.isAlwaysLeadingZero : 'false')
		})

		get('secondaryLanguage', function (data) {
			setSecondaryLanguage(data.secondaryLanguage !== undefined ? data.secondaryLanguage : 'none')
		})

		get('speedPercent', function (data) {
			setsSpeedPercent(data.speedPercent)
		})

		get('maxDuration', function (data) {
			setsMaxDuration(data.maxDuration)
		})
	}, [])

	const handleIsAlwaysLeadingZero = useCallback(() => {
		set({ isAlwaysLeadingZero })
	}, [isAlwaysLeadingZero])

	const handleSecondaryLanguage = useCallback(() => {
		set({ secondaryLanguage })
	}, [secondaryLanguage])

	const handleSpeedPercent = useCallback(() => {
		set({ speedPercent })
	}, [speedPercent])

	const handleMaxDuration = useCallback(() => {
		set({ maxDuration })
	}, [maxDuration])

	return (
		<div className="settings">
			<section className="time">
				<section className="delay">
					<label className="delay__label">
						Duration:{' '}
						<span id="label_slider" className="delay__value">
							{speedPercent}s
						</span>
					</label>
					<input
						type="range"
						id="SpeedSlider"
						className="delay__slider"
						name="Speed Slider"
						min="0"
						max="100"
						onChange={handleSpeedPercent}
					/>
				</section>
				<section className="max-duration">
					<label id="label_maxduration" className="max-duration__label">
						Max Duration(sec): {maxDuration}s
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
						<button id="btnApply" className="max-duration__submit" onClick={handleMaxDuration}>
							Apply
						</button>
					</div>
				</section>
			</section>
			<section className="leadingzero">
				<section className="leading-zero">
					<label id="label_LeadingZeroText" className="leading-zero__label">
						Leading Zero:{' '}
					</label>
					<select id="isAlwaysLeadingZero" name="Is Always Leading Zero" className="always-leading-zero__select">
						<option value="false">10 files or more</option>
						<option value="true">Always</option>
					</select>
					<button id="btnApplyLeadingZero" className="leading-zero__submit" onClick={handleIsAlwaysLeadingZero}>
						Apply
					</button>
				</section>
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
						Secondary Language: {secondaryLanguage}
					</label>
					<select id="SecondaryLanguage" name="Secondary language" className="secondary-subtitle__select">
						{Object.values(LOCALE_X_LANGUAGE).map(code => (
							<option key={code} value={code}>
								{LOCALE_X_LANGUAGE[code]}
							</option>
						))}
					</select>
				</section>
				<button id="btnApplySecondaryLanguage" className="subtitle__submit" onClick={handleSecondaryLanguage}>
					Apply
				</button>
			</section>
		</div>
	)
}
