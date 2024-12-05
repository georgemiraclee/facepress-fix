import React from "react";
import DataPresensi from "@/components/Admin/DataPresensi/[id]";
import { Metadata } from "next";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Detail Kelas | Face Recognition Computer Engineeering Universitas Diponegoro",
  description:
    "Website Presensi Mahasiswa Teknik Komputer Universitas Diponegoro",
};

const DataMatkulPage = () => {
  return (
    <DefaultLayout>
      <DataPresensi/>
    </DefaultLayout>
  );
};

export default DataMatkulPage;
