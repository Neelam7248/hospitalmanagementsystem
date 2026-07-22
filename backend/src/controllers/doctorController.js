const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const uploadToCloudinary = require("../utils/cloudinaryUploadLogic");

const addDoctor=async(req,res)=>{
    try{
        const id=req.user.userId;
    const authUser=await prisma.user.findUnique({where:{
        id
    },
    select:{
email:true,
role:true,
    }
})    
if (!authUser) {
  return res.status(404).json({
    message: "User not found"
  });
}

if (
  authUser.role !== "ADMIN" &&
  authUser.role !== "SUPER_ADMIN"
) {
  return res.status(403).json({
    message: "Unauthorized user",
  });
}        const{
            firstName    ,
  lastName       ,
  email           ,
  phone           ,
password,
  gender          ,
  specialization  ,

  experience      ,

  qualification   , consultationFee ,

  
  address   ,      

  city           ,

  state          ,

  country      ,

  postalCode    ,

  isAvailable    ,

  }=req.body;

  let imageUrl = null;

if (req.file) {
  const uploadedImage = await uploadToCloudinary(req.file.buffer);
  imageUrl = uploadedImage.secure_url;
}
  
console.log(req.file);

if (!     firstName    ||
  !lastName       ||
  !email           ||
  !phone           ||


  !gender          ||
  !specialization  ||

  !experience      ||

  !qualification ||
  !  consultationFee ||
!password ||
  !address   ||      

  !city           ||

  !state          ||

  !country      ||

  !postalCode    ||

  isAvailable===undefined    
){
    return res.status(400).json ({message:"please fill all the required fields"});
}

const existingEmail=await prisma.user.findUnique({
    where:{
        email
    }
})
;
if (existingEmail){
    return res. status(409).json ({message:"Email is already registered  in db"})
}
const hashedPassword=await bcrypt.hash(password,10);
const doctor= await prisma.$transaction(async(tx)=>{
const user = await tx.user.create({
  data: {
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: "DOCTOR",
    profileImage: imageUrl,
  },
});
const doctor = await tx.doctor.create({
  data: {
    userId: user.id,
    phone,
    gender,
    specialization,
    experience: Number(experience),
    qualification,
    consultationFee,
    address,
    city,
    state,
    country,
    postalCode,
    isAvailable: isAvailable === "true",
  },
});
return doctor;
})

return res.status(201).json({
  message: "Doctor created successfully",
  doctor,
});
}catch(err){
    return res.status(500).json({
        message:"SERVER ERROR",error:err.message,
success:false
    })
}  
}
module.exports={addDoctor,};
