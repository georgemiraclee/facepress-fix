"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Breadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLayout";
import axiosInstance from "@/utils/axiosinstance";
import withAuth from "@/hoc/withAuth";
import { Mahasiswa } from "@/types/Mahasiswa"; // Assuming you have a Mahasiswa type defined
import { Course } from "@/types/Course";       // Assuming you have a Course type defined

const KelolaDataMataKuliahMahasiswa = () => {
  const { id } = useParams();

  // State declarations
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [assignedCourses, setAssignedCourses] = useState<Course[]>([]);
  const [totalSKS, setTotalSKS] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch Mahasiswa and Mata Kuliah data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
    
        console.log("Fetching mahasiswa with ID:", id);
        console.log("Fetching mata kuliah for mahasiswa ID:", id);
    
        const mahasiswaResponse = await axiosInstance.get(`/web-admin/mahasiswa/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
        console.log("Mahasiswa Response:", mahasiswaResponse.data); // Log response
    
        const coursesResponse = await axiosInstance.get(`/web-admin/mata-kuliah/`);
        console.log("Courses Response:", coursesResponse.data); // Log response
    
        const assignedCoursesResponse = await axiosInstance.get(`/web-admin/mahasiswa/${id}/mata-kuliah/`, { headers: { Authorization: `Bearer ${token}` } });
        console.log("Assigned Courses Response:", assignedCoursesResponse.data); // Log response
    
        // Assign data to state
        setMahasiswa(mahasiswaResponse.data.data);
        setCourses(coursesResponse.data.data);
        setAssignedCourses(assignedCoursesResponse.data.data);
        calculateTotalSKS(assignedCoursesResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data.");
      } finally {
        setIsLoading(false);
      }
    };    
    fetchData();
  }, [id]);
  

  // Fetch available classes based on selected mata kuliah
  useEffect(() => {
    const fetchClasses = async () => {
      if (!selectedCourse) return;
      try {
        const response = await axiosInstance.get(`/mata-kuliah/${selectedCourse}/`);  // Changed to match provided API
        setAvailableClasses(response.data.kelas);
      } catch (error) {
        console.error("Error fetching classes:", error);
        setError("Failed to fetch classes.");
      }
    };
    if (selectedCourse) fetchClasses();
  }, [selectedCourse]);

  // Calculate total SKS
  const calculateTotalSKS = (courses: Course[]) => {
    const total = courses.reduce((acc, course) => acc + course.sks, 0);
    setTotalSKS(total);
  };

  // Handle adding a mata kuliah
  const handleAddCourse = async () => {
    if (!selectedCourse || !selectedClass) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.post(`/web-admin/mahasiswa/${id}/mata-kuliah/`, {
        mata_kuliah: selectedCourse,
        kelas: selectedClass,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const newCourse = response.data.data;
      setAssignedCourses([...assignedCourses, newCourse]);
      calculateTotalSKS([...assignedCourses, newCourse]);
      setSelectedCourse(null);
      setSelectedClass(null);

    } catch (error) {
      console.error("Error adding course:", error);
      setError("Failed to add course.");
    }
  };

  // Handle deleting a mata kuliah
  const handleDeleteCourse = async (courseId: number) => {
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.delete(`/web-admin/mahasiswa/${id}/mata-kuliah/${courseId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updatedCourses = assignedCourses.filter(course => course.id !== courseId);
      setAssignedCourses(updatedCourses);
      calculateTotalSKS(updatedCourses);
    } catch (error) {
      console.error("Error deleting course:", error);
      setError("Failed to delete course.");
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Kelola Data Mata Kuliah Mahasiswa" />
      <div className="mt-4 p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Kelola Data Mata Kuliah Mahasiswa</h2>

        {/* Display Mahasiswa Name */}
        {mahasiswa && (
          <p className="mb-4">
            Nama Mahasiswa: <strong>{mahasiswa.nama}</strong>
          </p>
        )}

        {/* Mata Kuliah and Kelas Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <select
            className="p-2 border rounded"
            value={selectedCourse || ''}
            onChange={(e) => setSelectedCourse(e.target.value ? parseInt(e.target.value) : null)}
          >
            <option value="">Pilih Mata Kuliah</option>
            {Array.isArray(courses) && courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.nama}
              </option>
            ))}
          </select>

          <select
            className="p-2 border rounded"
            value={selectedClass || ''}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Pilih Kelas</option>
            {availableClasses.map((kelas, index) => (
              <option key={index} value={kelas}>{kelas}</option>
            ))}
          </select>
        </div>

        <button
          className="flex justify-center bg-primary px-6 py-2 text-white rounded hover:bg-opacity-90"
          onClick={handleAddCourse}
        >
          Tambah Mata Kuliah
        </button>

        {/* Assigned Courses Table */}
        <h3 className="mt-4 text-xl font-bold">Daftar Mata Kuliah yang Diambil:</h3>
        <table className="min-w-full mt-4 border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Nama Mata Kuliah</th>
              <th className="border px-4 py-2">Kelas</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {assignedCourses.map(course => (
              <tr key={course.id}>
                <td className="border px-4 py-2">{course.mata_kuliah_nama}</td>
                <td className="border px-4 py-2">{course.kelas_nama}</td>
                <td className="border px-4 py-2">{course.status}</td>
                <td className="border px-4 py-2">
                  <button className="text-red-500" onClick={() => handleDeleteCourse(course.id)}>
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total SKS */}
        <p className="mt-4">Total SKS: {totalSKS} (Maks 24 SKS)</p>

        {/* Error Message */}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </DefaultLayout>
  );
};

export default withAuth(KelolaDataMataKuliahMahasiswa);
