
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    }
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

module.exports = mongoose.model('User',userSchema);