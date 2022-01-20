const express = require('express');
const router = express.Router();
const passport = require('passport');

//Async Function error catcher
const catchAsync = require('../utilities/catchAsync');

//Users Controllers
const users = require('../controllers/users');

//User Registration
router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

//User Login
router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

//Logout request
router.get('/logout', users.logout);

module.exports = router;