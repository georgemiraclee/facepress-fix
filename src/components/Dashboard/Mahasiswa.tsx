"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import withAuth from "@/hoc/withAuth";
import TableAdmin from "../Tables/TableOne";
import Link from "next/link";

const Mahasiswa: React.FC = () => {
  const router = useRouter(); // Initialize router here
  const [profile, setProfile] = useState({
    id: null,
    nama: "",
    nim: "",
    email: "",
    semester: null,
    mobilePhone: "",
    nik: "",
    isWajahExist: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [greeting, setGreeting] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);

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

  const redirectToFaceCapture = () => {
    router.push("/mahasiswa/faceinput"); // Redirect client-side using router.push
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8000/api/web-mahasiswa/profil-user/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfile({
          id: response.data.data.id || null,
          nama: response.data.data.nama,
          nim: response.data.data.nim,
          email: response.data.data.email,
          semester: response.data.data.semester,
          mobilePhone: response.data.data.mobile_phone,
          nik: response.data.data.nik,
          isWajahExist: response.data.data.is_wajah_exist,
        });
        setGreeting(getGreeting());

        // Show the modal if isWajahExist is false
        if (!response.data.data.is_wajah_exist) {
          setShowModal(true);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError("Gagal mengambil data profil");
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen">
      {error && (
        <div className="text-red-500 p-4 mb-4 rounded-lg bg-red-50 border border-red-200">
          {error}
        </div>
      )}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          {greeting}
          {profile.nama ? `, ${profile.nama}` : ""}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Semoga harimu menyenangkan!
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <div className="mt-4 p-6 bg-white shadow-lg rounded-lg dark:border-strokedark dark:bg-gray-800">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 border-b pb-2">
            Profil Mahasiswa
          </h3>
          <div className="text-gray-800 dark:text-gray-300 space-y-4">
            <div className="flex items-center">
              <span className="font-medium w-32">Nama:</span>
              <span>{profile.nama || "Memuat..."}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium w-32">NIM:</span>
              <span>{profile.nim || "Memuat..."}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium w-32">Semester:</span>
              <span>{profile.semester || "Memuat..."}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium w-32">Email:</span>
              <span>{profile.email || "Memuat..."}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium w-32">No HP:</span>
              <span>{profile.mobilePhone || "Memuat..."}</span>
            </div>
          </div>
          <div className="mt-6">
            <Link href={`/edit`} legacyBehavior>
              <a className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg transition-all duration-300 shadow-md">
                Edit
              </a>
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-12">
          <TableAdmin />
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4">Perhatian</h2>
            <p className="mb-6">
              Data wajah belum tersedia. Silakan tambahkan data wajah Anda.
            </p>
            <button
              onClick={redirectToFaceCapture} // Use client-side redirect on button click
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
            >
              Tambahkan Data Wajah
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(Mahasiswa);
