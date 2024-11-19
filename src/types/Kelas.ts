
import { MataKuliah } from "./MataKuliah";

export interface Kelas {
    nama: string;
    id: number;
    namaKelas: string;
    kodeKelas: string;
    kapasitas: number;
    mataKuliah: MataKuliah;
    jamMulai: string;
    jamSelesai: string;
}
