const express = require("express")
const morgan = require("morgan")
const mongoose = require("mongoose")
const cors = require("cors")
const app = express()

const userRoutes = require("./api/routes/users")
const postsRoutes = require("./api/routes/posts")

// No deprecation
mongoose.set('useCreateIndex', true)

// Mongoose connection
mongoose.connect("mongodb+srv://deger4beger:" + process.env.MONGO_ATLAS_PW +
				 "@cluster0.kv3je.mongodb.net/" + process.env.MONGO_ATLAS_DBN +
				 "?retryWrites=true&w=majority",
				 {
				 	useNewUrlParser: true,
 					useUnifiedTopology: true
 				 })
mongoose.Promise = global.Promise


//Middlewares
app.use(morgan("dev"))
// instead of body-parser
app.use(express.json())

// CORS
app.use(cors())

// Routes which should handle request
app.use("/user", userRoutes)
app.use("/posts", postsRoutes)


// Handling errors
app.use((req, res, next) => {
	const error = new Error("Not found")
	error.status = 404
	next(error)
})

app.use((error, req, res, next) => {
	res.status(error.status || 505)
	res.json({
		error: error.message
	})
})


module.exports = app