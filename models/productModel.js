import mongoose from "mongoose";
import slugify from "slugify";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    description: {
      type: String,
    },

    images: {
      type: [String],
      required: [true, "image is required"],
    },
    price: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      validate: {
        validator: function (value) {
          return this.price > value;
        },
        message: "discount price should be less than the original price",
      },
    },
    shopkeeperId: {
      type: String,
      required: [true, "shopkeeper id required"],
    },
    categoryId: {
      type: [String],
      required: [true, "categoryId id required"],
    },
    quantity: {
      type: Number,
      validate: {
        validator: function (value) {
          return  value >= 0
        },
        message: "invalid quantity",
      },
    },
    rating:{
        type:[{
            userId:String,
            rate:Number
        }]
    },
    startDiscountDate:{
        type:Date
    },
    endDiscountPrice:{
        type:Date,
    },
    slug:{
      type:String
    }
  },
  { timestamps: true }
);

ProductSchema.pre('save',function(next){
  this.slug=slugify(this.name,{lower:true})
  next()
})

const Product = mongoose.model("Product", ProductSchema);
export default Product;
