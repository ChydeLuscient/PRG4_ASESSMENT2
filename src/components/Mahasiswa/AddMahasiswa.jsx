import React, { useState } from 'react';
import { addMahasiswa } from '../../services/API';
import { Link, useNavigate } from 'react-router-dom';

function AddMahasiswa() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    mhs_nim: '',
    mhs_nama: '',
    mhs_prodi: 'MI',
    mhs_beasiswa: '1',
    mhs_status: '1', // Status otomatis aktif (1 = Aktif)
  });
  
  const prodiOptions = [
    { value: 'MI', label: 'MI - Manajemen Informatika' },
    { value: 'MK', label: 'MK - Mekatronika' },
    { value: 'TPM', label: 'TPM - Teknik Produksi & Manufaktur' }
  ];

  const beasiswaOptions = [
    { value: '1', label: 'Beasiswa Full' },
    { value: '2', label: 'Beasiswa Parsial' },
    { value: '3', label: 'Non-Beasiswa' }
  ];
  
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Validasi form wajib diisi
    if (!formData.mhs_nim.trim()) {
      setError('NIM harus diisi');
      return;
    }
    if (!formData.mhs_nama.trim()) {
      setError('Nama harus diisi');
      return;
    }
    if (!formData.mhs_prodi) {
      setError('Prodi harus dipilih');
      return;
    }
    if (!formData.mhs_beasiswa) {
      setError('Beasiswa harus dipilih');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await addMahasiswa(formData);
      console.log('✅ Add response:', response);
      
      // Cek jika NIM sudah ada
      if (response.data.status === 'error' || response.data.status === 'failed') {
        setError(response.data.message || 'Gagal menambahkan mahasiswa');
        setIsSubmitting(false);
        return;
      }
      
      setSuccessMessage('✅ Mahasiswa berhasil ditambahkan! Mengalihkan...');
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (error) {
      console.error("❌ Error adding mahasiswa:", error);
      const errorMsg = error.response?.data?.message || error.message || "Gagal menambahkan mahasiswa";
      setError(`❌ ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">➕ Tambah Mahasiswa Baru</h4>
                <Link to="/" className="btn btn-light btn-sm">
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
                        NIM <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="mhs_nim"
                        name="mhs_nim"
                        value={formData.mhs_nim}
                        onChange={handleInputChange}
                        placeholder="Masukkan NIM"
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="mhs_nama" className="form-label fw-semibold">
                        Nama Lengkap <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="mhs_nama"
                        name="mhs_nama"
                        value={formData.mhs_nama}
                        onChange={handleInputChange}
                        placeholder="Masukkan nama lengkap"
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="mhs_prodi" className="form-label fw-semibold">
                        Program Studi <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        id="mhs_prodi"
                        name="mhs_prodi"
                        value={formData.mhs_prodi}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        required
                      >
                        {prodiOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Jenis Beasiswa <span className="text-danger">*</span>
                      </label>
                      <div>
                        {beasiswaOptions.map(opt => (
                          <div className="form-check" key={opt.value}>
                            <input
                              className="form-check-input"
                              type="radio"
                              name="mhs_beasiswa"
                              id={`beasiswa_${opt.value}`}
                              value={opt.value}
                              checked={formData.mhs_beasiswa === opt.value}
                              onChange={handleInputChange}
                              disabled={isSubmitting}
                              required
                            />
                            <label className="form-check-label" htmlFor={`beasiswa_${opt.value}`}>
                              {opt.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Status
                      </label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        value="Aktif"
                        disabled
                        readOnly
                      />
                      <small className="text-muted">Status otomatis diset sebagai Aktif</small>
                    </div>
                  </div>
                </div>

                {/* <div className="alert alert-info">
                  <strong>ℹ️ Keterangan:</strong>
                  <ul className="mb-0 mt-2">
                    <li><strong>Beasiswa Full:</strong> Beasiswa penuh 100%</li>
                    <li><strong>Beasiswa Parsial:</strong> Beasiswa sebagian (misalnya 50%)</li>
                    <li><strong>Non-Beasiswa:</strong> Tidak menerima beasiswa</li>
                  </ul>
                </div> */}

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Link 
                    to="/" 
                    className="btn btn-secondary me-md-2"
                    disabled={isSubmitting}
                  >
                    Batal
                  </Link>
                  <button 
                    type="submit" 
                    className="btn btn-success"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Menyimpan...
                      </>
                    ) : (
                      '💾 Simpan Data'
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

export default AddMahasiswa;