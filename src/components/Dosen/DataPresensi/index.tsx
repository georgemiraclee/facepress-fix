"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import DefaultLayout from "../Layouts/DefaultLayout";
import Swal from "sweetalert2";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";

interface Mahasiswa {
  mahasiswaId: number;
  namaMahasiswa: string;
  nimMahasiswa: string;
  emailMahasiswa: string;
  statusPresensi: string;
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
  const router = useRouter();
  const { IdJadwal } = useParams(); // Ambil IdJadwal dari route params
  const [jadwalDetail, setJadwalDetail] = useState<JadwalDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  // Fetch data dari API saat komponen pertama kali di-mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi untuk mengambil data dari API
  const fetchData = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/web-dosen/presensi/${IdJadwal}/`);
      setJadwalDetail(response.data.data); // Simpan data ke state
      setIsFetching(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data");
      setIsFetching(false);
    }
  };

  // Fungsi untuk mengubah status presensi mahasiswa
  const handleSetStatus = async (mahasiswaId: number, status: string) => {
    try {
      await axios.patch(`http://localhost:8000/api/web-dosen/presensi/${mahasiswaId}/set-status/`, { status });
      fetchData(); // Refresh data setelah status diperbarui
      Swal.fire("Success", `Status updated to ${status}`, "success");
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update status");
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  return (
    <DefaultLayout>
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
                {/* Detail Jadwal */}
                <div className="mb-4">
                  <h5 className="text-lg font-semibold text-black dark:text-white">Jadwal Detail</h5>
                  <p><strong>Tanggal:</strong> {jadwalDetail.tanggal}</p>
                  <p><strong>Jam Mulai:</strong> {jadwalDetail.jamMulai}</p>
                  <p><strong>Jam Selesai:</strong> {jadwalDetail.jamSelesai}</p>
                  <p><strong>Mata Kuliah:</strong> {jadwalDetail.mataKuliah}</p>
                  <p><strong>Kelas:</strong> {jadwalDetail.kelas}</p>
                  <p><strong>Ruang:</strong> {jadwalDetail.ruang}</p>
                  <p><strong>Dosen:</strong> {jadwalDetail.dosen}</p>
                </div>
                
                {/* Tabel Mahasiswa Terdaftar */}
                <div>
                  <h5 className="text-lg font-semibold text-black dark:text-white">Mahasiswa Terdaftar</h5>
                  {jadwalDetail.presensiMahasiswa.length === 0 ? (
                    <p>No students are registered for this schedule.</p>
                  ) : (
                    <div className="grid grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
                      {/* Header Tabel */}
                      <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Nama</h5>
                      </div>
                      <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">NIM</h5>
                      </div>
                      <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Email</h5>
                      </div>
                      <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Status</h5>
                      </div>
                      <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Actions</h5>
                      </div>
                      
                      {/* Tabel Data Mahasiswa */}
                      {jadwalDetail.presensiMahasiswa.map((mahasiswa, index) => (
                        <div
                          className={`grid grid-cols-5 sm:grid-cols-5 ${
                            index === jadwalDetail.presensiMahasiswa.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"
                          }`}
                          key={mahasiswa.mahasiswaId}
                        >
                          <div className="flex items-center gap-3 p-2.5 xl:p-5">
                            <p className="text-black dark:text-white">{mahasiswa.namaMahasiswa}</p>
                          </div>
                          <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className="text-black dark:text-white">{mahasiswa.nimMahasiswa}</p>
                          </div>
                          <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className="text-black dark:text-white">{mahasiswa.emailMahasiswa}</p>
                          </div>
                          <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className="text-black dark:text-white">{mahasiswa.statusPresensi}</p>
                          </div>
                          <div className="flex items-center justify-center p-2.5 xl:p-5 space-x-2">
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
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
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
                          </div>
                        </div>
                      ))}
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
    </DefaultLayout>
  );
};

export default DataPresensi;
