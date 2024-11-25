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
    <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
      <Breadcrumb pageName="Data Mahasiswa" />
      
      <div className="mt-4">
        <div className="mb-4">
          <Link href="/admin/datamahasiswa/create" legacyBehavior>
            <a className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition-colors">
              Tambah Mahasiswa
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
              {mahasiswas.length > 0 ? (
                mahasiswas.map((mahasiswa, index) => (
                  <div 
                    key={mahasiswa.id}
                    className="p-4 border-b border-stroke dark:border-strokedark"
                  >
                    <div className="flex flex-col space-y-3">
                      <div>
                        <h3 className="font-medium text-black dark:text-white">{mahasiswa.nama}</h3>
                        <p className="text-sm text-gray-600 mt-1">{mahasiswa.email}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">NIM:</span> {mahasiswa.nim || "-"}
                        </div>
                        <div>
                          <span className="font-medium ">Semester:</span> {mahasiswa.semester || "-"}
                        </div>
                        <div>
                          <span className="font-medium">Phone:</span> {mahasiswa.mobile_phone || "-"}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/admin/datamahasiswa/edit/${mahasiswa.id}`} legacyBehavior>
                          <a className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm">
                            Edit
                          </a>
                        </Link>
                        <Link href={`/admin/datamahasiswa/detail/${mahasiswa.id}`} legacyBehavior>
                          <a className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">
                            Detail
                          </a>
                        </Link>
                        <button
                          className="bg-red hover:bg-red text-white px-3 py-1 rounded text-sm"
                          onClick={() => handleDeleteMahasiswa(mahasiswa.id)}
                        >
                          Hapus
                        </button>
                        <Link href={`/admin/datamahasiswa/matakuliah/${mahasiswa.id}/`} legacyBehavior>
                          <a className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                            Mata Kuliah
                          </a>
                        </Link>
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
                    NIM
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-semibold">
                    Semester
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
                {mahasiswas.length > 0 ? (
                  mahasiswas.map((mahasiswa, index) => (
                    <tr 
                      key={mahasiswa.id}
                      className={`border-b border-stroke dark:border-strokedark ${
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-50'
                      }`}
                    >
                      <td className="py-4 px-4">
                        {editFormData.id === mahasiswa.id ? (
                          <input
                            type="text"
                            className="border rounded px-2 py-1 w-full"
                            value={editFormData.name}
                            onChange={(e) => handleEditChange("name", e.target.value)}
                          />
                        ) : (
                          <span className="text-black dark:text-white">{mahasiswa.nama}</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {editFormData.id === mahasiswa.id ? (
                          <input
                            type="text"
                            className="border rounded px-2 py-1 w-full"
                            value={editFormData.email}
                            onChange={(e) => handleEditChange("email", e.target.value)}
                          />
                        ) : (
                          <span className="text-black dark:text-white">{mahasiswa.email}</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span>{mahasiswa.nim || "-"}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span>{mahasiswa.semester || "-"}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span>{mahasiswa.mobile_phone || "-"}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
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
                            <>
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
                              <button
                                className="bg-red hover:bg-red text-white px-3 py-1 rounded"
                                onClick={() => handleDeleteMahasiswa(mahasiswa.id)}
                              >
                                Hapus
                              </button>
                              <Link href={`/admin/datamahasiswa/matakuliah/${mahasiswa.id}/`} legacyBehavior>
                                <a className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                                  Mata Kuliah
                                </a>
                              </Link>
                            </>
                          )}
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

export default withAuth(DataMahasiswa);