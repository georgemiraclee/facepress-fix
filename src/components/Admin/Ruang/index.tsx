"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import withAuth from "@/hoc/withAuth";
import axiosInstance from "@/utils/axiosinstance";

interface Ruang {
  id: number;
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
      const response = await axiosInstance.get("/web-admin/ruang/");
      setRuangList(response.data.data); // Pastikan struktur sesuai dengan API
      setIsFetching(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data");
      setIsFetching(false);
    }
  };

  const handleDeleteRuang = async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/web-admin/ruang/${id}/`);
      if (response.data.success === false) {
        Swal.fire(
          "Error",
          "Ruang terdaftar di beberapa Kelas dan Jadwal Kelas. Ganti terlebih dahulu jika ingin menghapus.",
          "error"
        );
      } else {
        Swal.fire("Success", "Berhasil menghapus data Ruang", "success");
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting Ruang:", error);
      Swal.fire("Error", "An unexpected error occurred", "error");
    }
  };

  const renderLoadingOrError = () => {
    if (isFetching) {
      return <p>Loading...</p>;
    }

    if (error) {
      return (
        <div className="p-4 bg-red-50 text-red-500 border-b border-stroke">
          {error}
        </div>
      );
    }

    if (ruangList.length === 0) {
      return <div className="p-4 text-center">No data available</div>;
    }

    return null;
  };

  return (
    <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
      <Breadcrumb pageName="Ruang Kelas" />
      
      <div className="mt-4">
        <div className="mb-4">
          <Link href="/admin/ruang/create">
            <button className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition-colors">
              Tambah
            </button>
          </Link>
        </div>

        <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          {renderLoadingOrError()}
        {/* Mobile View */}
        <div className="w-full overflow-x-auto block md:hidden">
          {ruangList.map((ruang) => (
            <div
              key={ruang.id}
              className="border-b border-stroke dark:border-strokedark p-4"
            >
              {/* Nama Ruang */}
              <div>
                <p className="font-medium text-black dark:text-white">
                  {ruang.nama_ruang}
                </p>
                <p className="text-sm">Lokasi: {ruang.lokasi || "-"}</p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap justify-start gap-2 mt-3">
                <Link href={`/admin/ruang/edit/${ruang.id}`}>
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm">
                    Edit
                  </button>
                </Link>
                <Link href={`/admin/ruang/detail/${ruang.id}`}>
                  <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">
                    Detail
                  </button>
                </Link>
                <button
                  className="bg-red hover:bg-red text-white px-3 py-1 rounded text-sm"
                  onClick={() => handleDeleteRuang(ruang.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
          {/* Desktop View */}
          <table className="hidden md:table min-w-full">
            <thead>
              <tr className="bg-gray-2 dark:bg-meta-4">
                <th className="py-4 px-4 text-left text-sm font-semibold">
                  Nama
                </th>
                <th className="py-4 px-4 text-left text-sm font-semibold">
                  Lokasi
                </th>
                <th className="py-4 px-4 text-center text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {ruangList.map((ruang) => (
                <tr
                  key={ruang.id}
                  className="border-b border-stroke dark:border-strokedark"
                >
                  <td className="py-4 px-4 text-black dark:text-white">
                    {ruang.nama_ruang}
                  </td>
                  <td className="py-4 px-4 text-black dark:text-white">
                    {ruang.lokasi || "-"}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Link href={`/admin/ruang/edit/${ruang.id}`}>
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
                          Edit
                        </button>
                      </Link>
                      <Link href={`/admin/ruang/detail/${ruang.id}`}>
                        <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                          Detail
                        </button>
                      </Link>
                      <button
                        className="bg-red hover:bg-red text-white px-3 py-1 rounded"
                        onClick={() => handleDeleteRuang(ruang.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default withAuth(DataRuang);
