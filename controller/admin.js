const User = require('../model/user');
const Size = require('../model/size');
const Color = require('../model/color');
const Brand = require('../model/brand');
const Category = require('../model/category');
const Product = require('../model/product')
const Order = require('../model/order')
const bcryptjs = require('bcryptjs');
const FormData = require('form-data')
const fs = require('fs');
const path = require('path')
const listStatus = require('../utils/status')
let fileCount;
// npm install --save node-fetch@2
const fetch = require('node-fetch')

const method={
    create:'create',
    update:'update'
}
//testttttt/
//---------------------------------------- User Controller ----------------------------------------------------------------------------------//
exports.createUser = async (req,res,next)=>{
    const {name,email,phone,password} = req.body;
    try{
        const hashedPassword = await bcryptjs.hash(password,12) ; 
        const user = new User({name:name,email:email,phone:phone,password:hashedPassword});
        const result = await user.save();
        res
          .status(201)
          .json({ message: 'User created successfully', userId: result._id });
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getUsers =  async (req,res,next)=>{
    try{
        const users = await User.find().select('name email phone');
        res.status(200).json({message:'Fetched Users Successfully',users:users});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getUser = async (req,res,next)=>{
    const userId = req.params.userId;
    try{
        const user = await User.findById(userId).select('name email phone')
        if(!user){
            const error = new Error('Could not find user');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({message:'Fetched user',user:user});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.deleteUser  = async (req,res,next)=>{
    const userId = req.params.userId;
    try{
        const user = await User.findById(userId);
        if(!user){
            const error = new Error('Could not find user');
            error.statusCode = 404;
            throw error;
        }
        await User.findByIdAndRemove(userId);
        res.status(200).json({message:'Delete User Successfully'});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.updateUser = async (req,res,next)=>{
    const userId = req.params.userId;
    const {phone,name,email} = req.body;
    try{
        const user = await User.findById(userId);
        if(!user){
            const error = new Error('Could not find user');
            error.statusCode = 404;
            throw error;
        }
        user.phone = phone;
        user.name = name;
        user.email = email;
        const result = await user.save();
        res.status(200).json({message:'User updated',user:result});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
          }
          next(err);
    }
}

//---------------------------------------- Size Controller ----------------------------------------------------------------------------------//

exports.createSize = async (req,res,next)=>{
    const {sizeNumber} = req.body
    try{
        const size = new Size({sizeNumber:sizeNumber});
        const result = await size.save();
        res
          .status(201)
          .json({ message: 'Size created successfully', sizeId: result._id });
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getSizes =  async (req,res,next)=>{
    try{
        const sizes = await Size.find();
        res.status(200).json({message:'Fetched Sizes Successfully',sizes:sizes});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getSize = async (req,res,next)=>{
    const sizeId = req.params.sizeId;
    try{
        const size = await Size.findById(sizeId);
        if(!size){
            const error = new Error('Could not find user');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({message:'Fetched size',size:size});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.deleteSize  = async (req,res,next)=>{
    const sizeId = req.params.sizeId;
    try{
        const size = await Size.findById(sizeId);
        if(!size){
            const error = new Error('Could not find user');
            error.statusCode = 404;
            throw error;
        }
        const result = await Product.hasSize(sizeId);
        if(result){
            const error = new Error('Conflict with Product collection, cant delete size');
            error.statusCode = 409;
            throw error;
        }
        await Size.findByIdAndRemove(sizeId);
        res.status(200).json({message:'Delete Size Successfully'});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.updateSize = async (req,res,next)=>{
    const sizeId = req.params.sizeId;
    const {sizeNumber} = req.body;
    try{
        const size = await Size.findById(sizeId);
        if(!size){
            const error = new Error('Could not find size');
            error.statusCode = 404;
            throw error;
        }
        size.sizeNumber = sizeNumber;
        const result = await size.save();
        res.status(200).json({message:'Size updated',size:result});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
          }
          next(err);
    }
}

//---------------------------------------- Color Controller ----------------------------------------------------------------------------------//

exports.createColor = async (req,res,next)=>{
    const {colorValue} = req.body
    try{
        const color = new Color({colorValue:colorValue});
        const result = await color.save();
        res
          .status(201)
          .json({ message: 'Color created successfully', colorId: result._id });
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getColors =  async (req,res,next)=>{
    try{
        const colors = await Color.find();
        res.status(200).json({message:'Fetched Colors Successfully',colors:colors});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getColor = async (req,res,next)=>{
    const colorId = req.params.colorId;
    try{
        const color = await Color.findById(colorId);
        if(!color){
            const error = new Error('Could not find Color');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({message:'Fetched color',color:color});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}


exports.updateColor = async (req,res,next)=>{
    const colorId = req.params.colorId;
    const {colorValue} = req.body;
    try{
        const color = await Color.findById(colorId);
        if(!color){
            const error = new Error('Could not find color');
            error.statusCode = 404;
            throw error;
        }
        color.colorValue = colorValue;
        const result = await color.save();
        res.status(200).json({message:'Color updated',color:result});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
          }
          next(err);
    }
}

exports.deleteColor  = async (req,res,next)=>{
    const colorId = req.params.colorId;
    try{
        const color = await Color.findById(colorId);
        if(!color){
            const error = new Error('Could not find color');
            error.statusCode = 404;
            throw error;
        }
        const result = await Product.hasColor(colorId);
        if(result){
            const error = new Error('Conflict with Product collection, cant delete color');
            error.statusCode = 409;
            throw error;
        }
        await Color.findByIdAndRemove(colorId);
        res.status(200).json({message:'Delete Color Successfully'});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

//---------------------------------------- Brand Controller ----------------------------------------------------------------------------------//

exports.createBrand = async (req,res,next)=>{
    const {name} = req.body
    try{
        const brand = new Brand({name:name});
        const result = await brand.save();
        res
          .status(201)
          .json({ message: 'Brand created successfully', brand: result});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}


exports.getBrands =  async (req,res,next)=>{
    try{
        const brands = await Brand.find();
        res.status(200).json({message:'Fetched Brands Successfully',brands:brands});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}


exports.getBrand = async (req,res,next)=>{
    const brandId = req.params.brandId;
    try{
        const brand = await Brand.findById(brandId);
        if(!brand){
            const error = new Error('Could not find Color');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({message:'Fetched brand',brand:brand});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.updateBrand = async (req,res,next)=>{
    const brandId = req.params.brandId;
    const {name} = req.body;
    try{
        const brand = await Brand.findById(brandId);
        if(!brand){
            const error = new Error('Could not find Brand');
            error.statusCode = 404;
            throw error;
        }
        brand.name = name;
        const result = await brand.save();
        res.status(200).json({message:'Brand updated',brand:result});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
          }
          next(err);
    }
}


exports.deleteBrand  = async (req,res,next)=>{
    const brandId = req.params.brandId;
    try{
        const brand = await Brand.findById(brandId);
        if(!brand){
            const error = new Error('Could not find brand');
            error.statusCode = 404;
            throw error;
        }
        await Brand.findByIdAndRemove(brandId);
        res.status(200).json({message:'Delete Brand Successfully'});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

//---------------------------------------- Category Controller ----------------------------------------------------------------------------------//

exports.createCategory = async (req,res,next)=>{
    const {name} = req.body
    try{
        const category = new Category({name:name});
        category.slug = convertNameToSlug(name);
        const result = await category.save();
        res
          .status(201)
          .json({ message: 'Category created successfully', categoryId: result._id });
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.updateCategory = async (req,res,next)=>{
    const categoryId = req.params.categoryId;
    const {name} = req.body;
    try{
        const category = await Category.findById(categoryId);
        if(!category){
            const error = new Error('Could not find Category');
            error.statusCode = 404;
            throw error;
        }
        category.name = name;
        category.slug = convertNameToSlug(name);
        const result = await category.save();
        res.status(200).json({message:'Category updated',category:result});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
          }
          next(err);
    }
}


exports.getCategories =  async (req,res,next)=>{
    try{
        const categories = await Category.find();
        res.status(200).json({message:'Fetched Categories Successfully',categories:categories});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}


exports.getCategory = async (req,res,next)=>{
    const categoryId = req.params.categoryId;
    try{
        const category = await Category.findById(categoryId);
        if(!category){
            const error = new Error('Could not find category');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({message:'Fetched category',category:category});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.deleteCategory  = async (req,res,next)=>{
    const categoryId = req.params.categoryId;
    try{
        const category = await Category.findById(categoryId);
        if(!category){
            const error = new Error('Could not find category');
            error.statusCode = 404;
            throw error;
        }
        const result = await Product.hasCategory(categoryId);
        if(result){
            const error = new Error('Conflict with Product collection, cant delete category');
            error.statusCode = 409;
            throw error;
        }
        await Category.findByIdAndRemove(categoryId);
        res.status(200).json({message:'Delete Category Successfully'});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

//---------------------------------------- Product Controller ----------------------------------------------------------------------------------//

function convertNameToSlug(str){
    str = str.toLowerCase();
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g,"a"); 
    str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g,"e"); 
    str = str.replace(/??|??|???|???|??/g,"i"); 
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g,"o"); 
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g,"u"); 
    str = str.replace(/???|??|???|???|???/g,"y"); 
    str = str.replace(/??/g,"d");
    // M???t v??i b??? encode coi c??c d???u m??, d???u ch??? nh?? m???t k?? t??? ri??ng bi???t n??n th??m hai d??ng n??y
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ?? ?? ?? ?? ??  huy???n, s???c, ng??, h???i, n???ng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ?? ?? ??  ??, ??, ??, ??, ??
    // B??? c??c kho???ng tr???ng li???n nhau
    str = str.replace(/ + /g," ");
    // X??a ??i kho???ng c??ch 2 ?????u
    str = str.trim();
    // B??? d???u c??u, k?? t??? ?????c bi???t
    // str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
    // Thay kho???ng c??ch tr???ng b???ng d???u - 
    const slug = str.split(' ').join('-');
    return slug;
}



// X??a c??c file ???? c?? trong th?? m???c
// function cleanFolder(folder){
//     return fs.readdir(folder,(err,files)=>{
//         if(err){
//             console.log(err);
//         }
//         for (const file of files) {
//             filePath = path.join(__dirname,'..',folder+'/'+file);
//             fs.unlink(filePath,err=>{
//                 if(err) console.log(err)
//             });
//           }; 
//     })
// }

// X??a 1 listfile ????a v??o

// function cleanFiles(files){
//     for(const file in files){
//         filePath = path.join(__dirname,'..',files[file][0].path);
//         fs.unlink(filePath,err=>{
//             if(err) console.log(err)
//         });
//     }
// }

// // X??a 1 file ?????u v??o
// function cleanFile(file){
//     filePath = path.join(__dirname,'..',file);
//     return fs.unlink(filePath,err=>{
//         if(err) console.log(err)
//     });
// }

// // Chuy???n ???nh qua ?????nh d???ng 64 ????? ????a l??n server ???nh
// function base64_encode(file) {
//     // read binary data
//     var bitmap = fs.readFileSync(file);
//     // convert binary data to base64 encoded string
//     return new Buffer.from(bitmap).toString('base64');
// }
// async function uploadImage(listFile,action){
//     var resArray=[];
//     fileCount = Object.keys(listFile).length||0;
//     if(fileCount<2 && action === method.create){
//         const error = new Error('Need 2 images to create this product');
//         error.statusCode = 402;
//         throw error;
//     }
//     for(var file in listFile){
//         var formData = new FormData();
//         formData.append("key", process.env.imgbbKey);
//         // const filePath =listFile[file][0].path;
//         // const imageBase64 = base64_encode(filePath);
//         const imageBase64 = listFile[file][0].buffer.toString('base64');
//         formData.append("image", imageBase64);

//         var res = await fetch("https://api.imgbb.com/1/upload", {
//           method: "POST",
//           body: formData,
//           Headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         });

//         var resData = await res.json();
//         if(resData.error){
//             const error = new Error(resData.error.message);
//             error.statusCode = resData['status_code'];
//             throw error;
//         }
//         resArray.push(resData);
//     }
//         return resArray;
// }

// ????? g???i ???????c file ???nh th?? body ph???i l?? d???ng form -data , thay v?? d???ng application/json
exports.createProduct =  async (req,res,next)=>{
    try{
        // V?? upload file l?? async n??n c???n await ????? l???y ???????c resArray\
        // const resArray = await uploadImage(req.files,method.create);
        const {title,sizeArray,color,price,description,category,image01,image02} = req.body;
        // var image01 , image02
        // image01 = resArray[0].data.url;
        // image02 = resArray[1].data.url;
        // N???u ???nh tr??ng base64 th?? ko upload ???nh ???? , m?? ch??? tr??? v??? link c???a ???nh ???? ???? t???n t???i
        const product = new Product({
            title:title,
            // brand:brand,
            sizeArray:sizeArray,
            color:color,
            price:price,
            description:description,
            category:category,
            image01:image01,
            image02:image02,
            slug:convertNameToSlug(title)
        });
        const result = await product.save();
        // cleanFiles(req.files)
        res.status(201).json({message:'Product created successfully',product:result});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
          }
        //   cleanFiles(req.files);
          next(err);
    }
}


exports.updateProduct = async (req,res,next)=>{
    const productId = req.params.productId;
    const {title,sizeArray,color,price,description,category,image01,image02} = req.body;
    // var {image01,image02} = req.body;
    try{
        const product = await Product.findById(productId);
        if(!product){
            const error = new Error('Could not find Product');
            error.statusCode = 404;
            throw error;
        }
        // V?? upload file l?? async n??n c???n await ????? l???y ???????c resArray\
        // const resArray = await uploadImage(req.files,method.update);
        // if(!image01){
        //     image01 = resArray.pop().data.url;
        // }
        // if(!image02){
        //     image02 = resArray.pop().data.url;
        // }
        product.title = title;
        // product.brand = brand;
        product.sizeArray = sizeArray;
        product.color = color;
        product.price = price;
        product.description = description;
        product.category = category;
        product.image01 = image01;
        product.image02 = image02;
        product.slug = convertNameToSlug(title);
        const result = await product.save();
        // cleanFiles(req.files);
        res.status(200).json({message:'Product updated',product:result});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
          }
        //   cleanFiles(req.files);
          next(err);
    }
}

exports.getProducts =  async (req,res,next)=>{
    try{
        var products = await Product.find({isRemoved:false}).populate([
            {
                path:'sizeArray.size'
            },
            {
                path:'color'
            },
            {
                path:'category'
            }
        ]);
        res.status(200).json({message:'Fetched Products Successfully',products:products});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}


exports.getProduct = async (req,res,next)=>{
    const productId = req.params.productId;
    try{
        const product = await Product.findOne({_id:productId,isRemoved:false})
        .populate([
            {
                path:'sizeArray.size'
            },
            {
                path:'color'
            },
            {
                path:'category'
            }
        ]);
        if(!product){
            const error = new Error('Could not find product');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({message:'Fetched product',product:product});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.deleteProduct  = async (req,res,next)=>{
    const productId = req.params.productId;
    try{
        const product = await Product.findById(productId);
        if(!product){
            const error = new Error('Could not find Product');
            error.statusCode = 404;
            throw error;
        }
        product.isRemoved = true;
        const result = await product.save();
        res.status(200).json({message:'Delete Product Successfully'});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

//----------------------------------------Order Controller ----------------------------------------------------------------------------------//

exports.updateOrder = async (req,res,next)=>{
    const orderId = req.params.orderId;
    const {status} = req.body
    try{
        const order = await Order.findById(orderId);
        if(!order){
            const error = new Error('Could not find Order');
            error.statusCode = 404;
            throw error;
        }
        const statusCount = Object.keys(listStatus).length||0;
        var invalidStatusCount = 0;
        for(var item in listStatus){
            if(listStatus[item] !== status){
                invalidStatusCount++;
            }
        }
        if(invalidStatusCount === statusCount){
            const error = new Error('Status selected is invalid');
            error.statusCode = 422;
            throw error;
        }
        // Xet su hop le cua status truoc sau
        const oldStatus = order.status;
        var errorFlag = false;
        switch(oldStatus){
            case listStatus.pending:
                if(status === listStatus.pending || status ===listStatus.succeeded ){
                    errorFlag = true;
                }
                break;
            case listStatus.shipping:
                if(status === listStatus.pending || status ===listStatus.shipping ){
                    errorFlag = true;
                }
                break;
            case listStatus.succeeded:
                if(status === listStatus.pending || status ===listStatus.shipping || status ===listStatus.succeeded || status ===listStatus.failed ){
                    errorFlag = true;
                }
                break;
            case listStatus.failed:
                if(status === listStatus.pending || status ===listStatus.shipping || status ===listStatus.succeeded || status ===listStatus.failed ){
                    errorFlag = true;
                }
        }
        if(errorFlag){
            const error = new Error('Status selected is invalid');
            error.statusCode = 422;
            throw error;
        }
        if(status === listStatus.failed){
            // N???u ????n h??ng b??? th???t b???i th?? ph???i t??ng l???i quantity ???? mua cho s???n ph???m
            await order.addQuantity();
        }
        order.status = status;
        const result = await order.save();
        res.status(200).json({message:'Order status updated',order:result});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
          }
          next(err);
    }
}

exports.getOrders =  async (req,res,next)=>{
    try{
        const orders = await Order.find();
        res.status(200).json({message:'Fetched Order Successfully',orders:orders});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getOrder = async (req,res,next)=>{
    const orderId = req.params.orderId;
    try{
        const order = await Order.findById(orderId);
        if(!order){
            const error = new Error('Could not find order');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({message:'Fetched order',order:order});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}
// Chart
exports.Chart = async (req,res,next)=>{
    try{
        const orders = await Order.find();
        const numOfOrders = await Order.countDocuments({});
        const numOfProducts = await Product.countDocuments({isRemoved:false});
        const numOfUsers = await User.countDocuments({});
        const orderPerMonthchart = await Order.createOrderPerMonthChart(orders);
        // tham s??? 1 l?? map , tham s??? th??? 2 la map function, ta c?? m???i ph???n t??? c???a th???ng map l?? 1 m???ng [key,value] , v?? v???y map l?? m???ng 2 chi???u
        // v?? truy???n array v??o n??n ta ph???i d??ng d???u ()
        // ta mu???n return nhanh th?? ta c??ng d??ng d???u ()
        const orderChart = Array.from(orderPerMonthchart, ([month, orderNumber]) => ({ month, orderNumber }));
        const RevenuePerMonthchart = await Order.createRevenuePerMonthChart(orders);
        const revenueChart = Array.from(RevenuePerMonthchart, ([month, revenue]) => ({ month, revenue }));
        const mostSpentChart = await Order.getMostSpent5Phone(orders)
        // const top10Spent = await Order.createTop10SpentChart(orders);
        const mostRecent10Orders = await Order.getMostRecent10Orders(orders);
        const mostRecent5Products = await Product.getMostRecent5Products();
        const mostRecent5Users = await User.getMostRecent5Users();
        res.status(200).json({message:'Create order Per Month chart successfully',numOfOrders:numOfOrders,numofProducts:numOfProducts,numOfUsers:numOfUsers,orderChart:orderChart,revenueChart:revenueChart,mostSpentChart:mostSpentChart,mostRecent10Orders:mostRecent10Orders,mostRecent5Products:mostRecent5Products,mostRecent5Users:mostRecent5Users})
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

