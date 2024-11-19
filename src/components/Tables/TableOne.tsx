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
        console.log("Response Data:", response.data);
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
    return <p>No data available</p>;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Daftar Mata Kuliah Mahasiswa
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((mk, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 border dark:bg-boxdark dark:border-strokedark">
            <h5 className="text-lg font-bold mb-2">
              Mata Kuliah: {mk.mata_kuliah_nama}
            </h5>
            <p className="text-sm mb-1"><strong>Kelas:</strong> {mk.kelas_nama}</p>
            <p className="text-sm mb-1"><strong>Semester Mengambil:</strong> {mk.semester_mengambil}</p>
            <p className={`text-sm ${mk.status === "Belum Lulus" ? "text-red-500" : "text-green-500"}`}>
              <strong>Status:</strong> {mk.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default withAuth(MataKuliahList);
