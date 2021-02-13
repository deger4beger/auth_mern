const mongoose = require("mongoose")

const TokenBlacklist = require("../models/usersBlacklist")
const diffHelper = require("./diffMins")

module.exports = async (token, exp) => {
	const blacklist = new TokenBlacklist({
		_id: new mongoose.Types.ObjectId(),
		token: token
	})						
	const diffMins = diffHelper(exp)
	blacklist.ttl = `${diffMins}m`
	const BlacklistChecked = await TokenBlacklist.find({token: token}).exec()
	if (BlacklistChecked.length === 0) {
			await blacklist.save()
	}
}