import { Dosen } from './Dosen';

export type MataKuliah = {
  id: number;
  nama: string;
  namaEnglish: string;
  kode: string;
  type: string;
  sks: number;
  semester: number;
  status: string;
  dosenPengampu: Dosen[]; // Assuming dosenPengampu is an array of Dosen
  createdAt: string; // Add these properties
  updatedAt: string;
};
