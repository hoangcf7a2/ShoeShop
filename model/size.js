const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sizeSchema = new Schema({
    sizeNumber:{
        type:Number,
        required:true,
        unique:true
    }
})

module.exports = mongoose.model('Size',sizeSchema);