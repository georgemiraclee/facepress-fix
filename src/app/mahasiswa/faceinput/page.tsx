"use client";
import axios from "axios";
import React, { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useRouter } from "next/navigation";
import Webcam from "react-webcam";
import withAuth from "@/hoc/withAuth";
import Swal from "sweetalert2";

const FaceCapture: React.FC<{ mahasiswaId: number }> = ({ mahasiswaId }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [isCameraOn, setIsCameraOn] = useState(false); // State for webcam visibility

  const videoConstraints = {
    width: 740,
    height: 740,
    facingMode: "user",
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen); // Toggle modal visibility
  };

  const handleCapture = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire({
          title: "Error!",
          text: "Authentication token is missing. Please log in again.",
          icon: "error",
        });
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/api/web-mahasiswa/capture_wajah/",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        Swal.fire({
          title: "Success!",
          text: "Face data captured successfully!",
          icon: "success",
        });
        router.push("/");
      }
    } catch (error: unknown) {
      console.error("Failed to capture face data:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to capture face data. Please try again.",
        icon: "error",
      });
    }
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-[300px] sm:max-w-[740px]">
        <Breadcrumb pageName="Input Wajah Mahasiswa" />
        <div className="rounded-sm border border-stroke bg-white shadow-md dark:border-strokedark dark:bg-boxdark">
          <div className="w-full p-6 sm:p-12 xl:p-16">
            <h2 className="mb-6 text-2xl font-bold text-center text-black dark:text-white sm:text-3xl">
              Input Wajah Anda
            </h2>
            <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
              Tangkap gambar wajah Anda untuk dimasukkan ke dalam dataset presensi kuliah menggunakan Face Recognition.
            </p>
            <div className="flex flex-col items-center mb-8">
              <label className="flex items-center mb-4">
                <span className="mr-2 text-gray-600 dark:text-gray-300">Hidupkan Kamera</span>
                <input
                  type="checkbox"
                  className="toggle-checkbox"
                  checked={isCameraOn}
                  onChange={() => setIsCameraOn(!isCameraOn)}
                />
              </label>

              {isCameraOn && (
                <div className="webcam-container mb-5">
                  <Webcam
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    className="webcam-circle"
                  />
                </div>
              )}

              <button
                onClick={handleCapture}
                className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md mb-4"
              >
                Capture and Submit
              </button>
              <button
                onClick={toggleModal}
                className="bg-green-500 text-white py-2 px-6 rounded-lg shadow-md"
              >
                Cara Input Data Wajah
              </button>
            </div>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-bold mb-4">Tata Cara Input Data Wajah</h3>
              <ol className="list-decimal pl-6 mb-4">
                <li className="mb-2">Pastikan kamera Anda berfungsi dengan baik.</li>
                <li className="mb-2">Jauhkan diri Anda dari banyak orang agar mendapat hasil yang baik.</li>
                <li className="mb-2">Klik tombol "Capture and Submit" untuk menangkap gambar wajah Anda.</li>
                <li className="mb-2">Tunggu hingga konfirmasi bahwa data wajah berhasil ditangkap.</li>
                <li>Jika ada kesalahan, periksa pengaturan webcam Anda.</li>
              </ol>
              <div className="flex justify-end">
                <button
                  onClick={toggleModal}
                  className="bg-blue-500 text-white py-1 px-4 rounded-lg"
                >
                  Paham
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        .webcam-container {
          width: 200px;
          height: 200px;
          overflow: hidden;
          border-radius: 50%;
        }
        .webcam-circle {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .toggle-checkbox {
          appearance: none;
          width: 42px;
          height: 24px;
          background-color: #ccc;
          border-radius: 12px;
          position: relative;
          outline: none;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .toggle-checkbox:checked {
          background-color: #4caf50;
        }
        .toggle-checkbox::after {
          content: "";
          position: absolute;
          width: 20px;
          height: 20px;
          background-color: #fff;
          border-radius: 50%;
          top: 2px;
          left: 2px;
          transition: transform 0.2s ease;
        }
        .toggle-checkbox:checked::after {
          transform: translateX(18px);
        }
      `}</style>
    </DefaultLayout>
  );
};

export default withAuth(FaceCapture);
