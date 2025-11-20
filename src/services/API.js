import axios from 'axios';

const BASE_URL = 'https://asm.roniprsty.com';

// API untuk Mahasiswa
export const MahasiswaAPI = {
  getMahasiswa: () => axios.get(`${BASE_URL}/mahasiswa/read.php`),
  createMahasiswa: (data) => axios.post(`${BASE_URL}/mahasiswa/create.php`, data),
  softDeleteMahasiswa: (data) => {
    const jsonData = {
      mhs_nim: data.nim,
      mhs_status: 0
    };
    
    return axios.patch(`${BASE_URL}/mahasiswa/delete.php`, jsonData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } // dari status 1 menjadi 0
};

// API untuk Spp
export const SppAPI = {
  //getParkir: () => axios.get(`${BASE_URL}/parkir/read.php`)
  getSpp: () => axios.get(`${BASE_URL}/spp/read.php`),
  createSpp: (data) => axios.post(`${BASE_URL}/spp/create.php`, data),
};

// helper functions Jenis Parkir
export const listMahasiswa = () => MahasiswaAPI.getMahasiswa();
export const addMahasiswa = (data) => MahasiswaAPI.createMahasiswa(data);
export const softDeleteMahasiswa = (nim) => MahasiswaAPI.softDeleteMahasiswa(nim);

// helper functions Spp
export const listSpp = () => SppAPI.getSpp();
export const addSpp = (data) => SppAPI.createSpp(data);

// ambil NIM Mahasiswa
export const getMahasiswaByNIM = async (nim) => {
  const response = await MahasiswaAPI.getMahasiswa();
  let mahasiswaList = response.data;
  
  // jika response.data adalah object
  if (mahasiswaList && typeof mahasiswaList === 'object' && !Array.isArray(mahasiswaList)) {
    mahasiswaList = mahasiswaList.data || mahasiswaList.records || mahasiswaList.mahasiswa || [];
  }
  
  // cek mahasiswaList adalah array
  if (!Array.isArray(mahasiswaList)) {
    throw new Error('Format data tidak valid');
  }
  
  const mahasiswa = mahasiswaList.find(m => m.nim === nim || m.nim === parseInt(nim));
  if (!mahasiswa) {
    throw new Error('Data mahasiswa tidak ditemukan');
  }
  return { data: mahasiswa };
};

// Ambil SPP berdasarkan ID
export const getSppById = async (id) => {
  const response = await SppAPI.getSpp();
  let sppList = response.data;
  
  // jika response.data adalah object   
  if (sppList && typeof sppList === 'object' && !Array.isArray(sppList)) {
    sppList = sppList.data || sppList.records || sppList.spp || [];
  }
  // cek sppList adalah array
  if (!Array.isArray(sppList)) {
    throw new Error('Format data tidak valid');
  }
  const spp = sppList.find(s => s.id_spp === id || s.id_spp === parseInt(id));
  if (!spp) {
    throw new Error('Data SPP tidak ditemukan');
  }
  return { data: spp };
};