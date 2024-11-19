import { Kelas } from './Kelas'; // Adjust the import path based on your project structure

export interface Course {
  kelas_nama: string;
  mata_kuliah_nama: string;
  id: number;
  nama: string;
  sks: number;
  kelas: Kelas[]; // Use the Kelas interface for better readability
  status: string; // Adjust this if you have a specific type for status
}