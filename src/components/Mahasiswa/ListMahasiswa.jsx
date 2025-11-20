import React, { useEffect, useState } from "react";
import { listMahasiswa, softDeleteMahasiswa} from "../../services/API";
import { Link } from 'react-router-dom';

function ListMahasiswa() {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function untuk konversi beasiswa
  const getBeasiswaText = (code) => {
    const beasiswaMap = {
      '1': 'Beasiswa Penuh',
      '2': 'Beasiswa Parsial',
      '3': 'Non-Beasiswa '
    };
    return beasiswaMap[String(code)] || 'Tidak Diketahui';
  };

  // Helper function untuk konversi status
  const getStatusText = (code) => {
    const statusMap = {
      '0': 'Non-aktif',
      '1': 'Aktif'
    };
    return statusMap[String(code)] || 'Tidak Diketahui';
  };

  const fetchMahasiswa = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await listMahasiswa();
      
      // Handle jika response.data adalah object dengan property data atau records
      let mahasiswaData = response.data.data;
      
      if (mahasiswaData && typeof mahasiswaData === 'object' && !Array.isArray(mahasiswaData)) {
        // Coba ambil dari property yang mungkin
        mahasiswaData = mahasiswaData.data || mahasiswaData.records || mahasiswaData.mahasiswa || [];
      }
      
      setMahasiswa(Array.isArray(mahasiswaData) ? mahasiswaData : []);
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setError(err.message || "Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMahasiswa();
  }, []);

 const handleDelete = async (nim, nama) => {
    // Konfirmasi hapus
    if (!window.confirm(`Apakah Anda yakin ingin menonaktifkan mahasiswa "${nama}"?`)) {
      return;
    }
    try {
      await softDeleteMahasiswa(nim);
      alert('✅ Mahasiswa berhasil dinonaktifkan!');
      // refresh
      fetchMahasiswa();
    } catch (err) {
      alert("❌ Gagal nonaktifkan: " + (err.message || err));
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
        <h3 align='left'>👥 Daftar Mahasiswa</h3>
        <h4 style={{ paddingLeft: '16px' }}>Kelola data mahasiswa dengan mudah</h4>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Link to="/add-mahasiswa">
            <button style={{ marginRight: 8 }} className="btn btn-light btn-outline-success">➕ Tambah Mahasiswa</button>
          </Link>
          <button onClick={fetchMahasiswa} className="btn btn-outline-primary">🔄 Refresh</button>
        </div>

        {loading && <div>Loading...</div>}
        {error && <div style={{ color: "red" }}>Error: {error}</div>}
      </div>

       <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-dark">
                <tr>
                  <th style={{ border: "1px solid #ddd"}} className="text-center">No</th>
                  <th style={{ border: "1px solid #ddd"}} className="text-center">NIM</th>
                  <th style={{ border: "1px solid #ddd"}} className="text-center">Nama</th>
                  <th style={{ border: "1px solid #ddd"}} className="text-center">Prodi</th>
                  <th style={{ border: "1px solid #ddd"}} className="text-center">Beasiswa</th>
                  <th style={{ border: "1px solid #ddd"}} className="text-center">Status</th>
                  <th style={{ border: "1px solid #ddd"}} className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {mahasiswa.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={7} style={{ padding: 12, textAlign: "center" }}>Tidak ada data</td>
                  </tr>
                ) : (
                  mahasiswa.map((item, idx) => (
                    <tr key={item.mhs_nim || idx}>
                      <td style={{ border: "1px solid #eee"}} className="text-center">{idx + 1}</td>
                      <td style={{ border: "1px solid #eee"}} className="text-center">{item.mhs_nim || '-'}</td>
                      <td style={{ border: "1px solid #eee"}} className="text-center">{item.mhs_nama || '-'}</td>
                      <td style={{ border: "1px solid #eee"}} className="text-center">{item.mhs_prodi || '-'}</td> 
                      <td style={{ border: "1px solid #eee"}} className="text-center">
                        {(() => {
                          const beasiswa = getBeasiswaText(item.mhs_beasiswa);
                          if (beasiswa === 'Beasiswa Penuh') {
                            return <span className="badge bg-success">{beasiswa}</span>;
                          } else if (beasiswa === 'Beasiswa Parsial') {
                            return <span className="badge bg-info">{beasiswa}</span>;
                          } else if (beasiswa === 'Tidak Ada') {
                            return <span className="badge bg-secondary">{beasiswa}</span>;
                          } else {
                            return <span className="badge bg-secondary">Non-Beasiswa</span>;
                          }
                        })()}
                      </td>
                      <td style={{ border: "1px solid #eee"}} className="text-center">
                        {(() => {
                          const status = getStatusText(item.mhs_status);
                          if (status === 'Aktif') {
                            return <span className="badge bg-success">{status}</span>;
                          } else if (status === 'Nonaktif') {
                            return <span className="badge bg-danger">{status}</span>;
                          } else {
                            return <span className="badge bg-secondary">{status}</span>;
                          }
                        })()}
                      </td>
                      <td style={{ border: "1px solid #eee", padding: 8 }}>
                        {item.mhs_status === '1' && item.mhs_nim ? (
                          <button onClick={() => handleDelete(item.mhs_nim, item.mhs_nama)} className="btn btn-sm btn-outline-danger">Hapus</button>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {mahasiswa && mahasiswa.length > 0 && (
        <div className="mt-3 text-muted text-center">
          <small>Menampilkan {mahasiswa.length} Mahasiswa</small>
        </div>
      )}
    </div>

  );
}

export default ListMahasiswa;