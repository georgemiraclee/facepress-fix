"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Breadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";
import Link from "next/link";
import Swal from "sweetalert2";
import withAuth from "@/hoc/withAuth";
import axiosInstance from "@/utils/axiosinstance";

interface Dosen {
  email: string;
  nip: string;
  nama: string;
  mobile_phone: string;
}

interface Kelas {
  id: number;
  nama_kelas: string;
  kode_kelas: string;
  ruang: {
    nama_ruang: string;
    lokasi: string;
  };
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  kapasitas: number;
}

interface MataKuliah {
  id: number;
  nama: string;
  nama_english: string;
  kode: string;
  tipe: string;
  sks: number;
  semester: number;
  status: string;
  dosens: Dosen[];
  kelas: Kelas[];
}

const DetailMataKuliah = () => {
  const router = useRouter();
  const { id } = useParams();
  const [mataKuliah, setMataKuliah] = useState<MataKuliah | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Move fetchData function outside of useEffect
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/web-admin/mata-kuliah/${id}/`);
      const mataKuliahData = response.data.data.mata_kuliah;
      const kelasData = response.data.data.kelas;
      setMataKuliah({ ...mataKuliahData, kelas: kelasData });
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please check if the resource exists.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    } else {
      setError("No ID provided");
      setIsLoading(false);
    }
  }, [id]);

  const handleDeleteKelas = async (id: number) => {
    Swal.fire({
      title: "Anda yakin ingin mengapus?",
      text: "Anda tidak bisa mengembalikan datanya!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/web-admin/kelas/${id}/`);
          fetchData(); // Now fetchData is defined here
          Swal.fire("Data Terhapus!", "Kelas sudah terhapus.", "success");
        } catch (error) {
          console.error("Error deleting Kelas:", error);
          setError("Failed to delete Kelas");
          Swal.fire("Error", "Gagal menghapus Kelas", "error");
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

  if (!mataKuliah) {
    return <div className="p-6"><p>No data available</p></div>;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Breadcrumb pageName="Detail Mata Kuliah" />
      <div className="rounded-sm border bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h2 className="text-2xl font-bold mb-4">Detail Mata Kuliah</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-lg"><strong>Nama:</strong> {mataKuliah.nama}</p>
            <p className="text-lg"><strong>Nama English:</strong> {mataKuliah.nama_english}</p>
            <p className="text-lg"><strong>Kode:</strong> {mataKuliah.kode}</p>
            <p className="text-lg"><strong>Type:</strong> {mataKuliah.tipe}</p>
            <p className="text-lg"><strong>SKS:</strong> {mataKuliah.sks}</p>
            <p className="text-lg"><strong>Semester:</strong> {mataKuliah.semester}</p>
            <p className="text-lg"><strong>Status:</strong> {mataKuliah.status}</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Dosen</h3>
            {mataKuliah.dosens.map((dosen) => (
              <div key={dosen.nip}>
                <p className="text-lg"><strong>Nama:</strong> {dosen.nama}</p>
                <p className="text-lg"><strong>Email:</strong> {dosen.email}</p>
                <p className="text-lg"><strong>NIP:</strong> {dosen.nip}</p>
                <p className="text-lg"><strong>Mobile Phone:</strong> {dosen.mobile_phone}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Kelola Kelas</h3>
          <Link href={`/admin/matakuliah/${mataKuliah.id}/create/`} legacyBehavior>
            <a className="inline-flex items-center rounded bg-primary py-2 px-4 text-white hover:bg-opacity-90">
              Create Kelas
            </a>
          </Link>
         {/* Replace the existing table section with this responsive version */}
<div className="mt-4">
  <h3 className="text-xl font-bold mb-4">Kelas</h3>
  
  {/* Mobile View - Grid Cards */}
  <div className="grid gap-4 md:hidden">
    {mataKuliah.kelas.map((kelas) => (
      <div 
        key={kelas.id} 
        className="bg-white shadow rounded-lg p-4 dark:bg-boxdark"
      >
        <div className="grid grid-cols-2 gap-2">
          <div className="font-semibold">Nama Kelas:</div>
          <div>{kelas.nama_kelas}</div>
          
          <div className="font-semibold">Kode Kelas:</div>
          <div>{kelas.kode_kelas}</div>
          
          <div className="font-semibold">Ruang:</div>
          <div>{kelas.ruang.nama_ruang}</div>
          
          <div className="font-semibold">Hari:</div>
          <div>{kelas.hari}</div>
          
          <div className="font-semibold">Jam Mulai:</div>
          <div>{kelas.jam_mulai}</div>
          
          <div className="font-semibold">Jam Selesai:</div>
          <div>{kelas.jam_selesai}</div>
          
          <div className="font-semibold">Kapasitas:</div>
          <div>{kelas.kapasitas}</div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2 justify-between">
          <Link href={`/admin/matakuliah/${mataKuliah.id}/kelas/edit/${kelas.id}`} legacyBehavior>
            <a className="text-white hover:text-white px-2 py-1 bg-blue-500 rounded">Edit</a>
          </Link>
          <Link href={`/admin/matakuliah/${mataKuliah.id}/kelas/${kelas.id}/jadwal/`} legacyBehavior>
            <a className="text-white hover:text-white-300 px-2 py-1 bg-yellow-500 rounded">Jadwal</a>
          </Link>
          <button
            onClick={() => handleDeleteKelas(kelas.id)}
            className="text-white hover:text-white px-2 py-1 bg-red rounded"
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
      {/* Desktop Table View */}
      <table className="min-w-full bg-white shadow-default dark:border-strokedark dark:bg-boxdark hidden md:table">
        <thead>
          <tr>
            <th className="py-2">Nama Kelas</th>
            <th className="py-2">Kode Kelas</th>
            <th className="py-2">Ruang</th>
            <th className="py-2">Hari</th>
            <th className="py-2">Jam Mulai</th>
            <th className="py-2">Jam Selesai</th>
            <th className="py-2">Kapasitas</th>
            <th className="py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {mataKuliah.kelas.map((kelas) => (
            <tr key={kelas.id}>
              <td className="py-2">{kelas.nama_kelas}</td>
              <td className="py-2">{kelas.kode_kelas}</td>
              <td className="py-2">{kelas.ruang.nama_ruang}</td>
              <td className="py-2">{kelas.hari}</td>
              <td className="py-2">{kelas.jam_mulai}</td>
              <td className="py-2">{kelas.jam_selesai}</td>
              <td className="py-2">{kelas.kapasitas}</td>
              <td className="py-2">
                <Link href={`/admin/matakuliah/${mataKuliah.id}/kelas/edit/${kelas.id}`} legacyBehavior>
                  <a className="text-yellow-600 hover:text-yellow-900 mr-2">Edit</a>
                </Link>
                <Link href={`/admin/matakuliah/${mataKuliah.id}/kelas/${kelas.id}/jadwal/`} legacyBehavior>
                  <a className="text-blue-600 hover:text-blue-900 mr-2">Jadwal</a>
                </Link>
                <button
                  onClick={() => handleDeleteKelas(kelas.id)}
                  className="text-red hover:text-red"
                >
                  Delete
                </button>
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

export default withAuth(DetailMataKuliah);
