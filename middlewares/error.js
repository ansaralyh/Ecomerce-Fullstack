const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal server error';

    //wrong mongoDb id err || castError

    if (err.name === 'CastError') {
        const message = `Resource not found. ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    /**Mongoose duplicate key error */
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(message, 400);

    }
    res.status(err.statusCode).json({
        success: false,
        message: err.message

    })

      /**Jason web token error */
   if(err.name === "JasonWebTokenError"){
    const message = "jaosn web token is invalid, Try again"
    err = new ErrorHandler(message,400);

   }

     /**Jason web token expiry error */
     if(err.name === "TokenExpireError"){
        const message = "jaosn web token is expired, Try again"
        err = new ErrorHandler(message,400);
    
       }

}

