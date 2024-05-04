import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync.js";

export const addProductMw = catchAsync(async (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  const { id } = jwt.verify(token, process.env.JWT_SECRET);
  const verifyUser = await User.findById(id);
  let roleAccess = ["admin", "superAdmin", "shopkeeper"];
  if (roleAccess.includes(verifyUser.role)) {
    if (verifyUser.role === "shopkeeper" && !verifyUser.shopkeeperConfirmed) {
      res.status(401).json({
        success: false,
        message: "Shopkeeper is not Confirmed",
      });
    }
    next();
  }
  res.status(401).json({
    success: false,
    message: "user does not access to add product",
  });
});
