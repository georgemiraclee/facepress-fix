"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Swal from "sweetalert2";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import withAuth from "@/hoc/withAuth";
import axiosInstance from "@/utils/axiosinstance";

interface Ruang {
  nama_ruang: string;
  lokasi: string;
}

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
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/web-admin/ruang/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRuangList(response.data.data); // Access the 'data' field from the API response
      setIsFetching(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data");
      setIsFetching(false);
    }
  };

  const handleDeleteRuang = async (id: number) => {
    try {
      const response = await axiosInstance.delete(
        `http://localhost:8000/api/web-admin/ruang/${id}/`,
      );

      // Check if the deletion was successful or if the room is used in some classes or schedules
      if (response.data.success === false) {
        if (
          response.data.message.includes(
            "Ruang terdaftar di beberapa Kelas dan Jadwal Kelas"
          )
        ) {
          Swal.fire(
            "Error",
            "Ruang terdaftar di beberapa Kelas dan Jadwal Kelas. Ganti terlebih dahulu jika ingin menghapus.",
            "error"
          );
        } else {
          Swal.fire("Error", "Failed to delete Ruang", "error");
        }
      } else {
        Swal.fire("Success", "Berhasil menghapus data Ruang", "success");
        fetchData();
      }
    } catch (error) {
      Swal.fire("Error", "An unexpected error occurred", "error");
      console.error("Error deleting Ruang:", error);
      setError("Failed to delete Ruang");
    }
  };

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Ruang Kelas" />
      <div className="mt-4">
        <div className="mb-4 flex gap-4">
          <Link href="/admin/ruang/create" legacyBehavior>
            <a className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600">
              Tambah
            </a>
          </Link>
        </div>
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex flex-col">
            <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-3">
              <div className="p-2.5 xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">Nama Ruang</h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">Lokasi</h5>
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
                    index === ruangList.length - 1
                      ? ""
                      : "border-b border-stroke dark:border-strokedark"
                  }`}
                  key={index}
                >
                  <div className="flex items-center gap-3 p-2.5 xl:p-5">
                    <p className="text-black dark:text-white">{ruang.nama_ruang}</p>
                  </div>
                  <div className="flex items-center justify-center p-2.5 xl:p-5">
                    <p className="text-meta-3">{ruang.lokasi}</p>
                  </div>
                  <div className="flex items-center justify-center space-x-2 p-2.5 xl:p-5">
                    <Link href={`/admin/ruang/edit/${index}`} legacyBehavior>
                      <a className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600">
                        Edit
                      </a>
                    </Link>
                    <Link href={`/admin/ruang/detail/${index}`} legacyBehavior>
                      <a className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600">
                        Detail
                      </a>
                    </Link>
                    <button
                      className="rounded bg-red px-3 py-1 text-white hover:bg-red"
                      onClick={() => handleDeleteRuang(index)}
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
    </div>
  );
};

export default withAuth(DataRuang);
