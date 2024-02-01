const express = require('express');
const router = express.Router();
const {registerUser, Login, logout, forgetPassword, resetPassword} = require('../controllers/user.controller')

router.route("/register").post(registerUser);

router.route('/login').post(Login)

router.route('/logout').get(logout)

router.route("/forgot/password").post(forgetPassword)

router.route('/password/reset/:token').put(resetPassword)
module.exports  = router