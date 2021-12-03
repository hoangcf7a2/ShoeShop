const express = require('express');
const app = express();
const process = require('process');
const mongoose = require('mongoose');
const multer = require('multer');
const compression = require('compression')
const { v4: uuidv4 } = require('uuid');
const helmet = require('helmet');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path')
const cookies = require('cookie-parser');


const adminRoute  = require('./routes/admin')
const authRoute  = require('./routes/auth')
const clientRoute  = require('./routes/client')

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.h18qd.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, 'images');
//     },
//     filename: function(req, file, cb) {
//         cb(null, uuidv4() + '-' + file.originalname);
//     }
// });

// filter dạng file có thể upload
const fileFilter = (req,file,cb)=>{
    if(
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg' 
    ){
      cb(null,true);
    }
    else{
      cb(null,false);
      const err = new Error('Only .png, .jpg and .jpeg format allowed!')
      err.statusCode = 401;
      throw err;
    }
  }
// package để có thể truyền body dạng form-data
// Lưu 2 file image01,image02 vào req.file.
app.use(multer({fileFilter:fileFilter}).fields([{name:'image01'},{name:'image02'}]));

// để sử dụng ejs - dynamic value view
app.set('view engine','ejs');
app.set('views','views');
// dùng để lấy phần body chứa dữ liệu thuộc dạng json
app.use(express.json());

// link được các file trong thư mục public để gọi được ở thư mục khác
app.use(express.static(path.join(__dirname,'public')))
app.use(express.static(path.join(__dirname,'assets','images')))
// giảm dung lượng các file asset upload lên
app.use(compression());
//set HTTP headers de protect nodeapp
app.use(helmet());

// để lấy được cookie từ req
app.use(cookies())

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*'); // cho phép tất cả các trang web thứ 3 dùng api của mình 
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE'); // cho phép gọi đến các phương thức
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization'); // cho phép gửi request kèm với header 
    next();
})

const swaggerOptions = {
  swaggerDefinition:{
    info:{
      title:'Shoe shop api',
      description:'Shoe shop api information',
      contact:{
        name:'Hoang Pham'
      },
      servers:['https://shoe-shop-demo.herokuapp.com']
    }
  },
  apis:['app.js',`${__dirname}/routes/*.js`]
}

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocs));



app.use('/admin',adminRoute)
app.use(authRoute)
app.use(clientRoute)

app.use((error,req,res,next)=>{
    const statusCode = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(statusCode).json({message:message,data:data});
})



mongoose.connect(MONGODB_URI)
.then(result=>{
    console.log('Connected Database');
    console.log('Your process id is:' + process.pid);
    app.listen(process.env.PORT || 8080);
})
.catch(err=>{
    console.log(err);
})

