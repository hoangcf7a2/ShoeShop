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
function createMonthNotAvailable(map){
  const month = ['01','02','03','04','05','06','07','08','09','10','11','12']
  for(var item of month){
    if(!map.has(item)){
      map.set(item,0);
    }
  }
  return new Map([...map].sort((a,b)=>{
    return a[0]-b[0]
  }));
}
function OrderGroupByMonth(list, getMonth,getYear) {
  const map = new Map();
  list.forEach((item) => {
      const key = getMonth(item);
      const year = getYear(item);
      if (!map.has(key) && year=== new Date().getFullYear().toString()) {
          map.set(key, 1);
      } else if(map.has(key) && year=== new Date().getFullYear().toString()){
        const count = map.get(key);
        map.set(key,count+1);
      }
  });
  
  return createMonthNotAvailable(map);
}
function RevenueGroupByMonth(list,getMonth,getYear) {
  const map = new Map();
  list.forEach((item) => {
      const key = getMonth(item);
      const year = getYear(item)
      if (!map.has(key) && year=== new Date().getFullYear().toString()) {
          map.set(key, item.orderMoney);
      } 
      else if(map.has(key) && year=== new Date().getFullYear().toString())
      {
        const oldRevenue = parseFloat(map.get(key));
        var newRevenue = oldRevenue + parseFloat(item.orderMoney)
          map.set(key,newRevenue.toString());
      }
  });
  return createMonthNotAvailable(map);
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
  console.log(map)
  return map;
}
orderSchema.statics.createOrderPerMonthChart = async function(orders){
  const orderPerMonth = OrderGroupByMonth(orders,order =>order.orderDate.slice(3,5),order=>order.orderDate.slice(6,10));
  return orderPerMonth;
}

orderSchema.statics.createRevenuePerMonthChart = async function(orders){
  const revenuePerMonth = RevenueGroupByMonth(orders,order => order.orderDate.slice(3,5),order=>order.orderDate.slice(6,10));
  return revenuePerMonth;
}
orderSchema.statics.getMostSpent5Phone = async function(orders){
  const spentPhone = SpentGroupByPhone(orders,order => order.phone);
  const mostSpent5PhoneMap=new Map([...spentPhone].sort((a,b)=>{
    return b[1]-a[1];
  }));
  const mostSpent5PhoneArray = Array.from(mostSpent5PhoneMap,([phone,spent])=>({phone,spent}));
  return mostSpent5PhoneArray;
}

function changeFormatOfTimeToYearMonthDay(str){
  var formatStr = str.slice(6,10)+'/'+str.slice(3,5)+'/'+str.slice(0,2)
  return formatStr;
}

orderSchema.statics.getMostRecent10Orders = async function(orders){
  // const mostRecent5Orders = await this.find().sort({orderDate:-1}).limit(5).select('orderDate');
  const mostRecent10Orders=orders.sort((a,b)=>{
    var aFormat = new Date(changeFormatOfTimeToYearMonthDay(a.orderDate));
    var bFormat = new Date(changeFormatOfTimeToYearMonthDay(b.orderDate));
    return bFormat - aFormat
  }).slice(0,10).map(order=>({
    _id:order._id,
    name:order.name,
    phone:order.phone,
    status:order.status,
    orderCode:order.orderCode,
    orderDate:order.orderDate,
    totalMoney:order.totalMoney
  }));
  return mostRecent10Orders;
}


module.exports = mongoose.model('Order',orderSchema);