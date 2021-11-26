const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    categoryParentId:{
        type:Schema.Types.ObjectId,
        ref:'Category'
    }
})