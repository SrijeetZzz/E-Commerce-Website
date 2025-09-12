const express = require("express");
const {
    registerController,
    loginController,
    testController,
    forgotPasswordController,
    updateProfileController,
    getOrdersController,
    getAllOrdersController,
    orderStatusController,
    getAllUsers
  } = require("../controllers/authController");
const {isAdmin , requireSignin} = require("../middlewares/authMiddleware")

//router object
const router = express.Router();

//routing

//Register || POST
router.post("/register", registerController);

//login ||POST
router.post("/login", loginController);

//Forgot password
router.post('/forgot-password', forgotPasswordController)

//test route
router.get("/test", requireSignin, isAdmin, testController);

//protected user route auth
router.get('/user-auth',requireSignin, (req,res)=>{
  res.status(200).send({ok:true})
})

//protected admin route auth
router.get('/admin-auth',requireSignin, isAdmin, (req,res)=>{
  res.status(200).send({ok:true})
})

//update profile
router.put("/profile", requireSignin, updateProfileController)

//user order
router.get('/orders', requireSignin, getOrdersController)

//all order
router.get('/all-orders', requireSignin, isAdmin, getAllOrdersController)

//order status update
router.put('/order-status/:orderId', requireSignin,isAdmin,orderStatusController);

//get all users 
router.get("/users",requireSignin,isAdmin, getAllUsers);

module.exports = router;
