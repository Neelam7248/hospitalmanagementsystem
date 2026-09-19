"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "@/utils/auth";
import EmailChange from "./emailChange";
const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
const [editMode, setEditMode] = useState(false);
const [emailEditMode, setEmailEditMode] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  // ======================================================
  // GET PROFILE
  // ======================================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getToken();

        if (!token) {
          setError("User is not logged in");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userProfile = response.data.profile;

        setProfile(userProfile);

        setFormData({
          firstName: userProfile.firstName || "",
          lastName: userProfile.lastName || "",
        });

      } catch (error) {
        console.error("PROFILE ERROR:", error);

        setError(
          error.response?.data?.message ||
            "Failed to fetch profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ======================================================
  // HANDLE INPUT CHANGE
  // ======================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ======================================================
  // UPDATE PROFILE
  // ======================================================

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const token = getToken();

      if (!token) {
        setError("User is not logged in");
        return;
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/profile`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setProfile(response.data.profile);

      setFormData({
        firstName: response.data.profile.firstName,
        lastName: response.data.profile.lastName,
      });

      setSuccess("Profile updated successfully");

      setEditMode(false);

    } catch (error) {
      console.error("UPDATE PROFILE ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">
          Loading profile...
        </p>
      </div>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (error && !profile) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // ======================================================
  // NO PROFILE
  // ======================================================

  if (!profile) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">
          No profile found.
        </p>
      </div>
    );
  }

  // ======================================================
  // PROFILE UI
  // ======================================================

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">

<div className="flex justify-between items-center mb-6">

  <h1 className="text-2xl font-bold text-black">
    My Profile
  </h1>

  <div className="flex gap-3">

    {!editMode && !emailEditMode&& (
      <button
        onClick={() => {
          setEditMode(true);
          setSuccess("");
          setError("");
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Edit Profile
      </button>
    )}

    {!emailEditMode &&!editMode && (
      <button
        onClick={() => {
          setEmailEditMode(true);
          setSuccess("");
          setError("");
        }}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
      >
        Change Email
      </button>
    )}

  </div>

</div>
{emailEditMode && (
<EmailChange
onCancel={() => {
setEmailEditMode(false);
setError("");
setSuccess("");
}}
/>
)}
      {/* Success Message */}

      {success && (
        <div className="mb-4 bg-green-100 text-green-700 p-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Error Message */}

      {error && (
        <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Profile Header */}

      <div className="flex items-center gap-5 mb-6">

        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">

          <span className="text-2xl font-bold text-blue-600">
            {profile.firstName?.charAt(0)}
            {profile.lastName?.charAt(0)}
          </span>

        </div>

        <div>

          <h2 className="text-xl font-semibold text-black">
            {profile.firstName} {profile.lastName}
          </h2>

          <p className="text-gray-500">
            {profile.role}
          </p>

        </div>

      </div>

      {/* EDIT MODE */}

      {editMode ? (

        <form
          onSubmit={handleUpdateProfile}
          className="space-y-4"
        >

          {/* First Name */}

          <div>

            <label className="block text-sm text-gray-600 mb-1">
              First Name
            </label>

            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
              required
            />

          </div>

          {/* Last Name */}

          <div>

            <label className="block text-sm text-gray-600 mb-1">
              Last Name
            </label>

            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
              required
            />

          </div>

          {/* Email - Read Only */}

          <div>

            <label className="block text-sm text-gray-600 mb-1">
              Email
            </label>

            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-500"
            />

          </div>

          {/* Role - Read Only */}

          <div>

            <label className="block text-sm text-gray-600 mb-1">
              Role
            </label>

            <input
              type="text"
              value={profile.role}
              disabled
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-500"
            />

          </div>

          {/* Buttons */}

          <div className="flex gap-3 pt-2">

            <button
              type="submit"
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={() => {
                setEditMode(false);
                setError("");
                setFormData({
                  firstName: profile.firstName || "",
                  lastName: profile.lastName || "",
                });
              }}
              className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>

          </div>

        </form>

      ) : (

        // ==================================================
        // VIEW MODE
        // ==================================================

        <div className="space-y-4">

          <div>
            <p className="text-sm text-gray-500">
              First Name
            </p>

            <p className="text-gray-800 font-medium">
              {profile.firstName}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Last Name
            </p>

            <p className="text-gray-800 font-medium">
              {profile.lastName}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Email
            </p>

            <p className="text-gray-800 font-medium">
              {profile.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Role
            </p>

            <p className="text-gray-800 font-medium">
              {profile.role}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Account Created
            </p>

            <p className="text-gray-800 font-medium">
              {profile.createdAt
                ? new Date(
                    profile.createdAt
                  ).toLocaleDateString()
                : "-"}
            </p>
          </div>

        </div>

      )}

    </div>
  );
};

export default Profile;
