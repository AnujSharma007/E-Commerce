const userSchema = require("../modal/userModal");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../Utils/errorHandler");
const sendToken = require("../Utils/jwtToken");
const sendEmail = require("../Utils/sendEmail");
const crypto = require("crypto");

// Register a user
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await userSchema.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is just some sample public id",
      public_url: "this is just some sample public url",
    },
  });

  sendToken(user, 201, res);
});

//User login

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter email and password", 400));
  }

  const user = await userSchema.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid User Or Password"), 401);
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    return next(new ErrorHandler("Sorry Invalid User Or Password", 401));
  }

  sendToken(user, 200, res);
});

// logout user

exports.logOutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", "", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out successfully!!",
  });
});

// forget password
exports.forgetPassword = catchAsyncError(async (req, res, next) => {
  const user = await userSchema.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not Exists", 404));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetpasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/ecommerce/reset/password/${resetToken}`;

  const message = `Your Password reset link is -->> ${resetpasswordUrl} \n\n || if you have not requested this Please Ignore this Email!! Thanks!!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Password Reset email Sent to ${user.email} successfully!!`,
    });
  } catch (error) {
    (this.resetPasswordToken = undefined),
      (this.resetPasswordExpiry = undefined);

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// reset password
exports.resetpassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await userSchema.findOne({
    resetPasswordToken,
    resetPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Reset Password Token is invalid or it has expired", 400)
    );
  }

  // compare password and match password

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password doesn't Matched", 400));
  }

  user.password = req.body.password;
  (this.resetPasswordToken = undefined), (this.resetPasswordExpiry = undefined);

  // saving update user deatils
  await user.save();

  // logging in user

  sendToken(user, 200, res);
});

// get User Details[this is for someone who is loggedIn and want to see his own details]
exports.userDetails = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id;

  const user = await userSchema.findById(userId);

  if (!user) {
    next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// get all user
exports.getAllUser = catchAsyncError(async (req, res, next) => {
  const allUser = await userSchema.find();

  res.status(200).json({
    success: true,
    message: "data fetched Successfully",
    allUser,
  });
});

//get single user by id
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await userSchema.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`No such user exits with this Id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    message: "User found successfully",
    user,
  });
});

// update user Password
exports.updateUserPassword = catchAsyncError(async (req, res, next) => {
  const user = await userSchema.findById(req.user.id).select("+password");

  const isPasswordCorrect = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordCorrect) {
    return next(new ErrorHandler("Sorry Invalid User Or Password", 401));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not Matched", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

// update profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const updatedUserdata = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await userSchema.findByIdAndUpdate(
    req.user.id,
    updatedUserdata,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    user,
  });
});

//update user role and etc --admin only
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
  const userData = {
    email: req.body.email,
    name: req.body.name,
    role: req.body.role,
  };

  const user = await userSchema.findByIdAndUpdate(req.params.id, userData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "User Updated Successfully",
    user,
  });
});

// delete User -- admin only
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const userId = req.params.id;

  const user = await userSchema.findById(userId);

  if (!user) {
    return next(`No such user exits!!`, 404);
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "user deleted Successfully",
    user,
  });
});
