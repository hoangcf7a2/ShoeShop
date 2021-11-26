const express = require('express');
const app = express();
const process = require('process');
const mongoose = require('mongoose');

// dùng để lấy phần body chứa dữ liệu thuộc dạng json
app.use(express.json());

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
    next();
})

const MONGODB_URI = 'mongodb+srv://user1:user1@cluster0.h18qd.mongodb.net/ShoeShop?retryWrites=true&w=majority'



mongoose.connect(MONGODB_URI)
.then(result=>{
    console.log('Connected Database');
    console.log('Your process id is:' + process.pid);
    app.listen(4000);
})
.catch(err=>{
    console.log(err);
})

