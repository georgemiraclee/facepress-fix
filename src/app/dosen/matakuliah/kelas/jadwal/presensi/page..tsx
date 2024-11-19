"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";
import axios from "axios";
import Swal from "sweetalert2";
import withAuth from "@/hoc/withAuth";

interface Presence {
  id: number;
  nama_mahasiswa: string;
  nim_mahasiswa: string;
  status_presensi: string;
}

const PresencePage = () => {
  const { jadwalId } = useParams();
  const [presenceList, setPresenceList] = useState<Presence[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jadwalId) {
      setError("No Jadwal ID provided");
      setIsLoading(false);
      return;
    }

    const fetchPresenceData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");

        const response = await axios.get(`http://localhost:8000/api/web-dosen/attendance/list/${jadwalId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPresenceList(response.data.data);
      } catch (error) {
        setError("Failed to fetch attendance data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPresenceData();
  }, [jadwalId]);

  const startPresence = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");

      await axios.post(`http://localhost:8000/api/web-dosen/attendance/start/${jadwalId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire("Success", "Presence has started", "success");
    } catch (error) {
      console.error("Error starting presence:", error);
      Swal.fire("Error", "Failed to start presence", "error");
    }
  };

  if (isLoading) {
    return <div className="p-6"><p>Loading...</p></div>;
  }

  if (error) {
    return <div className="p-6"><p className="text-red-500">{error}</p></div>;
  }

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Detail Presensi" />
      <div className="mt-4 p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Detail Presensi Kelas</h2>

        {/* Start Presence Button */}
        <button
          onClick={startPresence}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
        >
          Start Presence
        </button>

        {/* Presence List */}
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="py-2">Nama Mahasiswa</th>
              <th className="py-2">NIM</th>
              <th className="py-2">Status Presensi</th>
            </tr>
          </thead>
          <tbody>
            {presenceList.map((presence) => (
              <tr key={presence.id}>
                <td className="py-2">{presence.nama_mahasiswa}</td>
                <td className="py-2">{presence.nim_mahasiswa}</td>
                <td className="py-2">{presence.status_presensi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default withAuth(PresencePage);
