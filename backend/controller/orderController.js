const orderSchema = require("../modal/orderModal");
const catchAsyncError = require('../middleware/catchAsyncError');
const ErrorHandler = require('../Utils/errorHandler');
const productSchema = require('../modal/productModal');
const userSchema = require('../modal/userModal');

//Creating New Order

exports.newOrder = catchAsyncError(async(req,res,next)=>{
    
    console.log("Req.body===>>>",req.body)

    console.log("req.query--->>",req.query)

    console.log("req.params--->>",req.params)

    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body

    const order = await orderSchema.create({
        shippingInfo, 
        orderItems, 
        paymentInfo, 
        itemsPrice, 
        taxPrice, 
        shippingPrice, 
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id
    });

    res.status(201).json({
        success:true,
        message:"Thank you !! Your Order Placed Successfully",
        order
    })
})

// get Single Order

exports.getSingleOrder = catchAsyncError(async (req,res,next)=>{
    const order = await orderSchema.findById(req.params.id).populate("user","name email")

    if(!order){
        return next(new ErrorHandler('No such Order Found',404));
    }

    res.status(200).json({
        success:true,
        message:"order Fetched Successfully",
        order
    })
})

// get all orders of someone who is loggedIN 
exports.getMyOrders = catchAsyncError(async(req,res,next)=>{

    console.log("Req.body===>>>",req.body)

    console.log("req.query--->>",req.query)

    console.log("req.params--->>",req.params)

    const orders = await orderSchema.find({user:req.user._id});

    res.status(200).json({
        success:true,
        message:"Your all orders are as below!!",
        orders
    })

})

//get All Orders admin
exports.getAllOrders = catchAsyncError(async(req,res,next)=>{
      const allOrders = await orderSchema.find();

      let totalCost = 0;
      allOrders.forEach((data)=>{
        totalCost += data.totalPrice;
      })
      
      res.status(200).json({
        success:true,
        message:"All orders Fetched Successfully!!",
        allOrders,
        totalCost
      })
});

//update Order Status
exports.updateOrder = catchAsyncError(async(req,res,next)=>{
    const order = await orderSchema.findById(req.params.id)

    if(!order){
        return next(new ErrorHandler("Order Not Found!!",404))
    }

    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("You can't Change it already got delivered."))
    }

    order.orderItems.forEach(async(o)=>{
        await updateStock(o.product,o.quantity);
    })

    order.orderStatus = req.body.status;

    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now();
    }

    await order.save({validateBeforeSave:false});

    res.status(200).json({
        success:true,
        message:"You have updated your Order"
    })
})

async function updateStock(id,quantity){
    let product = await productSchema.findById(id);

    product.Stock = quantity-1;

    await product.save()
}


// delete Order
exports.deleteOrder = catchAsyncError(async(req,res,next)=>{
    const order = orderSchema.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order Not Found!!",404))
    }

   await order.deleteOne();

    res.status(200).json({
        success:true,
        message:"You have successfully deleted the order"
    })
});