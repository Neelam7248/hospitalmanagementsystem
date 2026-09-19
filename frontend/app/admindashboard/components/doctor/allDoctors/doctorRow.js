"use client";

export default function DoctorRow({
  doctor,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <tr className="border-b text-black hover:bg-gray-50">

      <td className="px-4 text-black py-3">
        {doctor.user.firstName} {doctor.user.lastName}
      </td>

      <td className="px-4 py-3">
        {doctor.user.email}
      </td>

      <td className="px-4 py-3">
        {doctor.phone}
      </td>

      <td className="px-4 py-3">
        {doctor.specialization}
      </td>

      <td className="px-4 py-3">
        Rs. {doctor.consultationFee}
      </td>

      <td className="px-4 py-3">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium
            ${
              doctor.isAvailable
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
        >
          {doctor.isAvailable
            ? "Available"
            : "Unavailable"}
        </span>
      </td>

      <td className="px-4 py-3">
        <div className="flex gap-2 justify-center">

          <button
            onClick={() => onView(doctor)}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
          >
            View
          </button>

          <button
            onClick={() => onEdit(doctor)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(doctor)}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
          >
            Delete
          </button>

        </div>
      </td>

    </tr>
  );
}