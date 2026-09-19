"use client";

import DoctorRow from "./doctorRow";

export default function DoctorTable({
  doctors,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-x-auto bg-white shadow rounded-xl">

      <table className="min-w-full">

        <thead className="bg-blue-600 text-white">

          <tr>
            <th className="px-4 py-3 text-left">Name</th>

            <th className="px-4 py-3 text-left">Email</th>

            <th className="px-4 py-3 text-left">Phone</th>

            <th className="px-4 py-3 text-left">
              Specialization
            </th>

            <th className="px-4 py-3 text-left">
              Consultation Fee
            </th>

            <th className="px-4 py-3 text-left">
              Status
            </th>

            <th className="px-4 py-3 text-center">
              Actions
            </th>
          </tr>

        </thead>

        <tbody>

          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <DoctorRow
                key={doctor.id}
                doctor={doctor}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <tr>
              <td
                colSpan="7"
                className="text-center py-8 text-gray-500"
              >
                No doctors found.
              </td>
            </tr>
          )}

        </tbody>

      </table>

    </div>
  );
}