import { useEffect, useState } from "react";
import axios from "axios";
import withAuth from "@/hoc/withAuth";

// Define the interface for Mata Kuliah (Courses)
export interface MataKuliah {
  id: number;
  nama: string;
  namaEnglish: string;
  kode: string;
  type: string;
  sks: number;
  semester: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

// Define the interface for Jadwal (Schedule)
export interface Jadwal {
  id: number;
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  mataKuliahId: number;
  kelasId: number;
  ruangId: number;
  dosenId: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  matakuliah: MataKuliah;
}

const JadwalTerdekat = (): JSX.Element => {
  const [jadwals, setJadwals] = useState<Jadwal[]>([]); // State to store fetched schedules
  const [error, setError] = useState<string | null>(null); // State to store error message
  const [loading, setLoading] = useState<boolean>(true); // State to indicate loading status

  // useEffect to fetch schedule data when the component mounts
  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage for authentication
        const response = await axios.get(
          "http://localhost:8000/api/web-dosen/jadwal-terdekat/",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            },
          }
        );

        console.log("Response Data:", response.data);
        
        // Set the jadwals state to the fetched data
        setJadwals(response.data.data || []); // Ensure to set to an empty array if data is undefined
      } catch (error) {
        console.error("Error fetching schedule data:", error);
        setError("Gagal mengambil data jadwal"); // Set error message if fetching fails
      } finally {
        setLoading(false); // Stop loading once request completes
      }
    };

    fetchJadwal(); // Invoke the function
  }, []);

  // Show loading message while data is being fetched
  if (loading) {
    return <p>Loading...</p>;
  }

  // Render the schedules or an error message if any
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Jadwal Terdekat yang Diampu
      </h4>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-col">
        {/* Header of the Schedule Table */}
        <div className="grid grid-cols-4 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-4">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Mata Kuliah
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Tanggal
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Jam Mulai
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Jam Selesai
            </h5>
          </div>
        </div>

        {/* Render the schedule rows */}
        {jadwals.length > 0 ? (
          jadwals.map((jadwal, index) => (
            <div
              className={`grid grid-cols-4 sm:grid-cols-4 ${
                index === jadwals.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"
              }`}
              key={jadwal.id}
            >
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <p className="text-black dark:text-white">
                  {jadwal.matakuliah.nama}
                </p>
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{jadwal.tanggal}</p>
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{jadwal.jam_mulai}</p>
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{jadwal.jam_selesai}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-black dark:text-white">Tidak ada Jadwal yang tersedia.</p>
        )}
      </div>
    </div>
  );
};

export default withAuth(JadwalTerdekat); // Protect the component with authentication
