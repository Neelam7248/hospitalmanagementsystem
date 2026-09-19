"use client";

export default function SearchBar({
  search,
  setSearch,
  placeholder = "Search..."
}) {
  return (
    <div className="flex justify-between items-center mb-6">

      <h1 className="text-3xl font-bold text-gray-800">
        All Doctors
      </h1>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        className="
          w-80
          px-4
          py-2
          border
          border-gray-300
          rounded-lg
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
        "
      />

    </div>
  );
}