export function getNavLinks({ count, limit, offset, url }) {
	const nextOffset = offset + limit
	const prevOffset = offset - limit

	const hasNext = nextOffset < count
	const hasPrev = prevOffset >= 0

	const nextLink = hasNext ? `${url}?limit=${limit}&offset=${nextOffset}` : null
	const prevLink = hasPrev ? `${url}?limit=${limit}&offset=${prevOffset}` : null

	return {
		next: nextLink,
		prev: prevLink
	}
}
