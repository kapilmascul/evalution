const {blacklist}=require("../config/blacklist")
var jwt = require('jsonwebtoken');
const {UserModel}=require("../models/user.model")


const authMiddleware=async(req,res,next)=>{
    try{
        const token=req.headers.authorization.split(' ')[1]
    
    if(blacklist.includes(token)){
        return res.send("Pls login again")
    }
    const decodedToken = jwt.verify(token, process.env.JwtKey);

    console.log(decodedToken)
    
    const { userID } = decodedToken;

    // Check if the user exists
    const user = await UserModel.findById(userID);
    if (!user) {
      return res.status(401).json({ message: 'unauthorized' });
    }
        console.log(user)
    // // Attach the user to the request object
    req.User = user;

    next();
    }
  catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
    console.log(error)
  }
};

module.exports = {authMiddleware};  