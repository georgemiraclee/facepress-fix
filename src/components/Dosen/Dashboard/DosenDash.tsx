"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import withAuth from "@/hoc/withAuth"; // Assuming you have withAuth implemented for authentication
import TableAdmin from "../Tables/TableAdmin"; // Assuming this is your admin table component
import MatkulCard from "../MatkulCard/index"; // Assuming this is your chat or notifications component

interface Profile {
  id: number | null;
  nama: string;
  role: string;
  nip: string;
  email: string;
  mobilePhone: string;
}

const DosenDash: React.FC = () => {
  const [profile, setProfile] = useState<Profile>({
    id: null,
    nama: "",
    role: "",
    nip: "",
    email: "",
    mobilePhone: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [greeting, setGreeting] = useState<string>("");

  // Function to get greeting based on current time
  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return "Selamat Pagi";
    } else if (currentHour >= 12 && currentHour < 15) {
      return "Selamat Siang";
    } else if (currentHour >= 15 && currentHour < 18) {
      return "Selamat Sore";
    } else {
      return "Selamat Malam";
    }
  };

  // Fetch profile data from the API
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
        const response = await axios.get(
          "http://localhost:8000/api/web-dosen/profil-dosen/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Check if the response contains the expected profile data
        if (response.data && response.data.data) {
          const profileData = response.data.data;
          // Update profile data and map mobile_phone to mobilePhone
          setProfile({
            id: profileData.id,
            nama: profileData.nama,
            role: "", // role is missing in the response, defaulting to an empty string
            nip: profileData.nip,
            email: profileData.email,
            mobilePhone: profileData.mobile_phone, // Correct field name
          });
          setGreeting(getGreeting()); // Set the appropriate greeting based on the current time
        } else {
          setError("Data profil tidak ditemukan"); // Handle case when data is missing
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError("Gagal mengambil data profil"); // Set error if fetching fails
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div className="p-6">
      {error && (
        <div className="text-red-500 p-4 mb-4 rounded-lg bg-red-50 border border-red-200">
          {error}
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {greeting} {profile.nama ? `, ${profile.nama}` : ""} {/* Check if profile.nama exists */}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Semoga harimu menyenangkan!
        </p>
      </div>

      {/* Profile Information Section */}
      <div className="grid grid-cols-1 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Profil Dosen
          </h3>
          <div className="text-gray-700 dark:text-white space-y-2">
            <p>
              <span className="font-medium">Nama:</span>{" "}
              {profile.nama || "Memuat..."}
            </p>
            <p>
              <span className="font-medium">NIP:</span>{" "}
              {profile.nip || "Memuat..."}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {profile.email || "Memuat..."}
            </p>
            <p>
              <span className="font-medium">No HP:</span>{" "}
              {profile.mobilePhone || "Memuat..."}
            </p>
          </div>
        </div>
      </div>

      {/* Admin Table & Chat Card Section */}
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        {/* TableAdmin Section */}
        <div className="col-span-12 xl:col-span-8">
          <TableAdmin />
        </div>

        {/* ChatCard Section */}
        <MatkulCard />
      </div>
    </div>
  );
};

export default withAuth(DosenDash);
