const jwt = require("jsonwebtoken")

const TokenBlacklist = require("../models/usersBlacklist")

module.exports = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1]
		const BlacklistChecked = await TokenBlacklist.find({token: token}).exec()
		if (BlacklistChecked.length !== 0) {
			return res.status(401).json({
				message: "Auth failed"
			})
		}
		const decoded = jwt.verify(token, process.env.JWT_KEY)
		req.userData = decoded
		req.token = token
		next()
	} catch (err) {
		return res.status(401).json({
			message: "Auth failed"
		})
	}
}