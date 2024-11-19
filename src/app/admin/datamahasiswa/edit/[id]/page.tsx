"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Breadcrumb from '@/components/Admin/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Admin/Layouts/DefaultLayout';
import axiosInstance from '@/utils/axiosinstance';
import Swal from 'sweetalert2';
import withAuth from '@/hoc/withAuth';

const EditMahasiswa = () => {
  const router = useRouter();
  const { id } = useParams();
  const [mahasiswa, setMahasiswa] = useState({
    email: '',
    nama: '',
    semester: 1,
    mobilePhone: '',
    nik: '',
    nim: '',
    isWajahExist: false,
    password: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`Fetching data for ID: ${id}`);
        const response = await axiosInstance.get(`http://localhost:8000/api/web-admin/mahasiswa/${id}/`);
        setMahasiswa(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire('Error', 'Failed to fetch data. Please check if the resource exists.', 'error');
      }
    };

    if (id) {
      fetchData();
    } else {
      console.error('No ID provided');
    }
  }, [id]);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const requestBody = {
      email: mahasiswa.email,
      nim: mahasiswa.nim,
      nama: mahasiswa.nama,
      semester: mahasiswa.semester,
      is_wajah_exist: mahasiswa.isWajahExist,
      mobile_phone: mahasiswa.mobilePhone,
      nik: mahasiswa.nik,
      password: mahasiswa.password,
    };

    try {
      console.log(`Submitting data for ID: ${id}`, requestBody);
      const response = await axiosInstance.put(`http://localhost:8000/api/web-admin/mahasiswa/${id}/`, requestBody);
      console.log('Edit successful:', response.data);

      Swal.fire({
        title: 'Success!',
        text: 'Data Sukses Terupdate!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        router.back();
      });
    } catch (error) {
      console.error('Error editing data:', error);
      Swal.fire('Error', 'Failed to edit data. Please try again.', 'error');
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setMahasiswa((prevMahasiswa) => ({
      ...prevMahasiswa,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Edit Mahasiswa" />
        <div className="grid gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Edit Mahasiswa</h3>
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
                        value={mahasiswa.nama || ''}
                        onChange={handleInputChange}
                        placeholder="Jane Doe"
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
                        value={mahasiswa.email || ''}
                        onChange={handleInputChange}
                        placeholder="newemail@example.com"
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label htmlFor="semester" className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Semester
                      </label>
                      <input
                        type="number"
                        id="semester"
                        name="semester"
                        value={mahasiswa.semester || ''}
                        onChange={handleInputChange}
                        placeholder="7"
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label htmlFor="mobilePhone" className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Mobile Phone
                      </label>
                      <input
                        type="text"
                        id="mobilePhone"
                        name="mobilePhone"
                        value={mahasiswa.mobilePhone || ''}
                        onChange={handleInputChange}
                        placeholder="08987654321"
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label htmlFor="nik" className="mb-3 block text-sm font-medium text-black dark:text-white">
                        NIK
                      </label>
                      <input
                        type="text"
                        id="nik"
                        name="nik"
                        value={mahasiswa.nik || ''}
                        onChange={handleInputChange}
                        placeholder="123456789"
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label htmlFor="nim" className="mb-3 block text-sm font-medium text-black dark:text-white">
                        NIM
                      </label>
                      <input
                        type="text"
                        id="nim"
                        name="nim"
                        value={mahasiswa.nim || ''}
                        onChange={handleInputChange}
                        placeholder="NIM1"
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="isWajahExist" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Is Wajah Exist
                    </label>
                    <input
                      type="checkbox"
                      id="isWajahExist"
                      name="isWajahExist"
                      checked={mahasiswa.isWajahExist || false}
                      onChange={handleInputChange}
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
                      value={mahasiswa.password || ''}
                      onChange={handleInputChange}
                      placeholder="********"
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center rounded bg-primary py-3 px-7 text-center text-base font-medium text-white transition hover:bg-opacity-90"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default withAuth (EditMahasiswa);
