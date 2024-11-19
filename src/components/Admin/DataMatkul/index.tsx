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
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Data Mata Kuliah" />
      <div className="mt-4">
        <div className="flex gap-4 mb-4">
          <Link href="/admin/matakuliah/create" legacyBehavior>
            <a className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
              Tambah
            </a>
          </Link>
        </div>
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          {error && <p className="text-red-500">{error}</p>}
          {isFetching ? (
            <p>Loading data...</p>
          ) : (
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
                      {editMatkulId === matkul.id ? (
                        <input
                          type="text"
                          className="border rounded px-2 py-1"
                          value={editMatkulName}
                          onChange={(e) => setEditMatkulName(e.target.value)}
                        />
                      ) : (
                        <p className="text-black dark:text-white">{matkul.nama}</p>
                      )}
                    </div>
                    <div className="flex items-center p-2.5 xl:p-5">
                      {editMatkulId === matkul.id ? (
                        <input
                          type="text"
                          className="border rounded px-2 py-1"
                          value={editMatkulKode}
                          onChange={(e) => setEditMatkulKode(e.target.value)}
                        />
                      ) : (
                        <p className="text-black dark:text-white">{matkul.kode}</p>
                      )}
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
                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                      {editMatkulId === matkul.id ? (
                        <>
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                            onClick={() => handleEditMatkul(matkul.id)}
                          >
                            Save
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded ml-2"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                       <div className="flex space-x-2">
                        {/* Kelas Button */}
                        <Link href={`/admin/matakuliah/${matkul.id}/kelas/`} legacyBehavior>
                          <a className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded">
                            Kelas
                          </a>
                        </Link>

                        {/* Delete Button */}
                        <button
                          className="bg-red hover:bg-red text-white px-4 py-1 rounded"
                          onClick={() => handleDeleteMatkul(matkul.id)}
                        >
                          Delete
                        </button>

                        {/* Edit Button */}
                        <Link href={`/admin/matakuliah/edit/${matkul.id}`} legacyBehavior>
                          <a className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded">
                            Edit
                          </a>
                        </Link>
                      </div>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">No Mata Kuliah found</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withAuth(DataMatkul);
