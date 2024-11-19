import React from "react";
import DataPresensi from "@/components/Admin/DataPresensi";
import { Metadata } from "next";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Next.js Form Elements | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const DataMatkulPage = () => {
  return (
    <DefaultLayout>
      <DataPresensi/>
    </DefaultLayout>
  );
};

export default DataMatkulPage;
