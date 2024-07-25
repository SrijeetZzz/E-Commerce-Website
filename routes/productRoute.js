const express = require("express");
const { requireSignin, isAdmin } = require("../middlewares/authMiddleware");
const {
  createProductController,
  getProductController,
  getSingleProductController,
  productPhotoController,
  deleteProductController,
  updateProductController,
  productFilterController,
  productCountController,
  productListController,
  searchProductController,
  relatedProductController,
  productCategoryController,
  braintreeTokenController,
  braintreePaymentsController,
} = require("../controllers/productController");
const formidable = require("express-formidable");

const router = express.Router();

//routes
//create product
router.post(
  "/create-product",
  requireSignin,
  isAdmin,
  formidable(),
  createProductController
);

//update-product
router.put(
  "/update-product/:pid",
  requireSignin,
  isAdmin,
  formidable(),
  updateProductController
);

//get all products
router.get("/get-product", getProductController);

//single product
router.get("/get-single-product/:slug", getSingleProductController);

//photo
router.get("/product-photo/:pid", productPhotoController);

//delete product
router.delete("/delete-product/:pid", deleteProductController);

//filter-product
router.post("/product-filters", productFilterController);

//product-count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

//search product
router.get('/search/:keyword', searchProductController);

//similar-product
router.get(`/related-product/:pid/:cid`, relatedProductController)

//categorywise
router.get(`/product-category/:slug`, productCategoryController)

//payment routes
//token
router.get('/braintree/token', braintreeTokenController)

//payments
router.post('/braintree/payment', requireSignin, braintreePaymentsController)

module.exports = router;
