import React from 'react'

export const BuyMeCoffee = () => {
	return (
		<a
			href="https://www.buymeacoffee.com/sahilsehwag"
			target="_blank"
			rel="noopener noreferrer"
			className="inline-flex items-center gap-2 rounded bg-yellow-400 px-3 py-1 text-sm font-semibold text-black hover:bg-yellow-300"
		>
			<span>Buy me a coffee</span>
			<span role="img" aria-label="coffee">
				☕️
			</span>
		</a>
	)
}
