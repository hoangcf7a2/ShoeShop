const { Decimal128 } = require('bson');
const { truncate } = require('fs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    brand:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'Brand'
    },
    description:{
        type:String
    },
    image:{
        type:String,
        required:true
    },
    size:[
        {
            sizeId:{
                type:Schema.Types.ObjectId,
                required:true
            },
            quantity:{
                type:Number,
                required:true
            }
        }
    ],
    price:{
        type:Decimal128,
        required:true
    },
    promotionalPrice:{
        type:Decimal128
    },
    category:[
        {
            categoryId:Schema.Types.ObjectId,
            required:true,
            ref:'Category'
        }
    ],
    numberOfVoting:{
        type:Number,
        required:true
    },
    votingScore:{
        type:Number,
        required:true
    },
    isRemoved:{
        type:Boolean,
        required:true
    }
})

module.exports = mongoose.exports('Product',productSchema);