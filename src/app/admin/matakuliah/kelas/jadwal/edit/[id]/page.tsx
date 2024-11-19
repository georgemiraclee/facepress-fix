"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/Admin/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Admin/Layouts/DefaultLayout';
import axios from 'axios';
import { useParams } from 'next/navigation';

const EditJadwal = () => {
  const router = useRouter();
  const { id } = useParams();

  // State variables for storing form data and options
  const [jadwal, setJadwal] = useState({
    kelasId: 0,
    tanggal: '',
    jamMulai: '',
    jamSelesai: '',
    dosenId: 0,
    status: '',
  });

  // Effect to fetch data on component mount
  useEffect(() => {
    const fetchJadwalData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/mata-kuliah/jadwal-kelas/${id}`);
        setJadwal(response.data);
      } catch (error) {
        console.error('Error fetching jadwal data:', error);
      }
    };

    fetchJadwalData();
  }, [id]);

  // Function to handle form submission
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8000/api/mata-kuliah/jadwal-kelas/${id}`, jadwal);
      console.log('Edit successful:', response.data);
     router.back();// Redirect to a suitable page after successful update
    } catch (error) {
      console.error('Error editing jadwal:', error);
    }
  };

  // Function to handle input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setJadwal((prevJadwal) => ({
      ...prevJadwal,
      [name]: value,
    }));
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Edit Jadwal" />
        <div className="grid gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Edit Jadwal</h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-5.5">
                    <label htmlFor="kelasId" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Kelas ID
                    </label>
                    <input
                      type="number"
                      id="kelasId"
                      name="kelasId"
                      value={jadwal.kelasId}
                      onChange={handleInputChange}
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="tanggal" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Tanggal
                    </label>
                    <input
                      type="date"
                      id="tanggal"
                      name="tanggal"
                      value={jadwal.tanggal}
                      onChange={handleInputChange}
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="jamMulai" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Jam Mulai
                    </label>
                    <input
                      type="time"
                      id="jamMulai"
                      name="jamMulai"
                      value={jadwal.jamMulai}
                      onChange={handleInputChange}
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="jamSelesai" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Jam Selesai
                    </label>
                    <input
                      type="time"
                      id="jamSelesai"
                      name="jamSelesai"
                      value={jadwal.jamSelesai}
                      onChange={handleInputChange}
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="dosenId" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Dosen ID
                    </label>
                    <input
                      type="number"
                      id="dosenId"
                      name="dosenId"
                      value={jadwal.dosenId}
                      onChange={handleInputChange}
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="status" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Status
                    </label>
                    <input
                      type="text"
                      id="status"
                      name="status"
                      value={jadwal.status}
                      onChange={handleInputChange}
                      placeholder="Belum Dimulai"
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="flex justify-end gap-4.5">
                    <button
                      type="button"
                      className="flex justify-center rounded bg-meta-1 py-2 px-6 font-medium text-white"
                      onClick={() => router.back()}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray">
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EditJadwal;
