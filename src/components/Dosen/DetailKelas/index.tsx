"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Breadcrumb from '@/components/Admin/Breadcrumbs/Breadcrumb';
import axios from 'axios';
import Link from 'next/link';
import withAuth from '@/hoc/withAuth';

interface Jadwal {
  id: number;
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  dosen: string;
  ruang: string;
  status: string;
}

interface MataKuliah {
  id: number;
  nama: string;
  kode: string;
  sks: number;
}

interface Kelas {
  id: number;
  nama_kelas: string;
  kode_kelas: string;
  kapasitas: number;
  ruang: string;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  mata_kuliah: MataKuliah;
  jadwals: Jadwal[];
}

const DetailKelas = () => {
  const router = useRouter();
  const { id } = useParams();
  const [kelas, setKelas] = useState<Kelas | null>(null);
  const [isCardVisible, setIsCardVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No ID provided");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");

        // Fetch class details
        const kelasResponse = await axios.get(`http://localhost:8000/api/web-dosen/kelas/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setKelas(kelasResponse.data.data);
      } catch (error) {
        setError("Failed to fetch data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return <div className="p-6"><p>Loading...</p></div>;
  }

  if (error) {
    return <div className="p-6"><p className="text-red-500">{error}</p></div>;
  }

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Detail Kelas" />

      {/* Class Details */}
      {kelas && (
        <div className="mt-4 p-4 bg-white shadow-md rounded-lg shadow-default dark:border-strokedark dark:bg-boxdark ">
          <h2 className="text-2xl font-bold mb-4">Detail Kelas</h2>
          <p><strong>Nama Kelas:</strong> {kelas.nama_kelas}</p>
          <p><strong>Kode Kelas:</strong> {kelas.kode_kelas}</p>
          <p><strong>Ruang:</strong> {kelas.ruang}</p>
          <p><strong>Hari:</strong> {kelas.hari}</p>
          <p><strong>Jam Mulai:</strong> {kelas.jam_mulai}</p>
          <p><strong>Jam Selesai:</strong> {kelas.jam_selesai}</p>
          <p><strong>Kapasitas:</strong> {kelas.kapasitas}</p>
          <p><strong>Mata Kuliah:</strong> {kelas.mata_kuliah.nama} ({kelas.mata_kuliah.kode})</p>
          <p><strong>SKS:</strong> {kelas.mata_kuliah.sks}</p>

          {/* Schedule Management */}
           {/*  <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Kelola Jadwal</h3>
          <Link href={`/dosen/matakuliah/kelas/jadwal/${id}/create`} legacyBehavior>
              <a className="inline-flex items-center rounded bg-primary py-2 px-4 text-white hover:bg-opacity-90">Create Jadwal</a>
            </Link>
          </div>*/}
{/* Replace the existing table section with this responsive version */}
<div className="mt-4">
  <h3 className="text-xl font-bold mb-4">Jadwal</h3>
  <div className="grid gap-4 md:hidden">
    {kelas.jadwals.map((jadwal) => (
      <div 
        key={jadwal.id} 
        className="bg-white shadow rounded-lg p-4 dark:bg-boxdark"
      >
        <div className="grid grid-cols-2 gap-2">
          <div className="font-semibold">Tanggal:</div>
          <div>{jadwal.tanggal}</div>
          
          <div className="font-semibold">Jam Mulai:</div>
          <div>{jadwal.jam_mulai}</div>
          
          <div className="font-semibold">Jam Selesai:</div>
          <div>{jadwal.jam_selesai}</div>
          
          <div className="font-semibold">Dosen:</div>
          <div>{jadwal.dosen}</div>
          
          <div className="font-semibold">Ruang:</div>
          <div>{jadwal.ruang}</div>
          
          <div className="font-semibold">Status:</div>
          <div>{jadwal.status}</div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2 justify-between">
          <Link href={`/dosen/matakuliah/kelas/jadwal/edit/${jadwal.id}`} legacyBehavior>
            <a className="text-blue-600 hover:text-blue-900 px-2 py-1 bg-blue-100 rounded">Edit</a>
          </Link>
          <button
            onClick={() => alert("Delete functionality not implemented yet")}
            className="text-white hover:text-gray-200 px-2 py-1 bg-red rounded"
          >
            Delete
          </button>
          <Link href={`/dosen/matakuliah/kelas/jadwal/datapresensi/${jadwal.id}`} legacyBehavior>
            <a className="text-green-600 hover:text-green-900 px-2 py-1 bg-green-100 rounded">Atur Presensi</a>
          </Link>
          <Link href={`/dosen/matakuliah/kelas/jadwal/presensi/${jadwal.id}/`} legacyBehavior>
            <a className="text-yellow-600 hover:text-yellow-900 px-2 py-1 bg-yellow-100 rounded">Mulai Kelas</a>
          </Link>
        </div>
      </div>
    ))}
  </div>
          {/* Desktop table view */}
          <table className="min-w-full bg-white divide-y divide-gray-200 shadow-default dark:border-strokedark dark:bg-boxdark hidden md:table">
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
              {kelas.jadwals.map((jadwal) => (
                <tr key={jadwal.id}>
                  <td className="py-2">{jadwal.tanggal}</td>
                  <td className="py-2">{jadwal.jam_mulai}</td>
                  <td className="py-2">{jadwal.jam_selesai}</td>
                  <td className="py-2">{jadwal.dosen}</td>
                  <td className="py-2">{jadwal.ruang}</td>
                  <td className="py-2">{jadwal.status}</td>
                  <td className="py-2">
                    <Link href={`/dosen/matakuliah/kelas/jadwal/edit/${jadwal.id}`} legacyBehavior>
                      <a className="text-blue-600 hover:text-blue-900 mr-2">Edit</a>
                    </Link>
                    <button
                      onClick={() => alert("Delete functionality not implemented yet")}
                      className="text-red hover:text-red mr-2"
                    >
                      Delete
                    </button>
                    <Link href={`/dosen/matakuliah/kelas/jadwal/datapresensi/${jadwal.id}`} legacyBehavior>
                      <a className="text-green-600 hover:text-green-900 mr-2">Atur Presensi</a>
                    </Link>
                    <Link href={`/dosen/matakuliah/kelas/jadwal/presensi/${jadwal.id}/`} legacyBehavior>
                      <a className="text-yellow-600 hover:text-yellow-900 mr-2">Mulai Kelas</a>
                    </Link>
                  </td>
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

export default withAuth(DetailKelas);
