const productModel = require("../models/productModel");
const fs = require("fs");
const slugify = require("slugify");
const categoryModel = require("../models/categoryModel")
const orderModel = require("../models/orderModel")
const braintree = require("braintree");
const dotenv = require("dotenv")

dotenv.config()

//payment gateway
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

//create products
exports.createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: `Name is required` });
      case !description:
        return res.status(500).send({ error: `Description is required` });
      case !price:
        return res.status(500).send({ error: `Price is required` });
      case !category:
        return res.status(500).send({ error: `Category is required` });
      case !quantity:
        return res.status(500).send({ error: `Quantity is required` });
      case !photo :
        return res
          .status(500)
          .send({ error: `Photo is required ` });
    }
    const slug = slugify(name);
    const products = new productModel({
      ...req.fields,
      slug: slug,
    });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: `Product craeted successfully`,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: `Error while createing category`,
    });
  }
};

//get all products
exports.getProductController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const totalProducts = await productModel.countDocuments(); 

    const products = await productModel
      .find()
      .populate("category")
      .select("-photo")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      total_count: totalProducts,
      current_page: page,
      total_pages: Math.ceil(totalProducts / limit),
      message: `Products page ${page}`,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: `Error while getting the products`,
    });
  }
};


//getSingleProduct
exports.getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: `Single Product Fetched`,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: `Error while getting the single product`,
    });
  }
};

//get photo
exports.productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");

    if (!product || !product.photo || !product.photo.data) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    res.set("Content-type", product.photo.contentType);
    return res.status(200).send(product.photo.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error while getting the photo',
    });
  }
};


//delete product
exports.deleteProductController = async (req, res) => {
    try {
      await productModel.findByIdAndDelete(req.params.pid).select("-photo");
      res.status(200).send({
        success: true,
        message: "Product Deleted successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error while deleting product",
        error,
      });
    }
  };

  //update-category
  exports.updateProductController = async (req, res) => {
    try {
      const { name, description, price, category, quantity, shipping } =
        req.fields;
      const { photo } = req.files;
      //alidation
      switch (true) {
        case !name:
          return res.status(500).send({ error: "Name is Required" });
        case !description:
          return res.status(500).send({ error: "Description is Required" });
        case !price:
          return res.status(500).send({ error: "Price is Required" });
        case !category:
          return res.status(500).send({ error: "Category is Required" });
        case !quantity:
          return res.status(500).send({ error: "Quantity is Required" });
        case photo && photo.size > 1000000:
          return res
            .status(500)
            .send({ error: "photo is Required and should be less then 1mb" });
      }
  
      const products = await productModel.findByIdAndUpdate(
        req.params.pid,
        { ...req.fields, slug: slugify(name) },
        { new: true }
      );
      if (photo) {
        products.photo.data = fs.readFileSync(photo.path);
        products.photo.contentType = photo.type;
      }
      await products.save();
      res.status(201).send({
        success: true,
        message: "Product Updated Successfully",
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error in Updte product",
      });
    }
  };

  //filetr-conroller
exports.productFilterController = async (req,res)=>{
    try {
      const {checked,radio} = req.body
      let args ={}
      if(checked.length>0) args.category = checked
      if(radio.length) args.price= {$gte: radio[0] , $lte:radio[1]}
      const products = await productModel.find(args)
      res.status(200).send({
        success:true,
        products,
      })
    } catch (error) {
      console.log(error)
      res.status(400).send({
        success:false,
        message:`Error while filtering`,
        error
    })
      
  }
}

// product count
exports.productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};


// product list base on page
exports.productListController = async (req, res) => {
  try {
    const perPage = 4;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

//search controller

exports.searchProductController= async(req,res)=>{
  try {
    const {keyword} = req.params
    const result = await productModel.find({
      $or:[
        {name:{$regex : keyword, $options:"i"}},
        {description:{$regex : keyword, $options:"i"}}
      ]
    }).select("-photo")
    res.json(result)
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success:false,
      message:"Error in Search Product Api",
      error,
    })
  }
}


//realted product controller

exports.relatedProductController = async(req,res)=>{
  try {
    const {pid,cid} = req.params
    const products = await productModel.find({
      category:cid,
      _id:{$ne:pid},
    }).select("-photo").populate("category");
    res.status(200).send({
      success:true,
      products,
    })
    
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success:false,
      message:"error while getting related products",
      error,
    })
    
  }
}


//get product by cat

exports.productCategoryController = async(req,res) =>{
  try {
    const category = await categoryModel.findOne({slug:req.params.slug})
    const product = await productModel.find({category}).populate("category")
    res.status(200).send({
      success:true,
      category,
      product,
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success:false,
      error,
      message:"Error while Getting category"
    })
    
  }
}

//Payment control api
 exports.braintreeTokenController = async(req,res) => {
  try {
    gateway.clientToken.generate({}, function(err,resp){
      if(err)
        res.status(500).send(err)
      else{
        res.send(resp)
      }
    })
  } catch (error) {
    console.log(error)
    
  }
 }

//payment controller

exports.braintreePaymentsController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;

    cart.forEach((item) => {
      total += item.price;
    });

    total = total.toFixed(2);

    gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      async function (error, result) {
        if (error) {
          return res.status(500).json({ success: false, message: error.message });
        }

        if (result.success) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          });
          await order.save();
          res.json({
            success: true,
            message: "Payment successful",
          });
        } else {
          res.status(500).json({ success: false, message: result.message });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
