
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    products: [
      {
        productId: {
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
      required: true,
    },
    discountMoney: {
      type: mongoose.Decimal128,
      required: true,
    },
    orderMoney: {
      type: mongoose.Decimal128,
      required: true,
    },
    deliveryMoney: {
      type: mongoose.Decimal128,
      required: true,
    },
    totalMoney: {
      type: mongoose.Decimal128,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order',orderSchema);