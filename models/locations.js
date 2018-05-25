const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
	name: String,
	image: String,
	desc: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
})

module.exports = mongoose.model("Location", locationSchema)