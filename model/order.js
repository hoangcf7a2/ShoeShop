const Product = require('../model/product');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const listStatus = require('../utils/status')
const sendGridMail = require('@sendgrid/mail');
const path = require('path');
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
const fs =require('fs');

const orderSchema = new Schema(
  {
    name:{
      type:String,
      required:true
    },
    email:{
      type:String,
      required:true
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default:listStatus.pending
    },
    // discountMoney: {
    //   type: mongoose.Decimal128,
    //   required: true,
    // },
    orderMoney: {
      type: String,
      required: true,
    },
    deliveryMoney: {
      type: String,
      default:'30000'
    },
    totalMoney: {
      type: String,
      required: true,
    },
    orderCode:{
      type:String,
      required:true
    }
  },
  { timestamps: true }
);

orderSchema.methods.getOrderMoney = async function(){
  const order = this;
  let sum = 0;
  for(const item of order.items){
    const product = await Product.findById(item.product);
    const priceFloat = parseFloat(product.price);
    sum+=priceFloat;
  }
  return sum.toString();
}

function getHtml(link){
  try{
    console.log(link)
    const html = fs.readFileSync(link,{encoding:'utf-8'});
    console.log('abc'+html)
    return html;
  }
  catch(err){
    console.log(err)
  }
 
}

orderSchema.methods.sendMail = async function(){
  try{
    const order = this ;
    const html = getHtml('D:\\Code\\Year 4 TLCN\\shoe shop\\public\\html\\revoice.html');
    console.log(html)
    const message = {
      to:order.email,
      from:'hoangsendmail@gmail.com',
      subject:` #${order.orderCode} -Thông báo đặt hàng thành công từ ShoeShop`,
      'text':'abc',
      html:html
    }
    // Với sendgridmail chỉ có subject không thì sẽ bị lỗi( mail thường thì vẫn không sao)
    const result = await sendGridMail.send(message);
    return true;
  }
  catch(err){
    return false;
  }
}

module.exports = mongoose.model('Order',orderSchema);