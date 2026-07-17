const JWT=require("jsonwebtoken");
require ("dotenv").config();
const JWT_SECRET=process.env.JWT_SECRET;
const auth=async(req,res,next)=>{
    const authHeader= req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({message:"no token is provided"})
    }

    if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
        message: "Invalid Authorization Header",
    });
}

const token=authHeader.split(" ")[1];
try{
    if(!token){
        return res.status(400).json ({message:"No token Provided"})
    }
    const decode=JWT.verify(token,JWT_SECRET)
req.user={
    userId:decode.userId,
    email:decode.email,
    role:decode.role,

}

next();
}catch(err){
if(err.name==="TokenExpiredError"){
    return res.status(400).json({message:"token is expired or session is expired"})
}
res.status(401).json({message:"Invalid Token"})

}


}
module.exports=auth;