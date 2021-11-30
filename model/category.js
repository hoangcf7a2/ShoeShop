const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug:{
      type:String,
      required:true,
      unique:true
    }
    //,
    // categoryParent: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Category",
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category',categorySchema);