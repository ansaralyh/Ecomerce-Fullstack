const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter your name"],
        maxLength: [10, "Name cannot exceed 10 Characters"],
        minLength: [5, "Name cannot be less than 5 characters "]
    },
    email: {
        type: String,
        required: [true, "Please enter your emaail"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"]

    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [8, "Password cannot be less than 8 characters"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user",
        
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date


});
// Hashing password

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }

    this.password = await bcrypt.hash(this.password,10);
})

// JWT token

userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.SECRET, {
        expiresIn: process.env.EXPIRESIN
    });
};



// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

// generating password reset token 

userSchema.methods.generateResetToken = async function() {
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash the token and set it to resetPasswordToken field

    this.resetPasswordToken = crypto.createHash('sha256')
        .update(resetToken)
        .digest('hex');
          // Set the expiration time for the token (e.g., 15 minutes)
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    console.log(resetToken)

    // Return the unhashed token
    return resetToken; 
}

module.exports = mongoose.model('User',userSchema)