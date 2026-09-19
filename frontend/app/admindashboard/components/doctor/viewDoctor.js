"use client";
import axios from "axios";
import { getToken } from "@/utils/auth";
export default function ViewDoctor({ doctor, onClose }) {
  if (!doctor) return null;
console.log(doctor.documents);

const handleViewDocument = async (id) => {
  console.log("=== VIEW BUTTON CLICKED ===");
  console.log("DOCUMENT ID:", id);

  try {
    const token = getToken();

    console.log("TOKEN EXISTS:", !!token);

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/doctors/documents/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("DOCUMENT RESPONSE:", response.data);

    const documentUrl = response.data.document.documentUrl;

    console.log("DOCUMENT URL:", documentUrl);

    window.open(documentUrl, "_blank");

  } catch (err) {
    console.log("DOCUMENT ERROR:", err);
    console.log("STATUS:", err.response?.status);
    console.log("DATA:", err.response?.data);

    alert(
      err.response?.data?.message ||
      "Unable to open document."
    );
  }
};

  return (
    <div className="fixed inset-0 bg-black/50 text-black flex justify-center items-center z-50">
      <div className="bg-white w-[700px] rounded-lg shadow-xl p-6 overflow-y-auto max-h-[90vh]">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black">
            Doctor Details
          </h2>

          <button
            onClick={onClose}
            className="text-red-600 text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-5 mb-8">
          {doctor.user.profileImage ? (
            <img
              src={doctor.user.profileImage}
              alt="Doctor"
              className="w-28 h-28 rounded-full object-cover"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center">
              No Image
            </div>
          )}

          <div>
            <h3 className="text-2xl font-semibold">
              {doctor.user.firstName} {doctor.user.lastName}
            </h3>

            <p>{doctor.user.email}</p>

            <p>{doctor.specialization}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">

          <div>
            <strong>Phone</strong>
            <p>{doctor.phone}</p>
          </div>

          <div>
            <strong>Gender</strong>
            <p>{doctor.gender}</p>
          </div>

          <div>
            <strong>Experience</strong>
            <p>{doctor.experience} Years</p>
          </div>

          <div>
            <strong>Qualification</strong>
            <p>{doctor.qualification}</p>
          </div>

          <div>
            <strong>Consultation Fee</strong>
            <p>{doctor.consultationFee}</p>
          </div>

          <div>
            <strong>Availability</strong>
            <p>
              {doctor.isAvailable
                ? "Available"
                : "Not Available"}
            </p>
          </div>

          <div className="col-span-2">
            <strong>Address</strong>

            <p>
              {doctor.address}, {doctor.city},{" "}
              {doctor.state}, {doctor.country}
            </p>

            <p>{doctor.postalCode}</p>
          </div>

        </div>

        {/* Documents */}

        <div className="mt-8">

          <h3 className="text-xl font-semibold mb-3">
            Documents
          </h3>

          {doctor.documents?.length > 0 ? (
            <div className="space-y-2">

              {doctor.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex justify-between border rounded p-3"
                >
                  <span>{doc.documentType}</span>
<button
  onClick={() => handleViewDocument(doc.id)}
  className="text-blue-600 underline"
>
  View
</button>
                </div>
              ))}

            </div>
          ) : (
            <p>No Documents Uploaded.</p>
          )}

        </div>

      </div>
    </div>
  );
}