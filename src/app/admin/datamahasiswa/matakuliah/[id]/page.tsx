"use client";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLayout";
import axiosInstance from "@/utils/axiosinstance";
import withAuth from "@/hoc/withAuth";
import { BiSearch } from "react-icons/bi";
import Swal from "sweetalert2";

import { Mahasiswa } from "@/types/Mahasiswa";
import { Course } from "@/types/Course";

const KelolaDataMataKuliahMahasiswa = () => {
  const { id } = useParams();

  const [mahasiswa, setMahasiswa] = useState<Mahasiswa | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [availableClasses, setAvailableClasses] = useState<{ id: number; nama_kelas: string; }[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [assignedCourses, setAssignedCourses] = useState<any[]>([]);
  const [totalSKS, setTotalSKS] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
    // New state for search functionality
    const [searchTerm, setSearchTerm] = useState<string>('');

    const filteredCourses = useMemo(() => {
      if (!searchTerm) return courses;
      return courses.filter(course => 
        course.nama.toUpperCase().includes(searchTerm.toUpperCase())
      );
    }, [courses, searchTerm]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token not found in localStorage.");
          return;
        }

        const [mahasiswaResponse, coursesResponse, assignedCoursesResponse] = await Promise.all([
          axiosInstance.get(`/web-admin/mahasiswa/${id}/`, { headers: { Authorization: `Bearer ${token}` } }),
          axiosInstance.get(`/web-admin/mata-kuliah/`, { headers: { Authorization: `Bearer ${token}` } }),
          axiosInstance.get(`/web-admin/mahasiswa/${id}/mata-kuliah/`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setMahasiswa(mahasiswaResponse.data.data);
        setCourses(coursesResponse.data.data);
        const assignedCoursesData = assignedCoursesResponse.data.data || [];
        setAssignedCourses(assignedCoursesData);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  

  useEffect(() => {
    const fetchClasses = async () => {
      if (!selectedCourse) return;
  
      try {
        const response = await axiosInstance.get(`/web-admin/mata-kuliah/${selectedCourse}/`);
        
        const kelasData = response.data.data?.kelas;
        setAvailableClasses(kelasData ? kelasData.map((kelas: any) => ({
          id: kelas.id,           
          nama_kelas: kelas.nama_kelas 
        })) : []);
        
      } catch (error) {
        console.error("Error fetching classes:", error);
        setError("Failed to fetch classes.");
      }
    };
  
    fetchClasses();
  }, [selectedCourse]);

  // Recalculate SKS whenever assignedCourses or courses change
  useEffect(() => {
    if (assignedCourses.length > 0 && courses.length > 0) {
      calculateTotalSKS(assignedCourses);
    }
  }, [assignedCourses, courses]); // Watch for changes in assignedCourses or courses

  const calculateTotalSKS = (assignedCourses: any[]) => {
    const total = assignedCourses.reduce((acc, assignedCourse) => {
      const course = courses.find(course => course.id === assignedCourse.mata_kuliah);
      return acc + (course?.sks || 0); 
    }, 0);
  
    setTotalSKS(total);
    console.log("Total SKS:", total); 
  };
  
  const handleAddCourse = async () => {
    if (!selectedCourse || !selectedClass) return;
  
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.post(`/web-admin/mahasiswa/${id}/mata-kuliah/`, {
        mata_kuliah: selectedCourse,
        kelas: selectedClass,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      const assignedCoursesResponse = await axiosInstance.get(`/web-admin/mahasiswa/${id}/mata-kuliah/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      const assignedCoursesData = assignedCoursesResponse.data.data || [];
      setAssignedCourses(assignedCoursesData); 
  
      setSelectedCourse(null);
      setSelectedClass(null);

      Swal.fire({
        icon: "success",
        title: "Mata Kuliah Succesfully Added",
        showConfirmButton: false,
        timer: 2500,
      });
  
    } catch (error) {
      console.error("Error adding course:", error);
      setError("Failed to add course.");
    }
  };
  
  
  const handleDeleteCourse = async (courseId: number) => {
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.delete(`/web-admin/mahasiswa/${id}/mata-kuliah/${courseId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      setAssignedCourses(prevCourses => {
        const updatedCourses = prevCourses.filter(course => course.id !== courseId);
        return updatedCourses;
      });

      Swal.fire({
        icon: "success",
        title: "Mata Kuliah Succesfully Deleted",
        showConfirmButton: false,
        timer: 2500,
      });
  
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
      <div className="mt-4 p-4 bg-white shadow-md rounded-lg shadow-default dark:border-strokedark dark:bg-boxdark">
        <h2 className="text-2xl font-bold mb-4">Kelola Data Mata Kuliah Mahasiswa</h2>

        {mahasiswa && (
          <div className="mb-4">
            <p>Nama Mahasiswa: <strong>{mahasiswa.nama}</strong></p>
            <p>NIM: <strong>{mahasiswa.nim}</strong></p>
            <p>Email: <strong>{mahasiswa.email}</strong></p>
            <p>Semester: <strong>{mahasiswa.semester}</strong></p>
            <p>Mobile Phone: <strong>{mahasiswa.mobile_phone}</strong></p>
            <p>NIK: <strong>{mahasiswa.nik}</strong></p>
          </div>
        )}

      
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Cari Mata Kuliah"
              className="w-full p-2 pl-10 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && filteredCourses.length > 0 && (
              <div className="absolute z-10 w-full bg-white border rounded mt-1 max-h-60 overflow-y-auto">
                {filteredCourses.map(course => (
                  <div 
                    key={course.id} 
                    className={`p-2 hover:bg-gray-100 cursor-pointer ${selectedCourse === course.id ? 'bg-gray-200' : ''}`}
                    onClick={() => {
                      setSelectedCourse(course.id);
                      setSearchTerm(course.nama);
                    }}
                  >
                    {course.nama}
                  </div>
                ))}
              </div>
            )}
          </div>
          <select
            className="p-2 border rounded"
            value={selectedClass || ''}
            onChange={(e) => setSelectedClass(e.target.value ? parseInt(e.target.value) : null)}
          >
            <option value="">Pilih Kelas</option>
            {availableClasses.map((kelas) => (
              <option key={kelas.id} value={kelas.id}>
                {kelas.nama_kelas}
              </option>
            ))}
          </select>
        </div>

        <button
          className="flex justify-center bg-primary px-6 py-2 text-white rounded hover:bg-opacity-90"
          onClick={handleAddCourse}
        >
          Tambah
        </button>

        <h3 className="mt-4 text-xl font-bold">Daftar Mata Kuliah yang Diambil:</h3>
        <table className="min-w-full mt-4 border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Nama Mata Kuliah</th>
              <th className="border px-4 py-2">Kelas</th>
              <th className="border px-4 py-2">SKS</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {assignedCourses.filter(course => course).map(course => {
              // Find the full course details to get SKS
              const fullCourseDetails = courses.find(c => c.id === course.mata_kuliah);
              return (
                <tr key={course.id}>
                  <td className="border px-4 py-2">{course.mata_kuliah_nama ?? "N/A"}</td>
                  <td className="border px-4 py-2">{course.kelas_nama ?? "N/A"}</td>
                  <td className="border px-4 py-2">{fullCourseDetails?.sks ?? "N/A"}</td>
                  <td className="border px-4 py-2">{course.status ?? "N/A"}</td>
                  <td className="border px-4 py-2">
                    <button className="text-red-500" onClick={() => handleDeleteCourse(course.id)}>
                      Hapus
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <p className="mt-4">Total SKS: {totalSKS} (Maks 24 SKS)</p>
              
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </DefaultLayout>
  );
};

export default withAuth(KelolaDataMataKuliahMahasiswa);