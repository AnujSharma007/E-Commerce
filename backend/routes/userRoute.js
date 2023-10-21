const express = require('express');
const {registerUser, loginUser, logOutUser, forgetPassword, resetpassword, userDetails, updateUserPassword, updateProfile, getAllUser, getSingleUser, deleteUser, updateUserRole} = require('../controller/userController');
const { authoriseRoles, isUserAuthenticated } = require('../middleware/auth');

const router = express.Router();


// creating/registering new user
router.route("/register").post(registerUser);

// login User Route
router.route("/login").post(loginUser);

//logout
router.route("/logout").get(logOutUser)

//forgot password
router.route("/forget/password").post(forgetPassword);

// Reset Password
router.route("/reset/password/:token").put(resetpassword);

// get user details
router.route("/user/details").get(isUserAuthenticated,userDetails);

//update Password
router.route("/update/password").put(isUserAuthenticated,updateUserPassword);

//update profile Details
router.route("/user/update").put(isUserAuthenticated,updateProfile);

//get all user route (Admin)
router.route("/admin/getAllUser").get(isUserAuthenticated,authoriseRoles("admin"),getAllUser);

//get single user route (admin)
router.route("/admin/single/user/:id").get(isUserAuthenticated,authoriseRoles("admin"),getSingleUser);

//update user by admin
router.route("/admin/update/user/:id").put(isUserAuthenticated,authoriseRoles("admin"),updateUserRole);

// delete any user by admin
router.route("/admin/delete/user/:id").delete(isUserAuthenticated,authoriseRoles("admin"),deleteUser)

module.exports = router;