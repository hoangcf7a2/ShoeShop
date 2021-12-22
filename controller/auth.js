const User = require('../model/user');


exports.login = async (req,res,next)=>{
    try{
        // Tìm xem có user nào trùng với token lấy ra từ cookies không
        const {email,password} = req.body;
        var user = await User.findOne({email:email});
        // Không tồn tại user tương ứng với email
        if(!user){
            const error = new Error('A user with this email couldnt be found');
            error.statusCode= 404;
            throw error;
        }
        const isMatch = await user.comparePassword(password);
        console.log(isMatch)
        // Password nhập bị sai
        if(!isMatch){
            const error = new Error('Wrong password');
            error.statusCode= 401;
            throw error;
        }
        // sinh ra token và gán vào cho cookie
        const token = await user.generateToken();
        // user.password = undefined;
        delete user._doc.password
        // set samesite để thằng từ web thứ 3 có thể dùng cookie của mình set cho nó qua response với mọi request,lax là với get , strict là k cho với gì lun
        // set samesite = none, thì phải set secure = true , secure = true nghĩa là chỉ cho sài cookie này cho web thứ 3 là https, http ko cho
        res.status(200).cookie('auth',token,{sameSite: 'none',secure: false}).json({message:'Login sucessfully',user:user});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.logout = async (req,res,next)=>{
    try{
        // const {userId} = req.body;
        // const user = await User.findById(userId);
        const {user} = req;
        // Xoá token của user
        await user.deleteToken();
        // Xóa cookie auth ở mọi đường dẫn
        res.clearCookie('auth',{path:'/'}).status(200).json({message:'Logout successfully'});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}