"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/Admin/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Admin/Layouts/DefaultLayout';
import axios from 'axios';
import Swal from 'sweetalert2';
import withAuth from '@/hoc/withAuth';
import axiosInstance from '@/utils/axiosinstance';

const AddMatkul = () => {
  const router = useRouter();

  const [matkul, setMatkul] = useState({
    nama: '',
    namaEnglish: '',
    kode: '',
    type: 'wajib',
    sks: 0,
    semester: 1,
    status: 'aktif',
    dosenIds: [] as number[],
  });
  

  const [dosenOptions, setDosenOptions] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchDosenData = async () => {
      try {
        const response = await axiosInstance.get('http://localhost:8000/api/web-admin/dosen');
        console.log('Dosen data response:', response.data);
  
        // Access the data array from response.data
        if (Array.isArray(response.data.data)) {
          setDosenOptions(response.data.data.map((dosen: { id: number; nama: string }) => ({
            id: dosen.id,
            name: dosen.nama,
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
    try {
      const response = await axiosInstance.post('http://localhost:8000/api/web-admin/mata-kuliah/', {
        nama: matkul.nama,
        nama_english: matkul.namaEnglish,
        kode: matkul.kode,
        tipe: matkul.type,
        sks: matkul.sks,
        semester: matkul.semester,
        status: matkul.status,
        dosen_ids: matkul.dosenIds,
      });
      console.log('Add successful:', response.data);
  
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Mata Kuliah has been added successfully!',
      }).then(() => {
        router.back();
      });
  
    } catch (error) {
      console.error('Error adding data:', error);
  
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add Mata Kuliah. Please try again!',
      });
    }
  };
  

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setMatkul((prevMatkul) => ({
      ...prevMatkul,
      [name]: value,
    }));
  };

  const handleDosenIdsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const options = event.target.options;
    const selectedDosenIds = Array.from(options)
      .filter(option => option.selected)
      .map(option => parseInt(option.value, 10));
    
    setMatkul((prevMatkul) => ({
      ...prevMatkul,
      dosenIds: selectedDosenIds,
    }));
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Add Mata Kuliah" />
        <div className="grid gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Add Mata Kuliah</h3>
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
                        value={matkul.nama}
                        onChange={handleInputChange}
                        placeholder="Mata Kuliah 2"
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label htmlFor="namaEnglish" className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Nama English
                      </label>
                      <input
                        type="text"
                        id="namaEnglish"
                        name="namaEnglish"
                        value={matkul.namaEnglish}
                        onChange={handleInputChange}
                        placeholder="Subject 2"
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="kode" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Kode
                    </label>
                    <input
                      type="text"
                      id="kode"
                      name="kode"
                      value={matkul.kode}
                      onChange={handleInputChange}
                      placeholder="MK102"
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="type" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={matkul.type}
                      onChange={handleInputChange}
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    >
                      <option value="wajib">Wajib</option>
                      <option value="pilihan">Pilihan</option>
                    </select>
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="sks" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      SKS
                    </label>
                    <input
                      type="number"
                      id="sks"
                      name="sks"
                      value={matkul.sks}
                      onChange={handleInputChange}
                      placeholder="2"
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
                      value={matkul.semester}
                      onChange={handleInputChange}
                      placeholder="2"
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="status" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={matkul.status}
                      onChange={handleInputChange}
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    >
                      <option value="aktif">Aktif</option>
                      <option value="nonaktif">Non Aktif</option>
                    </select>
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="dosenId" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Dosen Pengampu
                    </label>
                    <select
                      id="dosenId"
                      name="dosenId"
                      multiple
                      value={matkul.dosenIds.map(id => id.toString())}
                      onChange={handleDosenIdsChange}
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    >
                      {dosenOptions.map(dosen => (
                        <option key={dosen.id} value={dosen.id}>
                          {dosen.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end gap-4.5">
                    <button
                      type="submit"
                      className="flex justify-center rounded bg-primary p-3 font-medium text-gray hover:shadow-1"
                    >
                      Add Mata Kuliah
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

export default withAuth (AddMatkul);
