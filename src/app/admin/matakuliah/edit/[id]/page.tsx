"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Breadcrumb from '@/components/Admin/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Admin/Layouts/DefaultLayout';
import axiosInstance from '@/utils/axiosinstance';
import withAuth from '@/hoc/withAuth';
import Swal from 'sweetalert2'; // Import SweetAlert

const EditMatkul = () => {
  const router = useRouter();
  const { id } = useParams();

  const [matkul, setMatkul] = useState({
    nama: '',
    nama_english: '',
    kode: '',
    tipe: 'wajib',
    sks: null as number | null,
    semester: null as number | null,
    status: 'aktif',
    dosen_ids: [] as number[],
  });

  const [dosenOptions, setDosenOptions] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchDosenData = async () => {
      try {
        const response = await axiosInstance.get('http://localhost:8000/api/web-admin/dosen/');
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`http://localhost:8000/api/web-admin/mata-kuliah/${id}/`);
        setMatkul(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch Mata Kuliah data. Please check if the resource exists.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
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
  
    // Validasi data yang akan dikirim
    if (!matkul.nama || !matkul.kode || matkul.sks === null || matkul.semester === null) {
      Swal.fire('Error', 'Please fill in all the required fields.', 'error');
      return;
    }
  
    const requestBody = {
      nama: matkul.nama,
      nama_english: matkul.nama_english || null,  // Kirim null jika kosong
      kode: matkul.kode,
      tipe: matkul.tipe || 'wajib',  // Pastikan ada tipe
      sks: matkul.sks !== null ? matkul.sks : null,
      semester: matkul.semester !== null ? matkul.semester : null,
      status: matkul.status || 'aktif',  // Default status 'aktif'
      dosen_ids: matkul.dosen_ids.length > 0 ? matkul.dosen_ids : [],  // Pastikan array berisi ID dosen
    };
  
    try {
      const response = await axiosInstance.put(`http://localhost:8000/api/web-admin/mata-kuliah/${id}/`, requestBody);
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
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setMatkul((prevMatkul) => ({
      ...prevMatkul,
      [name]: value === '' || value === undefined ? null : value, // Ensure no 'undefined'
    }));
  };

  const handleDosenIdsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const options = event.target.options;
    const selectedDosenIds = Array.from(options)
      .filter(option => option.selected)
      .map(option => parseInt(option.value, 10));

    setMatkul((prevMatkul) => ({
      ...prevMatkul,
      dosen_ids: selectedDosenIds,
    }));
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Edit Mata Kuliah" />
        <div className="grid gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Edit Mata Kuliah</h3>
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
                        value={matkul.nama || ''}
                        onChange={handleInputChange}
                        placeholder="Mata Kuliah 2"
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label htmlFor="nama_english" className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Nama English
                      </label>
                      <input
                        type="text"
                        id="nama_english"
                        name="nama_english"
                        value={matkul.nama_english || ''}
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
                      value={matkul.kode || ''}
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
                      name="tipe"
                      value={matkul.tipe || ''}
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
                      value={matkul.sks || ''}
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
                      value={matkul.semester || ''}
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
                      value={matkul.status || ''}
                      onChange={handleInputChange}
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    >
                      <option value="aktif">Aktif</option>
                      <option value="nonaktif">Non Aktif</option>
                    </select>
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="dosenIds" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Dosen Pengampu
                    </label>
                    <select
                      id="dosenIds"
                      name="dosenIds"
                      multiple
                      value={Array.isArray(matkul.dosen_ids) ? matkul.dosen_ids.map(id => id.toString()) : []}
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
                      Update Mata Kuliah
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

export default withAuth(EditMatkul);
