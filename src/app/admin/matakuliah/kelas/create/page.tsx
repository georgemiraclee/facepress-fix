"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/Admin/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Admin/Layouts/DefaultLayout';
import axios from 'axios';
import withAuth from '@/hoc/withAuth';
import axiosInstance from '@/utils/axiosinstance';

const AddKelas = () => {
  const router = useRouter();

  const [kelas, setKelas] = useState({
    mataKuliahId: 0,
    namaKelas: '',
    kodeKelas: '',
    ruangId: 0,
    hari: '',
    jamMulai: '',
    jamSelesai: '',
    kapasitas: 0,
  });

  const [mataKuliahOptions, setMataKuliahOptions] = useState<{ id: number; name: string }[]>([]);
  const [ruangOptions, setRuangOptions] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchMataKuliahData = async () => {
      try {
        const response = await axiosInstance.get('http://localhost:8000/api/mata-kuliah');
        setMataKuliahOptions(response.data.map((matkul: { id: number; nama: string }) => ({
          id: matkul.id,
          name: matkul.nama,
        })));
      } catch (error) {
        console.error('Error fetching mata kuliah data:', error);
      }
    };

    const fetchRuangData = async () => {
      try {
        const response = await axiosInstance.get('http://localhost:8000/api/ruang');
        setRuangOptions(response.data.map((ruang: { id: number; nama: string }) => ({
          id: ruang.id,
          name: ruang.nama,
        })));
      } catch (error) {
        console.error('Error fetching ruang data:', error);
      }
    };

    fetchMataKuliahData();
    fetchRuangData();
  }, []);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post('http://localhost:8000/api/mata-kuliah/kelas', kelas);
      console.log('Add successful:', response.data);
      router.back();
    } catch (error) {
      console.error('Error adding kelas:', error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setKelas((prevKelas) => ({
      ...prevKelas,
      [name]: value,
    }));
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Add Kelas" />
        <div className="grid gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Add Kelas</h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-5.5">
                    <label htmlFor="mataKuliahId" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Mata Kuliah
                    </label>
                    <select
                      id="mataKuliahId"
                      name="mataKuliahId"
                      value={kelas.mataKuliahId}
                      onChange={handleInputChange}
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    >
                      <option value="">Select Mata Kuliah</option>
                      {mataKuliahOptions.map((matkul) => (
                        <option key={matkul.id} value={matkul.id}>
                          {matkul.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="namaKelas" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Nama Kelas
                    </label>
                    <input
                      type="text"
                      id="namaKelas"
                      name="namaKelas"
                      value={kelas.namaKelas}
                      onChange={handleInputChange}
                      placeholder="Kelas A"
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="kodeKelas" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Kode Kelas
                    </label>
                    <input
                      type="text"
                      id="kodeKelas"
                      name="kodeKelas"
                      value={kelas.kodeKelas}
                      onChange={handleInputChange}
                      placeholder="KAKA101"
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="ruangId" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Ruang
                    </label>
                    <select
                      id="ruangId"
                      name="ruangId"
                      value={kelas.ruangId}
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
                      placeholder="Selasa"
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="jamMulai" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Jam Mulai
                    </label>
                    <input
                      type="time"
                      id="jamMulai"
                      name="jamMulai"
                      value={kelas.jamMulai}
                      onChange={handleInputChange}
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="jamSelesai" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Jam Selesai
                    </label>
                    <input
                      type="time"
                      id="jamSelesai"
                      name="jamSelesai"
                      value={kelas.jamSelesai}
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
                      value={kelas.kapasitas}
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
                      Add Kelas
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

export default withAuth (AddKelas);
