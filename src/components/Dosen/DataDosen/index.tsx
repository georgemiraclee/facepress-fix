"use client";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { Dosen } from "@/types/Dosen";
import { useRouter } from "next/navigation";
import Link from "next/link";

const DataDosen = (): JSX.Element => {
  const router = useRouter();
  const [dosens, setDosens] = useState<Dosen[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [newDosenName, setNewDosenName] = useState<string>("");
  const [newDosenEmail, setNewDosenEmail] = useState<string>("");
  const [editDosenId, setEditDosenId] = useState<number | null>(null);
  const [editDosenName, setEditDosenName] = useState<string>("");
  const [editDosenEmail, setEditDosenEmail] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get("http://localhost:8000/api/dosen");
      setDosens(response.data.dosens);
      setIsFetching(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data");
      setIsFetching(false);
      Swal.fire("Error", "Failed to fetch data", "error");
    }
  };

  const handleCreateDosen = async () => {
    try {
      await axios.post("http://localhost:8000/api/dosen", {
        nama: newDosenName,
        email: newDosenEmail,
      });
      setNewDosenName("");
      setNewDosenEmail("");
      fetchData();
      Swal.fire("Success", "Dosen created successfully", "success");
    } catch (error) {
      console.error("Error creating Dosen:", error);
      setError("Failed to create Dosen");
      Swal.fire("Error", "Failed to create Dosen", "error");
    }
  };

  const handleEditDosen = async (id: number) => {
    try {
      await axios.patch(`http://localhost:8000/api/dosen/${id}`, {
        nama: editDosenName,
        email: editDosenEmail,
      });
      setEditDosenId(null);
      setEditDosenName("");
      setEditDosenEmail("");
      setError(null);
      fetchData();
      Swal.fire("Success", "Dosen updated successfully", "success");
    } catch (error) {
      console.error("Error updating Dosen:", error);
      setError("Failed to update Dosen");
      Swal.fire("Error", "Failed to update Dosen", "error");
    }
  };

  const handleDeleteDosen = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/dosen/${id}`);
      fetchData();
      Swal.fire("Success", "Dosen deleted successfully", "success");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data && error.response.data.mataKuliah) {
          const mataKuliah = error.response.data.mataKuliah.map((mk: any) => `${mk.nama} (${mk.kode})`).join(", ");
          setError(`Dosen terdaftar di mata kuliah berikut: ${mataKuliah}. Ganti terlebih dahulu jika ingin menghapus.`);
          Swal.fire("Error", `Dosen terdaftar di mata kuliah berikut: ${mataKuliah}. Ganti terlebih dahulu jika ingin menghapus.`, "error");
        } else {
          console.error("Error deleting Dosen:", error);
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

  const handleCancelEdit = () => {
    setEditDosenId(null);
    setEditDosenName("");
    setEditDosenEmail("");
  };

  return (
    <div className="mt-4">
      <div className="flex gap-4 mb-4">
        <Link href="/admin/datadosen/create" legacyBehavior>
          <a className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
            Tambah
          </a>
        </Link>
      </div>
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Data Dosen
        </h4>
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
              <h5 className="text-sm font-medium uppercase xsm:text-base">Actions</h5>
            </div>
          </div>
          {dosens.length > 0 ? (
            dosens.map((dosen, index) => (
              <div
                className={`grid grid-cols-5 sm:grid-cols-5 ${
                  index === dosens.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"
                }`}
                key={dosen.id}
              >
                <div className="flex items-center gap-3 p-2.5 xl:p-5">
                  {editDosenId === dosen.id ? (
                    <input
                      type="text"
                      className="border rounded px-2 py-1"
                      value={editDosenName}
                      onChange={(e) => setEditDosenName(e.target.value)}
                    />
                  ) : (
                    <p className="text-black dark:text-white">{dosen.nama}</p>
                  )}
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  {editDosenId === dosen.id ? (
                    <input
                      type="text"
                      className="border rounded px-2 py-1"
                      value={editDosenEmail}
                      onChange={(e) => setEditDosenEmail(e.target.value)}
                    />
                  ) : (
                    <p className="text-black dark:text-white">{dosen.email}</p>
                  )}
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-meta-3">{dosen.nip || "-"}</p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5 space-x-2">
                  {editDosenId === dosen.id ? (
                    <>
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        onClick={() => handleEditDosen(dosen.id)}
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
                    </>
                  )}
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
  );
};

export default DataDosen;
