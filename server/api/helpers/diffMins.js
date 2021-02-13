module.exports = (exp) => {
	const expr = new Date(exp * 1000)
	const now = new Date(Date.now())
	const diffMs = expr - now
	const diffDays = Math.floor(diffMs / 86400000); // days
	const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
	const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
	return diffMins
}