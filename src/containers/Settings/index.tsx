import { useState, useEffect } from 'react'

import { get, set } from '~/utils/chrome'

import { LABELS } from './constants'
import {
	FIELD_X_KEY as KEYS,
	FIELD_X_LABEL,
	LEADING_ZERO_OPTIONS,
	LEADING_ZERO_OPTIONS_X_LABEL,
	LOCALE_X_LANGUAGE,
} from '~/constants/index'

import { renderLanguageOptions } from './helpers'

const { LEADING_ZERO, SECONDARY_LANGUAGE, DOWNLOAD_DELAY, MAX_DELAY } = KEYS

export const Settings = () => {
	// eslint-disable-next-line no-unused-vars
	const [, setShouldAddLeadingZero] = useState(
		LEADING_ZERO_OPTIONS.TEN_OR_MORE,
	)
	// eslint-disable-next-line no-unused-vars
	const [, setSecondaryLanguage] = useState(
		LOCALE_X_LANGUAGE.none,
	)
	const [downloadDelay, setsDownloadDelay] = useState()
	// eslint-disable-next-line no-unused-vars
	const [, setMaxDelay] = useState()

	useEffect(() => {
		get(LEADING_ZERO).then(setShouldAddLeadingZero)
		get(SECONDARY_LANGUAGE).then(setSecondaryLanguage)
		get(DOWNLOAD_DELAY).then(setsDownloadDelay)
		get(MAX_DELAY).then(setMaxDelay)
	}, [])

	const handleShouldAddLeadingZero = e => {
		setShouldAddLeadingZero(e.target.value)
		set(LEADING_ZERO, e.target.value)
	}
	const handleSecondaryLanguage = e => {
		setSecondaryLanguage(e.target.value)
		set(SECONDARY_LANGUAGE, e.target.value)
	}
	const handleDownloadDelay = e => {
		setsDownloadDelay(e.target.value)
		set(DOWNLOAD_DELAY, e.target.value)
	}
	const handleMaxDelay = e => {
		setMaxDelay(e.target.value)
		set(MAX_DELAY, e.target.value)
	}

	return (
		<div className="settings">
			<section className="time">
				<section className="delay">
					<label className="delay__label">
						{FIELD_X_LABEL.DOWNLOAD_DELAY}:{' '}
						<span id="label_slider" className="delay__value">
							{downloadDelay}s
						</span>
					</label>
					<input
						type="range"
						id="SpeedSlider"
						className="delay__slider"
						name={FIELD_X_LABEL.DOWNLOAD_DELAY}
						min="0"
						max="100"
						onChange={handleDownloadDelay}
					/>
				</section>
				<section className="max-duration">
					<label id="label_maxduration" className="max-duration__label">
						{FIELD_X_LABEL.MAX_DELAY}:
						<input
							type="number"
							min="0"
							id="MaxDuration"
							className="max-duration__input"
							name={FIELD_X_LABEL.MAX_DELAY}
							defaultValue="0"
							style={{ width: '2em' }}
							onChange={handleMaxDelay}
						/>
						s
					</label>
				</section>
			</section>
			<section className="leadingzero">
				<section className="leading-zero">
					<label id="label_LeadingZeroText" className="leading-zero__label">
						{FIELD_X_LABEL.LEADING_ZERO}:{' '}
					</label>
					<select
						id="isAlwaysLeadingZero"
						name={FIELD_X_LABEL.LEADING_ZERO}
						className="always-leading-zero__select"
						onChange={handleShouldAddLeadingZero}
					>
						<option value={LEADING_ZERO_OPTIONS.TEN_OR_MORE}>
							{LEADING_ZERO_OPTIONS_X_LABEL.TEN_OR_MORE}
						</option>
						<option value={LEADING_ZERO_OPTIONS.ALWAYS}>
							{LEADING_ZERO_OPTIONS_X_LABEL.ALWAYS}
						</option>
					</select>
				</section>
			</section>
			<section className="subtitle">
				<section className="primary-subtitle">
					<label id="label_PrimaryLanguage" className="primary-subtitle__label">
						{LABELS.PRIMARY_LANGUAGE}:
					</label>
					<select
						id="PrimaryLanguage"
						name={LABELS.PRIMARY_LANGUAGE}
						className="primary-subtitle__select"
					>
						<option value="en">English</option>
					</select>
				</section>
				<section className="secondary-subtitle">
					<label
						id="label_SecondaryLanguage"
						className="secondary-subtitle__label-"
					>
						{FIELD_X_LABEL.SECONDARY_LANGUAGE}:
					</label>
					<select
						id="SecondaryLanguage"
						name={FIELD_X_LABEL.SECONDARY_LANGUAGE}
						className="secondary-subtitle__select"
						onChange={handleSecondaryLanguage}
					>
						{renderLanguageOptions()}
					</select>
				</section>
			</section>
		</div>
	)
}
