const mongoose=require("mongoose")

const userSchema={
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        default:"seller",
        enum:["seller","buyer"]
    }
}

const UserModel=mongoose.model("User",userSchema)

module.exports={
    UserModel
}