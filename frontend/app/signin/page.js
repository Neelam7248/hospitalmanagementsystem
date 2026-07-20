"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveAuthData } from "@/utils/auth";
import axios from "axios";

export default function SigninPage() {
const[message,setMessage]=useState("");
const[error,setError]=useState(null);
const[loading,setLoading]=useState(false);
const navigate=useRouter();
const BACKEND_URL=process.env.NEXT_PUBLIC_API_URL

const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };




  const handleSubmit = async(e) => {
    e.preventDefault();
 setLoading(true);
  setError(null);
  setMessage("");

try{
     
    const res=await axios.post(`${BACKEND_URL}/api/v1/auth/signIn`,formData);
    if(res.data){
    setMessage("signin Successful");
saveAuthData(res.data.token, res.data.user);
navigate.push("/admindashboard");
    }
    console.log(formData);



}catch(err){
    setError(err?.response?.data?.message);
    console.log(err?.response?.data?.message);
}finally{
    setLoading(false);
}
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="w-full max-w-md text-black bg-white shadow-lg rounded-lg p-6">

        <h1 className="text-3xl font-bold text-center mb-6">
         Signin
        </h1>

{message && (
  <p className="text-green-600 text-center">
    {message}
  </p>
)}

{error && (
  <p className="text-red-600 text-center">
    {error}
  </p>
)}
        <form 
          onSubmit={handleSubmit}
          className="space-y-4"
        >



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



          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition"
          >
 {loading ? "Signing In..." : "Sign In"}        
          </button>


        </form>

      </div>

    </div>
  );
}