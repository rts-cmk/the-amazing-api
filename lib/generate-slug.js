export function generateSlug(inputString) {
	// Convert to lowercase
	let slug = inputString.toLowerCase()

	// Replace spaces and special characters with hyphens
	slug = slug.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

	// Generate two random characters
	const randomChars = Math.random().toString(36).substring(2, 6)

	// Append random characters to the slug
	slug = `${slug}-${randomChars}`

	return slug
}
