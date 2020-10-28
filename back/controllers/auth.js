const User = require('../models/user');
const { errorHandler } = require('../helpers/dbErrorHandler');
const jwt = require('jsonwebtoken');//for generating signed token
const expressJwt = require('express-jwt');//for authorization check

exports.signup = (req, res) => {
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({
            user
        });
    });
};

exports.signin = (req, res) => {
    //find based on email
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exists please sign up'
            });
        }
        //if user found check for email and password match
        //create authenticate method in user model
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Email and password don\'t match'
            });
        }
        //generate token with user id and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
        //persist token a 't' in cookie with expiry date
        res.cookie('t', token, { expiresin: new Date() + 9999 });
        //return response with user to frontend
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, email, name, role } });
    });
};

exports.signout = (req, res) => {
    res.clearCookie("t");
    res.json({ messege: 'Signed out successfully' });
};

//authorization Middlewares

exports.requireSignin = expressJwt({
    //it is use as a middleware 
    //for this to work we need to have cookie parser installed
    //It makes sure user is signed in it need to find the token in cookie
    //send back error 'No authorization token was found'     
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], // added later
    userProperty: 'auth'
});

exports.isAuth = (req, res, next) => {
    // it checks that req.profile when params has id 
    // req.auth is available via requireSignin middleware 
    //basically the user id in route parameter is the same as loged in token id
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) return res.status(403).json({
        error: 'Access Denied'
    });
    next();
}
exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: 'Admin Resource! Access Denied'
        });
    }
    next();;
}



