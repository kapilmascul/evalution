const express=require("express")
const { connection } = require("./config/connection")
const {userRoute}=require("./routes/user.routes")
require('dotenv').config()
const app=express()

app.use(express.json())

app.use("/users",userRoute)
  

app.listen(process.env.port,async(req,res)=>{
    try{
        await connection
        console.log("Connected to DB")
        console.log(`server is running at port${process.env.port}`)
    }catch(err){
         console.log(err)
    }
})