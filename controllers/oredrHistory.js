import Order from "../models/orderModel.js";
import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync.js";
import ApiFeatures from "../utils/apiFeatures.js";

export const getAllOrder = catchAsync(async (req, res, next) => {
  const token = req.headers["authorization"];
  const { role } = jwt.verify(token, process.env.JWT_SECRET);
  if (role === "admin" || role === "superAdmin") {
    const features = new ApiFeatures(Order, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const orders = await features.query;
    res.status(200).json({
      success: true,
      data: orders,
    });
  }
});
