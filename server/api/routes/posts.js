const express = require("express")
const router = express.Router()

const postsController = require("../controlllers/postsController")
const Post = require("../models/post")
const checkAuth = require("../middlewares/checkAuth")


router.get("/", postsController.get_posts)

router.post("/", checkAuth, postsController.create_post)

router.post("/:postId", checkAuth, postsController.like_post)

router.delete("/:postId", checkAuth, postsController.like_delete)



module.exports = router