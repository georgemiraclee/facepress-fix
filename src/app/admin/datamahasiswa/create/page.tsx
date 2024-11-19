"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/Admin/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Admin/Layouts/DefaultLayout';
import axiosInstance from '@/utils/axiosinstance';
import Swal from 'sweetalert2';
import withAuth from '@/hoc/withAuth';

const AddMahasiswa = () => {
  const router = useRouter();

  const [mahasiswa, setMahasiswa] = useState({
    email: '',
    nim: '',
    nama: '',
    semester: null, // Assuming semester can be null
    is_wajah_exist: false, // Added this field as per API requirement
    mobile_phone: '', // Adjusted field name to match the API
    nik: '',
    password: '',
  });

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post('http://localhost:8000/api/web-admin/mahasiswa/', mahasiswa);
      console.log('Add successful:', response.data);

      // Display success alert using Swal
      Swal.fire({
        title: 'Success!',
        text: 'Mahasiswa has been added successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        // Redirect to another page after success
        router.back();
      });

    } catch (error) {
      console.error('Error adding data:', error);

      // Display error alert using Swal
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add mahasiswa. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setMahasiswa((prevMahasiswa) => ({
      ...prevMahasiswa,
      [name]: value,
    }));
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Add Mahasiswa" />
        <div className="grid gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Add Mahasiswa</h3>
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
                        value={mahasiswa.nama}
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
                        value={mahasiswa.email}
                        onChange={handleInputChange}
                        placeholder="example@example.com"
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="nim" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      NIM
                    </label>
                    <input
                      type="text"
                      id="nim"
                      name="nim"
                      value={mahasiswa.nim}
                      onChange={handleInputChange}
                      placeholder="1234567819"
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="semester" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Semester
                    </label>
                    <input
                      type="number"
                      id="semester"
                      name="semester"
                      value={mahasiswa.semester || ''} // Handle null by using an empty string
                      onChange={handleInputChange}
                      placeholder="6"
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
                      name="mobile_phone" // Changed field name to match the API
                      value={mahasiswa.mobile_phone}
                      onChange={handleInputChange}
                      placeholder="081234516789"
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="nik" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      NIK
                    </label>
                    <input
                      type="text"
                      id="nik"
                      name="nik"
                      value={mahasiswa.nik}
                      onChange={handleInputChange}
                      placeholder="98765432231"
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
                      value={mahasiswa.password}
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

export default withAuth(AddMahasiswa);
