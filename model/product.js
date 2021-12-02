const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sizeExtraSchema = new Schema({
  size: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Size',
  },
  quantity: {
    type: Number,
    required: true,
  },
})

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image01: {
      type: String,
      required: true,
    },
    image02: {
      type: String,
      required: true,
    },
    slug:{
      type:String,
      required:true
    },
    // brand: {
    //   type: Schema.Types.ObjectId,
    //   required: true,
    //   ref: 'Brand',
    // },
    sizeArray: [
      {
        type:sizeExtraSchema,
        required:true
      }
    ],
    color:[
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Color',
      }
    ],
    price: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category:[ 
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
      }
    ],
    isRemoved: {
      type: Boolean,
      default: false,
    },

    // promotionalPrice: {
    //   type: Decimal128,
    // },

    // numberOfVoting: {
    //   type: Number,
    //   required: true,
    // },
    // votingScore: {
    //   type: Number,
    //   required: true,
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product',productSchema);

