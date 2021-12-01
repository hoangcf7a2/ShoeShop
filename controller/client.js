const Order = require('../model/order');
//---------------------------------------- Order Controller ----------------------------------------------------------------------------------//
exports.createOrder = async (req,res,next)=>{
    console.log(req.body)
    const {name,items,address,phone} = req.body
    try{
        const order = new Order({name:name,items:items,address,phone});
        order.orderMoney = await order.getOrderMoney();
        const totalMoney = parseFloat(order.orderMoney)  + parseFloat(order.deliveryMoney) ;
        order.totalMoney = totalMoney;
        const result = await order.save();
        res
          .status(201)
          .json({ message: 'Order created successfully', order: result});
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
    const {orderId,phone} = req.body;
    console.log(orderId,phone)
    try{
        const order = await Order.findOne({_id:orderId,phone:phone}).populate({path:'items.product'});
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

