const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/UserModel')

const protectAdmin = asyncHandler(async (req, res, next) => {
    req.user = await User.findById(req.body.id)
    if (req.user.isAdmin) {

        let token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                //Get Token from header 
                token = req.headers.authorization.split(' ')[1]
                //Verify token
                const decoded = jwt.verify(token, process.env.JWT_SECRET)


                //Get user from token
                req.user = await User.findById(decoded.id).select('-password')

                next()
            } catch (error) {
                console.log(error)
                res.status(401)
                throw new Error('Not authorized')
            }
        }
        if (!token) {
            res.status(401)
            throw new Error('Not authorized , no token')
        }
    }

    else {
        res.status(401)
        throw new Error('Admin permission needed')

    }
}

)

module.exports = protectAdmin

