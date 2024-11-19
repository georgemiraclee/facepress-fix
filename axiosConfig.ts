// axiosConfig.ts

import axios, { AxiosInstance } from 'axios';

// Membuat instance Axios
const token = localStorage.getItem('token');
const instance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // Sesuaikan dengan URL API Anda
  timeout: 5000, // Opsional: Waktu maksimal untuk menunggu respons, dalam milidetik
  headers: {
    'Content-Type': 'application/json', // Jenis konten default untuk permintaan
    'Authorization': `Bearer ${token}`

    // Tambahkan header lain jika diperlukan
  },
});

// Menambahkan interceptor untuk request
instance.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage
    const token = localStorage.getItem('token');

    // Jika token ada, tambahkan ke header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Perbaikan penggunaan template literal
    }

    return config;
  },
  (error) => {
    // Tangani error sebelum request dikirim
    return Promise.reject(error);
  }
);

// Menambahkan interceptor untuk response
instance.interceptors.response.use(
  (response) => {
    // Tangani response jika berhasil
    return response;
  },
  (error) => {
    // Tangani error dari response
    if (error.response && error.response.status === 401) {
      // Jika error 401 (Unauthorized), lakukan tindakan seperti redirect ke halaman login
      localStorage.removeItem('token'); // Hapus token dari localStorage
      window.location.href = '/signin'; // Redirect ke halaman login
    }

    return Promise.reject(error);
  }
);

export default instance;
