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

    if (!value) return;

    // Clear existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout for half second
    debounceRef.current = setTimeout(() => {
      search(value);
    }, 500);
  };

  const search = (searchTerm: string) => {
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

  const onClick = () => {
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
      <h1 className="text-3xl font-bold underline">Solace Advocates</h1>

      <div className="py-8">
        <label htmlFor="search">Search by keyword:</label>
        <input
          style={{ border: "1px solid black" }}
          name="search"
          onChange={handleSearchChange}
          value={searchTerm}
        />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <table className="w-full text-left table-auto min-w-max text-slate-800">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          {tableHeaders.map((header: string) => (
            <th key={header}>{header}</th>
          ))}
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate) => (
            <tr key={advocate.id}>
              <td>{advocate.firstName}</td>
              <td>{advocate.lastName}</td>
              <td>{advocate.city}</td>
              <td>{advocate.degree}</td>
              <td>
                {advocate.specialties.map((s) => (
                  <div key={s}>{s}</div>
                ))}
              </td>
              <td>{advocate.yearsOfExperience}</td>
              <td>{advocate.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
