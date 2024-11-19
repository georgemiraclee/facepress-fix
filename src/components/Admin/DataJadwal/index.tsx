"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Breadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";
import Link from "next/link";
import Swal from "sweetalert2";
import withAuth from "@/hoc/withAuth";
import axiosInstance from "@/utils/axiosinstance";

interface MataKuliah {
  id: number;
  nama: string;
  kode: string;
  sks: number;
}

interface Jadwal {
  id: number;
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  dosen: string;
  ruang: string;
  status: string;
}

interface KelasDetail {
  id: number;
  nama_kelas: string;
  kode_kelas: string;
  ruang: string;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  kapasitas: number;
  mata_kuliah: MataKuliah;
  jadwals: Jadwal[];
}

const DetailKelas = () => {
  const router = useRouter();
  const { id } = useParams();
  const [kelasDetail, setKelasDetail] = useState<KelasDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchKelasData = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/web-admin/kelas/${id}/`);
      if (response.data.success) {
        setKelasDetail(response.data.data);
      } else {
        setError("Failed to fetch class data.");
      }
    } catch (error) {
      console.error("Error fetching class data:", error);
      setError("Failed to fetch class data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchKelasData();
    } else {
      setError("No ID provided");
      setIsLoading(false);
    }
  }, [id]);

  const handleDeleteJadwal = async (jadwalId: number) => {
    Swal.fire({
      title: "Are you sure you want to delete?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/web-admin/jadwal/${jadwalId}/`);
          fetchKelasData();
          Swal.fire("Deleted!", "Your schedule has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting schedule:", error);
          setError("Failed to delete schedule.");
          Swal.fire("Error", "Failed to delete schedule.", "error");
        }
      }
    });
  };

  if (isLoading) {
    return <div className="p-6"><p>Loading...</p></div>;
  }

  if (error) {
    return <div className="p-6"><p className="text-red-500">{error}</p></div>;
  }

  if (!kelasDetail) {
    return <div className="p-6"><p>No data available</p></div>;
  }
  return (
    <div className="mx-auto max-w-4xl">
      <Breadcrumb pageName="Detail Kelas" />
      <div className="rounded-sm border bg-white px-5 pb-2.5 pt-6 shadow-default">
        <h2 className="text-2xl font-bold mb-4">Detail Kelas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-lg"><strong>Nama Kelas:</strong> {kelasDetail.nama_kelas}</p>
            <p className="text-lg"><strong>Kode Kelas:</strong> {kelasDetail.kode_kelas}</p>
            <p className="text-lg"><strong>Ruang:</strong> {kelasDetail.ruang}</p>
            <p className="text-lg"><strong>Hari:</strong> {kelasDetail.hari}</p>
            <p className="text-lg"><strong>Jam Mulai:</strong> {kelasDetail.jam_mulai}</p>
            <p className="text-lg"><strong>Jam Selesai:</strong> {kelasDetail.jam_selesai}</p>
            <p className="text-lg"><strong>Kapasitas:</strong> {kelasDetail.kapasitas}</p>
            <p className="text-lg"><strong>Mata Kuliah:</strong> {kelasDetail.mata_kuliah.nama} ({kelasDetail.mata_kuliah.kode})</p>
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Kelola Jadwal</h3>
          <Link href={`/admin/matakuliah/${kelasDetail.mata_kuliah.id}/kelas/${kelasDetail.id}/create`} legacyBehavior>
            <a className="inline-flex items-center rounded bg-primary py-2 px-4 text-white hover:bg-opacity-90">
              Create Jadwal
            </a>
          </Link>
          <div className="mt-4">
            <h3 className="text-xl font-bold mb-4">Jadwal</h3>
            <table className="min-w-full bg-white shadow-default">
              <thead>
                <tr>
                  <th className="py-2">Tanggal</th>
                  <th className="py-2">Jam Mulai</th>
                  <th className="py-2">Jam Selesai</th>
                  <th className="py-2">Dosen</th>
                  <th className="py-2">Ruang</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {kelasDetail.jadwals.map((jadwal) => (
                  <tr key={jadwal.id}>
                    <td className="py-2">{jadwal.tanggal}</td>
                    <td className="py-2">{jadwal.jam_mulai}</td>
                    <td className="py-2">{jadwal.jam_selesai}</td>
                    <td className="py-2">{jadwal.dosen}</td>
                    <td className="py-2">{jadwal.ruang}</td>
                    <td className="py-2">{jadwal.status}</td>
                    <td className="py-2">
                      <Link href={`/admin/matakuliah/${kelasDetail.mata_kuliah.id}/kelas/${kelasDetail.id}/jadwal/edit/${jadwal.id}/`} legacyBehavior>
                        <a className="text-blue-600 hover:text-blue-900 mr-2">Edit</a>
                      </Link>
                      <button
                        onClick={() => handleDeleteJadwal(jadwal.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                      <Link href={`/admin/presensi/${jadwal.id}`} legacyBehavior>
                        <a className="text-green-600 hover:text-green-900 ml-2">Atur Presensi</a>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-end gap-4.5 mt-4">
          <button
            type="button"
            className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-white hover:bg-opacity-90"
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default withAuth(DetailKelas);
