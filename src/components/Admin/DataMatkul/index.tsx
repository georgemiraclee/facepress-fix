"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import { MataKuliah } from "@/types/MataKuliah";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import withAuth from "@/hoc/withAuth";
import axiosInstance from "@/utils/axiosinstance";

const DataMatkul = (): JSX.Element => {
  const router = useRouter();
  const [mataKuliahList, setMataKuliahList] = useState<MataKuliah[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [newMatkulName, setNewMatkulName] = useState<string>("");
  const [newMatkulKode, setNewMatkulKode] = useState<string>("");
  const [editMatkulId, setEditMatkulId] = useState<number | null>(null);
  const [editMatkulName, setEditMatkulName] = useState<string>("");
  const [editMatkulKode, setEditMatkulKode] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const response = await axiosInstance.get("/web-admin/mata-kuliah/");
      setMataKuliahList(response.data.data); // Adjusted to match the API response structure
      setIsFetching(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data");
      setIsFetching(false);
    }
  };

  const handleCreateMatkul = async () => {
    if (!newMatkulName || !newMatkulKode) {
      Swal.fire("Warning", "Nama dan kode Mata Kuliah tidak boleh kosong", "warning");
      return;
    }

    try {
      await axiosInstance.post("/web-admin/mata-kuliah", {
        nama: newMatkulName,
        kode: newMatkulKode,
      });
      setNewMatkulName("");
      setNewMatkulKode("");
      fetchData();
      Swal.fire("Success", "Mata Kuliah berhasil ditambahkan", "success");
    } catch (error) {
      console.error("Error creating Mata Kuliah:", error);
      setError("Failed to create Mata Kuliah");
      Swal.fire("Error", "Gagal menambahkan Mata Kuliah", "error");
    }
  };

  const handleEditMatkul = async (id: number) => {
    if (!editMatkulName || !editMatkulKode) {
      Swal.fire("Warning", "Nama dan kode Mata Kuliah tidak boleh kosong", "warning");
      return;
    }

    try {
      await axiosInstance.patch(`/web-admin/mata-kuliah/${id}/`, {
        nama: editMatkulName,
        kode: editMatkulKode,
      });
      setEditMatkulId(null);
      setEditMatkulName("");
      setEditMatkulKode("");
      fetchData();
      Swal.fire("Success", "Mata Kuliah berhasil diupdate", "success");
    } catch (error) {
      console.error("Error updating Mata Kuliah:", error);
      setError("Failed to update Mata Kuliah");
      Swal.fire("Error", "Gagal mengupdate Mata Kuliah", "error");
    }
  };

  const handleDeleteMatkul = async (id: number) => {
    Swal.fire({
      title: "Anda yakin ingin mengapus?",
      text: "Anda tidak bisa mengembalikan datanya!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/web-admin/mata-kuliah/${id}/`);
          fetchData();
          Swal.fire("Data Terhapus!", "Mata Kuliah sudah terhapus.", "success");
        } catch (error) {
          console.error("Error deleting Mata Kuliah:", error);
          setError("Failed to delete Mata Kuliah");
          Swal.fire("Error", "Gagal menghapus Mata Kuliah", "error");
        }
      }
    });
  };

  const handleCancelEdit = () => {
    setEditMatkulId(null);
    setEditMatkulName("");
    setEditMatkulKode("");
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
                        <Link href={`/admin/matakuliah/edit/${matkul.id}`} legacyBehavior>
                          <a className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm">
                            Edit
                          </a>
                        </Link>
                        <button
                          className="bg-red hover:bg-red text-white px-3 py-1 rounded text-sm"
                          onClick={() => handleDeleteMatkul(matkul.id)}
                        >
                          Hapus
                        </button>
                        <Link href={`/admin/matakuliah/${matkul.id}/kelas/`} legacyBehavior>
                          <a className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                            Kelas
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
                              <Link href={`/admin/matakuliah/edit/${matkul.id}`} legacyBehavior>
                                <a className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
                                  Edit
                                </a>
                              </Link>
                              <button
                                className="bg-red hover:bg-red text-white px-3 py-1 rounded"
                                onClick={() => handleDeleteMatkul(matkul.id)}
                              >
                                Hapus
                              </button>
                              <Link href={`/admin/matakuliah/${matkul.id}/kelas/`} legacyBehavior>
                                <a className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                                  Kelas
                                </a>
                              </Link>
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

export default withAuth(DataMatkul);