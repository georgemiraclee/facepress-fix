import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import withAuth from "@/hoc/withAuth";  // Import the withAuth HOC

// Define the TypeScript interface to match the API response
interface MataKuliahDiampu {
  id: number;
  nama: string;
  kode: string;
  sks: number;
  nama_english?: string; // Optional field for English name
  type?: string;        // Optional field for course type (e.g., "Wajib")
  semester?: number;    // Optional field for semester
  status?: string;      // Optional field for status (e.g., "aktif")
}

// Main component to fetch and display list of Mata Kuliah
const MatkulCard = (): JSX.Element => {
  const [mataKuliahList, setMataKuliahList] = useState<MataKuliahDiampu[]>([]);  // State for Mata Kuliah list
  const [error, setError] = useState<string | null>(null);  // State for error handling

  // useEffect to fetch the Mata Kuliah list when the component mounts
  useEffect(() => {
    const fetchMataKuliahDiampu = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from local storage
        const response = await axios.get("http://localhost:8000/api/web-dosen/mata-kuliah/", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });

        console.log("Response:", response.data); // Log response for debugging
        setMataKuliahList(response.data.data); // Set the fetched data to state
      } catch (error) {
        console.error("Error fetching data:", error);
        if (axios.isAxiosError(error) && error.response) {
          console.log(error.response); // Log error response for debugging
          setError("Failed to fetch data"); // Set error message in state
        } else {
          setError("An unexpected error occurred"); // Handle other types of errors
        }
      }
    };

    fetchMataKuliahDiampu(); // Call the function to fetch data
  }, []);

  // Render the component UI
  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
        Mata Kuliah yang Diampu
      </h4>

      <div>
        {/* Show error message if there is one */}
        {error && (
          <div className="px-7.5 py-3 text-red-600">
            {error}
          </div>
        )}
        {/* Map through mataKuliahList and display each course as a link */}
        {!error && mataKuliahList.map((matkul) => (
          <Link
            href={`/dosen/matakuliah/kelas/${matkul.id}/`} // Adjust the URL to match your routing setup
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
        ))}
      </div>
    </div>
  );
};

export default withAuth(MatkulCard);  // Wrap the component with authentication HOC
