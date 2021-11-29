
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deliverySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    price: {
      type: mongoose.Decimal128,
      required: true,
    },
    description: String,
    isRemoved: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);