import React from "react";
import DataMahasiswa from "@/components/Admin/DataMahasiswa";
import { Metadata } from "next";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Data Mahasiswa | Face Recognition Computer Engineeering Universitas Diponegoro",
  description:
    "Website Presensi Mahasiswa Teknik Komputer Universitas Diponegoro",
};

const DataDosenPage = () => {
  return (
    <DefaultLayout>
      <DataMahasiswa />
    </DefaultLayout>
  );
};

export default DataDosenPage;
