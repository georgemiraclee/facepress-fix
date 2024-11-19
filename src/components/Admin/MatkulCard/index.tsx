import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import withAuth from "@/hoc/withAuth";

// Define the TypeScript interface to match the API response
interface MataKuliah {
  id: number;
  nama: string;
  kode: string;
  sks: number;
}

const MatkulCard = (): JSX.Element => {
  const [mataKuliahList, setMataKuliahList] = useState<MataKuliah[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMataKuliah = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        const response = await axios.get("http://localhost:8000/api/web-admin/mata-kuliah/", {
          headers: {
            Authorization: `Bearer ${token}`, // Add Bearer token to headers
          },
        });
        console.log("Response:", response.data); // Debug: Log response data
        setMataKuliahList(response.data.data); // Set mataKuliahList with response.data.data
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data"); // Set error message
      }
    };

    fetchMataKuliah();
  }, []); // Empty dependency array means this effect will run once after the initial render.

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
        Mata Kuliah Teknik Komputer
      </h4>

      <div>
        {error && (
          <div className="px-7.5 py-3 text-red-600">
            {error}
          </div>
        )}
        {!error && mataKuliahList.length > 0 ? (
          mataKuliahList.map((matkul) => (
            <Link
              href={`admin/matakuliah/${matkul.id}/kelas/`} // Adjust the URL to match your routing
              className="flex items-center gap-5 px-7.5 py-3 hover:bg-gray-3 dark:hover:bg-meta-4"
              key={matkul.id}
            >
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <h5 className="font-medium text-black dark:text-white">
                    {matkul.nama}
                  </h5>
                  <p className="text-sm text-black dark:text-white">
                    Kode: {matkul.kode} | SKS: {matkul.sks}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="px-7.5 py-3 text-sm text-gray-500 dark:text-gray-400">
            No data available
          </p>
        )}
      </div>
    </div>
  );
};

export default withAuth(MatkulCard);
