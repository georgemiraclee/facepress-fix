"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/Admin/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Admin/Layouts/DefaultLayout';
import Swal from 'sweetalert2';
import axiosInstance from '@/utils/axiosinstance';
import withAuth from '@/hoc/withAuth';

const AddRuang = () => {
  const router = useRouter();

  const [ruang, setRuang] = useState({
    nama_ruang: '',
    lokasi: ''
  });

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post('http://localhost:8000/api/web-admin/ruang/', ruang);
      console.log('Add successful', response.data);

      Swal.fire({
        icon: 'success',
        title: 'Berhasil menambahkan Ruang',
        text: 'Ruang berhasil ditambahkan',
      }).then(() => {
        router.back();// Redirect to DataRuang page
      });
    } catch (error) {
      console.error('Error adding data:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Gagal Menambahkan Ruang, Coba lagi',
      });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRuang((prevRuang) => ({
      ...prevRuang,
      [name]: value,
    }));
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Tambah Ruang" />
        <div className="grid gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Tambah Ruang</h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-5.5">
                    <label htmlFor="nama_ruang" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Nama Ruang
                    </label>
                    <input
                      type="text"
                      id="nama_ruang"
                      name="nama_ruang"
                      value={ruang.nama_ruang}
                      onChange={handleInputChange}
                      placeholder="Ruang Baca"
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="lokasi" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Lokasi
                    </label>
                    <input
                      type="text"
                      id="lokasi"
                      name="lokasi"
                      value={ruang.lokasi}
                      onChange={handleInputChange}
                      placeholder="Gedung Perpustakaan"
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="flex justify-end gap-4.5">
                    <button
                      type="button"
                      className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      onClick={() => router.back()}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                    >
                      Save
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

export default withAuth(AddRuang);
