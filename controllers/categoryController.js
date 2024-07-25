const categoryModel = require("../models/categoryModel");
const slug = require("slugify");

//create category
exports.createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: true,
        message: "Category Already Exisits",
      });
    }
    const category = await new categoryModel({
      name,
      slug: slug(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "new category created",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Errro in Category",
    });
  }
};

//update category
exports.updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slug(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: `Category updated successfully`,
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: `Error while updating category`,
    });
  }
};

// getAll categories
exports.categoryController = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    res.status(200).send({
      success: true,
      message: `All Categories list`,
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: `Error while getting the categories`,
    });
  }
};

//single category
exports.singleCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: `Get single category successfully`,
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: `error while getting the category`,
    });
  }
};

 //delete category
 exports.deleteCategoryController = async (req,res) =>{
  try {
    const {id} = req.params
    const category = await categoryModel.findByIdAndDelete(id)
    res.status(200).send({
      success:true,
      message:`Category deleted successfully`,
      category,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      error,
      message:`Error while deleting the category`
    })
  }
 }


 
 