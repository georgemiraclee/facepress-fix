import { useEffect, useState } from "react";
import axios from "axios";
import { Dosen } from "@/types/Dosen"; // Adjust path as per your project structure
import withAuth from "@/hoc/withAuth";

const TableAdmin = (): JSX.Element => {
  const [dosens, setDosens] = useState<Dosen[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/api/web-admin/dosen/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // Correctly access the dosens array
        setDosens(response.data.data); 
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data");
      }
    };
  
    fetchData();
  }, []);
  

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Data Dosen
      </h4>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-3">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Nama
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Email
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              NIP
            </h5>
          </div>
        </div>
        {dosens.length > 0 ? (
          dosens.map((dosen, index) => (
            <div
              className={`grid grid-cols-3 sm:grid-cols-3 ${
                index === dosens.length - 1
                  ? ""
                  : "border-b border-stroke dark:border-strokedark"
              }`}
              key={dosen.id}
            >
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <p className="text-black dark:text-white">
                  {dosen.nama} {/* Ensure 'nama' matches your API response */}
                </p>
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{dosen.email}</p>
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-meta-3">{dosen.nip || "-"}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
};

export default withAuth (TableAdmin);
