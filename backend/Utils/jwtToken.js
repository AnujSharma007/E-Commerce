// send token and save token in cookie

 const sendToken = (user,statusCode,res)=>{

    // getting the token from user modal methods
    const Token = user.getJWTTOKEN();

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE*24*60*60*1000
        ),
        httpOnly:true
    };

    res.status(statusCode).cookie("token",Token,options).json({
        success:true,
        message:"token send and saved in cookie successully",
        Token,
        user
    })
}

module.exports = sendToken;