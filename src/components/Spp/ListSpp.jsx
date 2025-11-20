import React, { useEffect, useState } from "react";
import { listSpp } from "../../services/API";
import { Link } from 'react-router-dom';

function ListSpp() {
  const [spp, setSpp] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSpp = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await listSpp();
      
      // Handle jika response.data adalah object dengan property data
      let sppData = response.data;
      
      if (sppData && typeof sppData === 'object' && !Array.isArray(sppData)) {
        // Coba ambil dari property yang mungkin
        sppData = sppData.data || sppData.records || sppData.spp || [];
      }
      
      setSpp(Array.isArray(sppData) ? sppData : []);
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setError(err.message || "Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpp();
  }, []);

  // Format number dengan separator
  const formatNumber = (number) => {
    return new Intl.NumberFormat('id-ID').format(number);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 align='left'>📋 Daftar Transaksi SPP</h3>
          <h4 style={{ paddingLeft: '16px' }}>Kelola pembayaran SPP mahasiswa</h4>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Link to="/add-spp">
            <button style={{ marginRight: 8 }} className="btn btn-light btn-outline-success">➕ Tambah SPP</button>
          </Link>
          <button onClick={fetchSpp} className="btn btn-outline-primary">🔄 Refresh</button>
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
                  <th style={{ border: "1px solid #ddd"}} className="text-center">Nama Mahasiswa</th>
                  <th style={{ border: "1px solid #ddd"}} className="text-center">Prodi</th>
                  <th style={{ border: "1px solid #ddd"}} className="text-center">Semester</th>
                  <th style={{ border: "1px solid #ddd"}} className="text-end pe-3">Jumlah SPP (Rp)</th>
                </tr>
              </thead>
              <tbody>
                {spp.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={6} style={{ padding: 12, textAlign: "center" }}>Tidak ada data</td>
                  </tr>
                ) : (
                  spp.map((item, idx) => (
                    <tr key={item.spp_id || idx}>
                      <td style={{ border: "1px solid #eee"}} className="text-center">{idx + 1}</td>
                      <td style={{ border: "1px solid #eee"}} className="text-center">{item.mhs_nim || '-'}</td>
                      <td style={{ border: "1px solid #eee"}} className="text-center">{item.mhs_nama || '-'}</td>
                      <td style={{ border: "1px solid #eee"}} className="text-center">{item.mhs_prodi || '-'}</td>
                      <td style={{ border: "1px solid #eee"}} className="text-center">{item.spp_semester || '-'}</td> 
                      <td style={{ border: "1px solid #eee"}} className="text-end pe-3 fw-bold">
                        {formatNumber(item.spp_jumlah || 0)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {spp && spp.length > 0 && (
        <div className="mt-3 text-muted text-center">
          <small>Menampilkan {spp.length} Transaksi SPP</small>
        </div>
      )}
    </div>

  );
}

export default ListSpp;