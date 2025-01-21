"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import withAuth from "@/hoc/withAuth";
import TableMatkul from "../Tables/TableMatkul";
import Link from "next/link";

interface Jadwal {
  id: number;
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  dosen: string;
  ruang: string;
  status: "belum dimulai" | "sudah selesai" | "sedang berlangsung";
}

const Mahasiswa: React.FC = () => {
  const router = useRouter();
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
  const [classData, setClassData] = useState<{ jadwals: Jadwal[] } | null>(
    null,
  );
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
    router.push("/mahasiswa/faceinput");
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const profileResponse = await axios.get(
          "http://localhost:8000/api/web-mahasiswa/profil-user/",
          { headers },
        );

        setProfile({
          id: profileResponse.data.data.id || null,
          nama: profileResponse.data.data.nama,
          nim: profileResponse.data.data.nim,
          email: profileResponse.data.data.email,
          semester: profileResponse.data.data.semester,
          mobilePhone: profileResponse.data.data.mobile_phone,
          nik: profileResponse.data.data.nik,
          isWajahExist: profileResponse.data.data.is_wajah_exist,
        });

        const classId = 1;
        const classResponse = await axios.get(
          `http://localhost:8000/api/web-mahasiswa/kelas/${classId}`,
          { headers },
        );

        setClassData(classResponse.data.data);
        setGreeting(getGreeting());

        if (!profileResponse.data.data.is_wajah_exist) {
          setShowModal(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Gagal mengambil data");
      }
    };

    fetchData();
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
          <TableMatkul />
        </div>
      </div>
      {classData && (
        <div className="mt-6 rounded-lg bg-white p-6 shadow-lg">
          <h3 className="mb-6 border-b pb-2 text-2xl font-semibold">
            Jadwal Pertemuan
          </h3>
          <div className="overflow-x-auto">
            <table className="divide-gray-200 min-w-full divide-y">
              <thead>
                <tr>
                  {["Tanggal", "Waktu", "Dosen", "Ruang", "Status"].map(
                    (header) => (
                      <th
                        key={header}
                        className="text-gray-500 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {classData.jadwals.map((jadwal) => (
                  <tr key={jadwal.id}>
                    <td className="px-6 py-4">{formatDate(jadwal.tanggal)}</td>
                    <td className="px-6 py-4">
                      {`${formatTime(jadwal.jam_mulai)} - ${formatTime(
                        jadwal.jam_selesai,
                      )}`}
                    </td>
                    <td className="px-6 py-4">{jadwal.dosen}</td>
                    <td className="px-6 py-4">{jadwal.ruang}</td>
                    <td className="px-6 py-4">{jadwal.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(Mahasiswa);
