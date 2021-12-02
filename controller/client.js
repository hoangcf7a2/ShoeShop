const Order = require('../model/order');
const shortId = require('shortid');
//---------------------------------------- Order Controller ----------------------------------------------------------------------------------//
exports.createOrder = async (req,res,next)=>{
    const {name,items,address,phone,email} = req.body
    try{
        const order = new Order({name:name,items:items,address,phone,orderCode:shortId.generate(),email:email,orderDate:new Date().toLocaleDateString()});
        order.orderMoney = await order.getOrderMoney();
        const totalMoney = parseFloat(order.orderMoney)  + parseFloat(order.deliveryMoney) ;
        order.totalMoney = totalMoney;
        const result = await order.save();
        // Nếu không có lỗi tiến hành gửi email cho khách hàng thông tin order
        const emailResult = await order.sendMail();
        res
          .status(201)
          .json({ message: 'Order created successfully', order: result,email:emailResult});
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        console.log(err);
        next(err);
    }
}

exports.getOrder = async (req,res,next)=>{
    const {orderCode,phone} = req.body;
    try{
        const order = await Order.findOne({orderCode:orderCode,phone:phone}).populate({path:'items.product'});
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

