
const authorise=(permittedRoles)=>{
    return (req,res,next)=>{
         const userRole=req.User.role
         if(permittedRoles.includes(userRole)){
             next()
         }else{
          res.send("Unauthorized")
         }
    }
  }

module.exports={
    authorise
}