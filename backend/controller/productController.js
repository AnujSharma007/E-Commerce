const ErrorHandler = require("../Utils/errorHandler");
const productSchema = require("../modal/productModal");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../Utils/apiFeatures");

// create new product Admin Only

exports.createProduct = catchAsyncError(async (req, res, next) => {
  req.body.user_id = req.user.id;

  const product = await productSchema.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// get all product api
exports.getAllProducts = catchAsyncError(async (req, res, next) => {
  const resultPerPage = 8;
  const productCount = await productSchema.countDocuments();
  console.log(productCount);
  const apiFeatures = new ApiFeatures(productSchema.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  const getAllProduct = await apiFeatures.query;

  if (!getAllProduct) {
    return next(new ErrorHandler("Products not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "This route is working fine",
    getAllProduct,
    productCount,
  });
});

// Update product -- Admin only

exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await productSchema.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }

  product = await productSchema.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Product Updated Successfully",
    product,
  });
});

// delete product admin only

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  let product = await productSchema.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }

  product = await product.deleteOne();
  res.status(200).json({
    success: true,
    message: "product deleted successfully",
    product,
  });
});

// get single Product
exports.getSingleProduct = catchAsyncError(async (req, res, next) => {
  console.log("Req.body===>>>", req.body);

  console.log("req.query--->>", req.query);

  console.log("req.params--->>", req.params);

  try {
    let product = await productSchema.findById(req.params.id);
    if (!product) {
      return next(new ErrorHandler("product not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "product found",
      product,
    });
  } catch (ex) {
    console.log("This my cast error    ===>   ", ex.name);
  }
});

// create Review
exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const reviewData = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(req.body.rating),
    comments: req.body.comment,
  };

  const product = await productSchema.findById(req.body.productId);

  const isReviewed = product.reviews.find((rev) => {
    rev.user.toString() === req.user._id.toString();
  });

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comments = comments);
    });
  } else {
    product.reviews.push(reviewData);
    product.numOfReviews = product.reviews.length;
  }

  let avgRating = 0;
  product.reviews.forEach((rate) => {
    avgRating += rate.rating;
  });

  product.rating = avgRating / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// get overall review of a single Product
exports.getOverallProductReview = catchAsyncError(async (req, res, next) => {
  const product = await productSchema.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// delete a review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await productSchema.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let rating = 0;

  if (reviews.length === 0) {
    rating = 0;
  } else {
    rating = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  const newData = {
    reviews,
    rating,
    numOfReviews,
  };

  console.log(reviews);

  await productSchema.findByIdAndUpdate(req.query.productId, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});
