const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	email: {
		type: String,
	    required: true,
	    unique: true,
	    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
	},
	password: {
		type: String,
		required: true
	},
	resetLink: {
		data: String,
		default: ""
	},
	subs: {
		type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
	},
	subsCount: {
		type: Number,
		default: 0
	}
})

module.exports = mongoose.model("User", userSchema)