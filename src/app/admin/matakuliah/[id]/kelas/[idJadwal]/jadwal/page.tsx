import React from "react";
import DataJadwal from "@/components/Admin/DataJadwal";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Detail Kelas & Jadwal | Face Recognition Computer Engineeering Universitas Diponegoro",
    description:
    "Website Presensi Mahasiswa Teknik Komputer Universitas Diponegoro",
  };

const DataJadwalPage = () => {
  return (
    <DefaultLayout>
      <DataJadwal/>
    </DefaultLayout>
  );
};

export default DataJadwalPage;
