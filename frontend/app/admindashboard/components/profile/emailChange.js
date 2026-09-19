
"use client";

import { useState } from "react";
import axios from "axios";
import { getToken } from "@/utils/auth";

export default function EmailChange() {
  const [formData, setFormData] = useState({
    newEmail: "",
    password: "",
    
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!formData.newEmail || !formData.password) {
      setError("Please fill all the fields");
      return;
    }

    try {
      setLoading(true);

      const token = getToken();

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/email`,
        {
          newEmail: formData.newEmail,
          password: formData.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(
        response.data.message || "Email changed successfully"
      );

      setFormData({
        newEmail: "",
        password: "",
      });
    } catch (err) {
      console.error("EMAIL CHANGE ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Failed to change email"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-black rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-xl font-semibold mb-5">
        Change Email
      </h2>

      <form onSubmit={handleEmailChange} className="space-y-4">

        {/* New Email */}
        <div>
          <label className="block text-sm font-medium mb-1">
            New Email
          </label>

          <input
            type="email"
            name="newEmail"
            value={formData.newEmail}
            onChange={handleChange}
            placeholder="Enter new email"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Current Password
          </label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter current password"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Success Message */}
        {message && (
          <p className="text-green-600 text-sm">
            {message}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p className="text-red-600 text-sm">
            {error}
          </p>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Change Email"}
        </button>

      </form>
    </div>
  );
}
