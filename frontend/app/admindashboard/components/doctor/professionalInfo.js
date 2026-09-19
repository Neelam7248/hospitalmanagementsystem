"use client";

export default function ProfessionalInfo({
  formData,
  handleChange,
}) {
  return (
    <div className="bg-white text-black rounded-xl shadow-md p-6 space-y-5">
      <h2 className="text-2xl font-semibold border-b pb-3">
        Professional Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Specialization */}
        <div>
          <label className="block mb-2 font-medium">
            Specialization
          </label>
          <input
            type="text"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            placeholder="Enter specialization"
            className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Experience */}
        <div>
          <label className="block mb-2 font-medium">
            Experience (Years)
          </label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="Enter experience"
            className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Qualification */}
        <div>
          <label className="block mb-2 font-medium">
            Qualification
          </label>
          <input
            type="text"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
            placeholder="Enter qualification"
            className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Consultation Fee */}
        <div>
          <label className="block mb-2 font-medium">
            Consultation Fee
          </label>
          <input
            type="number"
            name="consultationFee"
            value={formData.consultationFee}
            onChange={handleChange}
            placeholder="Enter consultation fee"
            className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Availability */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer">

            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              className="w-5 h-5"
            />

            <span className="font-medium">
              Available for Consultation
            </span>

          </label>
        </div>

      </div>
    </div>
  );
}