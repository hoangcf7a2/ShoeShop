const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    token:String
  },
  {timestamps:true}
  // address:[
  //     {
  //         // tỉnh , thành phố
  //         province:{
  //             type:String,
  //             required:true
  //         },
  //         // quận , huyện
  //         district:{
  //             type:String,
  //             required:true
  //         },
  //         // phường.xã
  //         subDistrict:{
  //             type:String,
  //             required:true
  //         },
  //         specificAddress:{
  //             type:String,
  //             required:true
  //         }
  //     }
  // ]
  // ,

  // isEmailActive:{
  //     type:Boolean,
  //     default:false
  // },

  // cardLevel:{
  //     type:Schema.Types.ObjectId,
  //     ref:'CardLevel',
  //     required:true
  // },

  // cart: {
  //     // items:[String]
  //     items: [
  //       {
  //         productId: { type: Schema.Types.ObjectId, ref:'Product',required: true },
  //         quantity: { type: Number, required: true },
  //       }
  //     ]
  // },
  // numberOfSucceddedOrders:{
  //     type:Number,
  //     default:0
  // },
  // numberOfFailedOrder:{
  //     type:Number,
  //     default:0
  // },
  // moneySpent:{
  //     type:Decimal128,
  //     default:0
  // },
  // avatar:{
  //     type:String,
  //     required:true
  // },
  // role:{
  //     type:Schema.Types.ObjectId,
  //     ref:'Role',
  //     required:true
  // },
  // resetToken:String,
  // resetTokenExpiration:Date
);

// so sánh password người dùng nhập vào và password gốc của user
userSchema.methods.comparePassword = async function(password){
  const user = this;
  console.log(user)
  const result = await bcryptjs.compare(password,user.password); // true hoặc false
  return result;
}

//Tìm kiếm user bằng token thay vì phải đăng nhập bằng username password
userSchema.statics.findByToken = async function (token) {
	if (!token) {
		return false;
	} 
  else {
		const payload = jwt.verify(token, process.env.SECRET_KEY); // Lấy payload từ token, từ đó lấy ra userId,email của token
    console.log(payload);
		const result = await this.findOne({ _id: payload.userId, email:payload.email,token: token }); // tìm xem có user nào có userId,email,token tương ứng không
		return result;
	}
};

//Tạo ra token và lưu vào database
userSchema.methods.generateToken = async function () {
	const user = this;
  // Tạo token từ email,userId thông qua khóa bí mật
	user.token = jwt.sign({email:this.email,userId:this._id.toString()}, process.env.SECRET_KEY);
	const result = await user.save();               
	return user.token;
};

//Delete token trong database
userSchema.methods.deleteToken = async function () {
	const user = this;
  // $unset là xóa đi trường tương ứng của document
  // hàm updateOne của document của mongoose
	const result = await user.updateOne({ $unset: { token: 1 } });
	return result;
};


module.exports = mongoose.model('User',userSchema);