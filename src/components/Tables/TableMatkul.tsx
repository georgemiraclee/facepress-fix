"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import withAuth from "@/hoc/withAuth";

interface MataKuliahData {
  mata_kuliah_nama: string;
  kelas_nama: string;
  semester_mengambil: number;
  status: string;
}

const MataKuliahList = (): JSX.Element => {
  const [data, setData] = useState<MataKuliahData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8000/api/web-mahasiswa/mata-kuliah/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.status === "success") {
          setData(response.data.data);
        } else {
          setError("Gagal mengambil data mata kuliah");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Gagal mengambil data mata kuliah");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!data.length) {
    return <p>Data tidak tersedia</p>;
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg ">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2">
        Daftar Mata Kuliah Mahasiswa
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((mk, index) => (
          <div
            key={index}
            className="p-4 bg-white border rounded-lg shadow-md"
          >
            <h3 className="text-lg font-bold mb-2 text-gray-800">
              {mk.mata_kuliah_nama}
            </h3>
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Kelas:</strong> {mk.kelas_nama}
              </p>
              <p className="text-sm">
                <strong>Semester Mengambil:</strong> {mk.semester_mengambil}
              </p>
              <p
                className={`text-sm font-semibold ${
                  mk.status === "Belum Lulus" ? "text-red-500" : "text-green-500"
                }`}
              >
                <strong>Status:</strong> {mk.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default withAuth(MataKuliahList);
