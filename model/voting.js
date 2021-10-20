const { truncate } = require('fs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const votingSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    productId:{
        type:Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },
    content:String,
    votingScore:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model('Voting',votingSchema);