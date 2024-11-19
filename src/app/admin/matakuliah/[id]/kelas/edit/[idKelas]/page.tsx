"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Breadcrumb from '@/components/Admin/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Admin/Layouts/DefaultLayout';
import Swal from 'sweetalert2';
import withAuth from '@/hoc/withAuth';
import axiosInstance from '@/utils/axiosinstance';

const EditKelas = () => {
  const router = useRouter();
  const { id } = useParams(); // Assuming you're using dynamic routing to get the ID
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
    // Fetch existing class data
    const fetchKelasData = async () => {
      try {
        const response = await axiosInstance.get(`http://localhost:8000/api/web-admin/kelas/${id}/`);
        console.log('Existing Kelas data:', response.data);
        if (response.data.success) {
          setKelas({
            nama_kelas: response.data.data.nama_kelas,
            kode_kelas: response.data.data.kode_kelas,
            ruang_id: response.data.data.ruang_id,
            hari: response.data.data.hari,
            jam_mulai: response.data.data.jam_mulai,
            jam_selesai: response.data.data.jam_selesai,
            kapasitas: response.data.data.kapasitas,
          });
        } else {
          console.error('Failed to fetch kelas data:', response.data);
        }
      } catch (error) {
        console.error('Error fetching kelas data:', error);
      }
    };

    // Fetch available ruang data
    const fetchRuangData = async () => {
      try {
        const response = await axiosInstance.get('http://localhost:8000/api/web-admin/ruang');
        if (response.data.success && Array.isArray(response.data.data)) {
          setRuangOptions(response.data.data.map((ruang: { id: number; nama_ruang: string; lokasi: string }) => ({
            id: ruang.id,
            name: `${ruang.nama_ruang} - ${ruang.lokasi}`,
          })));
        } else {
          console.error('Unexpected data format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching ruang data:', error);
      }
    };

    fetchKelasData();
    fetchRuangData();
  }, [id]);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axiosInstance.put(`http://localhost:8000/api/web-admin/kelas/${id}/`, {
        nama_kelas: kelas.nama_kelas,
        kode_kelas: kelas.kode_kelas,
        ruang_id: kelas.ruang_id,
        hari: kelas.hari,
        jam_mulai: kelas.jam_mulai,
        jam_selesai: kelas.jam_selesai,
        kapasitas: kelas.kapasitas,
      });

      console.log('Edit successful:', response.data);

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Kelas has been updated successfully!',
      }).then(() => {
        router.back();
      });
    } catch (error: any) {
      console.error('Error updating data:', error);

      const errorMessage = error.response?.data?.message || 'Failed to update Kelas. Please try again!';
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
        <Breadcrumb pageName="Edit Kelas" />
        <div className="grid gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Edit Kelas</h3>
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
                      Save Changes
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

export default withAuth(EditKelas);
