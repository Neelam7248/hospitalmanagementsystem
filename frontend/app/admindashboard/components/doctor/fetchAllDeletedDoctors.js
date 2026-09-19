"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "@/utils/auth";

export default function DeletedDoctors({onRestore}) {

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetchDeletedDoctors();
  }, []);


  const fetchDeletedDoctors = async () => {
    try {

      setLoading(true);

      const token = getToken();

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/doctor/getDeletedDoctors`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );


      console.log("Deleted Doctors:", response.data.doctors);

      setDoctors(response.data.doctors);

    } catch(error){

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to fetch deleted doctors"
      );

    } finally {

      setLoading(false);

    }
  };
const handleRestore = async (doctorId) => {

    const confirmRestore = window.confirm(
        "Restore this doctor?"
    );

    if (!confirmRestore) return;

    try {

        const token = getToken();

        await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/doctor/restoreDoctor/${doctorId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        alert("Doctor restored successfully.");

        fetchDeletedDoctors();
  onRestore?.(); // Refresh active doctors

    } catch (error) {

        console.log(error);

        alert(
            error.response?.data?.message ||
            "Restore failed"
        );
    }

};

  if(loading){
    return (
      <div className="text-center py-10">
        Loading deleted doctors...
      </div>
    );
  }


  return (

    <div className="p-6">


      <h1 className="text-2xl text-black font-bold mb-6 text-red-600">
        Deleted Doctors
      </h1>


      {
        doctors.length === 0 ? (

          <div className="text-gray-500">
            No deleted doctors found.
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full border text-black border-gray-200">

              <thead className="bg-gray-100">

                <tr>

                  <th className="p-3 border">
                    Name
                  </th>

                  <th className="p-3 border">
                    Email
                  </th>

                  <th className="p-3 border">
                    Phone
                  </th>

                  <th className="p-3 border">
                    Specialization
                  </th>

                  <th className="p-3 border">
                    Deleted Date
                  </th>
             <th className="p-3 border">
                                              Actions</th>

                </tr>

              </thead>


              <tbody>

                {
                  doctors.map((doctor)=>(
                    
                    <tr key={doctor.id}>

                      <td className="p-3 border">
                        {doctor.user.firstName}{" "}
                        {doctor.user.lastName}
                      </td>


                      <td className="p-3 border">
                        {doctor.user.email}
                      </td>


                      <td className="p-3 border">
                        {doctor.phone}
                      </td>


                      <td className="p-3 border">
                        {doctor.specialization}
                      </td>


                      <td className="p-3 border">
                        {
                          doctor.deletedAt
                          ? new Date(
                              doctor.deletedAt
                            ).toLocaleDateString()
                          : "-"
                        }
                      </td>
<td className="p-3 border">
    <div className="flex gap-2 justify-center">

        <button
            onClick={() => handleRestore(doctor.id)}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
        >
            Restore
        </button>

        <button
            onClick={() => handleHardDelete(doctor.id)}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
        >
            Hard Delete
        </button>

    </div>
</td>

                    </tr>

                  ))
                }

              </tbody>

            </table>

          </div>

        )
      }


    </div>

  );
}