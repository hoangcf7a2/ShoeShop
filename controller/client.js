const Order = require('../model/order');
const shortId = require('shortid');
const listStatus = require('../utils/status')
//---------------------------------------- Order Controller ----------------------------------------------------------------------------------//
exports.createOrder = async (req,res,next)=>{
    const {name,items,address,phone,email,status} = req.body
    var order;
    var removeResult=false; // bằng false , true hoặc 1 error
    try{
        console.log(status,listStatus.pending)
        if(status !== listStatus.pending && status !== listStatus.shipping){
            const error = new Error('Status selected is invalid');
            error.statusCode = 422;
            throw error;
        }
        order = new Order({name:name,items:items,address:address,phone:phone,status:status,orderCode:shortId.generate(),email:email,orderDate:new Date().toLocaleDateString("en-GB",{year:"numeric",month:"2-digit", day:"2-digit"})}); // ngày ở dạng days - month - year , year có 4 số , month 2 số , day có 2 số 
        console.log(order)
        order.orderMoney = await order.getOrderMoney();
        const totalMoney = parseFloat(order.orderMoney)  + parseFloat(order.deliveryMoney) ;
        order.totalMoney = totalMoney;
        // Thực hiện xóa quantity của product với size tương ứng
        removeResult = await order.removeQuantity(); // true hoặc 1 error
        if(removeResult!==true){
            const error = new Error(removeResult);
            error.statusCode = 422;
            throw error;
        }
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
        // Nếu đã remove quantity nhưng lại bị lỗi lưu order thì phải cộng lại quantity
        if(removeResult !== false){
            const result = await order.addQuantity();
            console.log(result);
        }
        console.log(err);
        next(err);
    }
}

exports.getOrder = async (req,res,next)=>{
    const {orderCode,phone} = req.body;
    try{
        const order = await Order.findOne({orderCode:orderCode,phone:phone});
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

