import Dosen from "@/components/Dosen/Dashboard/DosenDash";
import { Metadata } from "next";
import DefaultLayout from "@/components/Dosen/Layouts/DefaultLayout";
// import withAuth from "@/hoc/withAuth";

export const metadata: Metadata = {
  title:
    "Face Recognition Computer Engineeering Universitas Diponegoro",
  description: "Website Presensi Mahasiswa Teknik Komputer Universitas Diponegoro",
};


const Home = () => {
  return (
    <>
      <DefaultLayout>
        <Dosen />
      </DefaultLayout>
    </>
  );
};

export default Home;
