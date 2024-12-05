import React from "react";
import DataKelas from "@/components/Admin/DataKelas";
import { Metadata } from "next";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Detail Mata Kuliah | Face Recognition Computer Engineeering Universitas Diponegoro",
  description:
    "Website Presensi Mahasiswa Teknik Komputer Universitas Diponegoro",
};

const DataKelasPage = () => {
  return (
    <DefaultLayout>
      <DataKelas/>
    </DefaultLayout>
  );
};

export default DataKelasPage;
