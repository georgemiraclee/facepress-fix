import React from "react";
import DataKelas from "@/components/Dosen/DataKelas";
import { Metadata } from "next";
import DefaultLayout from "@/components/Dosen/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Detail Mata Kuliah dan Kelas | Face Recognition Computer Engineeering Universitas Diponegoro",
  description: "Website Presensi Mahasiswa Teknik Komputer Universitas Diponegoro",
};

const DataKelasPage = () => {
  return (
    <DefaultLayout>
      <DataKelas/>
    </DefaultLayout>
  );
};

export default DataKelasPage;
