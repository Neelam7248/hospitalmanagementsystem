"use client";

import { useState } from "react";
import axios from "axios";
import { getToken } from "@/utils/auth";

export default function DeleteDoctor({
  doctor,
  onClose,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/doctors/deleteDoctor/${doctor}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);

      onSuccess();
      onClose();

    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.message ||
          "Failed to delete doctor."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">

        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Delete Doctor
        </h2>

        <p className="text-gray-700 mb-6">
          Are you sure you want to delete this doctor?
          This action cannot be undone.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

        </div>
      </div>
    </div>
  );
}