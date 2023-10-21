const mongoose = require("mongoose");

// product schema to create new product
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter product name"],
  },
  description: {
    type: String,
    required: [true, "Please Enter Product Description"],
  },
  price: {
    type: Number,
    required: [true, "Please Enter Product Price"],
    maxLength: [8, "Price cannot be this much"],
  },
  rating: {
    type: Number,
    default: 0,
  },
  images: [
    {
      publicId: {
        type: String,
        required: true,
      },
      publicUrl: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please select the product category"],
  },
  Stock: {
    type: Number,
    required: [true, "Please Enter Stock Quantity"],
    default: 1,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "userSchema",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comments: {
        type: String,
        required: true,
      },
    },
  ],
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: "userSchema",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ProductSchema", productSchema);
