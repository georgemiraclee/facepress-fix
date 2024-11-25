"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import withAuth from "@/hoc/withAuth"; // Import the withAuth HOC
import { MataKuliah } from "@/types/MataKuliah";
import Link from "next/link";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";

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
    <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
      <Breadcrumb pageName="Data Mata Kuliah" />
      
      <div className="mt-4">
        <div className="mb-4">
          <Link href="/admin/matakuliah/create" legacyBehavior>
            <a className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition-colors">
              Tambah 
            </a>
          </Link>
        </div>

        <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          {error && (
            <div className="p-4 bg-red-50 text-red-500 border-b border-stroke">
              {error}
            </div>
          )}

          <div className="w-full overflow-x-auto">
            {/* Mobile View */}
            <div className="block md:hidden">
              {mataKuliahList.length > 0 ? (
                mataKuliahList.map((matkul, index) => (
                  <div 
                    key={matkul.id}
                    className="p-4 border-b border-stroke dark:border-strokedark"
                  >
                    <div className="flex flex-col space-y-3">
                      <div>
                        <h3 className="font-medium text-black dark:text-white">{matkul.nama}</h3>
                        <p className="text-sm text-gray-600 mt-1">{matkul.kode}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">SKS:</span> {matkul.sks || "-"}
                        </div>
                        <div>
                          <span className="font-medium ">Semester:</span> {matkul.semester || "-"}
                        </div>
                        <div>
                          <span className="font-medium">Status:</span> {matkul.status || "-"}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                      <button
                    className="bg-blue-900 hover:bg-blue-1000 text-white px-3 py-1 rounded"
                    onClick={() => handleViewClasses(matkul.id)}
                  >
                    Lihat
                  </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : isFetching ? (
                <div className="p-4 text-center">Loading...</div>
              ) : (
                <div className="p-4 text-center">No data available</div>
              )}
            </div>

            {/* Desktop View */}
            <table className="hidden md:table min-w-full">
              <thead>
                <tr className="bg-gray-2 dark:bg-meta-4">
                  <th className="py-4 px-4 text-left text-sm font-semibold">
                    Nama
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-semibold">
                    Kode
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-semibold">
                    SKS
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-semibold">
                    Semester
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="py-4 px-4 text-center text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {mataKuliahList.length > 0 ? (
                  mataKuliahList.map((matkul, index) => (
                    <tr 
                      key={matkul.id}
                      className={`border-b border-stroke dark:border-strokedark ${
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-50'
                      }`}
                    >
                      <td className="py-4 px-4">
                          <span className="text-black dark:text-white">{matkul.nama}</span>
                      </td>
                      <td className="py-4 px-4">
                          <span className="text-black dark:text-white">{matkul.kode}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span>{matkul.sks || "-"}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span>{matkul.semester || "-"}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span>{matkul.status || "-"}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                            <>
                            <button
                              className="bg-blue-900 hover:bg-blue-1000 text-white px-3 py-1 rounded"
                              onClick={() => handleViewClasses(matkul.id)}
                            >
                              Lihat
                            </button>
                            </>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : isFetching ? (
                  <tr>
                    <td colSpan={6} className="py-4 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={6} className="py-4 text-center">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(MataKuliahDiampu);