//---------------------------------------- Order Controller ----------------------------------------------------------------------------------//
const Order = require('../model/order');
exports.creatOrder = async (req,res,next)=>{
    console.log(req.body)
    const {name,items,address,phone} = req.body
    try{
        const order = new Order({name:name,items:items,address,phone});
        order.orderMoney = order.getOrderMoney;
        order.totalMoney = order.orderMoney + order.deliveryMoney;
        console.log(order)
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