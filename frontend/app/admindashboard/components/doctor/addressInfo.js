"use client";

export default function AddressInfo({
  formData,
  handleChange,
}) {
  return (
    <div className="bg-white text-black rounded-xl shadow-md p-6 space-y-5">
      <h2 className="text-2xl font-semibold border-b pb-3">
        Address Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block mb-2 font-medium">
            Address
          </label>

          <textarea
            name="address"
            rows={3}
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter complete address"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* City */}
        <div>
          <label className="block mb-2 font-medium">
            City
          </label>

          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter city"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* State */}
        <div>
          <label className="block mb-2 font-medium">
            State
          </label>

          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="Enter state"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block mb-2 font-medium">
            Country
          </label>

          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Enter country"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Postal Code */}
        <div>
          <label className="block mb-2 font-medium">
            Postal Code
          </label>

          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="Enter postal code"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

      </div>
    </div>
  );
}