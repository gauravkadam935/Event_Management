const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/user.js");
const validateRegistrationData = require("../validation/register.js");
// const { isValidObjectId } = require('mongoose');

const jwtSecretKey= "1234";
const logger = require("../utils/logger.js");
const registerUser = async (req,res)=>{

    const err = validateRegistrationData(req.body);
    if(err.hasError){
        return res.status(404).json({
            sucess:false,
            message:err.message,
        })
    }
    const userDetails = {
        name:req.body.name,
        email:req.body.email,
    };
    const plainTextPassword = req.body.password;

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(plainTextPassword,salt);

    userDetails.password = hashedPassword;

    const user = new User(userDetails);
    await user.save();
    res.json({
        sucess:true,
        message:"User registred successfully"
    })
};

const loginUser = async (req,res)=>{
    const email = req.body.email;
    const plainTeaxtPassword = req.body.password;

    const user = await User.findOne({
        email:email,
    });
    if(!user){
        res.status(404).json({
            success:false,
            message:"User do not exists,please register first"
        });
    }
    const hashedPassword = await user.password;
    const isPassword = await bcrypt.compare(plainTeaxtPassword,hashedPassword);
    console.log(isPassword);
    if(!isPassword){
        return res.status(404).json({
            sucess:false,
            message:"Incorrect username or password",
        })
    }

    logger.info("LOGIN_SUCCESSFUL", {timestamp: new Date(), email:user.email});
    const payload = {
        exp: Math.floor((Date.now()/ 1000)+3600),
        email:user.email,
        _id:user._id,
    };
    

    const token = jwt.sign(payload,jwtSecretKey);

    await User.findByIdAndUpdate(user._id,{token:token});
    console.log(isPassword);
    res.json({
        sucess:true,
        token:token,
    })
};

const logoutUser= async(req,res)=>{

    const decodedToken =jwt.decode(req.headers.authorization);
    console.log(decodedToken);
    await User.findById(decodedToken._id,{token:""});
    res.json({
        success:true,
        message:"User logout seccessfully",
    });
};

module.exports ={
    registerUser,
    loginUser,
    logoutUser,
}