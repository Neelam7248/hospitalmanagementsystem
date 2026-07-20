export default function AdminDashboardPage() {
  return (
    <>
      <h1 className="text-3xl font-bold text-black mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-600">
            Total Doctors
          </h2>

          <p className="text-3xl font-bold text-blue-600 mt-2">
            0
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-600">
            Total Patients
          </h2>

          <p className="text-3xl font-bold text-green-600 mt-2">
            0
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-600">
            Total Appointments
          </h2>

          <p className="text-3xl font-bold text-purple-600 mt-2">
            0
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-600">
            Total Departments
          </h2>

          <p className="text-3xl font-bold text-red-600 mt-2">
            0
          </p>
        </div>

      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mt-8">

        <h2 className="text-2xl font-semibold text-black mb-4">
          Welcome Admin
        </h2>

        <p className="text-gray-600">
          Welcome to the Hospital Management System Admin Dashboard.
          From here you can manage doctors, patients, appointments,
          departments, staff, and system settings.
        </p>

      </div>
    </>
  );
}