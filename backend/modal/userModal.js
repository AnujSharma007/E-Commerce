const mongoose =  require('mongoose');
const validator =  require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');



const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:[true,"Please Enter Your name"],
        maxLength:[40,'Your name can not be more than 40 character'],
        minLength:[4,"Your name can not be less than 4 character"]
    },
    email:{
        type:String,
        required:[true,'Please Enter Your Email'],
        unique:true,
        validate:[ validator.isEmail , 'Please Enter a valid Email']
    },
    password:{
        type:String,
        required:[true,"Please Enter a Password"],
        minLength:[8,"Your password must not be less than 8 character"],
        select:false

    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        public_url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:'user'
    },
    resetPasswordToken:String,
    resetPasswordExpiry:Date,
})


// hasing the password
userSchema.pre('save', async function(next){
   if(!this.isModified("password")){
    next();
   }

   this.password = await bcrypt.hash(this.password,10);
})

// Creating Json Web Token
userSchema.methods.getJWTTOKEN = function () {
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
    expiresIn:process.env.JWT_EXPIRE,
    })
}

// password compare and validation
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

// creating resetPasswordToken

userSchema.methods.getResetPasswordToken = function(){

    // generating token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // hashing and adding reset Password Token to user Schema

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpiry = Date.now() + 15*60*1000  // 15 minutes expiry

    return resetToken;
}

module.exports = mongoose.model('userSchema',userSchema);