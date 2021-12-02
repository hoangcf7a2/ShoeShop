
const User = require('../model/user')

module.exports = async (req,res,next)=>{
    try{
        const user = await User.findByToken(req.cookie.auth);
        if(!user){
            const error = new Error('Not authenticated');
            error.statusCode = 401;
            next(error);
        }
        req.user = user;
        next();
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}