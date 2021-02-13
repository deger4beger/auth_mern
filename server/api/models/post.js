const mongoose = require("mongoose")

const postSchema = mongoose.Schema({
	content: {
		type: String,
	    required: true
	},
	authorId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	likes: {
		type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
	},
	likesCount: {
		type: Number,
		default: 0
	}
})

module.exports = mongoose.model("Post", postSchema)