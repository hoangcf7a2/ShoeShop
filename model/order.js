const Product = require('../model/product');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    name:{
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
      default:'pending'
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
  },
  { timestamps: true }
);

orderSchema.methods.getOrderMoney = async function(){
  const order = this._doc;
  let sum = 0;
  for(const item of order.items){
    const product = await Product.findById(item._doc.product);
    const priceFloat = parseFloat(product.price);
    sum+=priceFloat;
  }
  return sum.toString();
}

module.exports = mongoose.model('Order',orderSchema);