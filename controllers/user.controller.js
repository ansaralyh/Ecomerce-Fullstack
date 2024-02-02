const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const userSchema = require('../models/user.model');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')

// Register User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    const { name, email, password, role } = req.body;
    const user = await userSchema.create({
        name, email, password, role, avatar: {
            public_id: 'This is sample id',
            url: 'http://sampleurl'
        }
    });
    // console.log(user)

    sendToken(user, 201, res);

})

//Login


exports.Login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Please provide an email and password", 400));
    }

    // Check if the user exists in the database
    const user = await userSchema.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Please provide a valid email and password", 401));
    }

    // Compare passwords
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email and password", 401));
    }

    sendToken(user, 200, res);
});


// Logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        messege: "Logged out successfully",

    })
})

// Forget password

exports.forgetPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await userSchema.findOne({ email: req.body.email });
    if(!user){

        return next(new ErrorHandler('user not found', 404));
    }
    // get reset passwor token
    const resetToken = await user.generateResetToken();
    await user.save({ validateBeforeSave:false})
    // create password resetURL
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    // Compose the email message
    const message = `Your password reset token:\n\n${resetPasswordUrl}. If you have not requested this email, please ignore it.`;

    try {
        // Send the reset password email
        await sendEmail({
            email: user.email,
            subject: 'Reset your password',
            message
        });

        // Respond with a success message
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        });

    } catch (error) {
         // If there is an error sending the email, clean up the user's reset token and expiration
         user.resetPasswordToken = undefined;
         user.resetPasswordExpire = undefined;
 
         // Save the user without validation
         await user.save({ validateBeforeSave: false });
 
         // Return an error response
         return next(new ErrorHandler(error.message, 500));
    }
});

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    // Create a token hash
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');


    // console.log(req.params.token)


    const user = await userSchema.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });
    // console.log(resetPasswordToken) // Debugging

    // console.log(user)   // Debugging

    if (!user) {
        return next(new ErrorHandler("Reset password token is invalid or the link has expired", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords don't match", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user, 200, res);
});


// Get user details
exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{
    const user = await userSchema.findById(req.user.id);

    res.status(200).json({
        success:"true",
        user
    })
})

// Update password

exports.updatePassword = catchAsyncErrors(async (req,res,next)=>{
    const user = await userSchema.findById(req.user.id).select("+password");
    
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if(!isPasswordMatched){
        return next(new ErrorHandler('Your old password is incorrect',401))
    }
    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler('New password and confirm password do not match',400))
    }
    user.password = req.body.newPassword;

  await  user.save();
  sendToken(user,200,res);

})


/**Update Profile - except password */
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    const user = await userSchema.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFinfAndModify: false
    });
    res.status(200).json({
        success: true,
        message: `${req.body.name} and ${req.body.email} updated successfully`

    })
})

// Get all users -- admin

exports.getAllUsers =  catchAsyncErrors(async(req,res,next)=>{

    const users = await userSchema.find();
    if(!users){
        return next(new ErrorHandler("No User Found",404));
    }
    res.status(200).json({
        success:true,
        users
    })
})

//Get single user -- admin 

exports.getSingleUser = catchAsyncErrors(async(req,res,next)=>{
    const user = await userSchema.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User not found with id of ${req.params.id}`));
         
    }
    res.status(200).json({
        succes:true,
        user
    })

});



/**Update user role -- Admin */

exports.updateRole = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }

    const user = await userSchema.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    res.status(200).json({
        success: true,
        user: user, 
        message: "User role updated successfully" 
    });
});

/**Delete a user -- admin */
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await userSchema.findOneAndDelete(req.params.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    });
});