import express from "express";
import {
  addProduct,
  getAllProducts,
  getProduct,
  removeProduct,
  updateProduct,
} from "../controllers/productCn.js";
import { addProductMw } from "../middleware/addProductMw.js";

const productRouter = express.Router();

productRouter.route("/").get(getAllProducts).post(addProductMw, addProduct);
productRouter
  .route("/:productId")
  .get(getProduct)
  .patch(addProductMw, updateProduct)
  .delete(addProductMw, removeProduct);

export default productRouter;
