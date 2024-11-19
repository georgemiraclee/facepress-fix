"use client";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import DefaultLayout from "@/components/Dosen/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Dosen/Breadcrumbs/Breadcrumb";
import axiosInstance from "@/utils/axiosinstance";
import withAuth from "@/hoc/withAuth";
import { useParams } from "next/navigation"; // Perbarui import

// Interface untuk Mahasiswa
interface Mahasiswa {
  nama_mahasiswa: string;
  nim_mahasiswa: string;
  status_presensi: string | null;
  semester_mengambil: number;
}

// Menggunakan Record untuk mendefinisikan Params
type Params = Record<string, string>;

const DataPresensi = (): JSX.Element => {
  const { id } = useParams<Params>(); // Memanggil useParams sebagai fungsi
  const [mahasiswaList, setMahasiswaList] = useState<Mahasiswa[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (id) { // Pastikan id tidak undefined sebelum memfetch
      fetchMahasiswaList();
    }
  }, [id]);

  // Fungsi untuk mengambil daftar mahasiswa
  const fetchMahasiswaList = async () => {
    setIsFetching(true);
    try {
      const response = await axiosInstance.get(`http://localhost:8000/api/web-dosen/attendance/list/${id}/`);
      // Menangani respons dari API
      if (response.data.status === "success") {
        setMahasiswaList(response.data.data);
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire("Error", "Terjadi kesalahan saat mengambil data presensi.", "error");
    } finally {
      setIsFetching(false); // Pastikan ini dipanggil dalam finally
    }
  };

  // Fungsi untuk memulai presensi
  const startAttendance = async () => {
    try {
      await axiosInstance.post(`http://localhost:8000/api/web-dosen/attendance/start/${id}/`);
      Swal.fire("Success", "Presensi telah dimulai", "success");
    } catch (error) {
      console.error("Error starting attendance:", error);
      Swal.fire("Error", "Gagal memulai presensi", "error");
    }
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Mulai Presensi Kelas" />
        <div className="mt-4">
          <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default sm:px-7.5 xl:pb-1">
            <h4 className="mb-6 text-xl font-semibold">Presensi Kelas</h4>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded mb-4"
              onClick={startAttendance}
            >
              Mulai Presensi
            </button>

            <h5 className="text-lg font-semibold mb-4">Daftar Mahasiswa</h5>
            {isFetching ? (
              <p>Loading...</p>
            ) : mahasiswaList.length > 0 ? (
              <table className="w-full border border-stroke">
                <thead>
                  <tr>
                    <th className="border border-stroke px-4 py-2">Nama Mahasiswa</th>
                    <th className="border border-stroke px-4 py-2">NIM</th>
                    <th className="border border-stroke px-4 py-2">Status</th>
                    <th className="border border-stroke px-4 py-2">Semester</th>
                  </tr>
                </thead>
                <tbody>
                  {mahasiswaList.map((mahasiswa, index) => (
                    <tr key={index}>
                      <td className="border border-stroke px-4 py-2">{mahasiswa.nama_mahasiswa}</td>
                      <td className="border border-stroke px-4 py-2">{mahasiswa.nim_mahasiswa}</td>
                      <td className="border border-stroke px-4 py-2">{mahasiswa.status_presensi ?? "Belum Hadir"}</td>
                      <td className="border border-stroke px-4 py-2">{mahasiswa.semester_mengambil}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Data presensi tidak ditemukan untuk jadwal kelas ini.</p>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default withAuth(DataPresensi);
