const ErrorHandler = require('../Utils/errorHandler');

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';

    //mongodb id/url/etc error
    if(err.name==='CastError'){
        const message = `Resource Not Found. Invalid: ${err.path}`;
        err = new ErrorHandler(message,400)
    }

    //mongoose duplicate key error
    if(err.name === 11000){
        const msg = `duplicate ${Object.keys(err.keyValue)} Entered`
        err =  new ErrorHandler(msg,400)
    }

    // wrong jwt error
    if(err.name === "JsonWebTokenError"){
        const msg = `JWT Token Expired or Invalid, try later`
        err =  new ErrorHandler(msg,400)
    }

    //JWT Expire Error
    if(err.name === "TokenExpiredError"){
        const msg = `JWT Token Expired or Invalid, try later`
        err =  new ErrorHandler(msg,400)
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message,
        error:err.stack
    })
}