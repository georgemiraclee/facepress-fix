"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Mahasiswa } from "@/types/Mahasiswa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import withAuth from "@/hoc/withAuth";
import axiosInstance from "@/utils/axiosinstance";

const DataMahasiswa = (): JSX.Element => {
  const router = useRouter();
  const [mahasiswas, setMahasiswas] = useState<Mahasiswa[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState<{
    id: number | null;
    name: string;
    email: string;
  }>({ id: null, name: "", email: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/web-admin/mahasiswa/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMahasiswas(response.data.data);
      setIsFetching(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data");
      setIsFetching(false);
    }
  };

  const handleEditChange = (field: string, value: string) => {
    setEditFormData({ ...editFormData, [field]: value });
  };

  const handleEditMahasiswa = async () => {
    if (editFormData.id === null) return;
    try {
      await axiosInstance.patch(`http://localhost:8000/api/web-admin/mahasiswa/${editFormData.id}`, {
        nama: editFormData.name,
        email: editFormData.email,
      });
      setEditFormData({ id: null, name: "", email: "" });
      setError(null);
      fetchData();
    } catch (error) {
      console.error("Error updating Mahasiswa:", error);
      setError("Failed to update Mahasiswa");
    }
  };

  const handleDeleteMahasiswa = async (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this data!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`http://localhost:8000/api/web-admin/mahasiswa/${id}/`);
          fetchData();
          Swal.fire("Deleted!", "Mahasiswa has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting Mahasiswa:", error);
          setError("Failed to delete Mahasiswa");
        }
      }
    });
  };

  const handleCancelEdit = () => {
    setEditFormData({ id: null, name: "", email: "" });
  };
  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Data Mahasiswa" />
      <div className="mt-4">
        <div className="flex gap-4 mb-4">
          <Link href="/admin/datamahasiswa/create" legacyBehavior>
            <a className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
              Tambah
            </a>
          </Link>
        </div>
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex flex-col">
            <div className="grid grid-cols-6 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-6">
              <div className="p-2.5 xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">Nama</h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">Email</h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">NIM</h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">Semester</h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">Mobile Phone</h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">Actions</h5>
              </div>
            </div>
            {mahasiswas.length > 0 ? (
              mahasiswas.map((mahasiswa) => (
                <div
                  className={`grid grid-cols-6 sm:grid-cols-6 border-b border-stroke dark:border-strokedark`}
                  key={mahasiswa.id}
                >
                  <div className="flex items-center gap-3 p-2.5 xl:p-5">
                    {editFormData.id === mahasiswa.id ? (
                      <input
                        type="text"
                        className="border rounded px-2 py-1"
                        value={editFormData.name}
                        onChange={(e) => handleEditChange("name", e.target.value)}
                      />
                    ) : (
                      <p className="text-black dark:text-white">{mahasiswa.nama}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-center p-2.5 xl:p-5">
                    {editFormData.id === mahasiswa.id ? (
                      <input
                        type="text"
                        className="border rounded px-2 py-1"
                        value={editFormData.email}
                        onChange={(e) => handleEditChange("email", e.target.value)}
                      />
                    ) : (
                      <p className="text-black dark:text-white">{mahasiswa.email}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-center p-2.5 xl:p-5">
                    <p className="text-meta-3">{mahasiswa.nim || "-"}</p>
                  </div>
                  <div className="flex items-center justify-center p-2.5 xl:p-5">
                    <p className="text-meta-3">{mahasiswa.semester || "-"}</p>
                  </div>
                  <div className="flex items-center justify-center p-2.5 xl:p-5">
                    <p className="text-meta-3">{mahasiswa.mobile_phone || "-"}</p>
                  </div>
                  <div className="flex items-center justify-center p-2.5 xl:p-5 space-y-2 flex-wrap">
                    {editFormData.id === mahasiswa.id ? (
                      <>
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                          onClick={handleEditMahasiswa}
                        >
                          Save
                        </button>
                        <button
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-wrap justify-center gap-2">
                        <div className="flex flex-col space-y-2">
                          <Link href={`/admin/datamahasiswa/edit/${mahasiswa.id}`} legacyBehavior>
                            <a className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
                              Edit
                            </a>
                          </Link>
                          <Link href={`/admin/datamahasiswa/detail/${mahasiswa.id}`} legacyBehavior>
                            <a className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                              Detail
                            </a>
                          </Link>
                        </div>
                        <button
                            className="bg-red hover:bg-red text-white px-3 py-1 rounded"
                            onClick={() => handleDeleteMahasiswa(mahasiswa.id)}
                          >
                            Hapus
                          </button>
                        <div className="flex flex-col space-y-2">
                          <Link href={`/admin/datamahasiswa/matakuliah/${mahasiswa.id}/`} legacyBehavior>
                            <a className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                              Mata Kuliah
                            </a>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center p-5">No Mahasiswa data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(DataMahasiswa);
