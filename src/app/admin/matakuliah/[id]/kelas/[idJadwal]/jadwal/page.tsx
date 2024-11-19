import React from "react";
import DataJadwal from "@/components/Admin/DataJadwal";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Next.js Form Elements | TailAdmin - Next.js Dashboard Template",
    description:
      "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
  };

const DataJadwalPage = () => {
  return (
    <DefaultLayout>
      <DataJadwal/>
    </DefaultLayout>
  );
};

export default DataJadwalPage;
