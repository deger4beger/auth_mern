const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")

const Post = require("../models/post")
const User = require("../models/user")
const TokenBlacklist = require("../models/usersBlacklist")
const errorHandler = require("../middlewares/errorFunc")

exports.get_posts = async (req, res, next) => {
    try {
        const sub = req.query.sub
        if (sub === "true") {
            console.log(sub)
            const token = req.headers.authorization.split(" ")[1]
            const BlacklistChecked = await TokenBlacklist.find({token: token}).exec()
            if (BlacklistChecked.length !== 0) {
                return res.status(401).json({
                    message: "Auth failed"
                })
            }
            const decoded = jwt.verify(token, process.env.JWT_KEY)
            const user = await User.findOne({_id: decoded.userId})
            const post = await Post
                .find({
                    authorId: {
                        $in: user.subs
                    }
                })
                .select("-__v")
                .populate("authorId", "email")
            return res.status(200).json({
                posts: post
            })
        }
        const post = await Post
            .find()
            .select("-__v")
            .populate("authorId", "email")
        res.status(200).json({
            posts: post
        })
    } catch (err) {
        errorHandler(res, err)
    }
}

exports.create_post = async (req, res, next) => {
    try {
        const { content } = req.body
        const post = new Post({
            content,
            authorId: req.userData.userId
        })
        const newPost = await post.save()
        const newp = await Post.populate(newPost, {path: "authorId", select: "email"})
        res.status(201).json({
            message: "Post created successfully",
            newp
        })
    } catch (err) {
        errorHandler(res, err)
    }
}

exports.like_post = async (req, res, next) => {
    try {
        const { postId } = req.params
        const like = await Post.findOne({
            _id: postId,
            likes: {
                $in: [req.userData.userId]
            }
        })
        console.log(like)
        if (!like) {
            const newLike = await Post.findOneAndUpdate(
                { _id: postId },
                {
                    $push: {
                        likes: req.userData.userId
                    },
                    $inc: {
                        likesCount: 1
                    }
                },
                {
                    new: true
                }
            ).select("-__v")
                .populate("authorId", "email")
                .populate("likes", "email")
            res.status(201).json({
               message: "Success",
               newLike
            })
        } else {
            res.status(400).json({
               error: "Some error occured"
            })
        }

    } catch (err) {
        errorHandler(res, err)
    }
}

exports.like_delete = async (req, res, next) => {
    try {
        const { postId } = req.params
        const like = await Post.findOne({
            _id: postId,
            likes: {
                $in: [req.userData.userId]
            }
        })
        if (like) {
            const newLike = await Post.findOneAndUpdate(
                { _id: postId },
                {
                    $pull: {
                        likes: req.userData.userId
                    },
                    $inc: {
                        likesCount: -1
                    }
                },
                {
                    new: true
                }
            ).select("-__v")
                .populate("authorId", "email")
                .populate("likes", "email")
            res.status(201).json({
               message: "Success",
               newLike
            })
        } else {
            res.status(400).json({
               error: "Some error occured"
            })
        }

    } catch (err) {
        errorHandler(res, err)
    }
}

