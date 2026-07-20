"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  getUser,
  isLoggedIn,
  logout,
} from "@/utils/auth";

export default function AdminDashboardLayout({ children }) {
  const router = useRouter();

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/signin");
      return;
    }

    setUser(getUser());
  }, [router]);

  const handleLogout = () => {
    logout();
    router.replace("/signin");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">

      <aside className="w-64 bg-gray-900 text-white p-6">

        <h1 className="text-2xl font-bold mb-8">
          HMS Admin
        </h1>

        <nav className="space-y-3">

          <Link
            href="/admindashboard"
            className="block p-3 rounded-lg hover:bg-gray-700"
          >
            Dashboard
          </Link>

          <Link
            href="/admindashboard/doctors"
            className="block p-3 rounded-lg hover:bg-gray-700"
          >
            Doctors
          </Link>

          <Link
            href="/admindashboard/patients"
            className="block p-3 rounded-lg hover:bg-gray-700"
          >
            Patients
          </Link>

          <Link
            href="/admindashboard/appointments"
            className="block p-3 rounded-lg hover:bg-gray-700"
          >
            Appointments
          </Link>

          <Link
            href="/admindashboard/departments"
            className="block p-3 rounded-lg hover:bg-gray-700"
          >
            Departments
          </Link>

        </nav>

      </aside>

      <div className="flex-1">

        <header className="bg-white shadow flex justify-between items-center p-5">

          <div>
            <h2 className="text-2xl font-semibold text-black">
              Hospital Management System
            </h2>

            <p className="text-gray-600">
              Welcome, {user.firstName}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>

        </header>

        <main className="p-6 bg-gray-100 min-h-screen">
          {children}
        </main>

      </div>

    </div>
  );
}