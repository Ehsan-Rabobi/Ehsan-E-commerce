import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync.js";
import HandleERROR from "../utils/handleError.js";
import Product from "../models/productModel.js";

export const clearCart = catchAsync(async (req, res, next) => {
  const { id } = jwt.verify(
    req.headers["authorization"].split(" ")[1],
    process.env.JWT_SECRET
  );
  await User.findByIdAndUpdate(id, { cart: [] });
  res.status(200).json({
    success: "true",
    message: "you cart has been cleared",
  });
});

export const addToCart = catchAsync(async (req, res, next) => {
  const { name, price, discountPrice, shopkeeperId, images, quantity } =
    await Product.findById(req.body.productId);
  const { id } = jwt.verify(
    req.headers["authorization"].split(" ")[1],
    process.env.JWT_SECRET
  );
  if (req.body.productId && req.body.quantity) {
    if (quantity < req.body.quantity) {
      return next(new HandleERROR("Quantity is not enough", 400));
    }
    const { cart } = await User.findById(id);
    let productInCart = false;
    let newCart = cart?.filter((e) => {
      if (e.productId == req.body.productId) {
        e.quantity = parseInt(req.body.quantity);
        if (e.quantity <= 0) {
          return false;
        }
        productInCart = true;
        return e;
      }
      return e;
    });

    if (!productInCart) {
      if (quantity < req.body.quantity) {
        return next(new HandleERROR("Quantity is not enough", 400));
      }
      newCart.push({
        name,
        price,
        discountPrice,
        shopkeeperId,
        images,
        quantity: req.body.quantity,
        productId: req.body.productId,
      });
    }
    const newCartUser = await User.findByIdAndUpdate(
      id,
      { cart: newCart },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      data: newCartUser.cart,
      message: "add cart successfully",
    });
  } else {
    return next(new HandleERROR("Data is incomplete", 400));
  }
});

export const getCartItem = catchAsync(async (req, res, next) => {
  const { id } = jwt.verify(
    req.headers["authorization"].split(" ")[1],
    process.env.JWT_SECRET
  );
  const { cart } = await User.findById(id);
  res.status(200).json({
    success: true,
    cart,
  });
});
