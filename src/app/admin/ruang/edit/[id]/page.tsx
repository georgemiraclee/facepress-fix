"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Breadcrumb from '@/components/Admin/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Admin/Layouts/DefaultLayout';
import axiosInstance from '@/utils/axiosinstance';
import withAuth from '@/hoc/withAuth';
import Swal from 'sweetalert2'; // Import SweetAlert

const EditRuang = () => {
  const router = useRouter();
  const { id } = useParams();
  const [ruang, setRuang] = useState({
    nama_ruang: '', // Updated to match API
    lokasi: '',     // Updated to match API
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`Fetching data for ID: ${id}`);
        const response = await axiosInstance.get(`http://localhost:8000/api/web-admin/ruang/${id}/`);
        setRuang(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire('Error', 'Failed to fetch data. Please check if the resource exists.', 'error'); // SweetAlert error
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
    try {
      console.log(`Submitting data for ID: ${id}`, ruang);
      const response = await axiosInstance.put(`http://localhost:8000/api/web-admin/ruang/${id}/`, ruang);
      console.log('Edit successful:', response.data);

      // SweetAlert success message
      Swal.fire({
        title: 'Success',
        text: 'Ruang has been successfully updated!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        router.back();// Redirect after success
      });

    } catch (error) {
      console.error('Error editing data:', error);
      Swal.fire('Error', 'Failed to edit data. Please try again.', 'error'); // SweetAlert error
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
        <Breadcrumb pageName="Edit Ruang" />
        <div className="grid gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Edit Ruang</h3>
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
                      value={ruang.nama_ruang || ''}
                      onChange={handleInputChange}
                      placeholder="Ruang 101"
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
                      value={ruang.lokasi || ''}
                      onChange={handleInputChange}
                      placeholder="Gedung A, Lantai 1"
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center rounded bg-primary py-3 px-7 text-center text-base font-medium text-white transition hover:bg-opacity-90"
                  >
                    Save 
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

export default withAuth(EditRuang);
