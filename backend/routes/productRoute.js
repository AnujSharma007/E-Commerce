const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSingleProduct,
  createProductReview,
  deleteReview,
  getOverallProductReview,
} = require("../controller/productController");
const { isUserAuthenticated, authoriseRoles } = require("../middleware/auth");

const router = express.Router();

// get all product route
router.route("/getAllProduct").get(getAllProducts);

// create a new product route
router
  .route("/admin/product/new")
  .post(isUserAuthenticated, authoriseRoles("admin"), createProduct);

// update/delete existing product
router
  .route("/admin/product/:id")
  .put(isUserAuthenticated, authoriseRoles("admin"), updateProduct)
  .delete(isUserAuthenticated, authoriseRoles("admin"), deleteProduct);

//Single product get api
router.route("/getproduct/:id").get(getSingleProduct);

// product review route
router.route("/submit/review").put(isUserAuthenticated, createProductReview);

// get product overall Review
router.route("/get/review").get(getOverallProductReview);

// product review delete api
router.route("/delete/review").delete(isUserAuthenticated, deleteReview);

module.exports = router;
