const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const uploadDoctorDocuments = require("../utils/uploadDoctorDocuments");
const createDoctorDocuments = require("../services/doctorDocumentServices");
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
  lastName, email, phone           ,

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
// Prisma transaction

const {
  imageUrl,
  cvData,
  degreeData,
  licenseData,
  certificateData,
} = await uploadDoctorDocuments(req.files);



const doctor = await prisma.$transaction(async (tx) => {
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

const doctor= await tx.doctor.create({
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
const documents = createDoctorDocuments(
  doctor.id,
  cvData,
  degreeData,
  licenseData,
  certificateData,
);
  await tx.doctorDocument.createMany({
  data: documents,
});

return await tx.doctor.findUnique({
    where:{
      id: doctor.id
    },
    include:{
      documents:true
    }
  });


});
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




//get all user
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true,
          },
        },
        documents: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      totalDoctors: doctors.length,
      doctors,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "SERVER ERROR",
      error: err.message,
    });
  }
};


//get one dr by id
const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await prisma.doctor.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true,
          },
        },
        documents: true,
      },
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      doctor,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "SERVER ERROR",
      error: err.message,
    });
  }
};


module.exports = {
  addDoctor,
  getAllDoctors,
  getDoctorById,
};