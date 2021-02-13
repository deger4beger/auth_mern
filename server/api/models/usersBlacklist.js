const mongoose = require("mongoose")
const ttl = require("mongoose-ttl")

const tokenBlacklistSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	token: {
		type: String,
		required: true
	}
})

tokenBlacklistSchema.plugin(ttl, { ttl: 600000 }); // 10m

module.exports = mongoose.model("TokenBlacklist", tokenBlacklistSchema)