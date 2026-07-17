const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const JWT=require("jsonwebtoken");
require ("dotenv").config();
const JWT_SECRET=process.env.JWT_SECRET;
const uploadToCloudinary=require("../utils/cloudinaryUploadLogic");



const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
let imageUrl = null;

if (req.file) {
  const uploadedImage = await uploadToCloudinary(req.file.buffer);
  imageUrl = uploadedImage.secure_url;
}
  
console.log(req.file);
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        profileImage:imageUrl,
      },
    });

    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const signIn=async(req,res)=>{

    try{
        const {email,password}=req.body;
        if(!email||!password){
            return res.status(400).json({message:"Please send all the required fields"})
        }
    const existingEmail=await prisma.user.findUnique({
        where:{
            email,
        },
    })

if(!existingEmail){
    return res.status(404).json({message:"Email is not registered or signup first with this email please"})
}
const isMatch= await bcrypt .compare(password,existingEmail.password)
if(!isMatch){
    return res.status(401).json({message:"pasword is wrong ,Please try with correct password"})
}    
const token=JWT.sign({
    userId:existingEmail.id,
    email:existingEmail.email,
    role:existingEmail.role,
},JWT_SECRET,{expiresIn:"1h"})
res.status(200).json({message:"signin Successfull",user:{email:existingEmail.email,id:existingEmail.id,role:existingEmail.role},token})
}catch(err){
res.status(500).json({message:"SERVER ERROR",error:err.message})
}
}


const getProfile=async(req,res)=>{
    try{
    const userId=req.user.userId;

    if(!userId){
        return res.status(401).json({message:"you are unauthorized to get profile"});
    }
const profile=await prisma.user.findUnique({
    where:{id:userId},
select:{
    id:true,
    firstName:true,
    lastName:true,
    email:true,
    role:true,
    profileImage:true,
    createdAt:true,
}


})
if(!profile){
    return res.status(404).json({message:"No profile is found"})
}

res.status(200).json({message:"profile fetched successfully",profile})
    }catch(err){
        res.status(500).json({message:"server error",error:err.message})
    }
}

const updateProfile=async(req,res)=>{
    try{
        const id=req.user.userId;
        const{firstName,lastName,profileImage}=req.body;
if(!firstName||!lastName){
    return res.status(400).json({message:"please fill all the fields"})
}
        const profile=await prisma.user.update({
            where:{
                id:id,
            },
data:{
    firstName,lastName,profileImage
}

        })
 
 res.status(200).json({message:"profile is updated successfully",profile})
    }catch(err){
        res.status(500).json({message:"Server error",error:err.message})
    }
}




const passwordChange=async(req,res)=>{

    try{
        const id=req.user.userId;
        
        const {oldPassword ,newPassword}=req.body;

        if(!oldPassword||!newPassword){
            return res.status(400).json({message:"please give both passwords"})
        }



        const olduser=await prisma.user.findUnique({
            where:{
                id
            }

        })

        if(!olduser){
            return res.status(404).json({message:"no user found"})
        }
        const isMatch=await bcrypt.compare(oldPassword,olduser.password);
if(!isMatch){
    return res.status(400).json({message:"old password didnot match ,please type correct password to change passwod first"})
}

const hashedPassword=await bcrypt.hash(newPassword,10);

const user=await prisma.user.update({
    where:{id},
    data:{password:hashedPassword},
    select:{
        id:true,firstName:true,lastName:true,email:true,profileImage:true,
    }
})
res.status(200).json({message:"password changed successfully",user})
    }catch(err){
        res.status(500).json({message:"SERVER ERROR",error:err.message})
    }
}
module.exports = {
  registerUser,
signIn,
getProfile,
updateProfile,
passwordChange,
};