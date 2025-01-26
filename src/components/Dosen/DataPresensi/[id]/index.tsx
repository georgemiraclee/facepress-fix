"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";
import withAuth from "@/hoc/withAuth";
import Breadcrumb from "../../Breadcrumbs/Breadcrumb";
import axiosInstance from "@/utils/axiosinstance";

interface Mahasiswa {
  presensiId: number;
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

const STATUS_OPTIONS = [
  { value: "hadir", label: "Hadir", color: "text-green-600" },
  { value: "izin", label: "Izin", color: "text-yellow-600" },
  { value: "alpha", label: "Alpha", color: "text-red-600" },
  { value: "sakit", label: "Sakit", color: "text-blue-600" },
];

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
      const response = await axiosInstance.get(
        `http://localhost:8000/api/web-dosen/presensi/${id}`
      );
      if (response.data && response.data.data) {
        const data = response.data.data;
        setJadwalDetail({
          id: data.id,
          tanggal: data.tanggal,
          jamMulai: data.jamMulai,
          jamSelesai: data.jamSelesai,
          mataKuliah: data.mataKuliah,
          kelas: data.kelas,
          ruang: data.ruang,
          dosen: data.dosen,
          presensiMahasiswa: data.presensiMahasiswa || [],
        });
        setError(null);
      } else {
        setError("No schedule data available.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(
        "Failed to fetch data. Please check the schedule ID or try again."
      );
    } finally {
      setIsFetching(false);
    }
  };

  const handleSetStatus = async (presensiId: number, status: string) => {
    try {
      await axiosInstance.patch(
        `http://localhost:8000/api/web-dosen/presensi/${presensiId}/set-status/`,
        {
          status,
        }
      );
      fetchData(); // Refresh data after updating status
      Swal.fire("Success", `Status updated to ${status}`, "success");
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire("Error", "Failed to update status.", "error");
    }
  };

  const handleSetHadirSemua = async () => {
    try {
      await Promise.all(
        jadwalDetail?.presensiMahasiswa.map((mahasiswa) => 
          axiosInstance.patch(
            `http://localhost:8000/api/web-dosen/presensi/${mahasiswa.presensiId}/set-status/`,
            { status: "hadir" }
          )
        ) || []
      );
      fetchData();
      Swal.fire("Success", "Semua mahasiswa diset Hadir", "success");
    } catch (error) {
      console.error("Error setting all hadir:", error);
      Swal.fire("Error", "Gagal mengeset semua mahasiswa hadir.", "error");
    }
  };


  const getStatusColor = (status: string | null) => {
    const statusObj = STATUS_OPTIONS.find((opt) => opt.value === status);
    return statusObj ? statusObj.color : "text-gray-500";
  };

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Edit Jadwal" />
      <div className="mt-4">
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
            Data Presensi
          </h4>
          {error && <p className="text-red-500">{error}</p>}
          {isFetching ? (
            <p>Loading...</p>
          ) : jadwalDetail ? (
            <div>
              <div className="mb-4">
                <h5 className="text-lg font-semibold text-black dark:text-white">
                  Schedule Details
                </h5>
                <p>
                  <strong>Date:</strong> {jadwalDetail.tanggal}
                </p>
                <p>
                  <strong>Start Time:</strong> {jadwalDetail.jamMulai}
                </p>
                <p>
                  <strong>End Time:</strong> {jadwalDetail.jamSelesai}
                </p>
                <p>
                  <strong>Subject:</strong> {jadwalDetail.mataKuliah}
                </p>
                <p>
                  <strong>Class:</strong> {jadwalDetail.kelas}
                </p>
                <p>
                  <strong>Room:</strong> {jadwalDetail.ruang}
                </p>
                <p>
                  <strong>Lecturer:</strong> {jadwalDetail.dosen}
                </p>
              </div>
              <div className="flex space-x-4 mb-4">
                <button 
                  onClick={handleSetHadirSemua}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Set Hadir Semua
                </button>
              </div>
              <div className="mt-8">
                <h5 className="mb-4 text-lg font-semibold text-black dark:text-white">
                Mahasiswa Terdaftar {jadwalDetail.mataKuliah}
                </h5>
                {jadwalDetail.presensiMahasiswa.length === 0 ? (
                  <p>Tidak ada mahasiswa yang terdaftar pada kelas ini.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="border-gray-300 min-w-full table-auto border-collapse border text-left dark:border-strokedark">
                      <thead className="bg-gray-200 dark:bg-meta-4">
                        <tr>
                          <th className="border-gray-300 border p-4 dark:border-strokedark">
                            Name
                          </th>
                          <th className="border-gray-300 border p-4 dark:border-strokedark">
                            NIM
                          </th>
                          <th className="border-gray-300 border p-4 dark:border-strokedark">
                            Email
                          </th>
                          <th className="border-gray-300 border p-4 dark:border-strokedark">
                            Status
                          </th>
                          <th className="border-gray-300 border p-4 dark:border-strokedark">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {jadwalDetail.presensiMahasiswa.map(
                          (mahasiswa, index) => (
                            <tr
                              key={mahasiswa.presensiId}
                              className={`${
                                index % 2 === 0
                                  ? "bg-gray-50 dark:bg-gray-800"
                                  : "dark:bg-gray-700 bg-gray-800"
                              }`}
                            >
                              <td className="border-gray-300 border p-4 dark:border-strokedark">
                                {mahasiswa.namaMahasiswa}
                              </td>
                              <td className="border-gray-300 border p-4 text-center dark:border-strokedark">
                                {mahasiswa.nimMahasiswa}
                              </td>
                              <td className="border-gray-300 border p-4 text-center dark:border-strokedark">
                                {mahasiswa.emailMahasiswa}
                              </td>
                              <td
                                className={`border-gray-300 border p-4 text-center dark:border-strokedark ${getStatusColor(
                                  mahasiswa.statusPresensi
                                )}`}
                              >
                                {mahasiswa.statusPresensi || "Belum Diset"}
                              </td>
                              <td className="border-gray-300 border p-4 text-center dark:border-strokedark">
                                <select
                                  className="w-full rounded border p-2"
                                  value={mahasiswa.statusPresensi || ""}
                                  onChange={(e) =>
                                    handleSetStatus(
                                      mahasiswa.presensiId,
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="">Pilih Status</option>
                                  {STATUS_OPTIONS.map((status) => (
                                    <option
                                      key={status.value}
                                      value={status.value}
                                    >
                                      {status.label}
                                    </option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                          )
                        )}
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