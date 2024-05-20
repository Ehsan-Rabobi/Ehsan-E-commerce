import Order from "../models/orderModel.js";
import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync.js";
import User from "../models/userModel.js";
import ApiFeatures from "../utils/apiFeatures.js";

export const submitOrder = catchAsync(async (req, res, next) => {
  const { id } = jwt.verify(
    req.headers["authorization"].split(" ")[1],
    process.env.JWT_SECRET
  );
  const dataBank = {
    status: false,
  };
  const { cart, fullName, address } = await User.findById(id);
  cart.map(async(e)=>{
    const {shopkeeperId , ...orthers}=e
  })
  if (dataBank.status) {
    const newOrder = await Order.create({
      orderList: cart,
      userId: id,
      orderStatus: "paid",
    });
    res.status(200).json({
      success: true,
      message: "order paid successfully",
    });
  } else {
    const newOrder = await Order.create({
      orderList: cart,
      userId: id,
      orderStatus: "fail",
    });
    res.status(400).json({
      success: false,
      message: "order payment failed",
    });
  }
  await User.findByIdAndUpdate(id, { cart: [] });
});

export const getAllOrder = catchAsync(async (req, res, next) => {
  const { id, role } = jwt.verify(
    req.headers["authorization"].split(" ")[1],
    process.env.JWT_SECRET
  );
  if (role === "admin" || role === "superAdmin") {
    const features = new ApiFeatures(Order, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const orders = await features.query;
    return res.status(200).json({
      success: true,
      data: orders,
    });
  }else{
    const userOredrs = await Order.findById(id)
    return res.status(200).json({
      success: true,
      data: userOredrs ,
    });
  }
});


export const shopkeeperOrderReceive=catchAsync(async(req,res,next)=>{
  const {id,role}=jwt.verify(req.headers['authorization'].split(' ')[1],process.env.JWT_SECRET)
  const shopkeeperOrder=await ShopkeeperOrder.find({shopkeeperId:id})
  res.status(200).json({
      success:true,
      data:shopkeeperOrder
  })
})