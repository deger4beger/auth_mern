const express = require("express")
const router = express.Router()

const UserController = require("../controlllers/usersController")
const User = require("../models/user")
const checkAuth = require("../middlewares/checkAuth")



router.post("/signup", UserController.user_signup)

router.get("/activation/:token", UserController.user_activate_account)

router.post("/login", UserController.user_login)

router.post("/logout", checkAuth, UserController.user_logout)

router.delete("/:userId", checkAuth, UserController.user_delete)

router.put("/forgotpassword", UserController.forgot_password)

router.put("/resetpassword", UserController.reset_password)

router.post('/googleauth', UserController.google_auth)

router.post("/sub/:idToSub", checkAuth, UserController.subscribe)

router.delete("/sub/:idToUnsub", checkAuth, UserController.unsubscribe)



// ONLY FOR DEVELOPMENT

router.get("/", async (req, res, next) => {
	const docs = await User.find().exec()
	res.status(200).json({
		users: docs
	})
})



module.exports = router