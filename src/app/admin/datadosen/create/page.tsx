"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2'; // Import SweetAlert
import Head from 'next/head';  // Import Head
import Breadcrumb from '@/components/Admin/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Admin/Layouts/DefaultLayout';
import axiosInstance from '@/utils/axiosinstance';
import withAuth from '@/hoc/withAuth';

const AddDosen = () => {
  const router = useRouter();

  const [dosen, setDosen] = useState({
    email: '',
    nip: '',
    nama: '',
    mobilePhone: '',
    password: ''
  });

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // Create the payload in the correct structure
      const payload = {
        email: dosen.email,
        nip: dosen.nip,
        nama: dosen.nama,
        mobile_phone: dosen.mobilePhone, // Changed to snake_case
        password: dosen.password
      };

      await axiosInstance.post('http://localhost:8000/api/web-admin/dosen/', payload);

      // Show success alert
      Swal.fire({
        icon: 'success',
        title: 'Dosen Added',
        text: 'The new dosen has been successfully added!',
        confirmButtonText: 'OK'
      }).then(() => {
        router.back(); // Redirect to DataDosen page
      });
    } catch (error) {
      console.error('Error adding data:', error);

      // Show error alert
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an issue adding the dosen. Please try again later.',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setDosen((prevDosen) => ({
      ...prevDosen,
      [name]: value,
    }));
  };

  return (
    <DefaultLayout>
      <Head>
        <title>Tambah Dosen - Admin</title>
      </Head>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Tambah Dosen" />
        <div className="grid gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Tambah Dosen</h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label htmlFor="nama" className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Nama
                      </label>
                      <input
                        type="text"
                        id="nama"
                        name="nama"
                        value={dosen.nama}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label htmlFor="email" className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={dosen.email}
                        onChange={handleInputChange}
                        placeholder="example@example.com"
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="nip" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      NIP
                    </label>
                    <input
                      type="text"
                      id="nip"
                      name="nip"
                      value={dosen.nip}
                      onChange={handleInputChange}
                      placeholder="1234567819"
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="mobilePhone" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Mobile Phone
                    </label>
                    <input
                      type="text"
                      id="mobilePhone"
                      name="mobilePhone"
                      value={dosen.mobilePhone}
                      onChange={handleInputChange}
                      placeholder="081234516789"
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="password" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={dosen.password}
                      onChange={handleInputChange}
                      placeholder="Password"
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

export default withAuth (AddDosen);
