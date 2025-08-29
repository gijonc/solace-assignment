"use client";

import { useEffect, useState, useRef } from "react";

interface Advocates {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
  createdAt: string;
}

const sanitizeString = (str: any) => {
  return String(str).trim().toLowerCase();
};

// Helper function to highlight matching text
const highlightText = (text: string, searchTerm: string) => {
  if (!searchTerm || !text) return text;

  const regex = new RegExp(`(${searchTerm})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (sanitizeString(part) === sanitizeString(searchTerm)) {
      return (
        <span key={index} style={{ backgroundColor: "yellow" }}>
          {part}
        </span>
      );
    }
    return part;
  });
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [advocates, setAdvocates] = useState<Advocates[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocates[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const debounceRef: any = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/advocates");
      const { data } = await res.json();

      setAdvocates(data);
      setFilteredAdvocates(data);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleSearchChange = (e: any) => {
    const value = sanitizeString(e.target.value);
    setSearchTerm(value);

    // Clear existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // If search term is empty, show all advocates
    if (!value) {
      setFilteredAdvocates(advocates);
      return;
    }

    // Set new timeout for half second
    debounceRef.current = setTimeout(() => {
      _performSearch(value);
    }, 500);
  };

  const _performSearch = (searchTerm: string) => {
    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        sanitizeString(advocate.firstName).includes(searchTerm) ||
        sanitizeString(advocate.lastName).includes(searchTerm) ||
        sanitizeString(advocate.city).includes(searchTerm) ||
        sanitizeString(advocate.degree).includes(searchTerm) ||
        sanitizeString(advocate.specialties).includes(searchTerm) ||
        sanitizeString(advocate.yearsOfExperience).includes(searchTerm)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const resetSearch = () => {
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  };

  const tableHeaders = [
    "First Name",
    "Last Name",
    "City",
    "Degree",
    "Specialties",
    "Years of Experience",
    "Phone Number",
  ];

  if (isLoading)
    return <main className="container mx-auto my-8">Loading...</main>;

  return (
    <main className="container mx-auto my-8">
      <h1 className="text-3xl font-bold">Solace Advocates</h1>

      <div className="py-8">
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
            placeholder="Search by keyword"
            name="search"
            onChange={handleSearchChange}
            value={searchTerm}
          />
          <button
            type="button"
            className="text-white absolute end-2.5 bottom-2.5 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            onClick={resetSearch}
          >
            Reset search
          </button>
        </div>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-md text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {tableHeaders.map((header: string) => (
                <th key={header} scope="col" className="px-6 py-3">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          {filteredAdvocates.length === 0 && (
            <p className="p-6 text-gray-500 ">No result found.</p>
          )}
          <tbody>
            {filteredAdvocates.map((advocate) => (
              <tr
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
                key={advocate.id}
              >
                <td className="px-6 py-4">
                  {highlightText(advocate.firstName, searchTerm)}
                </td>
                <td className="px-6 py-4">
                  {highlightText(advocate.lastName, searchTerm)}
                </td>
                <td className="px-6 py-4">
                  {highlightText(advocate.city, searchTerm)}
                </td>
                <td className="px-6 py-4">
                  {highlightText(advocate.degree, searchTerm)}
                </td>
                <td className="px-6 py-4">
                  {advocate.specialties.map((s) => (
                    <div key={s}>• {highlightText(s, searchTerm)}</div>
                  ))}
                </td>
                <td className="px-6 py-4">
                  {highlightText(
                    String(advocate.yearsOfExperience),
                    searchTerm
                  )}
                </td>
                <td className="px-6 py-4">
                  {highlightText(String(advocate.phoneNumber), searchTerm)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
