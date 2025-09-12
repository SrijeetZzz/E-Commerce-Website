const express = require("express")
const { requireSignin, isAdmin } = require('./../middlewares/authMiddleware');
const {createCategoryController , updateCategoryController ,categoryController , singleCategoryController , deleteCategoryController} = require('./../controllers/categoryController')

const router = express.Router()

//routes

//create catgeory
router.post('/create-category' ,requireSignin , isAdmin , createCategoryController) //requiresignin

//update category
router.put('/update-category/:id', requireSignin , isAdmin , updateCategoryController )

//getAll category
router.get('/get-category', categoryController)

//single category
router.get('/get-category/:slug', singleCategoryController)  //single-category it was

//delete category
router.delete('/delete-category/:id', requireSignin, isAdmin, deleteCategoryController)

module.exports = router