const express = require('express');
const router = express.Router();
const { userById, read, update, purchaseHistory } = require('../controllers/user');
const { requireSignin, isAuth } = require('../controllers/auth');

//If there is userId present in the route parameter this method
//will run making this user information available in the request object
router.param('userId', userById);


router.get('/user/:userId', requireSignin, isAuth, read);
router.put('/user/:userId', requireSignin, isAuth, update);
router.get('/orders/by/user/:userId', requireSignin, isAuth, purchaseHistory);


module.exports = router;