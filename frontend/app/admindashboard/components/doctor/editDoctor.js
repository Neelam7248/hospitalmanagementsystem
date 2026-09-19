"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { getToken } from "@/utils/auth";

import PersonalInfo from "./personelInfo";
import ProfessionalInfo from "./professionalInfo";
import AddressInfo from "./addressInfo";
import DocumentUpload from "./documentUpload";export default function EditDoctor({
  doctor,
  onClose,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
 
  const [formData, setFormData] = useState(doctor);
 
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
  if (doctor) {
    setFormData({
      ...doctor,
      profileImage: null,
      cv: null,
      degree: null,
      license: null,
      certificate: null,
    });
  }
}, [doctor]);
  const handleFileChange = (e) => {
    const { name, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = getToken();

      const data = new FormData();

      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== "") {
          data.append(key, formData[key]);
        }
      }

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/doctor/${doctor.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Doctor updated successfully.");
     
onSuccess();

onClose();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 text-black">

      <h1 className="text-3xl text-black font-bold">
        Edit Doctor
      </h1>
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

  <div className="flex justify-end gap-3">

    <button
      type="button"
      onClick={onClose}
      className="bg-gray-500 text-white px-6 py-3 rounded-lg"
    >
      Cancel
    </button>

    <button
      type="submit"
      disabled={loading}
      className="bg-green-600 text-white px-8 py-3 rounded-lg"
    >
      {loading ? "Updating..." : "Update Doctor"}
    </button>

  </div>

</form>
    </div>
  );
}