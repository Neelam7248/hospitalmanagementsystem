"use client";

import { useState } from "react";

import DoctorNavbar from "./doctorNavbar";
import AddDoctor from "./addDoctor";
import AllDoctors from "./allDoctors/allDoctors";
//import DeleteDoctor from "./DeleteDoctor";

export default function DoctorManagement() {
  const [activeTab, setActiveTab] = useState("Add Doctor");

  return (
    <div className="max-w-7xl mx-auto p-8">

      <DoctorNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === "Add Doctor" && <AddDoctor />}

      {activeTab === "All Doctors" && <AllDoctors />}

    </div>
  );
}