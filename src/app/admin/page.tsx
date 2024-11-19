import Admin from "@/components/Admin/Dashboard/AdminDash";
import { Metadata } from "next";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLayout";
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
        <Admin />
      </DefaultLayout>
    </>
  );
};

export default Home;
