const Product = require('../model/product');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const listStatus = require('../utils/status')
const sendGridMail = require('@sendgrid/mail');
const ejs = require('ejs');
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
          type: Object,
          required:true,
          // ref:'Product'
        },
        quantity: {
          type: Number,
          required: true,
        },
        size:{
          type: String,
          required: true
        }
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
    },
    orderDate:{
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
    // const product = await Product.findById(item.product);
    const priceFloat = parseFloat(item.product.price);
    sum+=priceFloat*item.quantity;
  }
  return sum.toString();
}

async function getHtml(link,order){
  try{
    // render file định dạng ejs(dynamic html file)
    const html = await ejs.renderFile(link,{order:order})
    // const html = fs.readFileSync(link,{encoding:'utf-8'});
    return html;
  }
  catch(err){
    console.log(err)
  }
 
}

orderSchema.methods.sendMail = async function(){
  try{
    const order = this ;
    // const orderPopulate = await order.populate(['items.product']);
    const html = await getHtml(path.join(__dirname,'..','views','receipt.ejs'),order);
    // console.log(html)
    const message = {
      to:order.email,
      from:'hoangsendmail@gmail.com',
      subject:` #${order.orderCode} -Thông báo đặt hàng thành công từ ShoeShop`,
      text:`Xin chào Lương Thế Anh ,Shoeshop xin thông báo đã nhận được đơn đặt hàng mang mã số ${order.orderCode} của bạn.Đơn hàng của bạn đang được tiếp nhận và trong quá trình xử lí. Nhân viên sẽ liên hệ với bạn ngay khi đơn hàng đã sẵn sàng để chuyển đi`,
      html:html
    }
    // Với sendgridmail chỉ có subject không thì sẽ bị lỗi( mail thường thì vẫn không sao)
    const result = await sendGridMail.send(message);
    return true;
  }
  catch(err){
    console.log(err);
    return false;
  }
}

orderSchema.methods.removeQuantity = async function(){
  const order = this;
  for(const item of order.items){
    const sizeArray = await Product.find({_id:item.product._id}).sizeArray;
  }
}

module.exports = mongoose.model('Order',orderSchema);