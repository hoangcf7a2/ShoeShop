const express = require('express');
const app = express();
const process = require('process');
const mongoose = require('mongoose');

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

