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
      <div className="rounded-sm border bg-white px-5 pb-2.5 pt-6  shadow-default dark:border-strokedark dark:bg-boxdark ">
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
        {/* Replace the existing table section with this code */}
<div className="mt-4 space-y-4 sm:hidden"> {/* Only show on mobile screens */}
  {kelasDetail.jadwals.map((jadwal) => (
    <div 
      key={jadwal.id} 
      className="bg-white shadow rounded-lg p-4 border border-gray-200  shadow-default dark:border-strokedark dark:bg-boxdark "
    >
      <div className="grid grid-cols-2 gap-2">
        <div className="font-semibold">Tanggal</div>
        <div>{jadwal.tanggal}</div>
        
        <div className="font-semibold">Jam</div>
        <div>{jadwal.jam_mulai} - {jadwal.jam_selesai}</div>
        
        <div className="font-semibold">Dosen</div>
        <div>{jadwal.dosen}</div>
        
        <div className="font-semibold">Ruang</div>
        <div>{jadwal.ruang}</div>
        
        <div className="font-semibold">Status</div>
        <div>{jadwal.status}</div>
      </div>
      
      <div className="mt-4 flex space-x-2">
        <Link href={`/admin/matakuliah/${kelasDetail.mata_kuliah.id}/kelas/${kelasDetail.id}/jadwal/edit/${jadwal.id}/`} legacyBehavior>
          <a className="flex-1 text-center rounded bg-blue-500 text-white py-2">Edit</a>
        </Link>
        <button
          onClick={() => handleDeleteJadwal(jadwal.id)}
          className="flex-1 rounded bg-red text-white py-2"
        >
          Delete
        </button>
        <Link href={`/admin/presensi/${jadwal.id}`} legacyBehavior>
          <a className="flex-1 text-center rounded bg-green-500 text-white py-2">Presensi</a>
        </Link>
      </div>
    </div>
  ))}
</div>
    {/* Existing table for larger screens */}
    <table className="min-w-full bg-white shadow-default dark:border-strokedark dark:bg-boxdark hidden sm:table">
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
                <a className="bg-blue-500 text-white hover:bg-blue-700 mr-2 px-2 py-1 rounded">Edit</a>
              </Link>
              <button
                onClick={() => handleDeleteJadwal(jadwal.id)}
                className="bg-red text-white px-2 py-1 rounded mr-2"
              >
                Delete
              </button>
              <Link href={`/admin/presensi/${jadwal.id}`} legacyBehavior>
                <a className="bg-green-500 text-white hover:bg-green-700 px-2 py-1 mr-2 rounded">Presensi</a>
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
  );
};

export default withAuth(DetailKelas);
