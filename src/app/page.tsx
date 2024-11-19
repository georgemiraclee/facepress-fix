"use client"
import Mahasiswa from "@/components/Dashboard/Mahasiswa";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";


export default function Home() {
  return (
    <>
      <DefaultLayout>
        <Mahasiswa />
      </DefaultLayout>
    </>
  );
}
