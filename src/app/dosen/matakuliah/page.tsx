import React from "react";
import DataMatkul from "@/components/Dosen/DataMatkul";
import { Metadata } from "next";
import DefaultLayout from "@/components/Dosen/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Mata Kuliah Dosen | Face Recognition Computer Engineeering Universitas Diponegoro",
  description:
    "Website Presensi Mahasiswa Teknik Komputer Universitas Diponegoro",
};

const DataMatkulPage = () => {
  return (
    <DefaultLayout>
      <DataMatkul/>
    </DefaultLayout>
  );
};

export default DataMatkulPage;
