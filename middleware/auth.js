const User = require("../models/user");
const jwt = require('jsonwebtoken');

const jwtSecretKey= "1234";

const authMiddleWare = async(req,res,next)=>{
    const token = req.headers.authorization;
    if(!token){
        json.status(404).json({
            success:false,
        message : "token is required",
        })
        
    }
    try{
        jwt.verify(token, jwtSecretKey);
    }catch{
        return res.status(400).json({
            success:false,
            message:"Invalid JWT"
        })
    }

    const decodedToken = jwt.decode(token);
    const now = Math.floor(Date.now()/1000);
    if(now > decodedToken.exp){
        return res.status(404).json({
            success:false,
            message:"Token expired,please re login"
        });
    }
   

    const user  = await User.findById(decodedToken._id);
    if(user.token !== token){
        return res.status(404).json({
            success:false,
            message:"Invalid JWT",
        })
    }

    req.user = user;

    next();
}
module.exports = authMiddleWare;