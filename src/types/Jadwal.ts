import { MataKuliah } from "./MataKuliah";
export interface Jadwal {
    id: number;
    tanggal: string;
    jamMulai: string;
    jamSelesai: string;
    mataKuliahId: number;
    kelasId: number;
    ruangId: number;
    dosenId: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    matakuliah: MataKuliah;
  }