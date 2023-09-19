export const ERRORS = {
	// network errors
	serverError: 'Server error: Looks like pluralsight messed up',
	notFound: 'Not found: Looks like hitting up the wrong url',
	badRequest: 'Bad request: Looks like I messed up.',
	unknown: 'Something went wrong, not sure what',
	unauthorized: 'Unauthorized: Make sure you are logged in',
	forbidden: 'Forbidden: You don\'t have permission to do that',
  tooManyRequests: 'Too many requests, You have hitted the rate limit for today. Next time increase the downoad delay in extension settings',

	// parsing errors
	parsingJsonFailed: 'Failed to parse JSON.',
}

export default ERRORS
