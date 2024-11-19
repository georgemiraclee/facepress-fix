"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import withAuth from "@/hoc/withAuth"; // Import the withAuth HOC
import { MataKuliah } from "@/types/MataKuliah";
import Link from "next/link";

const MataKuliahDiampu = (): JSX.Element => {
  const router = useRouter();
  const [mataKuliahList, setMataKuliahList] = useState<MataKuliah[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const token = localStorage.getItem("token"); // Retrieve the token from local storage
      const response = await axios.get("http://localhost:8000/api/web-dosen/mata-kuliah/", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
      setMataKuliahList(response.data.data); // Adjust to the correct path in the API response
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data");
    } finally {
      setIsFetching(false); // Set fetching state to false after data is fetched
    }
  };

  const handleViewClasses = (matkulId: number) => {
    router.push(`/dosen/matakuliah/kelas/${matkulId}`);
  };

  return (
    <div className="mt-4">
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Mata Kuliah yang Diampu
        </h4>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex flex-col">
          <div className="grid grid-cols-7 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-7">
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Nama</h5>
            </div>
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Kode</h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">SKS</h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Semester</h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Status</h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Actions</h5>
            </div>
          </div>
          {mataKuliahList.length > 0 ? (
            mataKuliahList.map((matkul, index) => (
              <div
                className={`grid grid-cols-7 sm:grid-cols-7 ${
                  index === mataKuliahList.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"
                }`}
                key={matkul.id}
              >
                <div className="flex items-center gap-3 p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{matkul.nama}</p>
                </div>
                <div className="flex items-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{matkul.kode}</p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-meta-3">{matkul.sks || "-"}</p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-meta-3">{matkul.semester || "-"}</p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-meta-3">{matkul.status || "-"}</p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5 space-x-2">
                  <button
                    className="bg-blue-900 hover:bg-blue-1000 text-white px-3 py-1 rounded"
                    onClick={() => handleViewClasses(matkul.id)}
                  >
                    Lihat
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No Mata Kuliah found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default withAuth(MataKuliahDiampu); // Wrap the component with withAuth HOC
