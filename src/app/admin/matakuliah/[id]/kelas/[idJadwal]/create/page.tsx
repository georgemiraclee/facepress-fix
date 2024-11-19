"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/Admin/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Admin/Layouts/DefaultLayout';
import Swal from 'sweetalert2';
import withAuth from '@/hoc/withAuth';
import axiosInstance from '@/utils/axiosinstance';

const AddJadwalKelas = () => {
  const router = useRouter();
  const [jadwal, setJadwal] = useState({
    tanggal: '',
    jam_mulai: '',
    jam_selesai: '',
    dosen: null as number | null,
  });

  const [dosenOptions, setDosenOptions] = useState<{ id: number; nama: string }[]>([]);

  useEffect(() => {
    const fetchDosenData = async () => {
      try {
        const response = await axiosInstance.get('http://localhost:8000/api/web-admin/dosen');
        console.log('Dosen data response:', response.data);
  
        if (response.data.success && Array.isArray(response.data.data)) {
          setDosenOptions(response.data.data.map((dosen: { id: number; nama: string }) => ({
            id: dosen.id,
            nama: dosen.nama,
          })));
        } else {
          console.error('Unexpected data format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching dosen data:', error);
      }
    };
  
    fetchDosenData();
  }, []);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log('Form data being submitted:', jadwal);

    try {
      const kelasId = "2"; // Replace with the actual Kelas ID
      const response = await axiosInstance.post(`http://localhost:8000/api/web-admin/kelas/${kelasId}/jadwal/`, {
        tanggal: jadwal.tanggal,
        jam_mulai: jadwal.jam_mulai,
        jam_selesai: jadwal.jam_selesai,
        dosen: jadwal.dosen,
      });
  
      console.log('Add successful:', response.data);
  
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Jadwal Kelas has been added successfully!',
      }).then(() => {
        router.back();
      });
      
  
    } catch (error: any) {
      console.error('Error adding data:', error);
      
      const errorMessage = error.response?.data?.message || 'Failed to add Jadwal Kelas. Please try again!';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    
    setJadwal((prevJadwal) => ({
      ...prevJadwal,
      [name]: name === 'dosen' ? parseInt(value) || null : value,
    }));
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Add Jadwal Kelas" />
        <div className="grid gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Add Jadwal Kelas</h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleFormSubmit}>
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
                    <label htmlFor="jam_mulai" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Jam Mulai
                    </label>
                    <input
                      type="time"
                      id="jam_mulai"
                      name="jam_mulai"
                      value={jadwal.jam_mulai}
                      onChange={handleInputChange}
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="jam_selesai" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Jam Selesai
                    </label>
                    <input
                      type="time"
                      id="jam_selesai"
                      name="jam_selesai"
                      value={jadwal.jam_selesai}
                      onChange={handleInputChange}
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="dosen" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Dosen
                    </label>
                    <select
                      id="dosen"
                      name="dosen"
                      value={jadwal.dosen?.toString() || ''}
                      onChange={handleInputChange}
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    >
                      <option value="">Select Dosen</option>
                      {dosenOptions.map((dosen) => (
                        <option key={dosen.id} value={dosen.id}>
                          {dosen.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end gap-4.5">
                    <button
                      type="submit"
                      className="flex justify-center rounded bg-primary p-3 font-medium text-gray hover:shadow-1"
                    >
                      Add Jadwal Kelas
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

export default withAuth(AddJadwalKelas);
