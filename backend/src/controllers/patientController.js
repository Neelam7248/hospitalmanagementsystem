const prisma = require("../config/prisma");
//const uploadPatientDocuments = require("../utils/uploadPatientDocuments");
const createPatientDocuments = require("../services/patientDocumentServices");
const generateSignedUrls = require("../utils/getSignedUrls");
const generateMRN = require("../utils/generateMRNO");
const uploadToCloudinary = require("../utils/cloudinaryUploadLogic");

const addPatient=async(req,res)=>{


    try{//authentication
const id=req.user.userId;
if(!id){
    return res.status(400).json({message:"please provide a valid Token"})
}//authorization
const user=await prisma.user.findUnique({
    where:{id},
    select:{
        role:true,
        email:true,

    }
})
if (!user) {
  return res.status(404).json({
    message: "User not found",
  });
}

if(user.role!=="ADMIN"){
    return res.status(403).json({message:"Only admin can addPatients and you are not authorized"})
}


        
        // // Validation
const {
  firstName,
  lastName,
  phone,
  email,
  bloodGroup,
  maritalStatus,
  gender,
  dateOfBirth,
  address,
  city,
  state,
  country,
  postalCode,
  emergencyContactName,
  emergencyContactPhone,
  status,
} = req.body;
    // Generate MRN
    const medicalRecordNumber = await generateMRN();
    // Upload profile imageconst {
 const{ imageUrl,
  uploadedDocuments,
} = await uploadPatientDocuments(req.files);

    // Prisma transaction
const patient=await prisma.$transaction(async(tax)=>{
    const patient=await tax.patient.create({
        data:{
 
            email,  
 
 medicalRecordNumber: medicalRecordNumber,profileImage:imageUrl,
  firstName    ,
  lastName     ,
phone ,
    
   bloodGroup,
maritalStatus , 
     gender ,
    dateOfBirth,
address,
city ,
state ,
country ,
postalCode ,
emergencyContactName ,
emergencyContactPhone ,
status,


        }
    })


    await tax.patientDocuments.createMany({
        data:documents
    })
    return patient;
})


// Response

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports={addPatient,};