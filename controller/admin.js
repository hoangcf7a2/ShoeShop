const User = require('../model/user');
const Size = require('../model/size');
const Color = require('../model/color');
const Brand = require('../model/brand');
const Category = require('../model/category');
const Product = require('../model/product')
const bryptjs = require('bcryptjs');
const FormData = require('form-data')
const fs = require('fs');
const path = require('path')
var deleteCount = 0;
let fileCount;
// npm install --save node-fetch@2
const fetch = require('node-fetch')

const method={
    create:'create',
    update:'update'
}

//---------------------------------------- User Controller ----------------------------------------------------------------------------------//
exports.createUser = async (req,res,next)=>{
    const {name,email,phone,password} = req.body;
    try{
        const hashedPassword = await bryptjs.hash(password,12) ; 
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
        const users = await User.find();
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
        const user = await User.findById(userId);
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
    const {phone,name} = req.body;
    try{
        const user = await User.findById(userId);
        if(!user){
            const error = new Error('Could not find user');
            error.statusCode = 404;
            throw error;
        }
        user.phone = phone;
        user.name = name;
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

// Xóa ảnh khỏi thư mục images trong project
const clearImage = filePath =>{
    filePath = path.join(__dirname,'..',filePath);
    fs.unlink(filePath,err=>{
        if(err) console.log(err)
        deleteCount++;
    });
}

// Chuyển ảnh qua định dạng 64 để đưa lên server ảnh
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    clearImage(file);
    // convert binary data to base64 encoded string
    return new Buffer.from(bitmap).toString('base64');
}
async function uploadImage(listFile,action){
    var resArray=[];
    fileCount = Object.keys(listFile).length||0;
    if(fileCount<2 && action === method.create){
        const error = new Error('Need 2 images to create this product');
        error.statusCode = 402;
        throw error;
    }
    for(var file in listFile){
        let formData = new FormData();
        formData.append("key", process.env.imgbbKey);
        const imageBase64 = base64_encode(listFile[file][0].path);
        formData.append("image", imageBase64);

        var res = await fetch("https://api.imgbb.com/1/upload", {
          method: "POST",
          body: formData,
          Headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        var resData = await res.json();
        if(resData.error){
            const error = new Error(resData.error.message);
            error.statusCode = resData['status_code'];
            throw error;
        }
        resArray.push(resData);
    }
        return resArray;
}

// để gửi được file ảnh thì body phải là dạng form -data , thay vì dạng application/json
exports.createProduct =  async (req,res,next)=>{
    const listFileDelete = req.files;
    try{
        // Vì upload file là async nên cần await để lấy được resArray\
        const resArray = await uploadImage(req.files,method.create);
        const {title,brand,size,color,price,description,category} = req.body;
        var image01 , image02
        image01 = resArray[0].data.url;
        image02 = resArray[1].data.url;
        // Nếu ảnh trùng base64 thì ko upload ảnh đó , mà chỉ trả về link của ảnh đó đã tồn tại
        const product = new Product({
            title:title,
            brand:brand,
            size:size,
            color:color,
            price:price,
            description:description,
            category:category,
            image01:image01,
            image02:image02
        });
        const result = await product.save();
        deleteCount=0;
        res.status(201).json({message:'Product created successfully',product:result});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
          }
          // Đọc các file trong thư mục images và xóa tất cả - dùng khi chưa kịp xóa đã dính lỗi
          const directory = 'images';
          fs.readdir(directory,(err,files)=>{
              for (const file of files) {
                  clearImage('images/'+file)
                }; 
          })
          next(err);
    }
}


exports.updateProduct = async (req,res,next)=>{
    const productId = req.params.productId;
    const {title,brand,size,color,price,description,category} = req.body;
    let {image01,image02} = req.body;
    try{
        const product = await Product.findById(productId);
        if(!product){
            const error = new Error('Could not find Product');
            error.statusCode = 404;
            throw error;
        }
        // Vì upload file là async nên cần await để lấy được resArray\
        const resArray = await uploadImage(req.files,method.update);
        try{
            image01 = resArray[0].data.url;
            image02 = resArray[1].data.url;
        }
        catch(err){
            console.log(err);
        }
        product.title = title;
        product.brand = brand;
        product.size = size;
        product.color = color;
        product.price = price;
        product.description = description;
        product.category = category;
        product.image01 = image01;
        product.image02 = image02;
        const result = await product.save();
        res.status(200).json({message:'Product updated',product:result});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
          }
          next(err);
    }
}

exports.getProducts =  async (req,res,next)=>{
    try{
        const products = await Product.find();
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
        const product = await Product.findById(productId);
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
        await Product.findByIdAndRemove(productId);
        res.status(200).json({message:'Delete Product Successfully'});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}