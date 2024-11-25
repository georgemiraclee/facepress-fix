"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import Link from "next/link";
import { Dosen } from "@/types/Dosen";
import withAuth from "@/hoc/withAuth";
import axiosInstance from "@/utils/axiosinstance";

const DataDosen = (): JSX.Element => {
  const router = useRouter();
  const [dosens, setDosens] = useState<Dosen[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/web-admin/dosen/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDosens(response.data.data);
      setIsFetching(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data");
      setIsFetching(false);
      Swal.fire("Error", "Failed to fetch data", "error");
    }
  };

  const handleDeleteDosen = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.delete(`http://localhost:8000/api/web-admin/dosen/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.data.success === false) {
        setError(response.data.message);
        Swal.fire("Error", response.data.message, "error");
      } else {
        fetchData();
        Swal.fire("Success", response.data.message, "success");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Axios error response:", error.response);
        
        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data?.message || "Bad Request";
          setError(errorMessage);
          Swal.fire("Error", errorMessage, "error");
        } else {
          setError("Failed to delete Dosen");
          Swal.fire("Error", "Failed to delete Dosen", "error");
        }
      } else {
        console.error("Unexpected error:", error);
        setError("An unexpected error occurred");
        Swal.fire("Error", "An unexpected error occurred", "error");
      }
    }
  };

  return (
    <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
      <Breadcrumb pageName="Data Dosen" />
      
      <div className="mt-4">
        <div className="mb-4">
          <Link href="/admin/datadosen/create" legacyBehavior>
            <a className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition-colors">
              Tambah Dosen
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
              {dosens.length > 0 ? (
                dosens.map((dosen, index) => (
                  <div 
                    key={dosen.id}
                    className="p-4 border-b border-stroke dark:border-strokedark"
                  >
                    <div className="flex flex-col space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-black dark:text-white">{dosen.nama}</p>
                          <p className="text-sm text-gray-600 mt-1">{dosen.email}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">NIP:</span> {dosen.nip || "-"}
                        </div>
                        <div>
                          <span className="font-medium">Phone:</span> {dosen.mobile_phone || "-"}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/admin/datadosen/edit/${dosen.id}`} legacyBehavior>
                          <a className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm">
                            Edit
                          </a>
                        </Link>
                        <Link href={`/admin/datadosen/detail/${dosen.id}`} legacyBehavior>
                          <a className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">
                            Detail
                          </a>
                        </Link>
                        <button
                          className="bg-red hover:bg-red text-white px-3 py-1 rounded text-sm"
                          onClick={() => handleDeleteDosen(dosen.id)}
                        >
                          Delete
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
                    Email
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-semibold">
                    NIP
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-semibold">
                    Mobile Phone
                  </th>
                  <th className="py-4 px-4 text-center text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {dosens.length > 0 ? (
                  dosens.map((dosen, index) => (
                    <tr 
                      key={dosen.id}
                      className={`border-b border-stroke dark:border-strokedark ${
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-50'
                      }`}
                    >
                      <td className="py-4 px-4">
                        <span className="text-black dark:text-white">{dosen.nama}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-black dark:text-white">{dosen.email}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span>{dosen.nip || "-"}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span>{dosen.mobile_phone || "-"}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Link href={`/admin/datadosen/edit/${dosen.id}`} legacyBehavior>
                            <a className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
                              Edit
                            </a>
                          </Link>
                          <Link href={`/admin/datadosen/detail/${dosen.id}`} legacyBehavior>
                            <a className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                              Detail
                            </a>
                          </Link>
                          <button
                            className="bg-red hover:bg-red text-white px-3 py-1 rounded"
                            onClick={() => handleDeleteDosen(dosen.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : isFetching ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 text-center">
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

export default withAuth(DataDosen);