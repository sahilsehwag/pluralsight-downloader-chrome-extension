import React from 'react'

export function primaryText(text: string) {
	return <span className="font-semibold text-primary">{text}</span>
}

export const mutedText = (text: string) => (
	<span className="text-muted-foreground">{text}</span>
)
