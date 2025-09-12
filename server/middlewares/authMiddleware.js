const JWT = require("jsonwebtoken");
const userModel = require("../models/userModel");

// //protected routes token based
exports.requireSignin = async (req, res, next) => {
  try {
    // Check if Authorization header exists
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      throw new Error("Invalid token format");
    }
    
    // Extract the token part
    const token = authorizationHeader.split(" ")[1];

    // Verify the token
    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user information to the request object
    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

//admin access
exports.isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
        success:false,
        error,
        message:"Error in admin middleware"
    })
  }
};


