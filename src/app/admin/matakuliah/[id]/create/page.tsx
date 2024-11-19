"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/Admin/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Admin/Layouts/DefaultLayout';
import Swal from 'sweetalert2';
import withAuth from '@/hoc/withAuth';
import axiosInstance from '@/utils/axiosinstance';

const AddKelas = () => {
  const router = useRouter();
  const [kelas, setKelas] = useState({
    nama_kelas: '',
    kode_kelas: '',
    ruang_id: null as number | null,
    hari: '',
    jam_mulai: '',
    jam_selesai: '',
    kapasitas: null as number | null,
  });

  const [ruangOptions, setRuangOptions] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchRuangData = async () => {
      try {
        const response = await axiosInstance.get('http://localhost:8000/api/web-admin/ruang');
        console.log('Ruang data response:', response.data);
  
        if (response.data.success && Array.isArray(response.data.data)) {
          // Pastikan id yang digunakan adalah tipe angka
          setRuangOptions(response.data.data.map((ruang: { id: number; nama_ruang: string; lokasi: string }) => ({
            id: ruang.id, // Gunakan ID numerik
            name: `${ruang.nama_ruang} - ${ruang.lokasi}`,
          })));
        } else {
          console.error('Unexpected data format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching ruang data:', error);
      }
    };
  
    fetchRuangData();
  }, []);
  
  
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Log the data being sent
    console.log('Form data being submitted:', kelas);

    try {
      const mataKuliahId = "1"; // Replace with the actual ID here
      const response = await axiosInstance.post(`http://localhost:8000/api/web-admin/mata-kuliah/${mataKuliahId}/kelas/`, {
        nama_kelas: kelas.nama_kelas,
        kode_kelas: kelas.kode_kelas,
        ruang_id: kelas.ruang_id,
        hari: kelas.hari,
        jam_mulai: kelas.jam_mulai,
        jam_selesai: kelas.jam_selesai,
        kapasitas: kelas.kapasitas,
      });
  
      console.log('Add successful:', response.data);
  
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Kelas has been added successfully!',
      }).then(() => {
        router.back();
      });
  
    } catch (error: any) {
      console.error('Error adding data:', error);
      
      const errorMessage = error.response?.data?.message || 'Failed to add Kelas. Please try again!';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    
    setKelas((prevKelas) => ({
      ...prevKelas,
      [name]: name === 'kapasitas' ? parseInt(value) || null : 
               name === 'ruang_id' ? parseInt(value) || null : // Convert ruang_id to a number
               value,
    }));
  };
  

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Add Kelas" />
        <div className="grid gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Add Kelas</h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label htmlFor="nama_kelas" className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Nama Kelas
                      </label>
                      <input
                        type="text"
                        id="nama_kelas"
                        name="nama_kelas"
                        value={kelas.nama_kelas}
                        onChange={handleInputChange}
                        placeholder="Kelas A"
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label htmlFor="kode_kelas" className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Kode Kelas
                      </label>
                      <input
                        type="text"
                        id="kode_kelas"
                        name="kode_kelas"
                        value={kelas.kode_kelas}
                        onChange={handleInputChange}
                        placeholder="KLS001"
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="ruang_id" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Ruang
                    </label>
                    <select
                    id="ruang_id"
                    name="ruang_id"
                    value={kelas.ruang_id?.toString() || ''}
                    onChange={handleInputChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    >
                    <option value="">Select Ruang</option>
                    {ruangOptions.map((ruang) => (
                        <option key={ruang.id} value={ruang.id}>
                        {ruang.name}
                        </option>
                    ))}
                    </select>
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="hari" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Hari
                    </label>
                    <input
                      type="text"
                      id="hari"
                      name="hari"
                      value={kelas.hari}
                      onChange={handleInputChange}
                      placeholder="Senin"
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
                      value={kelas.jam_mulai}
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
                      value={kelas.jam_selesai}
                      onChange={handleInputChange}
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="kapasitas" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Kapasitas
                    </label>
                    <input
                      type="number"
                      id="kapasitas"
                      name="kapasitas"
                      value={kelas.kapasitas?.toString() || ''}
                      onChange={handleInputChange}
                      placeholder="30"
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="flex justify-end gap-4.5">
                    <button
                      type="submit"
                      className="flex justify-center rounded bg-primary p-3 font-medium text-gray hover:shadow-1"
                    >
                      Add Kelas
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

export default withAuth(AddKelas);
