import React from "react";
import { Metadata } from "next";
import DataJadwal from "@/components/Dosen/DetailKelas";
import DefaultLayout from "@/components/Dosen/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Detail Kelas & Jadwal | Face Recognition Computer Engineeering Universitas Diponegoro",
  description: "Website Presensi Mahasiswa Teknik Komputer Universitas Diponegoro",
};

const DataJadwalPage = () => {
  return (
    <DefaultLayout>
      <DataJadwal/>
    </DefaultLayout>
  );
};

export default DataJadwalPage;
