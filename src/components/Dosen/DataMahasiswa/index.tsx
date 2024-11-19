"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Mahasiswa } from "@/types/Mahasiswa";
import { useRouter } from "next/navigation";
import Link from "next/link";

const DataMahasiswa = (): JSX.Element => {
  const router = useRouter();
  const [mahasiswas, setMahasiswas] = useState<Mahasiswa[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [newMahasiswaName, setNewMahasiswaName] = useState<string>("");
  const [newMahasiswaEmail, setNewMahasiswaEmail] = useState<string>("");
  const [editMahasiswaId, setEditMahasiswaId] = useState<number | null>(null);
  const [editMahasiswaName, setEditMahasiswaName] = useState<string>("");
  const [editMahasiswaEmail, setEditMahasiswaEmail] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get("http://localhost:8000/api/mahasiswa");
      setMahasiswas(response.data.mahasiswas);
      setIsFetching(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data");
      setIsFetching(false);
    }
  };

  const handleCreateMahasiswa = async () => {
    try {
      await axios.post("http://localhost:8000/api/mahasiswa", {
        nama: newMahasiswaName,
        email: newMahasiswaEmail,
      });
      setNewMahasiswaName("");
      setNewMahasiswaEmail("");
      fetchData();
    } catch (error) {
      console.error("Error creating Mahasiswa:", error);
      setError("Failed to create Mahasiswa");
    }
  };

  const handleEditMahasiswa = async (id: number) => {
    try {
      await axios.patch(`http://localhost:8000/api/mahasiswa/${id}`, {
        nama: editMahasiswaName,
        email: editMahasiswaEmail,
      });
      setEditMahasiswaId(null);
      setEditMahasiswaName("");
      setEditMahasiswaEmail("");
      setError(null);
      fetchData();
    } catch (error) {
      console.error("Error updating Mahasiswa:", error);
      setError("Failed to update Mahasiswa");
    }
  };

  const handleDeleteMahasiswa = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/mahasiswa/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting Mahasiswa:", error);
      setError("Failed to delete Mahasiswa");
    }
  };

  const handleCancelEdit = () => {
    setEditMahasiswaId(null);
    setEditMahasiswaName("");
    setEditMahasiswaEmail("");
  };

  return (
    <div className="mt-4">
      <div className="flex gap-4 mb-4">
        <Link href="/admin/datamahasiswa/create" legacyBehavior>
          <a className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
            Tambah
          </a>
        </Link>
      </div>
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Data Mahasiswa
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
              <h5 className="text-sm font-medium uppercase xsm:text-base">NIM</h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Actions</h5>
            </div>
          </div>
          {mahasiswas.length > 0 ? (
            mahasiswas.map((mahasiswa, index) => (
              <div
                className={`grid grid-cols-5 sm:grid-cols-5 ${
                  index === mahasiswas.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"
                }`}
                key={mahasiswa.id}
              >
                <div className="flex items-center gap-3 p-2.5 xl:p-5">
                  {editMahasiswaId === mahasiswa.id ? (
                    <input
                      type="text"
                      className="border rounded px-2 py-1"
                      value={editMahasiswaName}
                      onChange={(e) => setEditMahasiswaName(e.target.value)}
                    />
                  ) : (
                    <p className="text-black dark:text-white">{mahasiswa.nama}</p>
                  )}
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  {editMahasiswaId === mahasiswa.id ? (
                    <input
                      type="text"
                      className="border rounded px-2 py-1"
                      value={editMahasiswaEmail}
                      onChange={(e) => setEditMahasiswaEmail(e.target.value)}
                    />
                  ) : (
                    <p className="text-black dark:text-white">{mahasiswa.email}</p>
                  )}
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-meta-3">{mahasiswa.nim || "-"}</p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5 space-x-2">
                  {editMahasiswaId === mahasiswa.id ? (
                    <>
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        onClick={() => handleEditMahasiswa(mahasiswa.id)}
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

export default DataMahasiswa;
