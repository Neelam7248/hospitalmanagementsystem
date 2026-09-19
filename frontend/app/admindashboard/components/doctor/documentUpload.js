"use client";

export default function DocumentUpload({
  handleFileChange,
}) {
  return (
    <div className="bg-white text-black rounded-xl shadow-md p-6 space-y-5">
      <h2 className="text-2xl font-semibold border-b pb-3">
        Upload Documents
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Profile Image */}
        <div>
          <label className="block mb-2 font-medium">
            Profile Image
          </label>

          <input
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* CV */}
        <div>
          <label className="block mb-2 font-medium">
            CV (PDF)
          </label>

          <input
            type="file"
            name="cv"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Degree */}
        <div>
          <label className="block mb-2 font-medium">
            Degree (PDF)
          </label>

          <input
            type="file"
            name="degree"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* License */}
        <div>
          <label className="block mb-2 font-medium">
            License (PDF)
          </label>

          <input
            type="file"
            name="license"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Certificate */}
        <div>
          <label className="block mb-2 font-medium">
            Certificate (PDF)
          </label>

          <input
            type="file"
            name="certificate"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

      </div>
    </div>
  );
}