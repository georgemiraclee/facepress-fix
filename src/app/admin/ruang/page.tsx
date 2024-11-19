import React from "react";
import Ruang from "@/components/Admin/Ruang";
import { Metadata } from "next";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Ruang Kelas |  Face Recognition Computer Engineeering Universitas Diponegoro",
  description:
    "Website Presensi Mahasiswa Teknik Komputer Universitas Diponegoro",
};

const RuangPage = () => {
  return (
    <DefaultLayout>
      <Ruang/>
    </DefaultLayout>
  );
};

export default RuangPage;
