const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const uploadDoctorDocuments = require("../utils/uploadDoctorDocuments");
const createDoctorDocuments = require("../services/doctorDocumentServices");
const generateSignedUrl=require("../utils/getSignedUrls");

const deleteFromS3=require("../utils/deleteObjectfromS3");
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
}catch (err) {
  console.error("ADD DOCTOR ERROR:");
  console.error(err);

  return res.status(500).json({
    success: false,
    message: "SERVER ERROR",
    error: err.message,
  });
}}



//get all user
const getAllDoctors = async (req, res) => {
  try {

    const doctors = await prisma.doctor.findMany({
      where:{
        isDeleted:false
      },
      include:{
        user:{
          select:{
            firstName:true,
            lastName:true,
            email:true,
            profileImage:true,
          }
        },
        documents:true
      },
      orderBy:{
        createdAt:"desc"
      }
    });


    return res.status(200).json({
      success:true,
      totalDoctors:doctors.length,
      doctors
    });


  } catch(err){

    return res.status(500).json({
      success:false,
      message:"SERVER ERROR",
      error:err.message
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

const viewDoctorDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await prisma.doctorDocument.findUnique({
      where: {
        id,
      },
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    const signedUrl = await generateSignedUrl(document.fileKey);

    return res.status(200).json({
      success: true,
      url: signedUrl,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "SERVER ERROR",
      error: err.message,
    });
  }
};
const editDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    // Check logged-in user
    const authUser = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
      select: {
        role: true,
      },
    });

    if (
      !authUser ||
      (authUser.role !== "ADMIN" &&
        authUser.role !== "SUPER_ADMIN")
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    // Find doctor
    const existingDoctor = await prisma.doctor.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });

    if (!existingDoctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const {
      firstName,
      lastName,
        email,
  password,
      
      phone,
      gender,
      specialization,
      experience,
      qualification,
      consultationFee,
      address,
      city,
      state,
      country,
      postalCode,
      isAvailable,
    } = req.body;
if (email !== existingDoctor.user.email) {
  
  const emailExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (emailExists) {
    return res.status(409).json({
      success: false,
      message: "Email already exists.",
    });
  }
}
/*Agar password nahi bheja gaya to purana password use hoga.
Agar naya password aaya to hash hoga.*/

let hashedPassword = existingDoctor.user.password;

if (password && password.trim() !== "") {
  hashedPassword = await bcrypt.hash(password, 10);
}
const {
  imageUrl,
  cvData,
  degreeData,
  licenseData,
  certificateData,
} = await uploadDoctorDocuments(req.files);
const documents = createDoctorDocuments(
  id,
  cvData,
  degreeData,
  licenseData,
  certificateData
);
    const updatedDoctor = await prisma.$transaction(async (tx) => {

      // Update User Table
  await tx.user.update({
  where: {
    id: existingDoctor.userId,
  },
  data: {
    firstName,
    lastName,
    email,
    password: hashedPassword,
    profileImage:
      imageUrl || existingDoctor.user.profileImage,
  },
});
if (documents.length > 0) {
for (const document of documents) {

  const existing = await tx.doctorDocument.findFirst({
    where: {
      doctorId: id,
      documentType: document.documentType,
    },
  });

  if (existing) {
    
    await deleteFromS3(existing.fileKey);
    await tx.doctorDocument.update({
      where: {
        id: existing.id,
      },
      data: {
        originalName: document.originalName,
        fileName: document.fileName,
        fileKey: document.fileKey,
        mimeType: document.mimeType,
        fileSize: document.fileSize,
        documentUrl: document.documentUrl,
      },
    });
  } else {
    await tx.doctorDocument.create({
      data: document,
    });
  }

}}// Update Doctor Table
    return  await tx.doctor.update({
        where: {
          id,
        },
        data: {
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
          isAvailable:
            isAvailable === "true" ||
            isAvailable === true,
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
      });
  
    return res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      doctor: updatedDoctor,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "SERVER ERROR",
      error: err.message,
    });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    // Check logged-in user
    const authUser = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
      select: {
        role: true,
      },
    });

    if (
      !authUser ||
      (authUser.role !== "ADMIN" &&
        authUser.role !== "SUPER_ADMIN")
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    // Find doctor
    const doctor = await prisma.doctor.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        documents: true,
      },
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    if (doctor.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Doctor already deleted",
      });
    }

    // Soft Delete
    await prisma.doctor.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
  deletedAt:new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
    });

  } catch (err) {
    console.error("DELETE DOCTOR ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "SERVER ERROR",
      error: err.message,
    });
  }
};

const getDeletedDoctors = async (req, res) => {
  try {

    // Check logged-in user
    const authUser = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
      select: {
        role: true,
      },
    });


    if (
      !authUser ||
      (authUser.role !== "ADMIN" &&
        authUser.role !== "SUPER_ADMIN")
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized user",
      });
    }


    // Fetch deleted doctors
    const doctors = await prisma.doctor.findMany({
      where: {
        isDeleted: true,
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
      orderBy: {
        deletedAt: "desc",
      },
    });


    return res.status(200).json({
      success: true,
      totalDeletedDoctors: doctors.length,
      doctors,
    });


  } catch (err) {

    console.error("GET DELETED DOCTORS ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "SERVER ERROR",
      error: err.message,
    });

  }
};
const restoreDoctor = async (req, res) => {

    try {

        const { id } = req.params;

        const doctor = await prisma.doctor.findUnique({
            where: {
                id,
            },
        });

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found",
            });
        }

        await prisma.doctor.update({
            where: {
                id,
            },
            data: {
                isDeleted: false,
                deletedAt: null,
            },
        });

        return res.status(200).json({
            message: "Doctor restored successfully.",
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: error.message,
        });

    }

};

module.exports = {
  addDoctor,
  getAllDoctors,
  getDoctorById,
editDoctor,  
viewDoctorDocument,
deleteDoctor,
getDeletedDoctors,
restoreDoctor,
};