"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";
import withAuth from "@/hoc/withAuth";
import Breadcrumb from "../../Breadcrumbs/Breadcrumb";
import axiosInstance from "@/utils/axiosinstance";

interface Mahasiswa {
  mahasiswaId: number;
  namaMahasiswa: string;
  nimMahasiswa: string;
  emailMahasiswa: string;
  statusPresensi: string | null;
  presensiOleh: string | null;
  tanggalPresensi: string | null;
}

interface JadwalDetail {
  id: number;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  mataKuliah: string;
  kelas: string;
  ruang: string;
  dosen: string;
  presensiMahasiswa: Mahasiswa[];
}

const DataPresensi = (): JSX.Element => {
  const { id } = useParams(); 
  const [jadwalDetail, setJadwalDetail] = useState<JadwalDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  
  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const response = await axiosInstance.get(`http://localhost:8000/api/web-dosen/presensi/${id}`);
      if (response.data.success && response.data.data) {
        const { 
          id, 
          tanggal, 
          jamMulai, 
          jamSelesai, 
          mataKuliah, 
          kelas, 
          ruang, 
          dosen, 
          presensiMahasiswa 
        } = response.data.data;

        setJadwalDetail({
          id,
          tanggal,
          jamMulai,
          jamSelesai,
          mataKuliah,
          kelas,
          ruang,
          dosen,
          presensiMahasiswa: presensiMahasiswa || [],
        });
        setError(null);
      } else {
        setError("No schedule data available.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please check the schedule ID or try again.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleSetStatus = async (mahasiswaId: number, status: string) => {
    try {
      await axiosInstance.patch(`http://localhost:8000/api/web-dosen/presensi/${id}/${mahasiswaId}/set-status`, { 
        status,
        mahasiswaId
      });
      fetchData(); // Refresh data after updating status
      Swal.fire("Success", `Status updated to ${status}`, "success");
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update status.");
      Swal.fire("Error", "Failed to update status.", "error");
    }
  };

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Edit Jadwal" />
      <div className="mt-4">
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark sm:px-7.5 xl:pb-1">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Data Presensi</h4>
          {error && <p className="text-red-500">{error}</p>}
          {isFetching ? (
            <p>Loading...</p>
          ) : jadwalDetail ? (
            <div>
              {/* Detail Schedule */}
              <div className="mb-4">
                <h5 className="text-lg font-semibold text-black dark:text-white">Schedule Details</h5>
                <p><strong>Date:</strong> {jadwalDetail.tanggal}</p>
                <p><strong>Start Time:</strong> {jadwalDetail.jamMulai}</p>
                <p><strong>End Time:</strong> {jadwalDetail.jamSelesai}</p>
                <p><strong>Subject:</strong> {jadwalDetail.mataKuliah}</p>
                <p><strong>Class:</strong> {jadwalDetail.kelas}</p>
                <p><strong>Room:</strong> {jadwalDetail.ruang}</p>
                <p><strong>Lecturer:</strong> {jadwalDetail.dosen}</p>
              </div>
              
              {/* Registered Students Table */}
              <div className="mt-8">
                <h5 className="text-lg font-semibold text-black dark:text-white mb-4">
                  Registered Students
                </h5>
                {jadwalDetail.presensiMahasiswa.length === 0 ? (
                  <p>No students are registered for this schedule.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse border border-gray-300 dark:border-strokedark text-left">
                      {/* Table Headers */}
                      <thead className="bg-gray-200 dark:bg-meta-4">
                        <tr>
                          <th className="border border-gray-300 dark:border-strokedark p-4">Name</th>
                          <th className="border border-gray-300 dark:border-strokedark p-4">NIM</th>
                          <th className="border border-gray-300 dark:border-strokedark p-4">Email</th>
                          <th className="border border-gray-300 dark:border-strokedark p-4">Status</th>
                          <th className="border border-gray-300 dark:border-strokedark p-4">Actions</th>
                        </tr>
                      </thead>
                      {/* Table Body */}
                      <tbody>
                        {jadwalDetail.presensiMahasiswa.map((mahasiswa, index) => (
                          <tr
                            key={mahasiswa.mahasiswaId}
                            className={`${
                              index % 2 === 0 ? "bg-gray-50 dark:bg-gray-800" : "bg-white dark:bg-gray-700"
                            }`}
                          >
                            <td className="border border-gray-300 dark:border-strokedark p-4">
                              {mahasiswa.namaMahasiswa}
                            </td>
                            <td className="border border-gray-300 dark:border-strokedark p-4 text-center">
                              {mahasiswa.nimMahasiswa}
                            </td>
                            <td className="border border-gray-300 dark:border-strokedark p-4 text-center">
                              {mahasiswa.emailMahasiswa}
                            </td>
                            <td className="border border-gray-300 dark:border-strokedark p-4 text-center">
                              {mahasiswa.statusPresensi || 'Belum Diset'}
                            </td>
                            <td className="border border-gray-300 dark:border-strokedark p-4 text-center space-x-2">
                              <button
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                onClick={() => handleSetStatus(mahasiswa.mahasiswaId, "hadir")}
                              >
                                Hadir
                              </button>
                              <button
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                                onClick={() => handleSetStatus(mahasiswa.mahasiswaId, "izin")}
                              >
                                Izin
                              </button>
                              <button
                                className="bg-red hover:bg-red text-white px-3 py-1 rounded"
                                onClick={() => handleSetStatus(mahasiswa.mahasiswaId, "alpha")}
                              >
                                Alpha
                              </button>
                              <button
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                onClick={() => handleSetStatus(mahasiswa.mahasiswaId, "sakit")}
                              >
                                Sakit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p>No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default withAuth(DataPresensi);