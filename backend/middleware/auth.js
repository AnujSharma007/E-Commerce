// verifying if user exits or not

const ErrorHandler = require("../Utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require('jsonwebtoken');
const user = require('../modal/userModal');

exports.isUserAuthenticated = catchAsyncError(async(req,res,next)=>{
    const { token } = req.cookies

    if(!token){
        return next(new ErrorHandler('Please Login First Invalid User'),401);
    }

    const decodedData = jwt.verify(token,process.env.JWT_SECRET_KEY)
    const userIdFromJwtToken = decodedData.id      // this will give us id of user as we have saved user id when we were creating jwt

    req.user = await user.findById(userIdFromJwtToken);

    next();

})

exports.authoriseRoles = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
        return next(new ErrorHandler("Sorry , You are not authorized!!",403))
        }
        next();
    }
}