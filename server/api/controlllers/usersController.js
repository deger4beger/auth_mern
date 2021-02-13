const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const ttl = require("mongoose-ttl")
const {OAuth2Client} = require("google-auth-library")

const User = require("../models/user")
const blacklistHelper = require("../helpers/blacklistHelper")

// Mailgun
const mailgun = require("mailgun-js");
const DOMAIN = 'sandboxf8d449576caa475cb8a5b104a5c00f71.mailgun.org';
const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN});
// ...

const client = new OAuth2Client("812496501226-1d2cv9v92kgb6ikhitpcnjnoco91a1lq.apps.googleusercontent.com")

exports.user_signup = async (req, res, next) => {
    try {
        const {email, password, confirmPassword} = req.body
        if (!password || !email || !confirmPassword) {
            return res.status(400).json({error: "Enter correct data"})
        }
        if (confirmPassword !== password) {
            return res.status(400).json({error: "Passwords are not the same"})
        }
        const findedEmail = await User.find({email: email}).exec()
        if (findedEmail.length >= 1) {
            return res.status(409).json({error: "Email already exists"})
        }

        const token = jwt.sign({email: email, password: password},
            process.env.JWT_ACTIVATE_KEY,
            {expiresIn: "15m"})


        // Mailgun
        const data = {
            from: 'deger.begerrr@gmail.com',
            to: email,
            subject: 'Account activation link',
            html: `
				<h2Click on given link to activate your account</h2>
				<p>${process.env.CLIENT_URL}/user/activation/${token}</p>
			`
        }
        mg.messages().send(data, function (error, body) {
            if (error) {
                return res.status(400).json({
                    error: "Invalid email"
                })
            }
            return res.status(200).json({message: "Email has been sent, activate your account"})
        })
    } catch (err) {
        res.status(500).json({error: err})
    }
}

exports.user_activate_account = async (req, res, next) => {
    try {
        const token = req.params.token
        if (token) {
            const decodedToken = jwt.verify(token, process.env.JWT_ACTIVATE_KEY)
            const {email, password} = decodedToken
            bcrypt.hash(password, 10, async (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    })
                } else {
                    try {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: email,
                            password: hash
                        })
                        await user.save()
                        res.status(201).json({
                            message: "User created successfully"
                        })
                    } catch (err) {
                        res.status(500).json({error: err})
                    }
                }
            })
        }
    } catch (err) {
        return res.status(401).json({
            error: "Auth failed"
        })
    }
}

exports.forgot_password = async (req, res, next) => {
    try {
        const {email} = req.body
        if (!email) {
            return res.status(400).json({error: "Email required"})
        }

        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({error: "Email doesn's exists"})
        }


        const token = jwt.sign({_id: user._id},
            process.env.JWT_RESET_PASSWORD_KEY,
            {expiresIn: "15m"})


        // Mailgun
        const data = {
            from: 'noreply@hello.com',
            to: email,
            subject: 'Account activation key',
            html: `
				<h2Your reset key</h2>
				<p>${token}</p>
			`
        }

        await User.updateOne({email: email}, {resetLink: token}, (err, success) => {
            if (err) {
                return res.status(400).json({error: "reset password link error"})
            } else {
                mg.messages().send(data, function (error, body) {
                    if (error) {
                        return res.json({
                            error: error.message
                        })
                    }
                    return res.json({message: "Email has been sent, follow the instructions"})
                })
            }
        })
    } catch (err) {
        res.status(500).json({error: err})
    }
}

exports.reset_password = async (req, res, next) => {
    try {
        const {token, newPassword, confirmNewPassword} = req.body
        if (newPassword !== confirmNewPassword) {
            return res.status(401).json({error: "Passwords are not the same"})
        }
        if (!newPassword) {
            return res.status(404).json({error: "New password is required"})
        }
        if (!token) {
            return res.status(404).json({error: "Key is required"})
        }
        jwt.verify(token, process.env.JWT_RESET_PASSWORD_KEY, (err, decoded) => {
            if (err) {
                return res.status(404).json({error: "Invalid reset key"})
            }
        })
        bcrypt.hash(newPassword, 10, async (err, hash) => {
            if (err) {
                return res.status(500).json({
                    error: err
                })
            } else {
                try {
                    const obj = {
                        password: hash,
                        resetLink: ""
                    }
                    const user = await User.findOneAndUpdate({resetLink: token}, obj)
                    if (!user) {
                        return res.status(404).json({error: "Not found"})
                    }
                    return res.status(200).json({message: "Password updated successfully"})
                } catch (err) {
                    res.status(500).json({error: err})
                }
            }
        })
    } catch (err) {
        return res.status(500).json({error: err})
    }

}

exports.user_login = async (req, res, next) => {
    try {
        const user = await User.find({email: req.body.email})
        if (user.length < 1) {
            return res.status(401).json({
                error: "Auth failed"
            })
        }
        let expire
        if (req.body.rememberMe) {
            expire = `5h`
        } else {
            expire = `10m`
        }
        bcrypt.compare(req.body.password, user[0].password, async (err, result) => {
            if (err) {
                return res.status(401).json({
                    error: "Auth failed"
                })
            }
            if (result) {
                const token = jwt.sign(
                    {
                        email: user[0].email,
                        userId: user[0]._id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: `${expire}`
                    }
                )
                if (req.headers.authorization) {
                    try {
                        const existingToken = req.headers.authorization.split(" ")[1]
                        const decoded = jwt.verify(token, process.env.JWT_KEY)
                        await blacklistHelper(existingToken, decoded.exp)
                    } catch (err) {
                        return res.status(401).json({
                            message: "Auth failed"
                        })
                    }

                }
                return res.status(200).json({
                    message: "Auth succeessful",
                    email: user[0].email,
                    id: user[0]._id,
                    token: token,
                    subs: user[0].subs,
                    subsCount: user[0].subsCount
                })
            }
            return res.status(401).json({
                error: "Auth failed"
            })
        })
    } catch (err) {
        res.status(500).json({error: err})
    }
}

exports.user_logout = async (req, res, next) => {
    try {
        const {exp} = req.userData
        await blacklistHelper(req.token, exp)
        return res.status(200).json({
            message: "Success"
        })
    } catch (err) {
        res.status(500).json({error: err})
    }
}

exports.user_delete = async (req, res, next) => {
    try {
        const user = await User.deleteOne({_id: req.params.userId}).exec()
        if (user.deletedCount !== 0) {
            res.status(200).json({
                message: "Account deleted successfully",
                deletedCount: user.deletedCount
            })
        } else {
            res.status(404).json({
                error: "User not found"
            })
        }
    } catch (err) {
        res.status(500).json({error: err})
    }
}

exports.google_auth = async (req, res, next) => {
    try {
        const {tokenId} = req.body
        const response = await client.verifyIdToken({
            idToken: tokenId,
            audience: "812496501226-1d2cv9v92kgb6ikhitpcnjnoco91a1lq.apps.googleusercontent.com"
        })
        const {email_verified, name, email} = response.payload
        if (!email_verified) {
            return res.status(400).json({
                error: "Something went wrong"
            })
        }
        const user = await User.findOne({email}).exec()
        if (user) {
            const token = jwt.sign({_id: user._id}, process.env.JWT_KEY, {expiresIn: "1d"})

            res.status(201).json({
                message: "Successfully authorized",
                id: user._id,
                email: user.email,
                token,
                isGoogle: true
            })
        } else {
            let password = email + process.env.JWT_SIGNIN_KEY
            let newUser = new User({
                _id: new mongoose.Types.ObjectId(),
                email: email,
                password: password
            })
            await newUser.save()
            const token = jwt.sign({_id: newUser.id}, process.env.JWT_KEY, {expiresIn: "1d"})

            return res.status(201).json({
                message: "Successfully authorized",
                email: newUser.email,
                id: newUser._id,
                token,
                isGoogle: true
            })
        }
    } catch (err) {
        res.status(500).json({error: err})
    }
}


exports.subscribe = async (req, res, next) => {
    try {
        const { idToSub } = req.params
        const id = req.userData.userId
        const sub = await User.findOne({
            _id: id,
            "subs": {
                $in: [idToSub]
            }
        })
        if (!sub) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: id },
                {
                    $push: {
                        subs: idToSub
                    },
                    $inc: {
                        subsCount: 1
                    }
                },
                {
                    new: true
                }
            )
            res.status(201).json({
               message: "Success",
               updatedUser
            })
        } else {
            res.status(400).json({
               error: "Some error occured"
            })
        }

    } catch (err) {
        res.status(500).json({error: err})
    }
}

exports.unsubscribe = async (req, res, next) => {
    try {
        const { idToUnsub } = req.params
        const id = req.userData.userId
        const sub = await User.findOne({
            _id: id,
            "subs": {
                $in: [idToUnsub]
            }
        })
        if (sub) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: id },
                {
                    $pull: {
                        subs: idToUnsub
                    },
                    $inc: {
                        subsCount: -1
                    }
                },
                {
                    new: true
                }
            )
            res.status(201).json({
               message: "Success",
               updatedUser
            })
        } else {
            res.status(400).json({
               error: "Some error occured"
            })
        }

    } catch (err) {
        res.status(500).json({error: err})
    }
}