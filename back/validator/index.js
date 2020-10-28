//we can use validtion with joi here which use in MEAN stack app example
// this way works with installing middleware expresValidor 
// the recent version 6.0.0+ has a different setup


exports.userSignupValidator = (req, res, next) => {
    req.check('name', 'Name is required').notEmpty()
    req.check('email', 'Email must be between 3 to 32 characters')
        .matches(/.+\@.+\..+/)
        .withMessage('Email must contain @')
        .isLength({
            min: 4,
            max: 32
        });
    req.check('password', 'Password is required').notEmpty()
    req.check('password')
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .matches(/\d/)
        .withMessage("Password must contain a number")
    const errors = req.validationErrors()
    if (errors) {
        const firtError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firtError });
    }
    next();
}
