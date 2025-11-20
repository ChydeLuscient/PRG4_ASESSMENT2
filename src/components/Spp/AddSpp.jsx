import React, { useState, useEffect } from 'react';
import { addSpp, listMahasiswa, listSpp } from '../../services/API';
import { Link, useNavigate } from 'react-router-dom';

function AddSpp() {
  const [formData, setFormData] = useState({
    mhs_nim: '',
    spp_semester: '',
    spp_jumlah: 0,
  });

  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [sppList, setSppList] = useState([]);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  // Fetch daftar mahasiswa dan SPP saat component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch mahasiswa
        const responseMhs = await listMahasiswa();
        let mahasiswaData = responseMhs.data;
        
        if (mahasiswaData && typeof mahasiswaData === 'object' && !Array.isArray(mahasiswaData)) {
          mahasiswaData = mahasiswaData.data || mahasiswaData.records || mahasiswaData.mahasiswa || [];
        }
        
        // Filter hanya mahasiswa aktif
        const activeMahasiswa = Array.isArray(mahasiswaData) 
          ? mahasiswaData.filter(m => m.mhs_status === '1' || m.mhs_status === 1)
          : [];
        
        setMahasiswaList(activeMahasiswa);

        // Fetch SPP untuk validasi
        const responseSpp = await listSpp();
        let sppData = responseSpp.data;
        
        if (sppData && typeof sppData === 'object' && !Array.isArray(sppData)) {
          sppData = sppData.data || sppData.records || sppData.spp || [];
        }
        
        setSppList(Array.isArray(sppData) ? sppData : []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Gagal memuat data');
      }
    };

    fetchData();
  }, []);

  // Hitung jumlah SPP berdasarkan beasiswa
  const calculateSPP = (beasiswa) => {
    const baseSPP = 10000000; // 10 juta
    
    switch(String(beasiswa)) {
      case '1': // Beasiswa Full
        return 0; // 0%
      case '2': // Beasiswa Parsial
        return baseSPP * 0.5; // 50%
      case '3': // Non-Beasiswa
        return baseSPP; // 100%
      default:
        return baseSPP;
    }
  };

  const handleMahasiswaChange = (e) => {
    const nim = e.target.value;
    const mahasiswa = mahasiswaList.find(m => m.mhs_nim === nim);
    
    if (mahasiswa) {
      setSelectedMahasiswa(mahasiswa);
      const jumlahSPP = calculateSPP(mahasiswa.mhs_beasiswa);
      
      setFormData({
        mhs_nim: mahasiswa.mhs_nim,
        spp_semester: formData.spp_semester,
        spp_jumlah: jumlahSPP,
      });
    } else {
      setSelectedMahasiswa(null);
      setFormData({
        mhs_nim: '',
        spp_semester: '',
        spp_jumlah: 0,
      });
    }
    
    if (error) setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validation
    if (!formData.mhs_nim) {
      setError('Mahasiswa harus dipilih');
      return;
    }
    if (!formData.spp_semester.trim()) {
      setError('Semester harus diisi');
      return;
    }

    // Validasi duplikasi: cek apakah mahasiswa sudah bayar di semester ini
    const isDuplicate = sppList.some(
      spp => spp.mhs_nim === formData.mhs_nim && spp.spp_semester === formData.spp_semester.trim()
    );

    if (isDuplicate) {
      setError(`❌ Mahasiswa ini sudah membayar SPP untuk semester ${formData.spp_semester}. Tidak dapat menambahkan pembayaran duplikat.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const newSpp = {
        mhs_nim: formData.mhs_nim,
        spp_semester: formData.spp_semester.trim(),
        spp_jumlah: formData.spp_jumlah
      };
      
      await addSpp(newSpp);
      setSuccessMessage('✅ Transaksi SPP berhasil ditambahkan!');
      
      // Reset form and redirect
      setTimeout(() => {
        navigate('/list-spp');
      }, 1500);
      
    } catch (error) {
      console.error("Error adding SPP:", error);
      setError("❌ Gagal menambahkan transaksi SPP. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper untuk mendapatkan teks beasiswa
  const getBeasiswaText = (code) => {
    const beasiswaMap = {
      '1': 'Beasiswa Full (0%)',
      '2': 'Beasiswa Parsial (50%)',
      '3': 'Non-Beasiswa (100%)'
    };
    return beasiswaMap[String(code)] || 'Tidak Diketahui';
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">📋 Tambah Transaksi SPP</h4>
                <Link to="/list-spp" className="btn btn-light btn-sm">
                  ← Kembali
                </Link>
              </div>
            </div>
            
            <div className="card-body">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show">
                  {error}
                  <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                </div>
              )}
              
              {successMessage && (
                <div className="alert alert-success">
                  {successMessage}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="mhs_nim" className="form-label fw-semibold">
                        Pilih Mahasiswa <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        id="mhs_nim"
                        name="mhs_nim"
                        value={formData.mhs_nim}
                        onChange={handleMahasiswaChange}
                        disabled={isSubmitting}
                        required
                      >
                        <option value="">-- Pilih Mahasiswa --</option>
                        {mahasiswaList.map(mhs => (
                          <option key={mhs.mhs_nim} value={mhs.mhs_nim}>
                            {mhs.mhs_nim} - {mhs.mhs_nama}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="spp_semester" className="form-label fw-semibold">
                        Semester <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="spp_semester"
                        name="spp_semester"
                        value={formData.spp_semester}
                        onChange={handleInputChange}
                        placeholder="Contoh: 1, 2, 3, dst"
                        min="1"
                        max="14"
                        disabled={isSubmitting}
                        required
                      />
                      <small className="text-muted">Masukkan semester 1-14</small>
                    </div>
                  </div>
                </div>

                {selectedMahasiswa && (
                  <div className="card mb-4 bg-light">
                    <div className="card-body">
                      <h5 className="card-title mb-3">📋 Informasi Mahasiswa</h5>
                      <div className="row">
                        <div className="col-md-6">
                          <p><strong>NIM:</strong> {selectedMahasiswa.mhs_nim}</p>
                          <p><strong>Nama:</strong> {selectedMahasiswa.mhs_nama}</p>
                          <p><strong>Prodi:</strong> {selectedMahasiswa.mhs_prodi}</p>
                        </div>
                        <div className="col-md-6">
                          <p><strong>Status Beasiswa:</strong> {getBeasiswaText(selectedMahasiswa.mhs_beasiswa)}</p>
                          <p><strong>Jumlah SPP:</strong> 
                            <span className="badge bg-success ms-2 fs-6">
                              Rp {formData.spp_jumlah.toLocaleString('id-ID')}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* <div className="alert alert-info">
                  <strong>ℹ️ Perhitungan SPP:</strong>
                  <ul className="mb-0 mt-2">
                    <li><strong>Beasiswa Full:</strong> Rp 0 (0% dari Rp 10.000.000)</li>
                    <li><strong>Beasiswa Parsial:</strong> Rp 5.000.000 (50% dari Rp 10.000.000)</li>
                    <li><strong>Non-Beasiswa:</strong> Rp 10.000.000 (100% dari Rp 10.000.000)</li>
                  </ul>
                </div> */}

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Link 
                    to="/list-spp" 
                    className="btn btn-secondary me-md-2"
                    disabled={isSubmitting}
                  >
                    Batal
                  </Link>
                  <button 
                    type="submit" 
                    className="btn btn-success"
                    disabled={isSubmitting || !selectedMahasiswa}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Menyimpan...
                      </>
                    ) : (
                      '💾 Simpan Transaksi'
                    )}
                  </button>
                </div>
                
                <div className="mt-3">
                  <small className="text-muted">
                    <span className="text-danger">*</span> Menandakan field wajib diisi
                  </small>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddSpp;