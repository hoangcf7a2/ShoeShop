const { Decimal128 } = require('bson');
const { truncate } = require('fs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deliverySchema = new Schema({
    name:{
        type:String,
        unique:true,
        required:true
    },
    price:{
        type:Decimal128,
        required:true
    },
    description:String,
    isRemoved:{
        type:Boolean,
        required:true
    }
})