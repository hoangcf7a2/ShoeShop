
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardLevelSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    minSpent: {
      type: mongoose.Decimal128,
      unique: true,
      required: true,
    },
    percentDiscount: {
      type: Number,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CardLevel',cardLevelSchema);