const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const userControl = require('../controller/user');
const catchAsync = require('../utils/catchAsync');

router.route('/register').get(userControl.regForm).post(catchAsync(userControl.createUser));
// router.get('/register', userControl.regForm);

// router.post('/register', catchAsync(userControl.createUser));

router
	.route('/login')
	.get(userControl.logForm)
	.post(
		passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
		userControl.logUser
	);

// router.get('/login', userControl.logForm);

// router.post(
// 	'/login',
// 	passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
// 	userControl.logUser
// );

router.get('/logout', userControl.logOut);

module.exports = router;
