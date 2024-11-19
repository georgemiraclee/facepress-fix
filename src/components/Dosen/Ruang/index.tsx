"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Swal from "sweetalert2";
import { Ruang } from "@/types/Ruang";

const DataRuang = (): JSX.Element => {
  const [ruangList, setRuangList] = useState<Ruang[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get("http://localhost:8000/api/ruang");
      setRuangList(response.data);
      setIsFetching(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data");
      setIsFetching(false);
    }
  };
  
  const handleDeleteRuang = async (id: number) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/ruang/${id}`);
      fetchData();
      Swal.fire("Success", "Berhasil menghapus data ruang", "success");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data && error.response.data.message) {
          const message = error.response.data.message;
          if (message.includes("terdaftar di beberapa Kelas dan jadwal Kelas")) {
            Swal.fire("Error", "Ruang terdaftar di beberapa Kelas dan jadwal Kelas, ganti terlebih dahulu jika ingin menghapus", "error");
          } else {
            Swal.fire("Error", "Failed to delete Ruang", "error");
          }
        } else {
          Swal.fire("Error", "Failed to delete Ruang", "error");
        }
      } else {
        Swal.fire("Error", "An unexpected error occurred", "error");
      }
      console.error("Error deleting Ruang:", error);
      setError("Failed to delete Ruang");
    }
  };

  return (
    <div className="mt-4">
      <div className="flex gap-4 mb-4">
        <Link href="/admin/ruang/create" legacyBehavior>
          <a className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
            Tambah
          </a>
        </Link>
      </div>
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Data Ruang
        </h4>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex flex-col">
          <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-3">
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Nama</h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Status</h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Actions</h5>
            </div>
          </div>
          {isFetching ? (
            <p>Loading...</p>
          ) : ruangList.length > 0 ? (
            ruangList.map((ruang, index) => (
              <div
                className={`grid grid-cols-3 sm:grid-cols-3 ${
                  index === ruangList.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"
                }`}
                key={ruang.id}
              >
                <div className="flex items-center gap-3 p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{ruang.nama}</p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-meta-3">{ruang.status}</p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5 space-x-2">
                  <Link href={`/admin/ruang/edit/${ruang.id}`} legacyBehavior>
                    <a className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
                      Edit
                    </a>
                  </Link>
                  <Link href={`/admin/ruang/detail/${ruang.id}`} legacyBehavior>
                    <a className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                      Detail
                    </a>
                  </Link>
                  <button
                    className="bg-red hover:bg-red text-white px-3 py-1 rounded"
                    onClick={() => handleDeleteRuang(ruang.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No Ruang found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataRuang;
