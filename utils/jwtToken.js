/**Creating token and saving in cookie */

const sendToken = (user, statusCode, res)=>{
    const token = user.getJwtToken();
    // console.log(token)
    /**Options for cookie */
    const expiresDate = new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000);
    // console.log('Expires Date:', expiresDate);
    
    const options = {
        expires: expiresDate,
        httpOnly: true
    };
    
    res.status(statusCode).cookie('token',token,options).json({
        success:true,
        user,
        token,
        
    })
}

module.exports = sendToken