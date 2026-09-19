"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { getToken } from "@/utils/auth";
import DeleteDoctor from "../deleteModal";
import SearchBar from "./searchBar";
import DoctorTable from "./doctorTable";
import EditDoctor from "../editDoctor";
import ViewDoctor from "../viewDoctor";
import DeletedDoctors from "../fetchAllDeletedDoctors";
export default function AllDoctors() {
  const [loading, setLoading] = useState(false);
const[selectedDoctor,setSelectedDoctor]=useState(null)
  const [doctors, setDoctors] = useState([]);
const[showEdit,setShowEdit]=useState(false);
  const [search, setSearch] = useState("");
const[view,setView]=useState(false);
const[deletedDoctor,setDeletedDoctor]=useState("");
const [showDelete,setshowDelete]=useState(false);
const[viewDoctor,setViewDoctor]=useState(null);
const [showDeleted, setShowDeleted] = useState(false);
useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const token = getToken();
console.log("TOKEN:", !!token);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/doctors`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
console.log("fetchedData",response.data.doctors)
      setDoctors(response.data.doctors);

    } catch (error) {
  console.log("GET DOCTORS ERROR:", error);
  console.log("STATUS:", error.response?.status);
  console.log("DATA:", error.response?.data);}
  finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {

    const fullName =
      `${doctor.user.firstName} ${doctor.user.lastName}`.toLowerCase();

    return (
      fullName.includes(search.toLowerCase()) ||
      doctor.user.email
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      doctor.phone.includes(search)
    );
  });

  const handleView = (doctor) => {
setViewDoctor(doctor);
  setView(true);
    console.log("View", doctor);
  };
const handleEdit = (doctor) => {
  setSelectedDoctor({
    id: doctor.id,

    firstName: doctor.user.firstName,
    lastName: doctor.user.lastName,
    email: doctor.user.email,

    phone: doctor.phone,
    gender: doctor.gender,
    specialization: doctor.specialization,
    experience: doctor.experience,
    qualification: doctor.qualification,
    consultationFee: doctor.consultationFee,
    address: doctor.address,
    city: doctor.city,
    state: doctor.state,
    country: doctor.country,
    postalCode: doctor.postalCode,
    isAvailable: doctor.isAvailable,
  });

  setShowEdit(true);
};

  const handleDelete = (doctor) => {
    console.log("Delete", doctor);
    setDeletedDoctor(doctor.id);
    setshowDelete(true);
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        Loading...
      </div>
    );
  }

  return (
    <div>

      <SearchBar
        search={search}
        setSearch={setSearch}
        placeholder="Search doctor..."
      />

    <DoctorTable
  doctors={filteredDoctors}
  onView={handleView}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>

{showEdit && (
  <EditDoctor
    doctor={selectedDoctor}
  onClose={() => {
  setShowEdit(false);
  setSelectedDoctor(null);
}}  onSuccess={fetchDoctors}
  />
)}


{view &&(<ViewDoctor
doctor={viewDoctor}
onClose={()=>{setView(false)
   setViewDoctor(null)
}}

/>
)}

{showDelete&&(<DeleteDoctor
doctor={deletedDoctor}
onClose={()=>{ setshowDelete(false);
    setDeletedDoctor(null);
}}onSuccess={fetchDoctors}
/>)}
<button
  onClick={() => setShowDeleted(true)}
  className="bg-red-600 text-white px-4 py-2 rounded-lg mb-4"
>
  View Deleted Doctors
</button>
{showDeleted && (
 <DeletedDoctors
    onRestore={fetchDoctors}
/>)}

    </div>
  );
}