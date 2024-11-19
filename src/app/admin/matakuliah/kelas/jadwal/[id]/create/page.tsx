// components/AddJadwal.tsx
"use client";
import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Breadcrumb from '@/components/Admin/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Admin/Layouts/DefaultLayout';
import axios from 'axios';
import withAuth from '@/hoc/withAuth'; // Import the HOC

interface Kelas {
  id: number;
  namaKelas: string;
  kodeKelas: string;
  kapasitas: number;
  mataKuliah: any; // Adjust as needed
}

interface Dosen {
  id: number;
  nama: string;
}

interface Option {
  id: number;
  name: string;
}

const AddJadwal = () => {
  const [isClient, setIsClient] = useState(false);
  const { id } = useParams(); // Access the dynamic route parameter
  const router = useRouter();

  const [jadwal, setJadwal] = useState({
    kelasId: 0,
    tanggal: '',
    jamMulai: '',
    jamSelesai: '',
    dosenId: 0,
    status: 'belum dimulai',
  });

  const [kelasOptions, setKelasOptions] = useState<Option[]>([]);
  const [dosenOptions, setDosenOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchKelasData = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");

      const response = await axios.get<Kelas[]>(`http://localhost:8000/api/mata-kuliah/kelas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 && Array.isArray(response.data)) {
        setKelasOptions(
          response.data.map((kelas) => ({
            id: kelas.id,
            name: kelas.namaKelas, // Adjusted to match the actual field name in response
          }))
        );
      } else {
        console.error("Unexpected response data:", response.data);
      }
    } catch (error) {
      handleFetchError(error, "kelas");
    } finally {
      setLoading(false);
    }
  };

  const fetchDosenData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");

      const response = await axios.get<{ dosens: Dosen[] }>('http://localhost:8000/api/dosen', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.status === 200 && Array.isArray(response.data.dosens)) {
        setDosenOptions(response.data.dosens.map((dosen) => ({
          id: dosen.id,
          name: dosen.nama,
        })));
      } else {
        console.error('Unexpected response data:', response.data);
      }
    } catch (error) {
      handleFetchError(error, 'dosen');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchError = (error: any, type: string) => {
    if (axios.isAxiosError(error) && error.response) {
      console.error(`Error fetching ${type} data: ${error.response.status} ${error.response.statusText}`);
    } else {
      console.error(`Error fetching ${type} data:`, error);
    }
    setError(`Failed to fetch ${type} data. Please try again.`);
  };

  useEffect(() => {
    if (typeof id === 'string') {
      fetchKelasData(id);
    }
    fetchDosenData();
  }, [id]);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");
      const response = await axios.post(
        `http://localhost:8000/api/mata-kuliah/kelas/${jadwal.kelasId}/jadwal-kelas`,
        {
          tanggal: jadwal.tanggal,
          jamMulai: jadwal.jamMulai,
          jamSelesai: jadwal.jamSelesai,
          dosenId: jadwal.dosenId,
          status: jadwal.status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use token from context or hook
          },
        }
      );
      console.log('Add jadwal successful:', response.data);
      router.push('/admin/matakuliah');
    } catch (error) {
      console.error('Error adding jadwal:', error);
      setError('Failed to add jadwal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setJadwal((prevJadwal) => ({
      ...prevJadwal,
      [name]: value,
    }));
  };

  if (!isClient || !id) {
    return null; // or return a loading spinner, etc.
  }

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Add Jadwal" />
        <div className="grid gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Add Jadwal</h3>
              </div>
              <div className="p-7">
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-5.5">
                    <label htmlFor="kelasId" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Kelas
                    </label>
                    <select
                      id="kelasId"
                      name="kelasId"
                      value={jadwal.kelasId}
                      onChange={handleInputChange}
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    >
                      <option value="">Select Kelas</option>
                      {kelasOptions.map((kelas) => (
                        <option key={kelas.id} value={kelas.id}>
                          {kelas.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="tanggal" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Tanggal
                    </label>
                    <input
                      type="date"
                      id="tanggal"
                      name="tanggal"
                      value={jadwal.tanggal}
                      onChange={handleInputChange}
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
                      value={jadwal.jamMulai}
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
                      value={jadwal.jamSelesai}
                      onChange={handleInputChange}
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="dosenId" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Dosen
                    </label>
                    <select
                      id="dosenId"
                      name="dosenId"
                      value={jadwal.dosenId}
                      onChange={handleInputChange}
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    >
                      <option value="">Select Dosen</option>
                      {dosenOptions.map((dosen) => (
                        <option key={dosen.id} value={dosen.id}>
                          {dosen.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-5.5">
                    <label htmlFor="status" className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={jadwal.status}
                      onChange={handleInputChange}
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    >
                      <option value="belum dimulai">Belum Dimulai</option>
                      <option value="sedang berlangsung">Sedang Berlangsung</option>
                      <option value="selesai">Selesai</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded bg-primary py-3 px-4 text-center text-white transition hover:bg-opacity-90"
                  >
                    {loading ? 'Submitting...' : 'Submit'}
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

export default withAuth(AddJadwal); // Wrap component with authentication HOC
