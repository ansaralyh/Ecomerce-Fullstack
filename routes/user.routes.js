const express = require('express');
const router = express.Router();
const { registerUser,
    Login,
    logout,
    forgetPassword,
    resetPassword,
    getUserDetails,
    updatePassword,
    updateProfile,
    getAllUsers,
    getSingleUser,
    updateRole,
    deleteUser } = require('../controllers/user.controller')

const { isAuthenticatedUser, isAuthorizedRole } = require('../middlewares/auth');

router.route("/register").post(registerUser);

router.route('/login').post(Login)

router.route('/logout').get(logout)

router.route("/forgot/password").post(forgetPassword)

router.route('/password/reset/:token').put(resetPassword)

router.route('/user/view').get(isAuthenticatedUser, getUserDetails);


router.route('/password/update').put(isAuthenticatedUser, updatePassword);

router.route('/user/update').put(isAuthenticatedUser, updateProfile);

router.route('/admin/users').get(isAuthenticatedUser, isAuthorizedRole('admin'), getAllUsers);

router.route('/admin/user/:id').get(isAuthenticatedUser, isAuthorizedRole('admin'), getSingleUser);

router.route('/admin/updateRole/:id').put(isAuthenticatedUser, isAuthorizedRole('admin'), updateRole);


router.route('/admin/removeUser/:id').delete(isAuthenticatedUser, isAuthorizedRole('admin'), deleteUser);

module.exports = router