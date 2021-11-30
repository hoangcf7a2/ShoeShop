const Order = require('../model/order');
//---------------------------------------- Order Controller ----------------------------------------------------------------------------------//
exports.creatOrder = async (req,res,next)=>{
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