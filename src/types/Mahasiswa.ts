// types.ts

export type Mahasiswa = {
  is_wajah_exist: any;
  mobile_phone: string;
  id: number;
  email: string;
  nim: string;
  nama: string;
  semester: number;
  isWajahExist: boolean; // Redundant, consider removing
  mobilePhone: string; // This appears redundant, consider using camelCase for properties consistently
  nik: string;
  createdAt: string;
  updatedAt: string;
};

export interface Course {
  id: number;
  mata_kuliah_nama: string;
  mata_kuliah_kode: string;
  kelas: number; // It might be better to represent this as a string if it contains class identifiers
  semester_mengambil: number; // Consider renaming to `semester` for consistency
  status: string; // Consider using enums for statuses if they are limited
  kelas_nama: string; // This is important for displaying class names
  sks: number; // Assuming you have SKS in the response
}

export interface AssignedCourse {
  id: number;
  mahasiswa: number; // This references the Mahasiswa ID
  mata_kuliah: number; // This references the Course ID
  kelas: number; // This can be the class identifier
  semester_mengambil: number;
  status: string; // Consider using enums for statuses if they are limited
  mata_kuliah_nama: string; // Course name for display
  mata_kuliah_kode: string; // Course code for display
  kelas_nama: string; // Class name for display
}

export type Metadata = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
};

export type MahasiswaResponse = {
  mahasiswas: Mahasiswa[];
  metadata: Metadata;
};
