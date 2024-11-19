"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Dosen/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Dosen/Layouts/DefaultLayout";
import axios from "axios";
import withAuth from "@/hoc/withAuth";
import Swal from "sweetalert2"; // Import SweetAlert
import { useParams } from "next/navigation";

const AddJadwal = () => {
  const router = useRouter();
  const { id_kelas } = useParams();

  // State untuk menyimpan data form
  const [jadwal, setJadwal] = useState({
    tanggal: "",
    jam_mulai: "",
    jam_selesai: "",
    dosen: 0, // Dosen ID
    status: "belum dimulai", // Status default
  });

  // Fungsi untuk mengirim form
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token otentikasi tidak ditemukan");

      const response = await axios.post(
        `http://localhost:8000/api/web-dosen/kelas/${id_kelas}/`,
        {
          tanggal: jadwal.tanggal,
          jam_mulai: jadwal.jam_mulai,
          jam_selesai: jadwal.jam_selesai,
          dosen: jadwal.dosen, // Dosen ID
          status: jadwal.status, // Sertakan status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      console.log("Tambah jadwal berhasil:", response.data);
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Jadwal berhasil ditambahkan!",
      }).then(() => {
        router.back(); // Arahkan kembali setelah berhasil
      });
    } catch (error: any) {
      console.error(
        "Terjadi kesalahan saat menambah jadwal:",
        error.response?.data || error.message
      );
      Swal.fire({
        icon: "error",
        title: "Kesalahan",
        text: "Gagal menambah jadwal!",
      });
    }
  };

  // Fungsi untuk menangani perubahan input
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setJadwal((prevJadwal) => ({
      ...prevJadwal,
      [name]: value === "" ? "" : value,
    }));
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Tambah Jadwal" />
        <div className="grid gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Tambah Jadwal
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-5.5">
                    <label
                      htmlFor="tanggal"
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                    >
                      Tanggal
                    </label>
                    <input
                      type="date"
                      id="tanggal"
                      name="tanggal"
                      value={jadwal.tanggal}
                      onChange={handleInputChange}
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-5.5">
                    <label
                      htmlFor="jamMulai"
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                    >
                      Jam Mulai
                    </label>
                    <input
                      type="time"
                      id="jamMulai"
                      name="jam_mulai"
                      value={jadwal.jam_mulai}
                      onChange={handleInputChange}
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-5.5">
                    <label
                      htmlFor="jamSelesai"
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                    >
                      Jam Selesai
                    </label>
                    <input
                      type="time"
                      id="jamSelesai"
                      name="jam_selesai"
                      value={jadwal.jam_selesai}
                      onChange={handleInputChange}
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-5.5">
                    <label
                      htmlFor="dosen"
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                    >
                      Dosen ID
                    </label>
                    <input
                      type="number"
                      id="dosen"
                      name="dosen" // Dosen ID
                      value={jadwal.dosen}
                      onChange={handleInputChange}
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="flex justify-end gap-4.5">
                    <button
                      type="button"
                      className="flex justify-center rounded bg-meta-1 py-2 px-6 font-medium text-white"
                      onClick={() => router.back()}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray"
                    >
                      Tambah
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default withAuth(AddJadwal);
