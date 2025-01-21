"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Breadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";
import axios from "axios";
import Swal from "sweetalert2";
import withAuth from "@/hoc/withAuth";
import Link from "next/link";

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
    namaRuang: string;
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
  tipe: string; // Disesuaikan dari 'type' ke 'tipe'
  sks: number;
  semester: number;
  status: string;
  dosens: Dosen[];
}

const DetailMataKuliah = () => {
  const router = useRouter();
  const { id } = useParams();
  const [mataKuliah, setMataKuliah] = useState<MataKuliah | null>(null);
  const [kelas, setKelas] = useState<Kelas[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("No auth token found");
          }

          const response = await axios.get(
            `http://localhost:8000/api/web-dosen/mata-kuliah/${id}/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Menyesuaikan dengan struktur data respons API
          setMataKuliah(response.data.data.mata_kuliah);
          setKelas(response.data.data.kelas);
        } catch (error) {
          console.error("Error fetching data:", error);
          setError("Failed to fetch data. Please check if the resource exists.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    } else {
      console.error("No ID provided");
      setError("No ID provided");
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!mataKuliah) {
    return <p>No data available</p>;
  }

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Detail Mata Kuliah dan Kelas" />
      <div className="mt-4 p-4 bg-white shadow-md rounded-lg shadow-default dark:border-strokedark dark:bg-boxdark">
        <h2 className="text-2xl font-bold mb-4">Detail Mata Kuliah</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-lg">
              <strong>Nama:</strong> {mataKuliah.nama}
            </p>
            <p className="text-lg">
              <strong>Nama English:</strong> {mataKuliah.nama_english}
            </p>
            <p className="text-lg">
              <strong>Kode:</strong> {mataKuliah.kode}
            </p>
            <p className="text-lg">
              <strong>Tipe:</strong> {mataKuliah.tipe}
            </p>
            <p className="text-lg">
              <strong>SKS:</strong> {mataKuliah.sks}
            </p>
            <p className="text-lg">
              <strong>Status:</strong> {mataKuliah.status}
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Dosen</h3>
            {mataKuliah.dosens && mataKuliah.dosens.length > 0 ? (
              mataKuliah.dosens.map((dosen, index) => (
                <div key={index}>
                  <p className="text-lg">
                    <strong>Nama:</strong> {dosen.nama}
                  </p>
                  <p className="text-lg">
                    <strong>Email:</strong> {dosen.email}
                  </p>
                  <p className="text-lg">
                    <strong>NIP:</strong> {dosen.nip}
                  </p>
                  <p className="text-lg">
                    <strong>Mobile Phone:</strong> {dosen.mobile_phone}
                  </p>
                </div>
              ))
            ) : (
              <p>No dosens available</p>
            )}
          </div>
        </div>
        <div className="mt-8 ">
          <h3 className="text-xl font-bold mb-4">Kelas</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Kelas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kode Kelas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ruang
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hari
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jam Mulai
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jam Selesai
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kapasitas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 shadow-default dark:border-strokedark dark:bg-boxdark">
                {kelas && kelas.length > 0 ? (
                  kelas.map((kelasItem) => (
                    <tr key={kelasItem.id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {kelasItem.nama_kelas}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {kelasItem.kode_kelas}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {kelasItem.ruang.namaRuang}, {kelasItem.ruang.lokasi}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {kelasItem.hari}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {kelasItem.jam_mulai}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {kelasItem.jam_selesai}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {kelasItem.kapasitas}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <button
                          className="bg-blue-900 hover:bg-blue-1000 text-white px-3 py-1 rounded"
                          onClick={() => {
                            // Aksi untuk tombol Jadwal, misalnya navigasi ke halaman jadwal
                            router.push(`/dosen/matakuliah/kelas/jadwal/${kelasItem.id}`);
                          }}
                        >
                          Jadwal
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-sm text-center">
                      No classes available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-4">
          <Link href="/dosen/matakuliah">
            <button className="bg-red rounded px-3 py-1 hover:bg-red-300 text-white ">
              Kembali 
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default withAuth(DetailMataKuliah);
