"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/Admin/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import axiosInstance from '@/utils/axiosinstance';
import withAuth from '@/hoc/withAuth';
import Swal from 'sweetalert2'; // Import SweetAlert

const EditMahasiswa = () => {
  const router = useRouter();
  const [mahasiswa, setMahasiswa] = useState({
    nim: '',
    nama: '',
    semester: '',
    mobile_phone: '',
    nik: '',
    password: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('http://localhost:8000/api/web-mahasiswa/profil-user/');
        setMahasiswa(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire('Error', 'Failed to fetch data. Please try again.', 'error');
      }
    };

    fetchData();
  }, []);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const payload = {
        nim: mahasiswa.nim,
        nama: mahasiswa.nama,
        semester: Number(mahasiswa.semester),
        mobile_phone: mahasiswa.mobile_phone,
        nik: mahasiswa.nik,
        password: mahasiswa.password
      };

      const response = await axiosInstance.put('http://localhost:8000/api/web-mahasiswa/profile/update/', payload);
      console.log('Edit successful:', response.data);

      Swal.fire({
        title: 'Success!',
        text: 'Profile successfully updated!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        router.back();// Redirect after success
      });
    } catch (error) {
      console.error('Error editing data:', error);
      Swal.fire('Error', 'Failed to update profile. Please try again.', 'error');
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
        <Breadcrumb pageName="Edit Mahasiswa" />
        <div className="grid gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Edit Mahasiswa</h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-5.5">
                    <label htmlFor="nim" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      NIM
                    </label>
                    <input
                      type="text"
                      id="nim"
                      name="nim"
                      value={mahasiswa.nim || ''}
                      onChange={handleInputChange}
                      placeholder="NIM"
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="nama" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Nama
                    </label>
                    <input
                      type="text"
                      id="nama"
                      name="nama"
                      value={mahasiswa.nama || ''}
                      onChange={handleInputChange}
                      placeholder="Nama Lengkap"
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
                      value={mahasiswa.semester || ''}
                      onChange={handleInputChange}
                      placeholder="Semester"
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="mobile_phone" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Mobile Phone
                    </label>
                    <input
                      type="text"
                      id="mobile_phone"
                      name="mobile_phone"
                      value={mahasiswa.mobile_phone || ''}
                      onChange={handleInputChange}
                      placeholder="08123456789"
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
                      value={mahasiswa.nik || ''}
                      onChange={handleInputChange}
                      placeholder="NIK"
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

export default withAuth(EditMahasiswa);
