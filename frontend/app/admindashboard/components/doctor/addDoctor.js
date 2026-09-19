"use client";

import { useState } from "react";
import axios from "axios";

import PersonalInfo from "../doctor/personelInfo";
import ProfessionalInfo from "../doctor/professionalInfo";
import AddressInfo from "../doctor/addressInfo";
import DocumentUpload from "../doctor/documentUpload";

import { getToken } from "@/utils/auth";
const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  gender: "",
  specialization: "",
  experience: "",
  qualification: "",
  consultationFee: "",
  isAvailable: true,
  address: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  profileImage: null,
  cv: null,
  degree: null,
  license: null,
  certificate: null,
};


export default function DoctorForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [message, setMessage] = useState("");
const [error, setError] = useState("");
  // Handle Text Fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle File Upload
  const handleFileChange = (e) => {
    const { name, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
setMessage("");
setError("");
  try {
    setLoading(true);

    const data = new FormData();

for (const key in formData) {
  if (formData[key] !== null && formData[key] !== "") {
    data.append(key, formData[key]);
  }
}
    const token = getToken()
console.log("TOKEN EXISTS:", !!token);
console.log("TOKEN LENGTH:", token?.length);
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/doctor/addDoctor`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
setMessage(response.data.message);

    // Reset Form
    //setFormData(initialFormData);

  } catch (error) {
    setError(
  error.response?.data?.message || "Something went wrong"
);
    console.log(error);

  
  } finally {
    setLoading(false);
  }
};
return (
  <div className="max-w-6xl mx-auto">

    <h1 className="text-3xl font-bold mb-8 text-center">
      Add Doctor
    </h1>

  {message && (
  <div className="bg-green-100 text-green-700 p-3 rounded-lg">
    {message}
  </div>
)}

{error && (
  <div className="bg-red-100 text-red-700 p-3 rounded-lg">
    {error}
  </div>
)}
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      <PersonalInfo
        formData={formData}
        handleChange={handleChange}
      />

      <ProfessionalInfo
        formData={formData}
        handleChange={handleChange}
      />

      <AddressInfo
        formData={formData}
        handleChange={handleChange}
      />

      <DocumentUpload
        handleFileChange={handleFileChange}
      />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
        >
          {loading ? "Adding..." : "Add Doctor"}
        </button>
      </div>

    </form>

  </div>
);
}
