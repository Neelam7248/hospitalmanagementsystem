const prisma = require("../src/config/prisma");
const bcrypt = require("bcrypt");

const uploadDoctorDocuments =
  require("../src/utils/uploadDoctorDocuments");

const createDoctorDocuments =
  require("../src/services/doctorDocumentServices");

const generateSignedUrl =
  require("../src/utils/getSignedUrls");

const deleteFromS3 =
  require("../src/utils/deleteObjectfromS3");

const parseMultipart =
  require("../src/middleware/parseMultipart");

const authToken =
  require("../src/utils/authToken");


// ======================================================
// RESPONSE HELPER
// ======================================================

const response = (statusCode, data) => {
  return {
    statusCode,

    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Content-Type,Authorization",
      "Access-Control-Allow-Methods":
        "GET,POST,PUT,DELETE,OPTIONS",
    },

    body: JSON.stringify(data),
  };
};


// ======================================================
// JSON BODY HELPER
// ======================================================

const getJsonBody = (event) => {
  if (!event.body) {
    return {};
  }

  try {
    return typeof event.body === "string"
      ? JSON.parse(event.body)
      : event.body;
  } catch (error) {
    throw new Error("Invalid JSON body");
  }
};


// ======================================================
// CHECK MULTIPART
// ======================================================

const isMultipart = (event) => {
  const contentType =
    event.headers?.["content-type"] ||
    event.headers?.["Content-Type"] ||
    "";

  return contentType
    .toLowerCase()
    .includes("multipart/form-data");
};


// ======================================================
// ADD DOCTOR
// POST /api/v1/doctors
// ======================================================

const addDoctor = async (event) => {
  try {

    // --------------------------------------------------
    // Parse body
    // --------------------------------------------------

    let body = {};
    let files = {};

    if (isMultipart(event)) {

      const parsed = await parseMultipart(event);

      body = parsed.fields;
      files = parsed.files;
      
      console.log("PARSED FIELDS:", body);
      console.log("PARSED FILES:", Object.keys(files));
    

    } else {

      body = getJsonBody(event);
    }


    const {
      firstName,
      lastName,
      email,
      phone,
      password,
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
    } = body;


    // --------------------------------------------------
    // Required fields
    // --------------------------------------------------

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !password ||
      !gender ||
      !specialization ||
      experience === undefined ||
      !qualification ||
      consultationFee === undefined ||
      !address ||
      !city ||
      !state ||
      !country ||
      !postalCode ||
      isAvailable === undefined
    ) {
      return response(400, {
        success: false,
        message: "Please fill all the required fields",
      });
    }


    // --------------------------------------------------
    // AUTH USER
    // --------------------------------------------------

    const authResult = authToken(event);

    if (authResult?.statusCode) {
      return authResult;
    }


    const userId = event.user.userId;


    const authUser =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },

        select: {
          email: true,
          role: true,
        },
      });


    if (!authUser) {
      return response(404, {
        success: false,
        message: "User not found",
      });
    }


    if (
      authUser.role !== "ADMIN" &&
      authUser.role !== "SUPER_ADMIN"
    ) {
      return response(403, {
        success: false,
        message: "Unauthorized user",
      });
    }


    // --------------------------------------------------
    // EMAIL CHECK
    // --------------------------------------------------

    const existingEmail =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });


    if (existingEmail) {
      return response(409, {
        success: false,
        message: "Email is already registered in DB",
      });
    }


    // --------------------------------------------------
    // PASSWORD
    // --------------------------------------------------

    const hashedPassword =
      await bcrypt.hash(password, 10);


    // --------------------------------------------------
    // UPLOAD FILES
    // --------------------------------------------------

    const {
      imageUrl,
      cvData,
      degreeData,
      licenseData,
      certificateData,
    } = await uploadDoctorDocuments(files);


    // --------------------------------------------------
    // TRANSACTION
    // --------------------------------------------------

    const doctor =
      await prisma.$transaction(async (tx) => {

        const user =
          await tx.user.create({
            data: {
              firstName,
              lastName,
              email,
              password: hashedPassword,
              role: "DOCTOR",
              profileImage: imageUrl,
            },
          });


        const doctor =
          await tx.doctor.create({
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

              isAvailable:
                isAvailable === "true" ||
                isAvailable === true,
            },
          });


        // ------------------------------------------------
        // DOCUMENTS
        // ------------------------------------------------

        const documents =
          createDoctorDocuments(
            doctor.id,
            cvData,
            degreeData,
            licenseData,
            certificateData
          );


        if (documents.length > 0) {

          await tx.doctorDocument.createMany({
            data: documents,
          });

        }


        return await tx.doctor.findUnique({

          where: {
            id: doctor.id,
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


    return response(201, {
      success: true,
      message: "Doctor created successfully",
      doctor,
    });


  } catch (error) {

    console.error(
      "ADD DOCTOR ERROR:",
      error
    );

    return response(500, {
      success: false,
      message: "SERVER ERROR",
      error: error.message,
    });
  }
};


// ======================================================
// GET ALL DOCTORS
// GET /api/v1/doctors
// ======================================================

const getAllDoctors = async (event) => {

  try {

    const authResult = authToken(event);

    if (authResult?.statusCode) {
      return authResult;
    }


    const doctors =
      await prisma.doctor.findMany({

        where: {
          isDeleted: false,
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
          createdAt: "desc",
        },
      });


    return response(200, {
      success: true,
      totalDoctors: doctors.length,
      doctors,
    });


  } catch (error) {

    console.error(
      "GET ALL DOCTORS ERROR:",
      error
    );

    return response(500, {
      success: false,
      message: "SERVER ERROR",
      error: error.message,
    });
  }
};


// ======================================================
// GET DOCTOR BY ID
// GET /api/v1/doctors/{id}
// ======================================================

const getDoctorById = async (event) => {

  try {

    const authResult = authToken(event);

    if (authResult?.statusCode) {
      return authResult;
    }


    const id =
      event.pathParameters?.id;


    if (!id) {
      return response(400, {
        success: false,
        message: "Doctor ID is required",
      });
    }


    const doctor =
      await prisma.doctor.findUnique({

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
      return response(404, {
        success: false,
        message: "Doctor not found",
      });
    }


    return response(200, {
      success: true,
      doctor,
    });


  } catch (error) {

    console.error(
      "GET DOCTOR ERROR:",
      error
    );

    return response(500, {
      success: false,
      message: "SERVER ERROR",
      error: error.message,
    });
  }
};


// ======================================================
// VIEW DOCTOR DOCUMENT
// GET /api/v1/doctors/documents/{id}
// ======================================================
const viewDoctorDocument = async (event) => {
  try {
    console.log("=== VIEW DOCUMENT START ===");

    const authResult = authToken(event);

    console.log("AUTH RESULT:", authResult);

    if (authResult?.statusCode) {
      return authResult;
    }

    const id = event.pathParameters?.documentId;

    console.log("DOCUMENT ID:", id);
    console.log("PATH PARAMETERS:", event.pathParameters);

    if (!id) {
      return response(400, {
        success: false,
        message: "Document ID is required",
      });
    }

    console.log("STARTING PRISMA QUERY...");

    const document = await prisma.doctorDocument.findUnique({
      where: {
        id,
      },
    });

    console.log("DOCUMENT FROM DB:", document);

    if (!document) {
      return response(404, {
        success: false,
        message: "Document not found",
      });
    }

    console.log("FILE KEY:", document.fileKey);
    console.log("STARTING SIGNED URL...");

    const signedUrl = await generateSignedUrl(
      document.fileKey
    );

    console.log("SIGNED URL GENERATED:", !!signedUrl);

    return response(200, {
      success: true,
      document: {
        documentType: document.documentType,
        originalName: document.originalName,
        fileName: document.fileName,
        fileKey: document.fileKey,
        mimeType: document.mimeType,
        fileSize: document.fileSize,
        documentUrl: signedUrl,
      },
    });

  } catch (error) {
    console.error("VIEW DOCUMENT ERROR:", error);

    return response(500, {
      success: false,
      message: "SERVER ERROR",
      error: error.message,
    });
  }
};


// ======================================================
// EDIT DOCTOR
// PUT /api/v1/doctors/{id}
// ======================================================

const editDoctor = async (event) => {

  try {

    const authResult = authToken(event);

    if (authResult?.statusCode) {
      return authResult;
    }


    const id =
      event.pathParameters?.id;


    if (!id) {
      return response(400, {
        success: false,
        message: "Doctor ID is required",
      });
    }


    // --------------------------------------------------
    // PARSE BODY
    // --------------------------------------------------

    let body = {};
    let files = {};

    if (isMultipart(event)) {

      const parsed =
        await parseMultipart(event);

      body = parsed.fields;
      files = parsed.files;

    } else {

      body = getJsonBody(event);
    }


    // --------------------------------------------------
    // AUTH USER
    // --------------------------------------------------

    const authUser =
      await prisma.user.findUnique({

        where: {
          id: event.user.userId,
        },

        select: {
          role: true,
        },
      });


    if (
      !authUser ||
      (
        authUser.role !== "ADMIN" &&
        authUser.role !== "SUPER_ADMIN"
      )
    ) {
      return response(403, {
        success: false,
        message: "Unauthorized user",
      });
    }


    // --------------------------------------------------
    // EXISTING DOCTOR
    // --------------------------------------------------

    const existingDoctor =
      await prisma.doctor.findUnique({

        where: {
          id,
        },

        include: {
          user: true,
        },
      });


    if (!existingDoctor) {
      return response(404, {
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
    } = body;


    // --------------------------------------------------
    // EMAIL
    // --------------------------------------------------

    if (
      email &&
      email !== existingDoctor.user.email
    ) {

      const emailExists =
        await prisma.user.findUnique({

          where: {
            email,
          },
        });


      if (emailExists) {
        return response(409, {
          success: false,
          message: "Email already exists",
        });
      }
    }


    // --------------------------------------------------
    // PASSWORD
    // --------------------------------------------------

    let hashedPassword =
      existingDoctor.user.password;


    if (
      password &&
      password.trim() !== ""
    ) {

      hashedPassword =
        await bcrypt.hash(
          password,
          10
        );
    }


    // --------------------------------------------------
    // UPLOAD NEW FILES
    // --------------------------------------------------

    const {
      imageUrl,
      cvData,
      degreeData,
      licenseData,
      certificateData,
    } = await uploadDoctorDocuments(files);


    // --------------------------------------------------
    // DOCUMENT ARRAY
    // --------------------------------------------------

    const documents =
      createDoctorDocuments(
        id,
        cvData,
        degreeData,
        licenseData,
        certificateData
      );


    // --------------------------------------------------
    // TRANSACTION
    // --------------------------------------------------

    const updatedDoctor =
      await prisma.$transaction(
        async (tx) => {

          // --------------------------------------------
          // UPDATE USER
          // --------------------------------------------

          await tx.user.update({

            where: {
              id: existingDoctor.userId,
            },

            data: {

              firstName:
                firstName ??
                existingDoctor.user.firstName,

              lastName:
                lastName ??
                existingDoctor.user.lastName,

              email:
                email ??
                existingDoctor.user.email,

              password:
                hashedPassword,

              profileImage:
                imageUrl ||
                existingDoctor.user.profileImage,
            },
          });


          // --------------------------------------------
          // UPDATE DOCUMENTS
          // --------------------------------------------

          if (documents.length > 0) {

            for (const document of documents) {

              const existing =
                await tx.doctorDocument.findFirst({

                  where: {
                    doctorId: id,
                    documentType:
                      document.documentType,
                  },
                });


              if (existing) {

                await deleteFromS3(
                  existing.fileKey
                );


                await tx.doctorDocument.update({

                  where: {
                    id: existing.id,
                  },

                  data: {
                    originalName:
                      document.originalName,

                    fileName:
                      document.fileName,

                    fileKey:
                      document.fileKey,

                    mimeType:
                      document.mimeType,

                    fileSize:
                      document.fileSize,

                    documentUrl:
                      document.documentUrl,
                  },
                });

              } else {

                await tx.doctorDocument.create({
                  data: document,
                });

              }
            }
          }


          // --------------------------------------------
          // UPDATE DOCTOR
          // --------------------------------------------

          return await tx.doctor.update({

            where: {
              id,
            },

            data: {

              phone:
                phone ??
                existingDoctor.phone,

              gender:
                gender ??
                existingDoctor.gender,

              specialization:
                specialization ??
                existingDoctor.specialization,

              experience:
                experience !== undefined
                  ? Number(experience)
                  : existingDoctor.experience,

              qualification:
                qualification ??
                existingDoctor.qualification,

              consultationFee:
                consultationFee ??
                existingDoctor.consultationFee,

              address:
                address ??
                existingDoctor.address,

              city:
                city ??
                existingDoctor.city,

              state:
                state ??
                existingDoctor.state,

              country:
                country ??
                existingDoctor.country,

              postalCode:
                postalCode ??
                existingDoctor.postalCode,

              isAvailable:
                isAvailable !== undefined
                  ? (
                      isAvailable === "true" ||
                      isAvailable === true
                    )
                  : existingDoctor.isAvailable,
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
        }
      );


    return response(200, {
      success: true,
      message: "Doctor updated successfully",
      doctor: updatedDoctor,
    });


  } catch (error) {

    console.error(
      "EDIT DOCTOR ERROR:",
      error
    );

    return response(500, {
      success: false,
      message: "SERVER ERROR",
      error: error.message,
    });
  }
};


// ======================================================
// DELETE DOCTOR
// DELETE /api/v1/doctors/{id}
// ======================================================

const deleteDoctor = async (event) => {

  try {

    const authResult = authToken(event);

    if (authResult?.statusCode) {
      return authResult;
    }


    const id =
      event.pathParameters?.doctorId;


    if (!id) {
      return response(400, {
        success: false,
        message: "Doctor ID is required",
      });
    }


    const authUser =
      await prisma.user.findUnique({

        where: {
          id: event.user.userId,
        },

        select: {
          role: true,
        },
      });


    if (
      !authUser ||
      (
        authUser.role !== "ADMIN" &&
        authUser.role !== "SUPER_ADMIN"
      )
    ) {
      return response(403, {
        success: false,
        message: "Unauthorized user",
      });
    }


    const doctor =
      await prisma.doctor.findUnique({

        where: {
          id,
        },
      });


    if (!doctor) {
      return response(404, {
        success: false,
        message: "Doctor not found",
      });
    }


    if (doctor.isDeleted) {
      return response(400, {
        success: false,
        message: "Doctor already deleted",
      });
    }


    await prisma.doctor.update({

      where: {
        id,
      },

      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });


    return response(200, {
      success: true,
      message: "Doctor deleted successfully",
    });


  } catch (error) {

    console.error(
      "DELETE DOCTOR ERROR:",
      error
    );

    return response(500, {
      success: false,
      message: "SERVER ERROR",
      error: error.message,
    });
  }
};


// ======================================================
// GET DELETED DOCTORS
// GET /api/v1/doctors/deleted
// ======================================================

const getDeletedDoctors = async (event) => {

  try {

    const authResult = authToken(event);

    if (authResult?.statusCode) {
      return authResult;
    }


    const authUser =
      await prisma.user.findUnique({

        where: {
          id: event.user.userId,
        },

        select: {
          role: true,
        },
      });


    if (
      !authUser ||
      (
        authUser.role !== "ADMIN" &&
        authUser.role !== "SUPER_ADMIN"
      )
    ) {
      return response(403, {
        success: false,
        message: "Unauthorized user",
      });
    }


    const doctors =
      await prisma.doctor.findMany({

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


    return response(200, {
      success: true,
      totalDeletedDoctors:
        doctors.length,
      doctors,
    });


  } catch (error) {

    console.error(
      "GET DELETED DOCTORS ERROR:",
      error
    );

    return response(500, {
      success: false,
      message: "SERVER ERROR",
      error: error.message,
    });
  }
};


// ======================================================
// RESTORE DOCTOR
// PUT /api/v1/doctors/{id}/restore
// ======================================================

const restoreDoctor = async (event) => {

  try {

    const authResult = authToken(event);

    if (authResult?.statusCode) {
      return authResult;
    }


    const id =
      event.pathParameters?.id;


    if (!id) {
      return response(400, {
        success: false,
        message: "Doctor ID is required",
      });
    }


    const doctor =
      await prisma.doctor.findUnique({

        where: {
          id,
        },
      });


    if (!doctor) {
      return response(404, {
        success: false,
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


    return response(200, {
      success: true,
      message: "Doctor restored successfully",
    });


  } catch (error) {

    console.error(
      "RESTORE DOCTOR ERROR:",
      error
    );

    return response(500, {
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// MAIN LAMBDA HANDLER
// ======================================================

const handler = async (event) => {

  try {

    const method =
      event.requestContext?.http?.method;
const path =
  event.rawPath.replace(/^\/prod/, "");


    console.log("METHOD:", method);
    console.log("PATH:", path);


    // --------------------------------------------------
    // CORS
    // --------------------------------------------------

    if (method === "OPTIONS") {
      return response(200, {
        success: true,
      });
    }


    // --------------------------------------------------
    // GET DELETED
    // IMPORTANT: BEFORE /{id}
    // --------------------------------------------------

    if (
      method === "GET" &&
      path === "/api/v1/doctors/deleted"
    ) {
      return await getDeletedDoctors(event);
    }


    // --------------------------------------------------
    // VIEW DOCUMENT
    // --------------------------------------------------

    if (
      method === "GET" &&
      path.startsWith(
        "/api/v1/doctors/documents/"
      )
    ) {
      return await viewDoctorDocument(event);
    }


    // --------------------------------------------------
    // ADD
    // --------------------------------------------------

    if (
      method === "POST" &&
      path === "/api/v1/doctor/addDoctor"
    ) {
      return await addDoctor(event);
    }


    // --------------------------------------------------
    // GET ALL
    // --------------------------------------------------

    if (
      method === "GET" &&
      path === "/api/v1/doctors"
    ) {
      return await getAllDoctors(event);
    }


    // --------------------------------------------------
    // RESTORE
    // --------------------------------------------------

    if (
      method === "PUT" &&
      path.startsWith(
        "/api/v1/doctors/"
      ) &&
      path.endsWith("/restore")
    ) {
      return await restoreDoctor(event);
    }


    // --------------------------------------------------
    // GET BY ID
    // --------------------------------------------------

    if (
      method === "GET" &&
      path.startsWith(
        "/api/v1/doctors/"
      )
    ) {
      return await getDoctorById(event);
    }


    // --------------------------------------------------
    // UPDATE
    // --------------------------------------------------

    if (
      method === "PUT" &&
      path.startsWith(
        "/api/v1/doctors/"
      )
    ) {
      return await editDoctor(event);
    }


    // --------------------------------------------------
    // DELETE
    // --------------------------------------------------

    if (
      method === "DELETE" &&
      path.startsWith(
        "/api/v1/doctors/"
      )
    ) {
      return await deleteDoctor(event);
    }


    // --------------------------------------------------
    // NOT FOUND
    // --------------------------------------------------

    return response(404, {
      success: false,
      message: "Doctor route not found",
    });


  } catch (error) {

    console.error(
      "DOCTOR LAMBDA ERROR:",
      error
    );

    return response(500, {
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
  handler,
};