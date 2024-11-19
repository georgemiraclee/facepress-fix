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

// Define the Dosen interface based on the API response

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
      setDosens(response.data.data); // Updated to match API response
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
        setError(response.data.message); // Set error to be displayed on the frontend
        Swal.fire("Error", response.data.message, "error");
      } else {
        fetchData(); // Refresh the data
        Swal.fire("Success", response.data.message, "success");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Axios error response:", error.response);
        
        // Handle the 400 Bad Request error
        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data?.message || "Bad Request";
          setError(errorMessage); // Set error to be displayed on the frontend
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
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Data Dosen" />
      <div className="mt-4">
        <div className="flex gap-4 mb-4">
          <Link href="/admin/datadosen/create" legacyBehavior>
            <a className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
              Tambah
            </a>
          </Link>
        </div>
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex flex-col">
            <div className="grid grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
              <div className="p-2.5 xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">Nama</h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">Email</h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">NIP</h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">Mobile Phone</h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">Actions</h5>
              </div>
            </div>
            {dosens.length > 0 ? (
              dosens.map((dosen, index) => (
                <div
                  className={`grid grid-cols-5 sm:grid-cols-5 ${
                    index === dosens.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"
                  }`}
                  key={dosen.id} // Use `id` as key
                >
                  <div className="flex items-center gap-3 p-2.5 xl:p-5">
                    <p className="text-black dark:text-white">{dosen.nama}</p>
                  </div>
                  <div className="flex items-center justify-center p-2.5 xl:p-5">
                    <p className="text-black dark:text-white">{dosen.email}</p>
                  </div>
                  <div className="flex items-center justify-center p-2.5 xl:p-5">
                    <p className="text-meta-3">{dosen.nip || "-"}</p>
                  </div>
                  <div className="flex items-center justify-center p-2.5 xl:p-5">
                    <p className="text-meta-3">{dosen.mobile_phone || "-"}</p>
                  </div>
                  <div className="flex items-center justify-center p-2.5 xl:p-5 space-x-2">
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
                      onClick={() => handleDeleteDosen(dosen.id)} // Pass the ID instead of email
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : isFetching ? (
              <p>Loading...</p>
            ) : (
              <p>No data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(DataDosen);
