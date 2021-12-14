const Product = require('../model/product');
const Size = require('../model/size');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const listStatus = require('../utils/status')
const sendGridMail = require('@sendgrid/mail');
const ejs = require('ejs');
const path = require('path');
const mongoDB = require('mongodb');
const ObjectId = mongoDB.ObjectId;

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
        // product:{
        //   type:Schema.Types.ObjectId,
        //   required:true,
        //   ref:'Product'
        // },
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
// true nếu trừ quantity thành công,false nếu sinh ra lỗi
orderSchema.methods.removeQuantity = async function(){
  try{
    const order = this;
    for(const item of order.items){
      // Tìm ra id của size đã chọn của item tương ứng
      const sizePicked = await Size.findOne({sizeNumber:item.size});
      // TÌm product tương ứng với item
      const product = await Product.findOne({_id:item.product._id});
      // Quét qua sizeArray của product, tìm ra size trùng với size đã chọn và giảm quantity, nếu quantity không đủ return false
      product.sizeArray.some(function(element,index){
        console.log(element)
        if(element.size.toString() === sizePicked._id.toString() && element.quantity>item.quantity){
          element.quantity-=item.quantity;
          // console.log(element)
          return true;
        }
        else if(element.size.toString() === sizePicked._id.toString() && element.quantity<item.quantity){
          throw "product quantity is not enough"
        } 
      })
      await product.save();
    }
    // Trả về true nếu tất cả các product đều đủ quantity để tạo đơn hàng
    return true;
  }
  catch(err){
    console.log(err);
    return false;
  }
}
// dùng để add lại quantity khi có lỗi không add được order 
orderSchema.methods.addQuantity = async function(){
  try{
    const order = this;
    for(const item of order.items){
      // Tìm ra id của size đã chọn của item tương ứng
      const sizePicked = await Size.findOne({sizeNumber:item.size});
      // TÌm product tương ứng với item
      const product = await Product.findOne({_id:item.product._id});
      // Quét qua sizeArray của product, tìm ra size trùng với size đã chọn và tăng quantity lại
      product.sizeArray.some(function(element,index){
        console.log(element)
        if(element.size.toString() === sizePicked._id.toString() && element.quantity>item.quantity){
          element.quantity+=item.quantity;
          // console.log(element)
          return true;
        }
      })
      await product.save();
    }
    // Trả về true nếu tất cả các product đều đã được tăng quantity trở lại
    return true;
  }
  catch(err){
    console.log(err);
    return false;
  }
}
function OrderGroupByMonth(list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
      const key = keyGetter(item);
      if (!map.has(key)) {
          map.set(key, 1);
      } else {
        const count = map.get(key)
          map.set(key,count+1)
      }
  });
  return map;
}
function RevenueGroupByMonth(list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
      const key = keyGetter(item);
      if (!map.has(key)) {
          map.set(key, item.orderMoney);
      } else {
        const oldRevenue = parseFloat(map.get(key));
        var newRevenue = oldRevenue + parseFloat(item.orderMoney)
          map.set(key,newRevenue.toString());
      }
  });
  return map;
}
function SpentGroupByPhone(list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
      const key = keyGetter(item);
      if (!map.has(key)) {
          map.set(key, item.orderMoney);
      } else {
        const oldSpent = parseFloat(map.get(key));
        var newSpent = oldSpent + parseFloat(item.orderMoney)
          map.set(key,newSpent.toString());
      }
  });
  return map;
}
orderSchema.statics.createOrderPerMonthChart = async function(orders){
  const orderPerMonth = OrderGroupByMonth(orders,order =>order.orderDate.slice(3,5));
  console.log(orderPerMonth)
  return orderPerMonth;
}

orderSchema.statics.createRevenuePerMonthChart = async function(orders){
  const revenuePerMonth = RevenueGroupByMonth(orders,order => order.orderDate.slice(3,5));
  return revenuePerMonth;
}
// orderSchema.statics.createTop10SpentChart = async function(orders){
//   const spents = SpentGroupByPhone(orders,order => order.phone);
//   var top10Spents = new Map();
//   var spentsArray = Array.from(spents, ([phone, spent]) => ({ phone, spent }));
//   const topWanted = 10;
//     console.log(Math.max.apply(this,spentsArray.map(object=>(object.spent))))
//   return spents;
// }

module.exports = mongoose.model('Order',orderSchema);