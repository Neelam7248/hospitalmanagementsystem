"use client";

export default function DoctorNavbar({
  activeTab,
  setActiveTab,
}) {
  const tabs = [
    "Add Doctor",
    "All Doctors",
  ];

  return (
    <div className="bg-white text-black shadow rounded-xl p-4 mb-8">
      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg font-medium transition
              ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 "
              }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}