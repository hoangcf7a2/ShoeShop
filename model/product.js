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
productSchema.statics.getMostRecent5Products = async function(){
  const mostRecent5Products = await this.find().sort({createdAt:-1}).limit(5);
  const mostRecent5ProductsMapped = await mostRecent5Products.map(product=>({
    title:product.title,
    image01:product.image01,
    price:product.price,
    createdAt:product.createdAt.toISOString().slice(0,10).split("-").reverse().join("/")
  }))
  return mostRecent5ProductsMapped;
}
module.exports = mongoose.model('Product',productSchema);

