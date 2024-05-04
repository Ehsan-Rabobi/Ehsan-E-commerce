import express from "express";
import { addProduct, getAllProducts } from "../controllers/productCn.js";
import { addProductMw } from "../middleware/addProductMw.js";

const productRouter = express.Router();

productRouter.route("/").get(getAllProducts).post(addProductMw, addProduct);

export default productRouter;
