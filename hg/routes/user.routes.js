const express=require("express")
const {UserModel}=require("../models/user.model")
const bcrypt=require("bcrypt")
const userRoute=express.Router()
var jwt = require('jsonwebtoken');
const {blacklist}=require("../config/blacklist");
const { authMiddleware } = require("../middleware/authentication");
const { authorise } = require("../middleware/authorize");

userRoute.post("/signup",async(req,res)=>{
    try{
         const {email,password,role}=req.body
       
         ///checking if user exists already
         const isUserExist=await UserModel.findOne({email})

         if(isUserExist){
            return res.send({"msg":"User already exist"})
         }

         ///hasing the password
         const hashedPassword = bcrypt.hashSync(password, 8);
         const user=new UserModel({email,password:hashedPassword,role})
         await user.save()

        res.send({"Msg":"Account created successfully"})


    }
    catch(err){
        res.send(err)
    }
})


userRoute.post("/login",async(req,res)=>{
    try{
          const {email,password}=req.body

          const user=await UserModel.findOne({email})
          if(!user){
           res.send("Invalid email")
          }
            
          const isPasswordMatch=await bcrypt.compare(password, user.password);

        
          if(!isPasswordMatch){
           res.send("enter valid credentials")
          }

          ///create token

          const token=jwt.sign({userID: user._id}, process.env.JwtKey, { expiresIn: 60 });

          ///create refresh token
             
          const refreshToken=jwt.sign({userID: user.userID}, process.env.refreshJwtKey, { expiresIn: 300 });

          res.send({"msg":"Login successful",token,refreshToken})
    }
    catch(err){
     console.log(err)
    }
   
 })

 userRoute.get("/getnewtoken",(req,res)=>{
    const refreshtoken=req.headers?.authorization?.split(' ')[1]

    if(!refreshtoken){
        res.send("login first")
    }

    jwt.verify(refreshtoken, process.env.refreshJwtKey, (err, decoded)=> {
        if(err){
            res.send("plz login first")
        }else{
            let user=decoded
            const token=jwt.sign({userID: user.userID}, process.env.JwtKey, { expiresIn: 60 });
            res.send({"msg":"Login successful",token})
        }
      });

      res.send("new normal token")

 })


 
 

  userRoute.get("/products",authMiddleware,(req,res)=>{
    res.send("products...")
  })

  userRoute.get("/addproducts",authMiddleware,authorise(["seller"]),(req,res)=>{
    res.send("add products...")
  })

  userRoute.get("/deleteproducts",authMiddleware,authorise(["seller"]),(req,res)=>{
    res.send("delete products...")
  })


  userRoute.get("/logout",(req,res)=>{
    blacklist.push(req.headers?.authorization?.split(' ')[1])

    res.send("logout successful")
  })


module.exports={
    userRoute
}