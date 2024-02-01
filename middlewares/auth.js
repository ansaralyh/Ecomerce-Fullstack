const catchAsyncErrors = require("./catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user.model'); 
exports.isAuthenticatedUser = catchAsyncErrors(async(req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler('Please login to access this resourse',401))
    }
    const decodedData = await jwt.verify(token,process.env.SECRET);
    req.user = await userSchema.findById(decodedData.id);
    next();

});

// Checking user Role

exports.isAuthorizedRole = (...roles) => {
    return (req, res, next) => {
        // console.log('User Role:', req.user);
        if (req.user && req.user.role && roles.includes(req.user.role)) {
            return next();
        }
        return next(new ErrorHandler(`User is not authorized to access this resource`, 403));
    };
};
