import React from "react";
import DataDosen from "@/components/Admin/DataDosen";
import { Metadata } from "next";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Data Dosen | Face Recognition Computer Engineeering Universitas Diponegoro",
  description:
    "Website Presensi Mahasiswa Teknik Komputer Universitas Diponegoro",
};

const DataDosenPage = () => {
  return (
    <DefaultLayout>
      <DataDosen />
    </DefaultLayout>
  );
};

export default DataDosenPage;
