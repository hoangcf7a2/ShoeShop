const { Decimal128 } = require('bson');
const { truncate } = require('fs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardLevelSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    minSpent:{
        type:Decimal128,
        unique:true,
        required:true
    },
    percentDiscount:{
        type:Number,
        unique:true,
        required:true
    }
})

module.exports = mongoose.model('CardLevel',cardLevelSchema);