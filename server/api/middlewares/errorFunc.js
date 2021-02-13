const mongoose = require("mongoose")

module.exports = errorHandler = (res, err) => {
	return res.status(500).json({error: err})
}