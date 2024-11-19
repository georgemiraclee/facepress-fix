"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Breadcrumb from '@/components/Admin/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Admin/Layouts/DefaultLayout';
import axios from 'axios';
import { Dosen } from '@/types/Dosen';
import withAuth from '@/hoc/withAuth';

const DosenDetail = () => {
  const router = useRouter();
  const { id } = useParams();
  const [dosen, setDosen] = useState<Dosen | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("token");
          setIsLoading(true);
          const response = await axios.get(`http://localhost:8000/api/web-admin/dosen/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.data.success) {
            // Set the Dosen data from the response
            setDosen(response.data.data);
          } else {
            setError('Failed to retrieve Dosen details.');
          }

          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setError('Failed to fetch data. Please check if the resource exists.');
          setIsLoading(false);
        }
      };

      fetchData();
    } else {
      console.error('No ID provided');
      setError('No ID provided');
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="Detail Dosen" />
        <div className="p-6">
          <p>Loading...</p>
        </div>
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="Detail Dosen" />
        <div className="p-6">
          <p className="text-red-500">{error}</p>
        </div>
      </DefaultLayout>
    );
  }

  if (!dosen) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="Detail Dosen" />
        <div className="p-6">
          <p>No data available</p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Detail Dosen" />
        <div className="mt-4 p-4 bg-white shadow-md rounded-lg shadow-default dark:border-strokedark dark:bg-boxdark">
          <h2 className="text-2xl font-bold mb-4">Detail Dosen</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-lg">
                <strong>Nama:</strong> {dosen.nama}
              </p>
              <p className="text-lg">
                <strong>Email:</strong> {dosen.email}
              </p>
              <p className="text-lg">
                <strong>NIP:</strong> {dosen.nip}
              </p>
            </div>
            <div>
              <p className="text-lg">
                <strong>Mobile Phone:</strong> {dosen.mobile_phone}
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-4.5 mt-4">
            <button
              type="button"
              className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
              onClick={() => router.back()}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default withAuth(DosenDetail);
