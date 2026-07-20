"use client";

import { useState } from "react";

export default function RegisterPage() {

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    profileImage: null,
  });


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      profileImage: e.target.files[0],
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="w-full max-w-md text-black bg-white shadow-lg rounded-lg p-6">

        <h1 className="text-3xl font-bold text-center mb-6">
          Register
        </h1>


        <form 
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* First Name */}
          <div>
            <label className="block mb-1 font-medium">
              First Name
            </label>

            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              className="w-full border rounded-md p-3 text-black"
            />
          </div>


          {/* Last Name */}
          <div>
            <label className="block mb-1 font-medium">
              Last Name
            </label>

            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              className="w-full border rounded-md p-3 text-black"
            />
          </div>


          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full border rounded-md p-3 text-black"
            />
          </div>


          {/* Password */}
          <div>
            <label className="block mb-1 font-medium">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full border rounded-md p-3 text-black"
            />
          </div>


          {/* Role */}
          <div>
            <label className="block mb-1 font-medium">
              Role
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border rounded-md p-3 text-black"
            >
              <option value="">
                Select Role
              </option>

              <option value="ADMIN">
                ADMIN
              </option>

              <option value="DOCTOR">
                DOCTOR
              </option>

              <option value="PATIENT">
                PATIENT
              </option>

            </select>
          </div>


          {/* Image */}
          <div>

            <label className="block mb-1 font-medium">
              Profile Image
            </label>


            <input
              type="file"
              onChange={handleImageChange}
              className="w-full border rounded-md p-3"
            />

          </div>


          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition"
          >
            Register
          </button>


        </form>

      </div>

    </div>
  );
}