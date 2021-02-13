export const required= value => {
	
	if (value) return undefined
	return "Field is required"	
}

export const maxLenghtCreator = (maxLength) => (value) => {
	if (!value) return undefined
	if (value.length > maxLength) return `Max length is ${maxLength} symbols`
}