"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Breadcrumb from '@/components/Admin/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Admin/Layouts/DefaultLayout';
import axiosInstance from '@/utils/axiosinstance';
import withAuth from '@/hoc/withAuth';
import Swal from 'sweetalert2'; // Import SweetAlert

const EditDosen = () => {
  const router = useRouter();
  const { id } = useParams();
  const [dosen, setDosen] = useState({
    email: '',
    nip: '',
    nama: '',
    mobile_phone: '', // Updated from mobilePhone to mobile_phone
    password: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`Fetching data for ID: ${id}`);
        const response = await axiosInstance.get(`http://localhost:8000/api/web-admin/dosen/${id}`);
        setDosen(response.data);
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
    try {
      console.log(`Submitting data for ID: ${id}`, dosen);
      
      // Construct the body with correct field names
      const payload = {
        email: dosen.email,
        nip: dosen.nip,
        nama: dosen.nama,
        mobile_phone: dosen.mobile_phone, // Updated field name
        password: dosen.password // Ensure to handle optional updates
      };

      const response = await axiosInstance.put(`http://localhost:8000/api/web-admin/dosen/${id}/`, payload);
      console.log('Edit successful:', response.data);

      // SweetAlert Success
      Swal.fire({
        title: 'Success!',
        text: 'Data Sukses Terupdate!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        router.back(); // Redirect after success
      });
    } catch (error) {
      console.error('Error editing data:', error);
      Swal.fire('Error', 'Failed to edit data. Please try again.', 'error');
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
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Edit Dosen" />
        <div className="grid gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Edit Dosen</h3>
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
                        value={dosen.nama || ''}
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
                        value={dosen.email || ''}
                        onChange={handleInputChange}
                        placeholder="newemail@example.com"
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label htmlFor="mobile_phone" className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Mobile Phone
                      </label>
                      <input
                        type="text"
                        id="mobile_phone"
                        name="mobile_phone"
                        value={dosen.mobile_phone || ''} // Updated from mobilePhone to mobile_phone
                        onChange={handleInputChange}
                        placeholder="08987654321"
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label htmlFor="nip" className="mb-3 block text-sm font-medium text-black dark:text-white">
                        NIP
                      </label>
                      <input
                        type="text"
                        id="nip"
                        name="nip"
                        value={dosen.nip || ''}
                        onChange={handleInputChange}
                        placeholder="NIP"
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="password" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={dosen.password || ''}
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

export default withAuth(EditDosen);
